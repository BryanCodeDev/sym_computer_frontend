import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronRight, Cpu, Fan, CircuitBoard, Box, HardDrive, MemoryStick, Power,
  Monitor, Laptop, Tv, Keyboard, Mouse, Headphones, Printer, Tag, Zap, Camera, Speaker,
} from 'lucide-react'
import { categoryService } from '../../services/products'

// Reglas en orden de prioridad; se compara sin tildes ni mayúsculas.
const iconRules = [
  [/^partes/, Cpu],
  [/^equipos|computador/, Monitor],
  [/^accesorios/, Keyboard],
  [/ultimas/, Tag],
  [/ups|regulador/, Zap],
  [/camara/, Camera],
  [/parlante/, Speaker],
  [/pad.?mouse/, Mouse],
  [/portatil/, Laptop],
  [/todo.?en.?uno/, Monitor],
  [/monitor/, Monitor],
  [/televisor/, Tv],
  [/teclado|combo/, Keyboard],
  [/mouse/, Mouse],
  [/diadema|audifono/, Headphones],
  [/impresora/, Printer],
  [/procesador/, Cpu],
  [/disipador|refriger|ventilador/, Fan],
  [/board|placa/, CircuitBoard],
  [/disco|hdd|ssd/, HardDrive],
  [/memoria|ram/, MemoryStick],
  [/fuente/, Power],
  [/tarjeta.?grafica|video/, Monitor],
  [/chasis|caja|gabinete/, Box],
  [/\bpcs?\b/, Monitor],
]

function getCategoryIcon(name, slug) {
  const text = `${name || ''} ${slug || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const match = iconRules.find(([re]) => re.test(text))
  return match ? match[1] : Cpu
}

function SectionHeader({ animate = true }) {
  const Wrapper = animate ? motion.div : 'div'
  const props = animate
    ? { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }
    : {}
  return (
    <Wrapper {...props} className="text-center mb-12">
      <span className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#971111] mb-3">
        <span className="h-px w-8 bg-[#971111]" aria-hidden="true" />
        Partes · Equipos · Accesorios
        <span className="h-px w-8 bg-[#971111]" aria-hidden="true" />
      </span>
      <h2 className="font-display font-bold text-3xl sm:text-5xl text-black mb-4 tracking-tight">
        Encuentra la tecnología que necesitas
      </h2>
      <p className="text-neutral-600 max-w-2xl mx-auto">
        Explora nuestro catálogo y encuentra componentes, equipos y accesorios para tus proyectos, trabajo, estudio o entretenimiento.
      </p>
    </Wrapper>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll({ active: true, root: true })
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white" aria-busy="true">
        <div className="container-custom">
          <SectionHeader animate={false} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-neutral-50 animate-pulse">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-200 mb-4" aria-hidden="true" />
                <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || categories.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom text-center">
          <p className="text-black/60">No hay categorías disponibles</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom">
        <SectionHeader />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {categories.map((category, index) => {
            const Icon = getCategoryIcon(category.name, category.slug)
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: Math.min(index, 7) * 0.06 }}
              >
                <Link
                  to={`/categoria/${category.slug}`}
                  className="group relative flex flex-col h-full p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-[#971111] hover:shadow-xl hover:shadow-[#971111]/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="absolute top-0 left-0 h-1 w-0 bg-[#971111] group-hover:w-full transition-all duration-500" aria-hidden="true" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-black group-hover:bg-[#971111] mb-4 transition-colors duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-black mb-1.5">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 flex-1">
                    {category.description || 'Descubre nuestra selección'}
                  </p>
                  <span className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#971111]">
                    Ver productos
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}