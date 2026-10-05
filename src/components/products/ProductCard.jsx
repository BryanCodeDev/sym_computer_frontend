import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingCart, Zap, MessageSquare, Star } from 'lucide-react'
import { formatPrice, calculateDiscount, hasDiscount, getStockStatus, getWhatsAppUrl } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useState } from 'react'

export default function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)

  const onSale = hasDiscount(product)
  const discount = product.discount || (onSale
    ? calculateDiscount(product.originalPrice, product.price)
    : 0)

  const stockStatus = getStockStatus(product.stock)
  const imageIndex = hovered && product.images && product.images.length > 1 ? 1 : 0
  const image = product.images?.[imageIndex] || product.image || '/assets/images/producto1.webp'

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAdding(true)
    addItem(product, 1)
    setTimeout(() => setAdding(false), 300)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    window.location.href = '/checkout'
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(getWhatsAppUrl(product), '_blank')
  }

  const badges = []
  if (product.onSale || discount > 0) badges.push({ label: `${discount}% OFF`, class: 'badge-sale' })
  if (product.isNew) badges.push({ label: 'NUEVO', class: 'badge-new' })
  if (product.featured) badges.push({ label: 'DESTACADO', class: 'badge-gold' })
  if (product.stock > 0 && product.stock <= 5) badges.push({ label: `Últimos ${product.stock}`, class: 'badge-stock' })

  const commonImageOverlay = "absolute inset-0 bg-gradient-to-t from-charcoal-900/15 via-transparent to-transparent pointer-events-none"

  if (variant === 'featured') {
    return (
      <article className="card group relative" role="article" aria-labelledby={`product-${product.id}-title`}>
        <div
          className="card-image aspect-[4/3] relative overflow-hidden"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className={commonImageOverlay} />

          {badges.length > 0 && (
            <motion.div
              className="absolute top-3 left-3 flex flex-col gap-1.5 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {badges.map((badge, idx) => (
                <span key={idx} className={badge.class}>
                  {badge.label}
                </span>
              ))}
            </motion.div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
              className="flex-1 btn-primary py-2 text-sm disabled:opacity-50"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              {adding ? (
                <motion.svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10A10 10 0 0 1 12 22 10 10 0 0 1 2 12 10 10 0 0 1 12 2" /></motion.svg>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Agregar</span>
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="btn-secondary py-2 px-4 text-sm disabled:opacity-50"
              aria-label={`Comprar ${product.name} ahora`}
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={handleWhatsApp}
              className="btn-whatsapp py-2 px-4 text-sm"
              aria-label={`Comprar ${product.name} por WhatsApp`}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product) }}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isInWishlist(product.id)
                ? 'bg-charcoal-600/90 text-white'
                : 'bg-white/80 text-primary-900 hover:text-charcoal-600 hover:bg-primary-50'
            }`}
            aria-label={isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={isInWishlist(product.id)}
          >
            <motion.span
              animate={{ scale: isInWishlist(product.id) ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </motion.span>
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs text-primary-600">
            <span className="px-2 py-0.5 bg-charcoal-50 text-charcoal-700 rounded-full font-medium">{product.category}</span>
            {product.brand && <span>· {product.brand}</span>}
          </div>

          <Link to={`/producto/${product.slug}`} className="block">
            <h3 id={`product-${product.id}-title`} className="font-display font-semibold text-base sm:text-lg text-primary-900 line-clamp-2 group-hover:text-charcoal-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-mustard-500 text-mustard-500" aria-hidden="true" />
              <span className="text-sm font-medium text-primary-900">{product.rating.toFixed(1)}</span>
              <span className="text-primary-600 text-sm">({product.reviewCount || 0})</span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-xl text-charcoal-600">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-primary-600 line-through text-sm">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className={`flex items-center gap-2`}>
            <span className={`${stockStatus.class} text-xs font-medium`}>{stockStatus.label}</span>
          </div>

          <div className="flex gap-2 pt-3 border-t border-charcoal-100">
            <Link
              to={`/producto/${product.slug}`}
              className="flex-1 btn-secondary text-center text-sm py-2"
            >
              Ver detalle
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              {adding ? (
                <motion.svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10A10 10 0 0 1 12 22 10 10 0 0 1 2 12 10 10 0 0 1 12 2" /></motion.svg>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="card group relative" role="article" aria-labelledby={`product-${product.id}-title`}>
      <div
        className="card-image aspect-square relative overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className={commonImageOverlay} />

        {badges.length > 0 && (
          <motion.div
            className="absolute top-3 left-3 flex flex-col gap-1.5 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {badges.map((badge, idx) => (
              <span key={idx} className={badge.class}>
                {badge.label}
              </span>
            ))}
          </motion.div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="flex-1 btn-primary py-2 text-sm disabled:opacity-50"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            {adding ? (
              <motion.svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M12 2a10 10 0 0 1 10 10A10 10 0 0 1 12 22 10 10 0 0 1 2 12 10 10 0 0 1 12 2" /></motion.svg>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Agregar</span>
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="btn-secondary py-2 px-4 text-sm disabled:opacity-50"
            aria-label={`Comprar ${product.name} ahora`}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={handleWhatsApp}
            className="btn-whatsapp py-2 px-4 text-sm"
            aria-label={`Comprar ${product.name} por WhatsApp`}
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product) }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isInWishlist(product.id)
              ? 'bg-charcoal-600/90 text-white'
              : 'bg-white/80 text-primary-900 hover:text-charcoal-600 hover:bg-primary-50'
          }`}
          aria-label={isInWishlist(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={isInWishlist(product.id)}
        >
          <motion.span
            animate={{ scale: isInWishlist(product.id) ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <svg className="w-5 h-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </motion.span>
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-primary-600">
          <span className="px-2 py-0.5 bg-charcoal-50 text-charcoal-700 rounded-full font-medium">{product.category}</span>
          {product.brand && <span>· {product.brand}</span>}
        </div>

        <Link to={`/producto/${product.slug}`} className="block">
          <h3 id={`product-${product.id}-title`} className="font-display font-semibold text-base text-primary-900 line-clamp-2 group-hover:text-charcoal-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-mustard-500 text-mustard-500" aria-hidden="true" />
            <span className="text-sm font-medium text-primary-900">{product.rating.toFixed(1)}</span>
            <span className="text-primary-600 text-sm">({product.reviewCount || 0})</span>
          </div>
        )}

        <div className="flex items-baseline gap-3">
          <span className="font-display font-bold text-lg text-charcoal-600">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-primary-600 line-through text-sm">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`${stockStatus.class} text-xs font-medium`}>{stockStatus.label}</span>
        </div>
      </div>
    </article>
  )
}