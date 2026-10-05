import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server, API } from './mocks/server'
import CartDrawer from '../components/cart/CartDrawer'
import ProductCard from '../components/products/ProductCard'
import { renderWithProviders } from './utils'

/**
 * El usuario reportado que al agregar un producto no podía quitarlo. El botón
 * de papelera, el diálogo de confirmación y el contexto ya existían, así que
 * esta suite reproduce el gesto completo para localizar dónde se rompe.
 */

const ITEM = {
  productId: 99,
  quantity: 2,
  price: '45000.00',
  discountPrice: null,
  name: 'Concentrado Adulto 3kg',
  slug: 'concentrado-adulto-3kg',
  image: '/assets/images/producto1.webp',
  sku: 'ALI-ADU-001',
  stock: 10,
}

const STORAGE_KEY = 'techstore_cart'

const abrirCarrito = async (user) => {
  await user.click(screen.getByRole('button', { name: /Carrito: 2 productos/ }))
}

describe('Carrito — eliminar un producto', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([ITEM]))

    server.use(
      http.delete(`${API}/cart/:productId`, () => HttpResponse.json({ message: 'ok' }))
    )
  })

  it('abre el diálogo de confirmación al pulsar la papelera', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartDrawer />)
    await abrirCarrito(user)

    await user.click(await screen.findByRole('button', { name: /Eliminar Concentrado/ }))

    expect(await screen.findByRole('dialog', { name: /Eliminar del carrito/ })).toBeInTheDocument()
  })

  it('quita el producto al confirmar y lo borra del almacenamiento local', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartDrawer />)
    await abrirCarrito(user)

    await user.click(await screen.findByRole('button', { name: /Eliminar Concentrado/ }))
    await user.click(await screen.findByRole('button', { name: /^Eliminar$/ }))

    await waitFor(() => {
      expect(screen.queryByText('Concentrado Adulto 3kg')).not.toBeInTheDocument()
    })

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([])
  })

  it('avisa al backend para que la baja no reaparezca al sincronizar', async () => {
    const borrar = vi.fn(() => HttpResponse.json({ message: 'ok' }))
    server.use(http.delete(`${API}/cart/:productId`, borrar))

    const user = userEvent.setup()
    renderWithProviders(<CartDrawer />)
    await abrirCarrito(user)

    await user.click(await screen.findByRole('button', { name: /Eliminar Concentrado/ }))
    await user.click(await screen.findByRole('button', { name: /^Eliminar$/ }))

    await waitFor(() => expect(borrar).toHaveBeenCalled())
    expect(borrar.mock.calls[0][0].request.url).toContain('/cart/99')
  })

  it('no borra nada si el usuario cancela la confirmación', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartDrawer />)
    await abrirCarrito(user)

    await user.click(await screen.findByRole('button', { name: /Eliminar Concentrado/ }))
    await user.click(await screen.findByRole('button', { name: /^Cancelar$/ }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Eliminar del carrito/ })).not.toBeInTheDocument()
    })
    expect(screen.getByText('Concentrado Adulto 3kg')).toBeInTheDocument()
  })

  // El defecto de fondo: el carrito se guardaba solo en localStorage, así que el
  // servidor nunca se enteraba de lo que el usuario quitaba y el siguiente
  // sync lo resucitaba. Ahora toda mutación viaja al backend.
  it('el servidor se entera cuando se agrega un producto', async () => {
    const agregar = vi.fn(() => HttpResponse.json({ message: 'ok' }))
    server.use(http.post(`${API}/cart`, agregar))

    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={{ id: 99, name: 'Concentrado', price: 45000, stock: 5 }} />)
    await user.click(await screen.findByRole('button', { name: /Agregar Concentrado al carrito/ }))

    await waitFor(() => expect(agregar).toHaveBeenCalled())
  })

  it('el servidor se entera cuando cambia una cantidad', async () => {
    const cambiar = vi.fn(() => HttpResponse.json({ message: 'ok' }))
    server.use(http.put(`${API}/cart/:productId`, cambiar))

    const user = userEvent.setup()
    renderWithProviders(<CartDrawer />)
    await abrirCarrito(user)

    await user.click(await screen.findByRole('button', { name: /Aumentar cantidad/ }))

    await waitFor(() => expect(cambiar).toHaveBeenCalled())
    expect(cambiar.mock.calls[0][0].request.url).toContain('/cart/99')
  })
})
