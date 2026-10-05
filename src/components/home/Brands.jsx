import { motion } from 'framer-motion'
import { brands } from './BrandLogos'

export default function Brands() {
  return (
    <section className="py-16 lg:py-24 bg-white" aria-labelledby="brands-title">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 id="brands-title" className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight mb-4">
            Las mejores marcas, <span className="text-[#971111]">en un solo lugar</span>
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Trabajamos con reconocidas marcas nacionales e internacionales para ofrecer productos de calidad y soluciones confiables.
          </p>
        </motion.div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4" aria-label="Marcas">
          {brands.map((brand, index) => {
            const Icon = brand.icon
            return (
<motion.li
              key={brand.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="flex flex-col items-center justify-center gap-2 h-16 sm:h-20 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-black hover:border-black hover:-translate-y-0.5 transition-all duration-300 p-2 sm:p-3"
            >
              <Icon className="w-full h-full max-w-[140px] max-h-[28px] text-neutral-800 hover:text-white transition-colors duration-300" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs font-medium text-neutral-500 hover:text-white transition-colors duration-300 uppercase tracking-wide">{brand.name}</span>
            </motion.li>
            )
          })}
        </ul>
        <p className="text-center text-sm text-neutral-500 mt-6">y otras marcas reconocidas del sector.</p>
      </div>
    </section>
  )
}