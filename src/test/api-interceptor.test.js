import { describe, it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import api, { normalizeBaseUrl } from '../services/api'
import { server, API } from './mocks/server'

/**
 * El interceptor de `src/services/api.js` hace un redirect DURO
 * (`window.location.href = ...`) ante cualquier 401. Es la ruta más
 * delicada del frontend: se dispara en medio de la navegación, descarga el
 * estado en memoria de la SPA y obliga a reconstruirlo tras el login.
 *
 * jsdom no permite reasignar `window.location`, así que se sustituye el
 * global `window` completo durante la prueba y se restaura al terminar.
 */
function stubLocation(pathname) {
  const fakeWindow = { location: { pathname, href: pathname } }
  vi.stubGlobal('window', fakeWindow)
  return fakeWindow
}

describe('configuración del cliente HTTP', () => {
  it('envía las credenciales para que viaje la cookie httpOnly de sesión', () => {
    expect(api.defaults.withCredentials).toBe(true)
  })

  it('apunta al prefijo /api por defecto', () => {
    expect(api.defaults.baseURL).toBe('/api')
  })
})

// Regresión de un despliegue real: con VITE_API_URL apuntando a la raíz del
// backend (sin /api) TODAS las peticiones devolvían 404 — la tienda se veía
// vacía y el login fallaba, sin error que señalara la causa. La normalización
// convierte ese error de configuración en algo que simplemente funciona.
describe('normalizeBaseUrl', () => {
  it('deja intacta una URL que ya termina en /api', () => {
    expect(normalizeBaseUrl('https://api.symcomputer.com/api')).toBe('https://api.symcomputer.com/api')
  })

  it('añade /api a un host pelado', () => {
    expect(normalizeBaseUrl('https://symcomputer-backend-production.up.railway.app')).toBe(
      'https://symcomputer-backend-production.up.railway.app/api'
    )
  })

  it('no duplica el sufijo si viene con barra final', () => {
    expect(normalizeBaseUrl('https://api.symcomputer.com/api/')).toBe('https://api.symcomputer.com/api')
  })

  it('tolera barras finales en el host pelado', () => {
    expect(normalizeBaseUrl('https://api.symcomputer.com//')).toBe('https://api.symcomputer.com/api')
  })

  it('usa /api cuando no hay nada configurado', () => {
    expect(normalizeBaseUrl('')).toBe('/api')
    expect(normalizeBaseUrl(undefined)).toBe('/api')
  })

  it('deja intacta la ruta relativa del proxy de desarrollo', () => {
    expect(normalizeBaseUrl('/api')).toBe('/api')
  })
})

describe('respuestas correctas', () => {
  it('deja pasar la respuesta sin tocar la navegación', async () => {
    const fakeWindow = stubLocation('/tienda')
    server.use(http.get(`${API}/products`, () => HttpResponse.json({ products: [] })))

    const res = await api.get('/products')

    expect(res.status).toBe(200)
    expect(fakeWindow.location.href).toBe('/tienda')
  })
})

describe('errores que NO deben disparar el redirect de sesión', () => {
  it('ignora el 401 de /auth/me, que es la consulta de "¿sigo con sesión?"', async () => {
    const fakeWindow = stubLocation('/cuenta')
    server.use(http.get(`${API}/auth/me`, () => HttpResponse.json({ error: 'no' }, { status: 401 })))

    await expect(api.get('/auth/me')).rejects.toThrow()

    // Si redirigiera aquí, la app expulsaría al usuario en cada recarga.
    expect(fakeWindow.location.href).toBe('/cuenta')
  })

  it('ignora un 403, que significa "autenticado pero sin permisos"', async () => {
    const fakeWindow = stubLocation('/carrito')
    server.use(http.get(`${API}/admin/orders`, () => HttpResponse.json({ error: 'no' }, { status: 403 })))

    await expect(api.get('/admin/orders')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/carrito')
  })

  it('ignora un 500, que no implica sesión expirada', async () => {
    const fakeWindow = stubLocation('/carrito')
    server.use(http.get(`${API}/products/featured`, () => HttpResponse.json({}, { status: 500 })))

    await expect(api.get('/products/featured')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/carrito')
  })
})

describe('redirect por sesión expirada (401)', () => {
  it('lleva a /login conservando la ruta de origen', async () => {
    const fakeWindow = stubLocation('/carrito')
    server.use(http.get(`${API}/cart`, () => HttpResponse.json({ error: 'expirado' }, { status: 401 })))

    await expect(api.get('/cart')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/login?redirect=%2Fcarrito')
  })

  it('codifica correctamente rutas con query string', async () => {
    const fakeWindow = stubLocation('/categoria/perros?page=2')
    server.use(http.get(`${API}/products`, () => HttpResponse.json({}, { status: 401 })))

    await expect(api.get('/products')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/login?redirect=%2Fcategoria%2Fperros%3Fpage%3D2')
  })

  it('no redirige si ya estamos en /login (evita el bucle infinito)', async () => {
    const fakeWindow = stubLocation('/login')
    server.use(http.get(`${API}/cart`, () => HttpResponse.json({}, { status: 401 })))

    await expect(api.get('/cart')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/login')
  })

  it('no redirige si estamos en /registro', async () => {
    const fakeWindow = stubLocation('/registro')
    server.use(http.get(`${API}/cart`, () => HttpResponse.json({}, { status: 401 })))

    await expect(api.get('/cart')).rejects.toThrow()

    expect(fakeWindow.location.href).toBe('/registro')
  })
})

describe('propagación del error', () => {
  it('rechaza la promesa para que el llamante pueda manejar el fallo', async () => {
    stubLocation('/carrito')
    server.use(http.get(`${API}/cart`, () => HttpResponse.json({}, { status: 401 })))

    await expect(api.get('/cart')).rejects.toMatchObject({
      response: { status: 401 },
    })
  })
})
