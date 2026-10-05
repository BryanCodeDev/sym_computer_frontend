import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Truck, Shield, RotateCcw, Headphones, Award, Sparkles, Heart } from 'lucide-react'
import SEO from '../components/seo/SEO'

const features = [
  { icon: Heart, title: 'Pasión por la Tecnología', desc: 'Cada producto es elegido con rigor, pensado para el rendimiento y la durabilidad de tu equipo' },
  { icon: Shield, title: 'Garantía de Calidad', desc: 'Todos los productos cuentan con garantía oficial del fabricante' },
  { icon: Headphones, title: 'Asesoramiento Experto', desc: 'Nuestro equipo de expertos en tecnología te ayuda a encontrar lo que necesitas' },
  { icon: Truck, title: 'Envío Rápido y Seguro', desc: 'Llegamos a Bogotá, alrededores y todo Colombia con embalaje premium y seguimiento' },
  { icon: RotateCcw, title: 'Devoluciones Sin Complicaciones', desc: '30 días para cambios o devoluciones, sin preguntas' },
  { icon: Award, title: 'Productos Premium', desc: 'Solo marcas reconocidas con componentes y materiales de alta calidad' },
]

const team = [
  { name: 'Equipo SYM COMPUTER', role: 'Fundadores', desc: 'Apasionados por la tecnología con 10+ años de experiencia en componentes y ensamble de equipos' },
]

export default function About() {
  return (
    <>
<SEO
        title="Nosotros | SYM COMPUTER"
        description="Conoce a SYM COMPUTER: tu tienda online de partes, equipos y accesorios para computadores. Selección curada, garantía oficial, envíos a Bogotá, alrededores y todo Colombia."
      />

      <div className="min-h-screen bg-white pt-20">
        <section className="py-20 lg:py-28" aria-labelledby="about-hero">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="badge-accent mb-5">Desde 2020 en Cundinamarca</span>
              <h1 id="about-hero" className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-black mb-6 mt-4">
                MÁS QUE UNA TIENDA,<br />
                <span className="text-gradient-dark">
                  TU ALIADO TECNOLÓGICO
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-800 leading-relaxed max-w-2xl mx-auto">
                SYM COMPUTER nace de la pasión por la tecnología y el compromiso de ofrecer solo lo mejor para tu computador.
                No somos un marketplace más: somos expertos en tecnología que curamos cada producto con rigor.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-neutral-50/40" aria-labelledby="values-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 id="values-title" className="section-title mx-auto mb-4">NUESTROS VALORES</h2>
              <p className="text-black/60 max-w-2xl mx-auto">Lo que nos diferencia y nos impulsa cada día a potenciar tu equipo</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => {
                const accent = index % 3 === 1
                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-6 lg:p-8 bg-white border border-neutral-100 rounded-2xl hover:border-neutral-300 hover:shadow-card-hover transition-all duration-500"
                  >
                    <div className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      accent
                        ? 'bg-accent-500/10 border-accent-500/30'
                        : 'bg-neutral-100 border-neutral-200'
                    }`}>
                      <feature.icon className={`w-7 h-7 ${accent ? 'text-accent-700' : 'text-neutral-600'}`} aria-hidden="true" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-black mb-3">{feature.title}</h3>
                    <p className="text-neutral-800 leading-relaxed">{feature.desc}</p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="story-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 id="story-title" className="section-title mb-8 text-center">NUESTRA HISTORIA</h2>
              <div className="prose max-w-none text-black space-y-6">
                <p>
                  SYM COMPUTER nació en 2020 con una misión clara: mejorar la experiencia tecnológica de las personas en Colombia.
                  Cansados de productos genéricos y poco confiables, decidimos crear un espacio donde cada componente
                  tuviera un propósito y una razón de ser para el rendimiento de tu equipo.
                </p>
                <p>
                  Empezamos como un pequeño espacio en Bogotá, donde cada cliente recibía atención personalizada
                  y podía probar los productos antes de comprar. Esa filosofía —el trato humano, el asesoramiento honesto,
                  la pasión por la tecnología— sigue siendo nuestro núcleo aunque ahora operamos online en toda la región.
                </p>
                <p>
                  Hoy, SYM COMPUTER es referente en partes, equipos y accesorios para computadores en Colombia.
                  Trabajamos directamente con marcas reconocidas y fabricantes oficiales para garantizar autenticidad,
                  garantía y el mejor precio. Cada producto en nuestro catálogo ha pasado por nuestro filtro de calidad:
                  si no lo recomendaríamos a nuestro propio equipo, no lo vendemos.
                </p>
                <p>
                  Nuestro compromiso va más allá de la venta. Ofrecemos soporte post-venta real, gestión de garantías,
                  asesoramiento técnico y una experiencia de compra que respeta tu tiempo y tu dinero.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-neutral-50/40" aria-labelledby="team-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 id="team-title" className="section-title mx-auto mb-4">EL EQUIPO</h2>
              <p className="text-black/60 max-w-2xl mx-auto">Personas reales detrás de cada pedido, con pasión por la tecnología</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map((member, index) => (
                <motion.article
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white shadow-card border border-neutral-100 rounded-2xl text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-50 border border-neutral-200 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-12 h-12 text-neutral-600" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-black">{member.name}</h3>
                  <p className="text-neutral-600 text-sm mb-2">{member.role}</p>
                  <p className="text-black/60 text-sm">{member.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="cta-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto text-center p-8 lg:p-12 bg-white shadow-card border border-neutral-100 rounded-3xl"
            >
              <h2 id="cta-title" className="font-display font-bold text-3xl sm:text-4xl text-black mb-4">
                ¿Listo para potenciar tu equipo?
              </h2>
              <p className="text-black/70 mb-8">
                Explora nuestro catálogo curado y descubre por qué miles de personas confían en SYM COMPUTER.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/tienda" className="btn-primary px-8 py-4 text-lg">
                  Ver catálogo
                </Link>
                <Link to="/contacto" className="btn-outline px-8 py-4 text-lg">
                  Contactarnos
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
