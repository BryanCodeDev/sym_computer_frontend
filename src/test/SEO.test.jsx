import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import SEO from '../components/seo/SEO'

const metaContent = (attr, value) =>
  document.head.querySelector(`meta[${attr}="${value}"]`)?.getAttribute('content')

const jsonLd = () =>
  Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'))
    .flatMap(script => JSON.parse(script.textContent))

/**
 * SEO no encaja en renderWithProviders: además de los contexts de la app usa
 * HelmetProvider, que vuelca las etiquetas a document.head. Se leen de ahí
 * porque es lo que ve el buscador. Ojo: Helmet las aplica en un efecto aparte
 * del render, así que hay que esperarlas; el link canónico sirve de ancla
 * porque se emite en todos los casos.
 */
async function renderSEO(props, { route = '/tienda/perros' } = {}) {
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <SEO {...props} />
      </MemoryRouter>
    </HelmetProvider>
  )

  await waitFor(() =>
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeNull()
  )
}

describe('SEO', () => {
  it('arma la URL canónica a partir de la ruta cuando no le pasan una', async () => {
    await renderSEO({})

    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://symcomputer.com/tienda/perros'
    )
  })

  it('respeta la URL canónica explícita', async () => {
    await renderSEO({ canonical: 'https://symcomputer.com/producto/x' })

    expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://symcomputer.com/producto/x'
    )
  })

  // Regresión: las categorías sin imagen llegan con imageUrl en null desde la API
  // y el componente reventaba con "Cannot read properties of null (reading
  // 'startsWith')". Los parámetros por defecto de la función solo sustituyen
  // undefined, por eso el hueco hay que cerrarlo dentro del componente.
  it('no revienta con image en null y cae a la imagen por defecto', async () => {
    await renderSEO({ image: null })

    expect(metaContent('property', 'og:image')).toBe('https://symcomputer.com/og-image.jpg')
  })

  it('tampoco revienta con title o description en null', async () => {
    await renderSEO({ title: null, description: null })

    expect(document.title).toContain('SYM COMPUTER')
    expect(metaContent('name', 'description')).toBeTruthy()
  })

  it('convierte una imagen relativa en absoluta', async () => {
    await renderSEO({ image: '/assets/images/categoria.webp' })

    expect(metaContent('property', 'og:image')).toBe(
      'https://symcomputer.com/assets/images/categoria.webp'
    )
  })

  it('respeta una imagen que ya es absoluta', async () => {
    await renderSEO({ image: 'https://cdn.example.com/foto.jpg' })

    expect(metaContent('property', 'og:image')).toBe('https://cdn.example.com/foto.jpg')
  })

  it('marca la página como noindex cuando se le pide', async () => {
    await renderSEO({ noindex: true })

    expect(metaContent('name', 'robots')).toBe('noindex')
  })

  it('publica el JSON-LD de organización y de sitio en todas las páginas', async () => {
    await renderSEO({})

    expect(jsonLd().map(entry => entry['@type'])).toEqual(['Organization', 'WebSite'])
  })

  it('genera el JSON-LD del producto sin romperse si no trae imágenes', async () => {
    await renderSEO({
      type: 'product',
      product: { name: 'Concentrado Adulto', description: 'Alimento', images: null },
    })

    const product = jsonLd().find(entry => entry['@type'] === 'Product')
    expect(product.name).toBe('Concentrado Adulto')
    expect(product.image).toEqual([])
  })

  it('genera las migas de pan aunque vengan sin URL', async () => {
    await renderSEO({
      breadcrumbs: [{ name: 'Inicio' }, { name: 'Perros', url: '/categoria/perros' }],
    })

    const crumbs = jsonLd().find(entry => entry['@type'] === 'BreadcrumbList')
    expect(crumbs.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Perros',
        item: 'https://symcomputer.com/categoria/perros',
      },
    ])
  })
})
