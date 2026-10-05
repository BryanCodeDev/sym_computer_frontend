import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Banknote, Wallet } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'

export default function PaymentModal({ isOpen, onClose, onSubmit, cartTotal, cartDiscount }) {
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = cartTotal
  const cashReceivedNum = parseFloat(cashReceived) || 0
  const change = paymentMethod === 'cash' ? cashReceivedNum - total : 0

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (paymentMethod === 'cash' && cashReceivedNum < total) {
      alert('El monto recibido es insuficiente')
      return
    }
    setIsProcessing(true)
    try {
      await onSubmit({
        method: paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceivedNum : undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        notes: notes || undefined,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto"
      >
        <div className="p-6 border-b border-charcoal-100">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-primary-900">
              Procesar pago
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-primary-900/50 hover:text-primary-900 hover:bg-charcoal-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-primary-900/70 mb-1">Total a pagar</p>
            <p className="text-3xl font-bold text-charcoal-600">{formatPrice(total)}</p>
            {cartDiscount > 0 && (
              <p className="text-sm text-primary-900/60 mt-1">
                Descuento: -{formatPrice(cartDiscount)}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-charcoal-200 text-primary-900 hover:border-charcoal-400'
              }`}
            >
              <Banknote className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Efectivo</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('wompi')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'wompi'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-charcoal-200 text-primary-900 hover:border-charcoal-400'
              }`}
            >
              <Wallet className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Tarjeta (Wompi)</span>
            </button>
          </div>

          {paymentMethod === 'cash' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-primary-900/70 mb-2">
                Efectivo recibido
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-900/60">$</span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                   placeholder={formatPrice(total)}
                  min={total}
                  step="500"
                  className="w-full pl-8 pr-4 py-3 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-lg text-primary-900"
                  required
                  autoFocus
                />
              </div>
              {change >= 0 && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  Devolución: {formatPrice(change)}
                </p>
              )}
              {change < 0 && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Faltan: {formatPrice(Math.abs(change))}
                </p>
              )}
            </motion.div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-primary-900/70 mb-1">
                Nombre del cliente (opcional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900/70 mb-1">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej: 3001234567"
                className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-900/70 mb-1">
                Notas (opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones de la venta..."
                className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-charcoal-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-3"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isProcessing}
              className="btn-primary flex-1 py-3 font-semibold"
            >
              {isProcessing ? 'Procesando...' : 'Confirmar venta'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
