import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { formatPrice, calculateDiscount, getStockStatus, getImageUrl, getProductImage } from '../../utils/helpers'

export default function ProductGrid({ products, loading, onAddProduct, cart = [] }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-44 rounded-xl animate-pulse bg-charcoal-100/50" />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-charcoal-100 rounded-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-charcoal-50 flex items-center justify-center mb-4">
          <ShoppingCart className="w-7 h-7 text-charcoal-400" />
        </div>
        <p className="text-primary-900/60">
          Busca productos para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, index) => {
        const isDisabled = product.stock <= 0
        const cartItem = cart.find((item) => item.id === product.id)
        const cartQuantity = cartItem ? cartItem.quantity : 0
        const maxQuantity = product.stock
        const isMaxInCart = cartQuantity >= maxQuantity

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={`group bg-white border border-charcoal-100 rounded-xl overflow-hidden hover:shadow-card transition-shadow ${isDisabled ? 'opacity-60' : ''}`}
          >
            <div className="aspect-[4/3] bg-primary-100/30 overflow-hidden">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>

            <div className="p-3 space-y-2">
              <h3 className="font-medium text-sm text-primary-900 line-clamp-2 h-10">
                {product.name}
              </h3>

              <div className="flex items-center gap-2">
                {product.originalPrice > 0 && product.price < product.originalPrice && (
                  <span className="text-xs text-primary-900/50 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="font-bold text-lg text-charcoal-600">
                  {formatPrice(product.price)}
                </span>
                {calculateDiscount(product.originalPrice, product.price) > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                    -{calculateDiscount(product.originalPrice, product.price)}%
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs ${getStockStatus(product.stock).available ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {getStockStatus(product.stock).label}
                </span>

                <button
                  onClick={() => !isDisabled && !isMaxInCart && onAddProduct(product)}
                  disabled={isDisabled || isMaxInCart}
                  className={`p-2 rounded-lg transition-colors ${
                    isDisabled || isMaxInCart
                      ? 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                  aria-label={`Agregar ${product.name} al carrito`}
                  title={isMaxInCart ? 'Cantidad máxima en carrito' : isDisabled ? 'Sin stock' : 'Agregar al carrito'}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {cartQuantity > 0 && (
                    <span className="absolute text-xs bg-charcoal-600 text-white rounded-full w-5 h-5 flex items-center justify-center -top-1 -right-1">
                      {cartQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
