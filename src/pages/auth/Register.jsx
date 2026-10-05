import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, LockKeyhole, Eye, EyeOff, ArrowLeft, Loader2, PawPrint } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido'
    if (!formData.email.trim()) newErrors.email = 'Email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.password) newErrors.password = 'Contraseña es requerida'
    else if (formData.password.length < 8) newErrors.password = 'Mínimo 8 caracteres'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      toast.success('¡Cuenta creada exitosamente!')
      navigate('/cuenta', { replace: true })
    } catch (error) {
      console.error('Register error:', error)
      toast.error(error.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  return (
    <>
      <SEO
        title="Crear cuenta | SYM COMPUTER"
        description="Crea tu cuenta en SYM COMPUTER para gestionar pedidos, direcciones y preferencias."
        noindex
      />

      <div className="min-h-screen lg:min-h-[calc(100vh-112px)] flex bg-white">
        {/* Panel de imagen — visible solo desde lg, mitad izquierda */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-charcoal-800">
          <img
            src="/assets/images/herosection.webp"
            alt="Tecnología SYM COMPUTER"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-charcoal-900/10" />
          <div className="absolute inset-0 bg-[url('/favicon.ico')] opacity-5" />

          <div className="relative h-full flex flex-col justify-between p-8 xl:p-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors w-fit">
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>

            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 badge bg-white/10 text-white border border-white/20 backdrop-blur-sm mb-4">
                <PawPrint className="w-3.5 h-3.5" />
                SYM COMPUTER
              </div>
<h2 className="font-display font-bold text-2xl xl:text-3xl text-white leading-tight mb-2 text-balance">
                Potencia tu equipo con los mejores componentes
              </h2>
              <p className="text-white/75 text-sm xl:text-base">
                Procesadores, tarjetas gráficas, memorias y más. Envíos a Bogotá, alrededores y todo Colombia.
              </p>
            </div>
          </div>
        </div>

        {/* Panel de formulario */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Mini hero solo en móvil/tablet */}
          <div className="lg:hidden relative h-40 sm:h-48 overflow-hidden">
            <img
              src="/assets/images/herosection.webp"
              alt="Tecnología SYM COMPUTER"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-charcoal-900/10" />
            <Link
              to="/"
              className="absolute top-4 left-4 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 badge bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <PawPrint className="w-3.5 h-3.5" />
              SYM COMPUTER
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6 lg:px-10 xl:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-charcoal-600 to-charcoal-700 flex items-center justify-center mx-auto mb-3 shadow-gold-sm">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900 mb-1.5">Crea tu cuenta</h1>
                <p className="text-primary-900/60 text-sm">Únete a SYM COMPUTER y potencia tu equipo</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="label">Nombre *</label>
                    <div className="relative">
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`input pl-12 ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Juan"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label">Apellido *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Pérez"
                      autoComplete="family-name"
                      required
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input pl-12 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="label">Contraseña *</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`input pl-12 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-900 hover:text-charcoal-600 transition-colors"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="label">Confirmar contraseña *</label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`input pl-12 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Repite tu contraseña"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-900 hover:text-charcoal-600 transition-colors"
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-lg gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </form>

              <div className="my-4 border-t border-charcoal-100" />

              <div className="text-center">
                <p className="text-primary-900/70 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-charcoal-600 hover:text-charcoal-500 font-medium transition-colors">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>

              <div className="mt-3 text-center text-primary-900/50 text-xs">
                <p>Al crear una cuenta aceptas nuestros <Link to="/terminos" className="underline hover:text-charcoal-600">Términos y condiciones</Link> y la <Link to="/politica-privacidad" className="underline hover:text-charcoal-600">Política de privacidad</Link>.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}