import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, CreditCard, MessageSquare, Loader2 } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function CheckoutPending() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <>
      <SEO
        title="Pago pendiente | SYM COMPUTER"
        description="Tu pago está pendiente de confirmación. Te notificaremos cuando se procese."
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
              className="w-24 h-24 rounded-full bg-charcoal-600/10 border border-charcoal-500 flex items-center justify-center mx-auto mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-12 h-12 text-charcoal-500" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-3xl sm:text-4xl text-primary-900 mb-4"
            >
              Pago pendiente
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-primary-900 text-lg mb-8"
            >
              Tu pago está siendo procesado. Esto puede tomar unos minutos dependiendo del método elegido.
            </motion.p>

            {orderNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-50 border border-dark-border rounded-2xl p-6 mb-8"
              >
                <p className="font-medium text-primary-900 mb-2">Número de pedido</p>
                <p className="font-mono text-2xl font-bold text-charcoal-600 tracking-wider">{orderNumber}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            >
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <Clock className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Tiempo estimado</p>
                <p className="text-primary-900 text-sm">5-30 minutos</p>
              </div>
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <CreditCard className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Métodos rápidos</p>
                <p className="text-primary-900 text-sm">Tarjeta, efectivo</p>
              </div>
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <Clock className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Transferencia</p>
                <p className="text-primary-900 text-sm">Hasta 24hs</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-primary-50 border border-dark-border rounded-xl text-left mb-8"
            >
              <h3 className="font-medium text-primary-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-charcoal-500" />
                ¿Qué sucede ahora?
              </h3>
              <ul className="space-y-2 text-primary-900 text-sm">
                <li className="flex items-start gap-2">• Recibirás un email cuando el pago se confirme</li>
                <li className="flex items-start gap-2">• El estado del pedido se actualizará automáticamente</li>
                <li className="flex items-start gap-2">• Si pagaste en efectivo, tienes hasta 48 horas para realizar el pago</li>
                <li className="flex items-start gap-2">• Ante dudas, contáctanos por WhatsApp</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href={`https://wa.me/573001027616?text=${encodeURIComponent(`Hola, consulto por el estado de mi pago del pedido ${orderNumber || ''}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Consultar por WhatsApp
              </a>
              <Link to="/tienda" className="btn-secondary w-full sm:w-auto">
                <ArrowLeft className="w-5 h-5" />
                Seguir comprando
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}