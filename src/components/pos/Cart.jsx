import { motion } from 'framer-motion'
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'

export default function Cart({
  cart,
  cartTotal,
  cartSubtotal,
  cartDiscount,
  updateQuantity,
  removeItem,
  clearCart,
  onCheckout,
  itemCount,
}) {
  if (cart.length === 0) {
    return (
      <div className="bg-white border border-charcoal-100 shadow-card rounded-xl p-6 h-full flex flex-col">
        <h2 className="font-display font-bold text-xl text-primary-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Carrito
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-charcoal-50 flex items-center justify-center mb-4">
            <ShoppingCart className="w-9 h-9 text-charcoal-400" />
          </div>
          <h3 className="font-semibold text-lg text-primary-900 mb-2">Carrito vacío</h3>
          <p className="text-primary-900/60 text-sm">
            Busca productos y agrégalos al carrito para comenzar una venta
          </p>
        </div>
        <div className="border-t border-charcoal-100 pt-4 text-center">
          <span className="text-2xl font-bold text-primary-900">{formatPrice(cartTotal)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-charcoal-100 shadow-card rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl text-primary-900 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Carrito ({itemCount})
        </h2>
        <button
          onClick={clearCart}
          className="text-xs text-primary-900/50 hover:text-charcoal-600 transition-colors"
          title="Vaciar carrito"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {cart.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-primary-900 truncate">{item.name}</p>
              <p className="text-xs text-primary-900/60">
                {formatPrice(item.price)} x {item.quantity}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-lg bg-charcoal-50 border border-charcoal-200 flex items-center justify-center text-primary-900 hover:border-charcoal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3 h-3" />
              </button>

              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                min="1"
                max={item.stock}
                className="w-12 text-center text-sm bg-charcoal-50 border border-charcoal-200 rounded-lg text-primary-900 focus:outline-none focus:border-primary-600"
              />

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 rounded-lg bg-charcoal-50 border border-charcoal-200 flex items-center justify-center text-primary-900 hover:border-charcoal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="p-1.5 text-primary-900/50 hover:text-charcoal-600 hover:bg-charcoal-100 rounded-lg transition-colors"
              aria-label={`Eliminar ${item.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-charcoal-100 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-primary-900/60">Subtotal</span>
          <span className="text-primary-900/80">{formatPrice(cartSubtotal)}</span>
        </div>

        {cartDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-charcoal-600">Descuento</span>
            <span className="text-charcoal-600 font-medium">-{formatPrice(cartDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold pt-3 border-t border-charcoal-100">
          <span className="text-primary-900">Total</span>
          <span className="text-charcoal-600">{formatPrice(cartTotal)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          className="btn-primary w-full py-4 text-lg font-semibold mt-2"
        >
          Procesar venta
        </motion.button>
      </div>
    </div>
  )
}
