import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw, CreditCard, MessageSquare } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <>
      <SEO
        title="Pago no completado | SYM COMPUTER"
        description="Hubo un problema con tu pago. Puedes reintentar o contactarnos por WhatsApp."
        noindex
      />

      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="container-custom py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center mx-auto mb-8"
            >
              <XCircle className="w-12 h-12 text-red-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-3xl sm:text-4xl text-primary-900 mb-4"
            >
              No se pudo completar el pago
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-primary-900 text-lg mb-8"
            >
              Hubo un problema al procesar tu pago. Tu pedido está guardado y puedes reintentarlo cuando quieras.
            </motion.p>

            {orderNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-50 border border-dark-border rounded-2xl p-6 mb-8"
              >
                <p className="font-medium text-primary-900 mb-2">Número de pedido</p>
                <p className="font-mono text-2xl font-bold text-red-500 tracking-wider">{orderNumber}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
            >
              <Link to="/checkout" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Reintentar pago
              </Link>
              <a
                href={`https://wa.me/573001027616?text=${encodeURIComponent(`Hola, tuve un problema con mi pago del pedido ${orderNumber || ''}. ¿Pueden ayudarme?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Ayuda por WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-primary-50 border border-dark-border rounded-xl text-left"
            >
              <h3 className="font-medium text-primary-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-500" />
                Posibles causas:
              </h3>
              <ul className="space-y-2 text-primary-900 text-sm">
                <li className="flex items-start gap-2">• Fondos insuficientes en la tarjeta o cuenta</li>
                <li className="flex items-start gap-2">• Tarjeta vencida o datos incorrectos</li>
                <li className="flex items-start gap-2">• Límite de compra superado</li>
                <li className="flex items-start gap-2">• Problema temporal con Mercado Pago</li>
                <li className="flex items-start gap-2">• Conexión inestable durante el pago</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/tienda" className="btn-secondary w-full sm:w-auto inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Volver a la tienda
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}