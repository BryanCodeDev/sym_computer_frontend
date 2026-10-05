import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchX, ArrowLeft } from 'lucide-react'
import SEO from '../components/seo/SEO'

export default function NotFound() {
  return (
    <>
      <SEO
        title="Página no encontrada | SYM COMPUTER"
        description="La página que buscas no existe o fue movida."
        noindex
      />

      <div className="min-h-screen bg-cream bg-paw-pattern pt-20 flex items-center justify-center">
        <div className="container-custom py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
              className="w-32 h-32 rounded-full bg-white border-2 border-mustard-300 flex items-center justify-center mx-auto mb-8 shadow-gold"
            >
              <SearchX className="w-16 h-16 text-charcoal-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-8xl text-charcoal-600 mb-2"
            >
              404
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display font-bold text-3xl sm:text-4xl text-primary-900 mb-4"
            >
              Página no encontrada
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-primary-900 text-lg mb-8"
            >
              La página que buscas no existe o fue movida.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/" className="btn-primary w-full sm:w-auto flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Volver al inicio
              </Link>
              <Link to="/tienda" className="btn-secondary w-full sm:w-auto">
                Explorar productos
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}