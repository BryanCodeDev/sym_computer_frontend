import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react'
import SEO from '../components/seo/SEO'
import toast from 'react-hot-toast'

// Un solo lugar para el número: cámbialo aquí y se actualiza toda la página.
const WHATSAPP_NUMBER = '573001027616' // formato wa.me (sin + ni espacios)
const PHONE_DISPLAY = '(+57) 300 102 7616'
const PHONE_OFFICE = '(601) 755 9202'
const PHONE_OFFICE2 = '(601) 373 7118'
const ADDRESS = 'CALLE 77 # 16A – 38'

const contactInfo = [
  { icon: Phone, title: 'Servicio al cliente', value: PHONE_DISPLAY, desc: 'WhatsApp y llamadas las 24 horas' },
  { icon: Phone, title: 'Teléfono', value: PHONE_OFFICE, desc: 'Línea fija principal' },
  { icon: Phone, title: 'Teléfono adicional', value: PHONE_OFFICE2, desc: 'Línea fija alternativa' },
  { icon: MapPin, title: 'Sede principal', value: ADDRESS, desc: 'Cobertura: Bogotá, alrededores y todo Colombia' },
]

const serviceZones = [
  { zone: 'Mosquera', icon: MapPin, desc: 'Zona metropolitana. Entregas rápidas y asesoramiento 24/7 por WhatsApp.' },
  { zone: 'Madrid', icon: MapPin, desc: 'Zona metropolitana. Entregas en 24-48 horas y atención 24/7.' },
  { zone: 'Funza', icon: MapPin, desc: 'Atención presencial con cita previa. Envíos rápidos y seguros.' },
  { zone: 'Cundinamarca', icon: Send, desc: 'Llegamos a toda la región. Envío gratis en compras superiores a $100.000.' },
]

const faqs = [
  { q: '¿Hacen envíos a todo el país?', a: 'Sí, enviamos a todo Colombia. El envío es gratis en compras superiores a $100.000. Los tiempos de entrega varían según la localidad: 24-48 horas en Bogotá y alrededores, 3-5 días en el interior.' },
  { q: '¿Cuál es la política de devoluciones?', a: 'Las ventas son en firme. Cualquier reclamo debe reportarse máximo 48 horas después de la entrega, indicando número de factura, producto, serial y cantidad. Solo se aceptan productos en su empaque original, sellado, sin marcas y en buen estado. Consulta la política completa de devoluciones.' },
  { q: '¿Los productos tienen garantía?', a: 'Sí. Para hacerla efectiva necesitas la factura original y el producto con su caja, manuales y accesorios. El tiempo máximo para resolver una garantía es de 30 días hábiles. En portátiles y monitores el trámite se hace directamente con el fabricante.' },
  { q: '¿Puedo pagar en cuotas?', a: 'Sí, a través de Mercado Pago puedes pagar en hasta 12 cuotas sin interés con tarjetas seleccionadas, o en cuotas con interés según la tarjeta.' },
  { q: '¿Atienden las 24 horas?', a: `Sí, nuestro equipo de atención al cliente está disponible las 24 horas todos los días a través de WhatsApp al ${PHONE_DISPLAY}. Puedes contactarnos en cualquier momento, incluso fines de semana y festivos.` },
  { q: '¿Tienen showroom físico?', a: `Estamos ubicados en ${ADDRESS}. Atendemos cobertura en Bogotá, alrededores y todo Colombia. Puedes coordinar una visita previa por WhatsApp para conocernos y ver los productos en exhibición.` },
  { q: '¿Cómo funciona la compra por WhatsApp?', a: 'Al hacer clic en "Comprar por WhatsApp" en cualquier producto, se abre una conversación con nuestro equipo con el mensaje pre-cargado. Te asesoramos, confirmas stock y coordinas pago y envío.' },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // TODO: reemplazar por el envío real (API, EmailJS, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      toast.success('¡Mensaje enviado! Te responderemos a la brevedad.')
    } catch {
      toast.error('Error al enviar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <>
      <SEO
        title="Contacto | SYM COMPUTER - Servicio al cliente (+57) 300 102 7616"
        description={`SYM COMPUTER atiende por WhatsApp al ${PHONE_DISPLAY}. Partes, equipos y accesorios para computadores. Envíos a Bogotá, alrededores y todo Colombia.`}
      />

      <div className="min-h-screen bg-white pt-20">
        <section className="py-20 lg:py-28" aria-labelledby="contact-hero">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 id="contact-hero" className="font-display font-bold text-4xl sm:text-5xl text-black mb-6">
                HABLEMOS DE TU EQUIPO
              </h1>
              <p className="text-lg text-black leading-relaxed">
                Estamos aquí para ayudarte. Ya sea que necesites asesoramiento para la compra de partes,
                equipos o accesorios, o tengas dudas sobre un pedido.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-neutral-50/50" aria-labelledby="contact-info-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 id="contact-info-title" className="section-title mx-auto mb-4">CANALES DE CONTACTO</h2>
              <p className="text-black max-w-2xl mx-auto">Elige el que prefieras, nosotros nos adaptamos a ti</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {contactInfo.map((info, index) => (
                <motion.article
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white border border-dark-border rounded-2xl hover:border-neutral-300 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-neutral-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-black mb-2">{info.title}</h3>
                  <p className="text-black font-medium mb-1">{info.value}</p>
                  <p className="text-black text-sm">{info.desc}</p>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, me gustaría recibir asesoramiento personalizado para mi equipo.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 btn-whatsapp px-8 py-4 text-lg"
              >
                <MessageSquare className="w-6 h-6" aria-hidden="true" />
                <span>Escribirnos por WhatsApp 24/7</span>
              </a>
            </motion.div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-neutral-50/50" aria-labelledby="zones-title">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 id="zones-title" className="section-title mx-auto mb-4">ZONAS DE ATENCIÓN Y ENVÍO</h2>
              <p className="text-black max-w-2xl mx-auto">Atendemos las 24 horas en Bogotá, alrededores y todo Colombia.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {serviceZones.map((zone, index) => (
                <motion.article
                  key={zone.zone}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white border border-dark-border rounded-2xl hover:border-neutral-300 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 border border-neutral-200 flex items-center justify-center mb-4">
                    <zone.icon className="w-6 h-6 text-neutral-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-black mb-2">{zone.zone}</h3>
                  <p className="text-black text-sm">{zone.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="form-title">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 id="form-title" className="section-title mb-6">ENVÍANOS UN MENSAJE</h2>
                <p className="text-black mb-8">
                  Completa el formulario y te responderemos en menos de 2 horas. También puedes contactarnos por WhatsApp las 24 horas al {PHONE_DISPLAY}.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-primary-50 border border-green-500/30 rounded-2xl text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="font-display font-bold text-xl text-primary-900 mb-2">¡Mensaje enviado!</h3>
                    <p className="text-primary-900 mb-6">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn-outline"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="label">Nombre completo *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="input"
                          required
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="label">Email *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="label">Teléfono</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder={PHONE_DISPLAY}
                          autoComplete="tel"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="label">Asunto *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="input"
                          required
                        >
                          <option value="">Seleccionar asunto</option>
                          <option value="consulta">Consulta general</option>
                          <option value="pedido">Consulta por pedido</option>
                          <option value="productos">Consulta por productos</option>
                          <option value="garantia">Garantía / Devolución</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="label">Mensaje *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="input min-h-[150px] resize-y"
                        required
                        placeholder="Cuéntanos en qué podemos ayudarte..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full py-4 text-lg gap-3"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" aria-hidden="true" />
                          Enviar mensaje
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:pl-0 mt-8 lg:mt-0"
              >
                <h2 id="faq-title" className="section-title mb-8">PREGUNTAS FRECUENTES</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <DetailsFAQ key={faq.q} question={faq.q} answer={faq.a} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function DetailsFAQ({ question, answer }) {
  return (
    <details className="group bg-white border border-dark-border rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
        <span className="font-medium text-black pr-4">{question}</span>
        <span className="flex-shrink-0 w-6 h-6 text-neutral-600 transition-transform duration-300 group-open:rotate-180">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </summary>
      <div className="px-5 pb-5 text-black leading-relaxed animate-fade-in">{answer}</div>
    </details>
  )
}