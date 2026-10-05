import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const API = '/api'

/**
 * Manejadores por defecto: el suficiente para que un componente monte.
 * `onUnhandledRequest: 'error'` en setup.js obliga a declarar cada petición,
 * así que una suite que olvide un endpoint falla en vez de pedir red real.
 */
export const handlers = [
  http.get(`${API}/auth/me`, () => HttpResponse.json({ user: null }, { status: 401 })),

  http.get(`${API}/products`, () =>
    HttpResponse.json({ products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })
  ),
  http.get(`${API}/products/featured`, () => HttpResponse.json({ products: [] })),
  http.get(`${API}/products/on-sale`, () => HttpResponse.json({ products: [] })),
  http.get(`${API}/products/new-arrivals`, () => HttpResponse.json({ products: [] })),
  http.get(`${API}/products/search`, () => HttpResponse.json({ products: [] })),
  http.get(`${API}/categories`, () => HttpResponse.json({ categories: [] })),

  http.get(`${API}/cart`, () => HttpResponse.json({ items: [], total: 0 })),
  http.post(`${API}/cart`, () => HttpResponse.json({ message: 'Producto agregado al carrito' })),
  http.put(`${API}/cart/:productId`, () => HttpResponse.json({ message: 'Carrito actualizado' })),
  http.delete(`${API}/cart/:productId`, () =>
    HttpResponse.json({ message: 'Producto eliminado del carrito' })
  ),
  http.delete(`${API}/cart`, () => HttpResponse.json({ message: 'Carrito vaciado' })),
  http.post(`${API}/cart/sync`, () => HttpResponse.json({ items: [], total: 0 })),
]

export const server = setupServer(...handlers)
