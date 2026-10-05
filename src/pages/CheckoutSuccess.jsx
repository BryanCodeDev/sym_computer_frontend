import { useSearchParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, Package, Clock, CreditCard } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order')
  const whatsapp = searchParams.get('whatsapp') === 'true'

  return (
    <>
      <SEO
        title="Compra exitosa | SYM COMPUTER"
        description="Tu compra de partes, equipos y accesorios para computadores se ha realizado correctamente. ¡Gracias por confiar en SYM COMPUTER!"
        noindex
      />

      <div className="min-h-screen bg-cream bg-paw-pattern pt-20 flex items-center justify-center">
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
              className="w-24 h-24 rounded-full bg-green-600/20 border border-green-500 flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-3xl sm:text-4xl text-primary-900 mb-4"
            >
              ¡Compra realizada correctamente!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-primary-900 text-lg mb-8"
            >
              {whatsapp
                ? 'Tu pedido ha sido enviado por WhatsApp. Nuestro equipo se contactará contigo para coordinar el pago y la entrega.'
                : 'Tu pago ha sido aprobado. Recibirás un email con la confirmación y los detalles de tu pedido.'
              }
            </motion.p>

            {orderNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-50 border border-dark-border rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-8 h-8 text-charcoal-500" />
                  <span className="font-display font-semibold text-xl text-primary-900">Número de pedido</span>
                </div>
                <p className="font-mono text-2xl font-bold text-charcoal-600 tracking-wider">{orderNumber}</p>
                <p className="text-primary-900 text-sm mt-2">Guarda este número para consultas futuras</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
            >
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <CreditCard className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Pago confirmado</p>
                <p className="text-primary-900 text-sm">Mercado Pago</p>
              </div>
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <Package className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Preparando envío</p>
                <p className="text-primary-900 text-sm">24-48 horas hábiles</p>
              </div>
              <div className="p-4 bg-primary-50 border border-dark-border rounded-xl">
                <Clock className="w-8 h-8 text-charcoal-500 mb-2" />
                <p className="font-medium text-primary-900">Seguimiento</p>
                <p className="text-primary-900 text-sm">Email con tracking</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link to={orderNumber ? `/cuenta/pedido/${orderNumber}` : '/cuenta'} className="btn-primary w-full sm:w-auto">
                Ver mi pedido
              </Link>
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