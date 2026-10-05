import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import { renderWithProviders } from './utils'

/**
 * ProductCard concentra tres decisiones de negocio que dependen de los tipos
 * que llegan del backend: precio frente a precio original, disponibilidad y
 * el mensaje de WhatsApp. Las tres conectan con la compra.
 */

// Los precios reales del backend llegan como STRING porque MySQL DECIMAL
// vuelve de mysql2 sin coerción. Se prueban las dos formas.
const PRODUCT = {
  id: 1,
  name: 'Concentrado Adulto 3kg',
  slug: 'concentrado-adulto-3kg',
  category: 'Alimento para Perro',
  price: '45000.00',
  originalPrice: '60000.00',
  stock: 12,
  isNew: false,
  featured: false,
}

const CART_KEY = 'techstore_cart'

function readCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
}

describe('ProductSkeleton — estado de carga', () => {
  it('se marca como ocupado para lectores de pantalla', () => {
    renderWithProviders(<ProductSkeleton />)

    expect(screen.getByRole('listitem')).toHaveAttribute('aria-busy', 'true')
  })

  it('no expone texto que un lector de pantalla leería como contenido real', () => {
    renderWithProviders(<ProductSkeleton />)

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('soporta la variante de lista', () => {
    renderWithProviders(<ProductSkeleton variant="list" />)

    expect(screen.getByRole('listitem')).toHaveAttribute('aria-busy', 'true')
  })
})

describe('ProductCard — datos básicos', () => {
  it('muestra el nombre y enlaza a la ficha por slug', () => {
    renderWithProviders(<ProductCard product={PRODUCT} />)

    const heading = screen.getByRole('heading', { name: 'Concentrado Adulto 3kg' })
    expect(heading).toBeInTheDocument()
    expect(heading.closest('a')).toHaveAttribute('href', '/producto/concentrado-adulto-3kg')
  })

  it('muestra el precio actual formateado', () => {
    renderWithProviders(<ProductCard product={PRODUCT} />)

    expect(screen.getByText(/45[.\s]?000/)).toBeInTheDocument()
  })

  it('muestra la categoría como contexto de la ficha', () => {
    renderWithProviders(<ProductCard product={PRODUCT} />)

    expect(screen.getByText('Alimento para Perro')).toBeInTheDocument()
  })

  it('expone la disponibilidad según el stock', () => {
    renderWithProviders(<ProductCard product={PRODUCT} />)

    expect(screen.getByText('Disponible')).toBeInTheDocument()
  })
})

describe('ProductCard — estados de stock', () => {
  it('informa "Agotado" y deshabilita la compra sin unidades', () => {
    renderWithProviders(<ProductCard product={{ ...PRODUCT, stock: 0 }} />)

    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Agregar .* al carrito/ })).toBeDisabled()
  })

  it('advierte cuando quedan pocas unidades', () => {
    renderWithProviders(<ProductCard product={{ ...PRODUCT, stock: 3 }} />)

    expect(screen.getByText('Stock bajo (3)')).toBeInTheDocument()
    expect(screen.getByText('Últimos 3')).toBeInTheDocument()
  })
})

describe('ProductCard — precio de oferta (tipos del backend)', () => {
  it('calcula y muestra el descuento con precios numéricos', () => {
    renderWithProviders(
      <ProductCard product={{ ...PRODUCT, price: 45000, originalPrice: 60000 }} />
    )

    expect(screen.getByText('25% OFF')).toBeInTheDocument()
  })

  it(
    'debería detectar la oferta cuando los precios llegan como string de MySQL',
    () => {
      // DEFECTO — ProductCard.jsx:15, 164 y 308 comparan
      // `product.price < product.originalPrice` sin coerción a número. Con los
      // DECIMAL que entrega el backend como string la comparación es LÉXICA.
      // '45000.00' < '60000.00' es TRUE ('4' < '6'), así que el casoTypical
      // pasa por casualidad y oculta el fallo.
      renderWithProviders(
        <ProductCard product={{ ...PRODUCT, price: '9500.00', originalPrice: '10000.00' }} />
      )

      // Con 9.500 vs 10.000 la comparación léxica da FALSE ('9' > '1'), así que
      // la tarjeta no muestra ni el badge de oferta ni el precio tachado: el
      // cliente ve el precio original y se pierde la promoción.
      expect(screen.getByText('5% OFF')).toBeInTheDocument()
    }
  )

  it(
    'debería tachar el precio original cuando los precios llegan como string',
    () => {
      renderWithProviders(
        <ProductCard product={{ ...PRODUCT, price: '99000.00', originalPrice: '120000.00' }} />
      )

      expect(screen.getByText(/120[.\s]?000/)).toBeInTheDocument()
    }
  )

  it('no muestra precio tachado cuando el producto no está en oferta', () => {
    renderWithProviders(<ProductCard product={{ ...PRODUCT, originalPrice: null }} />)

    expect(screen.queryByText(/60[.\s]?000/)).not.toBeInTheDocument()
  })
})

describe('ProductCard — acciones sobre el carrito', () => {
  it('persiste el producto en el carrito al agregarlo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={PRODUCT} />)

    await user.click(screen.getByRole('button', { name: /Agregar .* al carrito/ }))

    await waitFor(() => expect(readCart()).toHaveLength(1))
    expect(readCart()[0]).toMatchObject({
      productId: PRODUCT.id,
      quantity: 1,
      name: PRODUCT.name,
      slug: PRODUCT.slug,
    })
  })

  it('acumula cantidad en lugar de duplicar la línea', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={PRODUCT} />)

    const button = screen.getByRole('button', { name: /Agregar .* al carrito/ })

    await user.click(button)
    await waitFor(() => expect(readCart()).toHaveLength(1))

    // El botón se deshabilita 300 ms tras pulsar (estado `adding`) para evitar
    // dobles clics; hay que esperar a que se rehabilite antes del segundo clic.
    await waitFor(() => expect(button).not.toBeDisabled())
    await user.click(button)

    await waitFor(() => expect(readCart()[0].quantity).toBe(2))
    expect(readCart()).toHaveLength(1)
  })

  it('recupera el carrito guardado en localStorage al montar', async () => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify([
        { productId: 99, quantity: 3, name: ' Correa', price: 15000, stock: 5 },
      ])
    )

    renderWithProviders(<ProductCard product={PRODUCT} />)

    await waitFor(() => expect(readCart()[0].productId).toBe(99))
  })

  it('no escribe nada en el carrito cuando el producto está agotado', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={{ ...PRODUCT, stock: 0 }} />)

    await user.click(screen.getByRole('button', { name: /Agregar .* al carrito/ }))

    expect(readCart()).toEqual([])
  })
})

describe('ProductCard — botón de favorito', () => {
  it('expone el estado de favorito a lectores de pantalla', () => {
    renderWithProviders(<ProductCard product={PRODUCT} />)

    const button = screen.getByRole('button', { name: 'Agregar a favoritos' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('alterna a "Quitar de favoritos" tras pulsarlo', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductCard product={PRODUCT} />)

    await user.click(screen.getByRole('button', { name: 'Agregar a favoritos' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })
  })
})

describe('ProductCard — WhatsApp', () => {
  it(
    'debería abrir WhatsApp con el producto en el mensaje',
    async () => {
      const user = userEvent.setup()
      const open = vi.fn()
      vi.stubGlobal('open', open)

      renderWithProviders(<ProductCard product={PRODUCT} />)

      await user.click(screen.getByRole('button', { name: /Comprar .* por WhatsApp/ }))

      expect(open).toHaveBeenCalledTimes(1)
      const url = open.mock.calls[0][0]

      // DEFECTO — ProductCard.jsx:41 llama
      // getWhatsAppUrl({ name, price, discountPrice }), pero helpers.js:200
      // espera un string y hace `encodeURIComponent(message)`. Al recibir un
      // objeto produce "text=%5Bobject%20Object%5D" y el vendedor abre el
      // chat con un mensaje inútil: se pierde la venta por WhatsApp, que es
      // uno de los canales de venta del negocio.
      expect(decodeURIComponent(url)).toContain('Concentrado Adulto 3kg')
    }
  )
})
