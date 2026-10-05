import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Truck, ShieldCheck, Headphones, RotateCcw, Lock } from 'lucide-react'
import { categoryService } from '../../services/products'

const footerLinks = {
  tienda: [
    { label: 'Todos los productos', href: '/tienda' },
    { label: 'Ofertas', href: '/tienda?category=ofertas' },
    { label: 'Novedades', href: '/tienda?sort=newest' },
    { label: 'Más vendidos', href: '/tienda?sort=best-sellers' },
    { label: 'Marcas', href: '/tienda#marcas' },
  ],
  ayuda: [
    { label: 'Preguntas frecuentes', href: '/contacto#faq' },
    { label: 'Envíos y entregas', href: '/contacto#shipping' },
    { label: 'Cambios y devoluciones', href: '/cambios-devoluciones' },
    { label: 'Garantía', href: '/contacto#warranty' },
    { label: 'Contacto', href: '/contacto' },
  ],
  empresa: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Trabaja con nosotros', href: '/contacto#jobs' },
    { label: 'Prensa', href: '/contacto#press' },
    { label: 'Sostenibilidad', href: '/contacto#sustainability' },
    { label: 'Afiliados', href: '/contacto#affiliates' },
  ],
  legal: [
    { label: 'Política de privacidad', href: '/politica-privacidad' },
    { label: 'Términos y condiciones', href: '/terminos' },
    { label: 'Política de cambios/devoluciones', href: '/cambios-devoluciones' },
    { label: 'Tratamiento de datos', href: '/tratamiento-datos' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/sym_computer', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/sym_computer', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/sym_computer', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/sym_computer', label: 'YouTube' },
]

const trustItems = [
  { icon: Lock, title: 'Pago seguro', desc: 'Protección SSL y Mercado Pago' },
  { icon: ShieldCheck, title: 'Productos seleccionados', desc: 'Calidad verificada' },
  { icon: Headphones, title: 'Atención personalizada', desc: 'Soporte experto' },
  { icon: Truck, title: 'Envíos a tu puerta', desc: 'Bogotá, alrededores y todo Colombia' },
  { icon: RotateCcw, title: 'Cambios y devoluciones', desc: '30 días sin complicaciones' },
]

const contactInfo = [
  { icon: MapPin, text: 'CALLE 77 # 16A – 38' },
  { icon: Phone, text: '(+57) 300 102 7616' },
  { icon: Phone, text: '(601) 755 9202' },
  { icon: Phone, text: '(601) 373 7118' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(link => (
          <li key={link.href}>
            <Link to={link.href} className="text-neutral-300 hover:text-white transition-colors text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll({ active: true, root: true })
        setCategories(data.categories || [])
      } catch (err) {
        console.error('Error fetching categories for footer:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <footer className="bg-black" role="contentinfo">
      <div className="border-b border-white/10">
        <div className="container-custom py-8">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-6" role="list">
            {trustItems.map((item) => (
              <li key={item.title} className="flex flex-col items-center text-center gap-2 md:items-start md:text-left md:flex-row md:gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-accent-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-white text-xs sm:text-sm">{item.title}</p>
                  <p className="text-neutral-400 text-xs hidden md:block">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-custom py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-10 lg:gap-x-8">
<div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4" aria-label="SYM COMPUTER - Inicio">
              <img src="/assets/images/Logo.webp" alt="SYM COMPUTER" className="w-10 h-10" />
              <span className="font-display font-bold text-xl text-white">SYM COMPUTER</span>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6 max-w-xs">
              Tu tienda de partes, equipos y accesorios para computadores. Envíos a Bogotá, alrededores y todo Colombia.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Tienda" links={footerLinks.tienda} />
          {loading ? (
            <div className="space-y-2.5">
              <h4 className="font-display font-semibold text-white text-sm tracking-wide mb-4">Categorías</h4>
              {[...Array(4)].map((_, i) => (
                <li key={i}>
                  <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
                </li>
              ))}
            </div>
          ) : (
            <FooterColumn
              title="Categorías"
              links={categories.map(cat => ({
                label: cat.name,
                href: `/categoria/${cat.slug}`
              }))}
            />
          )}
          <FooterColumn title="Ayuda" links={footerLinks.ayuda} />
          <FooterColumn title="Empresa" links={footerLinks.empresa} />
        </div>

        <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start gap-3 mb-3 last:mb-0">
                <info.icon className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-neutral-300 text-sm">{info.text}</p>
              </div>
            ))}
          </div>

          <form className="w-full md:max-w-sm md:justify-self-end" action="/contacto" method="POST">
            <h5 className="font-medium text-white text-sm mb-3">Suscríbete a nuestro newsletter</h5>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400/50"
                required
                aria-label="Correo electrónico"
              />
              <button type="submit" className="px-4 py-2.5 rounded-lg bg-accent-500 text-white text-sm font-semibold hover:bg-accent-400 transition-colors whitespace-nowrap">
                Suscribirse
              </button>
            </div>
            <p className="text-neutral-400 text-xs mt-2.5">
              Al suscribirte aceptas nuestra <Link to="/politica-privacidad" className="underline hover:text-white">Política de privacidad</Link>.
            </p>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-neutral-500 text-xs">
            © {currentYear} SYM COMPUTER. Todos los derechos reservados.
          </p>
          <nav aria-label="Enlaces legales" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.legal.map(link => (
              <Link key={link.href} to={link.href} className="text-neutral-500 hover:text-white transition-colors text-xs">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
