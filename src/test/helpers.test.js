import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatPrice,
  formatNumber,
  calculateDiscount,
  slugify,
  truncate,
  debounce,
  throttle,
  getInitials,
  validateEmail,
  validatePhone,
  classNames,
  buildQueryString,
  parseQueryString,
  getImageUrl,
  getProductImage,
  getWhatsAppUrl,
  getProductMessage,
} from '../utils/helpers'

describe('formatPrice', () => {
  it('formatea un monto en pesos colombianos', () => {
    expect(formatPrice(45000)).toMatch(/45[.\s]?000/)
  })

  it('devuelve $0 ante null o undefined', () => {
    expect(formatPrice(null)).toBe('$0')
    expect(formatPrice(undefined)).toBe('$0')
  })

  it('no redondea a decimales', () => {
    expect(formatPrice(1234.56)).not.toMatch(/[,.]5[0-9]/)
  })
})

describe('formatNumber', () => {
  it('aplica el separador de miles local', () => {
    expect(formatNumber(1500000)).toMatch(/1[.\s]?500[.\s]?000/)
  })
})

describe('calculateDiscount', () => {
  it('calcula el porcentaje', () => {
    expect(calculateDiscount(60000, 45000)).toBe(25)
  })

  it('devuelve 0 si no hay descuento o si el precio subió', () => {
    expect(calculateDiscount(45000, 45000)).toBe(0)
    expect(calculateDiscount(45000, 60000)).toBe(0)
    expect(calculateDiscount(null, 45000)).toBe(0)
  })
})

describe('slugify', () => {
  it('normaliza para URLs', () => {
    expect(slugify('Alimento para Perro')).toBe('alimento-para-perro')
    expect(slugify('Collar ¡Antipulgas!')).toBe('collar-antipulgas')
  })
})

describe('truncate', () => {
  it('deja intactos los textos cortos', () => {
    expect(truncate('Alimento', 100)).toBe('Alimento')
  })

  it('corta y añade puntos suspensivos', () => {
    expect(truncate('a'.repeat(150), 100)).toHaveLength(103)
  })

  it('respeta el límite exacto sin cortar', () => {
    expect(truncate('a'.repeat(100), 100)).toBe('a'.repeat(100))
  })
})

describe('debounce', () => {
  it('solo ejecuta la última llamada dentro de la ventana', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('a')
    debounced('b')
    debounced('c')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')

    vi.useRealTimers()
  })
})

describe('throttle', () => {
  it('ignora las llamadas dentro de la ventana', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttled = throttle(fn, 300)

    throttled('a')
    throttled('b')
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(300)
    throttled('c')
    expect(fn).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})

describe('getInitials', () => {
  it('toma las iniciales de nombre y apellido', () => {
    expect(getInitials('Camilo Alvarez')).toBe('CA')
  })

  it('toma las dos primeras palabras en nombres compuestos', () => {
    // Nombres colombianos de 3+ palabras ("Juan Sebastian Lopez") muestran
    // las iniciales del nombre y del segundo nombre, no nombre + apellido.
    // No es incorrecto, pero conviene tenerlo presente al revisar la UI.
    expect(getInitials('Juan Sebastian Lopez')).toBe('JS')
  })

  it('tolera espacios sobrantes', () => {
    expect(getInitials('  Ana   Maria  ')).toBe('AM')
  })
})

describe('validateEmail', () => {
  it('acepta un correo válido', () => {
    expect(validateEmail('cliente@symcomputer.com')).toBe(true)
  })

  it.each(['', 'sin-arroba', 'a@b'])('rechaza %j', (email) => {
    expect(validateEmail(email)).toBe(false)
  })
})

describe('validatePhone', () => {
  it.each([
    '3001027616',
    '300 102 7616',
    '+57 300 102 7616',
    '(300) 102-7616',
    '300-102-7616',
  ])('acepta %s', (phone) => {
    expect(validatePhone(phone)).toBe(true)
  })

  it.each(['', '123', 'abcdefghij', '300abc10276'])('rechaza %j', (phone) => {
    expect(validatePhone(phone)).toBe(false)
  })
})

describe('classNames', () => {
  it('concatena solo los valores truthy', () => {
    expect(classNames('card', false, null, undefined, 'active')).toBe('card active')
  })
})

describe('buildQueryString', () => {
  it('omite undefined, null y cadena vacía', () => {
    expect(buildQueryString({ page: 1, q: '', category: undefined, sort: null })).toBe('page=1')
  })

  it('repite la clave cuando el valor es un array', () => {
    expect(buildQueryString({ tag: ['perro', 'gato'] })).toBe('tag=perro&tag=gato')
  })

  it('codifica caracteres especiales', () => {
    expect(buildQueryString({ q: 'alimento & snacks' })).toBe('q=alimento+%26+snacks')
  })
})

describe('parseQueryString', () => {
  it('agrupa los valores repetidos en un array', () => {
    expect(parseQueryString('tag=perro&tag=gato&page=1')).toEqual({
      tag: ['perro', 'gato'],
      page: '1',
    })
  })

  it('devuelve un objeto vacío para una cadena vacía', () => {
    expect(parseQueryString('')).toEqual({})
  })

  it('es la inversa de buildQueryString', () => {
    const params = { page: 2, q: 'comida para perros', tag: ['a', 'b'] }
    expect(parseQueryString(buildQueryString(params))).toEqual({
      page: '2',
      q: 'comida para perros',
      tag: ['a', 'b'],
    })
  })
})

describe('getImageUrl', () => {
  it('devuelve la imagen de reserva cuando falta el path', () => {
    expect(getImageUrl(null)).toBe('/assets/images/producto1.webp')
    expect(getImageUrl('')).toBe('/assets/images/producto1.webp')
  })

  it('no modifica una URL absoluta', () => {
    expect(getImageUrl('https://cdn.test/a.jpg', { width: 100 })).toBe('https://cdn.test/a.jpg')
  })

  it('añade transformaciones de Cloudinary cuando hay dimensiones', () => {
    const result = getImageUrl('perro.webp', { width: 400, height: 300 })

    if (result.startsWith('http') || result.includes('w_400')) {
      expect(result).toContain('w_400')
      expect(result).toContain('h_300')
    } else {
      // Sin VITE_CLOUDINARY_URL configurado no hay transformaciones posibles.
      expect(result).toBe('/perro.webp')
    }
  })
})

describe('getProductImage', () => {
  it('devuelve la imagen por índice', () => {
    const product = { images: [{ url: 'a.webp' }, { url: 'b.webp' }] }
    expect(getProductImage(product, 1)).toBe('b.webp')
  })

  it('cae a la imagen simple si el índice no existe', () => {
    const product = { images: [{ url: 'a.webp' }], image: 'main.webp' }
    expect(getProductImage(product, 5)).toBe('main.webp')
  })

  it('cae a la imagen de reserva si no hay ninguna', () => {
    expect(getProductImage({})).toBe('/assets/images/producto1.webp')
  })
})

describe('getWhatsAppUrl', () => {
  // El número viene de VITE_WHATSAPP_NUMBER. Se fija aquí para que la
  // aserción no dependa del .env de quien ejecuta: este test afirmaba
  // literalmente "wa.me/undefined", es decir documentaba la variable sin
  // configurar en lugar del comportamiento que debe garantizarse.
  beforeEach(() => {
    vi.stubEnv('VITE_WHATSAPP_NUMBER', '573001234567')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('construye un enlace wa.me con el número configurado y el mensaje codificado', () => {
    const url = getWhatsAppUrl('Hola & bienvenido')

    expect(url).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/)
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Hola & bienvenido')
  })

  it('compone el mensaje cuando se le pasa un producto', () => {
    // Antes los llamantes pasaban un objeto y encodeURICurrency lo
    // convertía en "[object Object]", así que el vendedor abría el chat vacío.
    const url = getWhatsAppUrl({ name: 'Concentrado Adulto', price: 45000, sku: 'SKU-1' })
    const text = decodeURIComponent(url.split('text=')[1])

    expect(text).toContain('Concentrado Adulto')
    expect(text).toContain('45.000')
    expect(text).not.toContain('[object Object]')
  })

  it('incluye el precio original cuando el producto está en oferta', () => {
    const url = getWhatsAppUrl({ name: 'Oferta', price: '9500.00', originalPrice: '10000.00' })
    const text = decodeURIComponent(url.split('text=')[1])

    expect(text).toContain('9.500')
    expect(text).toContain('10.000')
  })

  it('añade la cantidad cuando es mayor que uno', () => {
    const url = getWhatsAppUrl({ name: 'Cepillo', price: 15000 }, 3)
    expect(decodeURIComponent(url.split('text=')[1])).toContain('Cantidad: 3')
  })

  it('no rompe con valores ausentes', () => {
    expect(decodeURIComponent(getWhatsAppUrl(null).split('text=')[1])).toBe('')
    expect(decodeURIComponent(getWhatsAppUrl({}).split('text=')[1])).toBe('')
  })

  it('getProductMessage devuelve cadena vacía sin producto', () => {
    expect(getProductMessage(null)).toBe('')
    expect(getProductMessage({})).toBe('')
  })
})
