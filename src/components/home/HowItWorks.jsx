import { motion } from 'framer-motion'
import { Search, MessageCircle, PackageCheck, ClipboardCheck } from 'lucide-react'

const steps = [
  { id: 1, title: 'Elige tus productos', desc: 'Explora el catálogo de partes, equipos y accesorios.', icon: Search },
  { id: 2, title: 'Recibe asesoría', desc: 'Nuestro equipo te ayuda a elegir según tu necesidad, rendimiento y presupuesto.', icon: MessageCircle },
  { id: 3, title: 'Confirma y recibe', desc: 'Coordina pago y envío con nuestro equipo y recibe tu pedido.', icon: PackageCheck },
  { id: 4, title: 'Verifica tu compra', desc: 'Revisa tu producto al recibirlo; los reclamos se reportan dentro de las primeras 48 horas.', icon: ClipboardCheck },
]

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-neutral-100" aria-labelledby="how-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 id="how-title" className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight mb-3">
            Así de fácil <span className="text-[#971111]">comprar</span>
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">En 4 pasos, con acompañamiento de principio a fin.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] border-t-2 border-dashed border-neutral-300" aria-hidden="true" />
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center bg-black mb-5 shadow-lg">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#971111] text-white text-sm font-bold flex items-center justify-center ring-4 ring-neutral-100">
                    {step.id}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-black mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-[16rem]">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}