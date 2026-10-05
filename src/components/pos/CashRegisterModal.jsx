import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { posService } from '../../services/pos'
import { formatPrice } from '../../utils/helpers'

export default function CashRegisterModal({
  isOpen,
  onClose,
  cashRegister,
  onOpened,
  onClosed,
  onCurrentChange,
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const isClosing = !!cashRegister

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsProcessing(true)
    try {
      const formData = new FormData(e.target)
      if (isClosing) {
        const closingAmount = parseFloat(formData.get('closingAmount') || 0)
        const notes = formData.get('notes') || undefined
        await posService.closeCashRegister({ closingAmount, notes })
        onClosed()
        onCurrentChange()
      } else {
        const openingAmount = parseFloat(formData.get('openingAmount') || 0)
        const notes = formData.get('notes') || undefined
        const data = await posService.openCashRegister({ openingAmount, notes })
        if (data.cashRegister) {
          onOpened(data.cashRegister)
        }
        onCurrentChange()
      }
    } catch (error) {
      console.error('Cash register action error:', error)
      setError(error.response?.data?.error || 'Error al procesar la caja')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto"
        >
          <div className="p-6 border-b border-charcoal-100">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-primary-900">
                {isClosing ? 'Cerrar caja' : 'Abrir caja'}
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

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isClosing ? (
              <>
                {cashRegister && (
                  <div className="bg-charcoal-50 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-primary-900/70">Monto inicial:</p>
                    <p className="font-bold text-lg text-primary-900">{formatPrice(cashRegister.initial_amount)}</p>
                    <p className="text-sm text-primary-900/70">Monto actual:</p>
                    <p className="font-bold text-lg text-primary-900">{formatPrice(cashRegister.current_amount)}</p>
                    <p className="text-sm text-primary-900/70 mt-2">Total vendido:</p>
                    <p className="font-bold text-lg text-charcoal-600">{formatPrice((cashRegister.current_amount || 0) - (cashRegister.initial_amount || 0))}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-primary-900/80 mb-1">
                    Monto de cierre
                  </label>
                  <input
                    type="number"
                    name="closingAmount"
                    step="1000"
                    min="0"
                    defaultValue={cashRegister?.current_amount || 0}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-900/80 mb-1">
                    Notas (opcional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Notas de cierre..."
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary w-full py-3 font-semibold"
                >
                  {isProcessing ? 'Cerrando...' : 'Cerrar caja'}
                </motion.button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-primary-900/80 mb-1">
                    Monto inicial
                  </label>
                  <input
                    type="number"
                    name="openingAmount"
                    step="1000"
                    min="0"
                    defaultValue="0"
                    placeholder="0"
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-900/80 mb-1">
                    Notas (opcional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Notas de apertura..."
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  {isProcessing ? 'Abriendo...' : 'Abrir caja'}
                </motion.button>
              </>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
