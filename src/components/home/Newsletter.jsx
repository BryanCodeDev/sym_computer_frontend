import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone, MapPin, Headphones } from 'lucide-react'

const contacts = [
  { icon: Headphones, label: 'Servicio al cliente', value: '(+57) 300 102 7616', href: 'tel:+573001027616' },
  { icon: Phone, label: 'Teléfono', value: '(601) 755 9202', href: 'tel:+576017559202' },
  { icon: Phone, label: 'Teléfono', value: '(601) 373 7118', href: 'tel:+576013737118' },
  { icon: MapPin, label: 'Sede principal', value: 'Calle 77 # 16A – 38' },
]

export default function Newsletter() {
  return (
    <section className="relative py-20 lg:py-28 bg-black overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute left-1/2 -translate-x-1/2 -top-40 h-96 w-[40rem] max-w-full rounded-full bg-[#971111]/40 blur-3xl" aria-hidden="true" />
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <h2 id="cta-title" className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight mb-4">
            JUNTOS LLEGAMOS <span className="text-[#e03a3a]">MÁS ALTO</span>
          </h2>
          <p className="text-lg text-white/70 mb-2">La tecnología evoluciona. Nosotros también.</p>
          <p className="text-white/60 mb-9">
            Descubre nuestros productos y encuentra las soluciones que necesitas con el respaldo y la asesoría de SYM Computer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/tienda"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#971111] hover:bg-[#b01515] text-white font-semibold px-8 py-4 text-base shadow-xl shadow-[#971111]/30 transition-colors"
            >
              Explorar catálogo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-base transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {contacts.map((c, index) => {
            const content = (
              <>
                <div className="w-10 h-10 rounded-lg bg-[#971111] flex items-center justify-center flex-shrink-0">
                  <c.icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-white/50">{c.label}</p>
                  <p className="text-sm font-semibold text-white">{c.value}</p>
                </div>
              </>
            )
            const cls = 'flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.04] transition-colors'
            return (
              <motion.div
                key={`${c.label}-${c.value}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
              >
                {c.href ? (
                  <a href={c.href} className={`${cls} hover:border-[#971111]`}>{content}</a>
                ) : (
                  <div className={cls}>{content}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}