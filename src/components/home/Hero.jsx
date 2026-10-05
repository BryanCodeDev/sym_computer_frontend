import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Globe2, Headphones } from 'lucide-react'

const MotionLink = motion.create(Link)

const heroImages = ['/assets/images/herosection.webp']

const trustBadges = [
  { icon: Globe2, text: 'Importadores directos' },
  { icon: ShieldCheck, text: 'Garantías reales' },
  { icon: Headphones, text: 'Asesoría especializada' },
]

const stats = [
  { value: '14', label: 'años de experiencia' },
  { value: '14+', label: 'marcas líderes' },
  { value: '3', label: 'líneas: partes, equipos y accesorios' },
]

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col overflow-hidden bg-black" aria-labelledby="hero-title">
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, index) => (
          <img key={index} src={src} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#971111]/35 blur-3xl" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex-1 flex items-center container-custom pt-28 pb-16 lg:pt-32">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#971111] text-white text-xs sm:text-sm font-semibold tracking-wide mb-7 shadow-lg shadow-[#971111]/30"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            +14 años en el mercado
          </motion.span>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-white mb-5 tracking-tight"
          >
            TECNOLOGÍA QUE IMPULSA{' '}
            <span className="text-[#e03a3a]">TUS IDEAS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-lg sm:text-xl font-semibold text-white mb-3"
          >
            Equipos y componentes de alto rendimiento
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg text-white/80 max-w-xl mb-9 leading-relaxed"
          >
            Más de 14 años ofreciendo tecnología, asesoría especializada, productos de calidad y soluciones para empresas y consumidores.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <MotionLink
              to="/tienda"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#971111] hover:bg-[#b01515] text-white font-semibold px-8 py-4 text-base shadow-xl shadow-[#971111]/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver productos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </MotionLink>
            <MotionLink
              to="/nosotros"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/60 text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-base transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Conoce SYM Computer
            </MotionLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85"
          >
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2">
                <badge.icon className="w-4 h-4 text-[#e03a3a] flex-shrink-0" aria-hidden="true" />
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/15 bg-black/60 backdrop-blur-sm">
        <div className="container-custom grid grid-cols-3 divide-x divide-white/15">
          {stats.map((s) => (
            <div key={s.label} className="py-5 px-3 sm:px-6 text-center sm:text-left">
              <p className="font-display font-bold text-2xl sm:text-4xl text-white">{s.value}</p>
              <p className="text-[11px] sm:text-sm text-white/70 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 h-1 bg-[#971111]" aria-hidden="true" />
    </section>
  )
}