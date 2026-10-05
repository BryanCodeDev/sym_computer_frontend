import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const siteUrl = 'https://symcomputer.com'
const defaultTitle = 'SYM COMPUTER - Partes, Equipos y Accesorios para tu PC'
const defaultDescription = 'Tu tienda online de partes, equipos y accesorios para computadores. Envíos a Bogotá, alrededores y todo Colombia.'
const defaultImage = '/og-image.jpg'
const twitterHandle = '@sym_computer'

/**
 * Los datos de las etiquetas llegan de la API, donde un campo sin valor es
 * `null`, no `undefined`. Los parámetros por defecto de abajo solo sustituyen
 * `undefined`, así que un `null` atravesaba el componente y reventaba en el
 * primer `.startsWith`. Cualquier hueco vuelve al valor por defecto.
 */
const resolve = (value, fallback) => (value == null || value === '' ? fallback : value)

const toAbsoluteUrl = path => (path.startsWith('http') ? path : `${siteUrl}${path}`)

export default function SEO({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = siteUrl,
  type = 'website',
  noindex = false,
  nofollow = false,
  canonical,
  structuredData,
  product,
  breadcrumbs,
}) {
  const location = useLocation()
  const resolvedTitle = resolve(title, defaultTitle)
  const resolvedDescription = resolve(description, defaultDescription)
  const fullUrl = resolve(canonical, `${siteUrl}${location.pathname}${location.search}`)
  const fullImage = toAbsoluteUrl(resolve(image, defaultImage))

  const jsonLd = []

  if (type === 'product' && product) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      sku: product.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      image: (product.images || []).map(toAbsoluteUrl),
      offers: {
        '@type': 'Offer',
        url: fullUrl,
        priceCurrency: product.currency,
        price: product.price,
        availability: product.availability,
        seller: {
          '@type': 'Organization',
          name: 'SYM COMPUTER',
        },
      },
      ...(product.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        },
      }),
    })
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        ...(crumb.url && { item: toAbsoluteUrl(crumb.url) }),
      })),
    })
  }

  if (structuredData) {
    const data = Array.isArray(structuredData) ? structuredData : [structuredData]
    jsonLd.push(...data)
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SYM COMPUTER',
    url: siteUrl,
    logo: `${siteUrl}/assets/images/Logo.webp`,
    sameAs: [
      'https://www.facebook.com/Symcomputer',
      'https://www.instagram.com/symcomputer/',
      'https://www.youtube.com/channel/UCjHDlAs5OBnPGxeopvbED_Q',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+573001027616',
      contactType: 'customer service',
      availableLanguage: ['Spanish'],
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SYM COMPUTER',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={fullUrl} />

      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {noindex && nofollow && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SYM COMPUTER" />
      <meta property="og:locale" content="es_CO" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  )
}
