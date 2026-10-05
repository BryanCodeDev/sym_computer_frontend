import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

export default function RemoveItemDialog({ item, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary-950/50 backdrop-blur-sm"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-cart-item-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="bg-white border border-dark-border rounded-2xl p-6 w-full max-w-md shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
              </div>
              <button
                onClick={onCancel}
                className="p-1 text-primary-500 hover:text-charcoal-700 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <h2 id="remove-cart-item-title" className="font-display font-bold text-lg text-primary-900 mb-2">
              Eliminar del carrito
            </h2>
            <p className="text-primary-600 text-sm mb-6">
              ¿Seguro que quieres quitar <strong className="text-primary-900 font-medium">&quot;{item.name}&quot;</strong> del carrito? Puedes agregarlo de nuevo después.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={onCancel} className="btn-secondary w-full sm:w-auto">
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
