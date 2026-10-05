import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X, ShoppingCart, Zap, MessageSquare, Star, Share2, Heart, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { formatPrice, calculateDiscount, getStockStatus, getWhatsAppUrl } from '../utils/helpers'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { productService } from '../services/products'
import SEO from '../components/seo/SEO'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoomActive, setZoomActive] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await productService.getBySlug(slug)
        setProduct(data.product)
        if (data.related) setRelatedProducts(data.related)
      } catch (err) {
        setError(err.response?.status === 404 ? 'Producto no encontrado' : 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  useEffect(() => {
    setSelectedImage(0)
  }, [product])

  if (loading) {
    return (
      <>
        <SEO title="Cargando..." />
        <div className="min-h-screen bg-cream pt-20">
          <div className="container-custom py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProductSkeleton variant="detail" />
              <div className="space-y-6">
                <ProductSkeleton variant="detail-info" />
                <ProductSkeleton variant="detail-actions" />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <SEO title="Producto no encontrado" noindex />
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="container-custom text-center py-20">
            <svg className="w-20 h-20 text-primary-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h1 className="font-display font-bold text-3xl text-primary-900 mb-2">Producto no encontrado</h1>
            <p className="text-primary-900 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
            <Link to="/tienda" className="btn-primary inline-flex">Volver a la tienda</Link>
          </div>
        </div>
      </>
    )
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url || img)
    : [product.image || '/assets/images/producto1.webp']

  const discount = product.discount || (product.originalPrice && product.price < product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0)

  const stockStatus = getStockStatus(product.stock)
  const canBuy = product.stock > 0

  const handleAddToCart = async () => {
    if (!canBuy) return
    setAdding(true)
    try {
      addItem(product, quantity)
      toast.success(`${product.name} agregado al carrito`)
    } catch (err) {
      toast.error('Error al agregar al carrito')
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = () => {
    if (!canBuy) return
    addItem(product, quantity)
    window.location.href = '/checkout'
  }

  const handleWhatsApp = () => {
    window.open(getWhatsAppUrl(product, quantity), '_blank')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  const breadcrumbs = [
    { name: 'Inicio', url: '/' },
    { name: 'Tienda', url: '/tienda' },
    { name: product.category, url: `/categoria/${product.categorySlug || product.category.toLowerCase()}` },
    { name: product.name, url: window.location.href },
  ]

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    image: images.map(img => img.startsWith('http') ? img : `https://symcomputer.com${img}`),
    offers: {
      '@type': 'Offer',
      url: window.location.href,
      priceCurrency: 'COP',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'SYM COMPUTER' },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  }

  return (
    <>
<SEO
        title={`${product.name} | SYM COMPUTER`}
        description={product.shortDescription || product.description?.slice(0, 160)}
        image={images[0]}
        url={`/producto/${product.slug}`}
        type="product"
        product={{
          name: product.name,
          description: product.description,
          price: product.price,
          currency: 'COP',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          brand: product.brand,
          sku: product.sku,
          images,
          rating: product.rating,
          reviewCount: product.reviewCount,
        }}
        breadcrumbs={breadcrumbs}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-cream pt-20">
        <div className="container-custom py-8">
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2 text-sm text-primary-900">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.url} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-primary-900 truncate max-w-xs" aria-current="page">{crumb.name}</span>
                  ) : (
                    <Link to={crumb.url} className="hover:text-charcoal-600 transition-colors">{crumb.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-primary-50 border border-dark-border">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage] || '/assets/images/producto1.webp'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                {zoomActive && (
                  <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                    <img
                      src={images[selectedImage] || '/assets/images/producto1.webp'}
                      alt={product.name}
                      className="max-h-[90vh] max-w-[90vw] object-contain"
                    />
                    <button
                      onClick={() => setZoomActive(false)}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-primary-900 hover:bg-primary-50"
                      aria-label="Cerrar zoom"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setZoomActive(true)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-primary-900 hover:bg-primary-50 transition-colors z-10"
                  aria-label="Ampliar imagen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Imágenes del producto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-charcoal-500 shadow-card'
                          : 'border-dark-border hover:border-charcoal-300'
                      }`}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-current={selectedImage === index}
                      role="listitem"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={handleShare} className="btn-secondary px-3 sm:px-4" aria-label="Compartir producto">
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Compartir</span>
                </button>
                <button
                  onClick={() => toggleItem(product)}
                  className={`btn-secondary px-3 sm:px-4 ${isInWishlist(product.id) ? 'bg-charcoal-600/10 border-charcoal-600/20 text-charcoal-600' : ''}`}
                  aria-label={isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  aria-pressed={isInWishlist(product.id)}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{isInWishlist(product.id) ? 'En favoritos' : 'Favoritos'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-primary-50 border border-dark-border rounded-full text-xs font-medium text-primary-900 mb-3">
                  {product.category}
                </span>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-bold text-3xl sm:text-4xl text-primary-900 mb-3"
                >
                  {product.name}
                </motion.h1>

                {product.rating && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-primary-900">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-primary-900">({product.reviewCount || 0} reseñas)</span>
                    <span className="text-primary-900">·</span>
                    <span className="text-primary-900">SKU: {product.sku}</span>
                  </div>
                )}

                <div className="flex items-baseline gap-4 flex-wrap mb-4">
                  <motion.span className="font-display font-bold text-3xl sm:text-4xl text-charcoal-600">
                    {formatPrice(product.price)}
                  </motion.span>
                  {product.originalPrice && product.price < product.originalPrice && (
                    <span className="text-primary-900 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                  )}
                  {discount > 0 && (
                    <span className="badge-sale px-3 py-1">{discount}% OFF</span>
                  )}
                </div>

                <div className={`flex items-center gap-3 ${stockStatus.class.replace('badge-', 'badge-')}`}>
                  <span className="font-medium">{stockStatus.label}</span>
                </div>
              </div>

              {product.shortDescription && (
                <div className="prose prose max-w-none text-primary-900">
                  <p>{product.shortDescription}</p>
                </div>
              )}

              <div className="border-t border-dark-border pt-6 space-y-4">
                <div>
                  <label htmlFor="quantity" className="label">Cantidad</label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center border border-dark-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="px-3 sm:px-4 py-2 sm:py-3 text-primary-900 hover:text-charcoal-600 hover:bg-primary-100 disabled:opacity-50 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        min="1"
                        max={product.stock}
                        className="w-16 text-center bg-transparent border-0 focus:outline-none text-primary-900 font-medium"
                        aria-label="Cantidad"
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="px-3 sm:px-4 py-2 sm:py-3 text-primary-900 hover:text-charcoal-600 hover:bg-primary-100 disabled:opacity-50 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                    <span className="text-primary-900 text-sm">Disponibles: {product.stock}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || !canBuy}
                    className="flex-1 btn-primary py-3 sm:py-4 text-base sm:text-lg gap-3"
                  >
                    {adding ? (
                      <motion.svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10A10 10 0 0 1 12 22 10 10 0 0 1 2 12 10 10 0 0 1 12 2" /></motion.svg>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Agregar al carrito</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!canBuy}
                    className="flex-1 btn-secondary py-3 sm:py-4 text-base sm:text-lg gap-3"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Comprar ahora</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 btn-whatsapp py-3 sm:py-4 text-base sm:text-lg gap-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-dark-border pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-primary-50 rounded-xl">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900">Envío gratis</p>
                    <p className="text-primary-900 text-sm">En compras mayores a $100.000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-primary-50 rounded-xl">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900">Garantía oficial</p>
                    <p className="text-primary-900 text-sm">{product.warranty || '12 meses de garantía'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-primary-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900">Devoluciones fáciles</p>
                    <p className="text-primary-900 text-sm">30 días sin complicaciones</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="border border-dark-border rounded-2xl overflow-hidden">
                <div className="border-b border-dark-border">
                  <nav className="flex gap-1 p-1 overflow-x-auto" aria-label="Pestañas de producto">
                    <button className="tab-btn px-4 py-3 font-medium text-primary-900 hover:text-primary-900 transition-colors relative whitespace-nowrap">
                      Descripción
                    </button>
                    <button className="tab-btn px-4 py-3 font-medium text-primary-900 hover:text-primary-900 transition-colors relative whitespace-nowrap">
                      Especificaciones
                    </button>
                    <button className="tab-btn px-4 py-3 font-medium text-primary-900 hover:text-primary-900 transition-colors relative whitespace-nowrap">
                      Características
                    </button>
                    <button className="tab-btn px-4 py-3 font-medium text-primary-900 hover:text-primary-900 transition-colors relative whitespace-nowrap">
                      Garantía
                    </button>
                  </nav>
                </div>
                <div className="p-8">
                  <div className="prose prose max-w-none text-primary-900">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>

                  {product.specifications && (
                    <div className="mt-12">
                      <h3 className="font-display font-semibold text-xl text-primary-900 mb-6">Especificaciones técnicas</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row gap-2 p-3 sm:p-4 bg-primary-50 rounded-xl">
                            <dt className="text-primary-900 font-medium sm:w-1/3">{key}</dt>
                            <dd className="text-primary-900">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {product.features && (
                    <div className="mt-12">
                      <h3 className="font-display font-semibold text-xl text-primary-900 mb-6">Características destacadas</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-primary-50 rounded-xl">
                            <svg className="w-5 h-5 text-charcoal-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            <span className="text-primary-900">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.warranty && (
                    <div className="mt-12">
                      <h3 className="font-display font-semibold text-xl text-primary-900 mb-6">Garantía y soporte</h3>
                      <div className="prose prose max-w-none text-primary-900">
                        <p>{product.warranty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="section-title">PRODUCTOS RELACIONADOS</h2>
                <Link to={`/categoria/${product.categorySlug || product.category.toLowerCase()}`} className="btn-outline">
                  Ver más
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
                {relatedProducts.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    role="listitem"
                  >
                    <ProductCard product={related} variant="default" />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  )
}