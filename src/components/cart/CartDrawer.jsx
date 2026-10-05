import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext'
import { formatPrice, getWhatsAppUrlForCart } from '../../utils/helpers'
import RemoveItemDialog from './RemoveItemDialog'
import { Link, useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart, loading, cartOpen, toggleCart } = useCart()
  const [itemToRemove, setItemToRemove] = useState(null)
  const navigate = useNavigate()

  const handleConfirmRemove = async () => {
    if (!itemToRemove) return
    await removeItem(itemToRemove.productId)
    toast.success(`"${itemToRemove.name}" se eliminó del carrito`)
    setItemToRemove(null)
  }

  const handleClearCart = async () => {
    await clearCart()
    toast.success('Carrito vaciado')
  }

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

  const handleCheckout = () => {
    toggleCart()
    navigate('/checkout')
  }

  if (loading) return null

  const discountTotal = items.reduce((sum, item) => sum + ((item.price - (item.discountPrice || item.price)) * item.quantity), 0)

  return (
    <>
      <button
        onClick={toggleCart}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-charcoal-600 text-white shadow-card-hover flex items-center justify-center active:scale-95 transition-transform"
        aria-label={`Carrito: ${itemCount} productos`}
      >
        <ShoppingBag className="w-6 h-6" aria-hidden="true" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-mustard-500 text-primary-950 text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary-950/40"
            onClick={() => toggleCart()}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white flex flex-col shadow-card-hover"
            role="dialog"
            aria-label="Carrito de compras"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
              <h2 className="font-display font-bold text-lg text-primary-900">
                Tu carrito
                <span className="ml-2 text-sm font-medium text-primary-500">({itemCount})</span>
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 -mr-2 rounded-lg text-primary-600 hover:text-charcoal-700 hover:bg-primary-50 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-charcoal-500" aria-hidden="true" />
                  </div>
                  <p className="font-display font-semibold text-primary-900 mb-1">Tu carrito está vacío</p>
                  <p className="text-primary-600 text-sm mb-6 max-w-xs">
                    Agrega alimento, snacks o accesorios para consentir a tu peludo
                  </p>
                  <Link to="/tienda" onClick={toggleCart} className="btn-primary">
                    Explorar productos
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.productId}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 bg-primary-50/60 rounded-2xl border border-dark-border"
                    >
                      <Link to={`/producto/${item.slug}`} onClick={toggleCart} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-dark-border">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/producto/${item.slug}`} onClick={toggleCart} className="font-medium text-primary-900 text-sm leading-snug line-clamp-2 hover:text-charcoal-700 transition-colors">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => setItemToRemove(item)}
                            className="p-1 text-primary-400 hover:text-red-500 transition-colors flex-shrink-0"
                            aria-label={`Eliminar ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-charcoal-700 font-semibold text-sm">{formatPrice(item.discountPrice || item.price)}</span>
                          {item.discountPrice && item.price > item.discountPrice && (
                            <span className="text-primary-500 text-xs line-through">{formatPrice(item.price)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1 bg-white border border-dark-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center text-primary-900 hover:text-charcoal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-7 text-center text-sm text-primary-900 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 flex items-center justify-center text-primary-900 hover:text-charcoal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <span className="text-primary-900 text-sm font-semibold">
                            {formatPrice((item.discountPrice || item.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-dark-border space-y-4 bg-primary-50/40">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-primary-700">
                    <span>Subtotal</span>
                    <span className="text-primary-900 font-medium">{formatPrice(total)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Descuentos</span>
                      <span className="font-medium">-{formatPrice(discountTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-primary-700">
                    <span>Envío</span>
                    <span>Se calcula en el checkout</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                  <span className="font-display font-semibold text-primary-900">Total</span>
                  <span className="font-display font-bold text-xl text-charcoal-700">{formatPrice(total)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-3.5 text-base">
                  Ir al checkout
                </button>
                <button onClick={handleClearCart} className="w-full py-2 text-sm text-primary-500 hover:text-charcoal-600 transition-colors">
                  Vaciar carrito
                </button>
                <a
                  href={getWhatsAppUrlForCart(items, total)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-center text-primary-600 text-xs pt-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                  También puedes comprar por <span className="text-charcoal-700 font-medium hover:underline">WhatsApp</span>
                </a>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      <RemoveItemDialog
        item={itemToRemove}
        onCancel={() => setItemToRemove(null)}
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}
