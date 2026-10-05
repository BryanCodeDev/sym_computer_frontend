import { motion } from 'framer-motion'
import { Award, Globe2, Headphones, ShieldCheck } from 'lucide-react'

const trustItems = [
  { icon: Award, title: '14 años de experiencia', desc: 'Una trayectoria construida sobre tecnología, servicio y relaciones comerciales.' },
  { icon: Globe2, title: 'Importadores y distribuidores', desc: 'Productos de marcas reconocidas y soluciones tecnológicas para diferentes necesidades.' },
  { icon: Headphones, title: 'Asesoría especializada', desc: 'Te ayudamos a encontrar el producto adecuado según tus necesidades.' },
  { icon: ShieldCheck, title: 'Garantía y respaldo', desc: 'Productos con garantías reales y acompañamiento al cliente.' },
]

export default function TrustSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-black overflow-hidden" aria-labelledby="trust-title">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#971111]/30 blur-3xl" aria-hidden="true" />
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <span className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#e03a3a] mb-3">
            <span className="h-px w-8 bg-[#e03a3a]" aria-hidden="true" />
            Por qué SYM Computer
          </span>
          <h2 id="trust-title" className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight mb-3">
            Compra con confianza
          </h2>
          <p className="text-white/70">Tu aliado en tecnología: asesoría, respaldo y soluciones que se adaptan a tus necesidades.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
          {trustItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              role="listitem"
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-[#971111] hover:bg-white/[0.07] transition-all duration-300"
            >
              <span className="absolute top-5 right-5 font-display font-bold text-4xl text-white/10 group-hover:text-[#971111]/50 transition-colors" aria-hidden="true">
                0{index + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#971111] flex items-center justify-center mb-5 shadow-lg shadow-[#971111]/30">
                <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}