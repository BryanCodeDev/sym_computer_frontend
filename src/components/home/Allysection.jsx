import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const hawkValues = ['Fuerza', 'Visión', 'Velocidad', 'Precisión', 'Evolución', 'Ambición', 'Crecimiento']
const formula = ['Necesidad', 'Calidad', 'Rendimiento', 'Precio', 'Garantía']

export default function AllySection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-[#971111] via-[#6f0c0c] to-black text-white" aria-labelledby="ally-title">
      <span className="absolute -right-6 -bottom-16 font-display font-black text-[16rem] lg:text-[24rem] leading-none text-white/[0.06] select-none" aria-hidden="true">
        14
      </span>

      <div className="container-custom relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-white/80 mb-4">
            Nuestra nueva etapa
          </span>
          <h2 id="ally-title" className="font-display font-bold text-3xl sm:text-5xl tracking-tight mb-6">
            Tu aliado en tecnología
          </h2>
          <p className="text-white/85 leading-relaxed mb-4">
            En SYM Computer no solo comercializamos productos tecnológicos. Construimos relaciones de largo plazo con nuestros clientes y aliados, ofreciendo asesoría, respaldo y soluciones que se adaptan a sus necesidades.
          </p>
          <p className="text-white/85 leading-relaxed mb-8">
            Con 14 años de experiencia, continuamos evolucionando para ofrecer una experiencia de compra más moderna, confiable y especializada. Nuestra meta: ser uno de los principales distribuidores de tecnología de Bogotá y Colombia.
          </p>
          <Link
            to="/nosotros"
            className="group inline-flex items-center gap-2 rounded-xl bg-white text-black hover:bg-black hover:text-white font-semibold px-7 py-3.5 transition-colors"
          >
            Conoce SYM Computer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-sm p-6 lg:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 mb-3">Nuestro diferencial</p>
            <p className="text-white/90 mb-4">Asesoría y acompañamiento para elegir bien, con el equilibrio justo entre:</p>
            <ul className="flex flex-wrap gap-2" aria-label="Equilibrio de compra">
              {formula.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white text-black text-sm font-semibold">{item}</span>
                  {i < formula.length - 1 && <span className="text-white/60 font-bold" aria-hidden="true">+</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-sm p-6 lg:p-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/70 mb-3">Inspirados en el halcón</p>
            <ul className="flex flex-wrap gap-2 mb-5" aria-label="Valores">
              {hawkValues.map((v) => (
                <li key={v} className="px-3 py-1 rounded-full border border-white/30 text-sm text-white/90">{v}</li>
              ))}
            </ul>
            <p className="font-display font-bold text-2xl sm:text-3xl">“Juntos llegamos más alto.”</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}