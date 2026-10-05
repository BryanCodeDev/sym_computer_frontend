import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Truck, Shield, AlertCircle, CheckCircle, Loader2, Zap, MessageSquare, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatPrice, getWhatsAppUrlForCart, generateOrderNumber } from '../utils/helpers'
import { orderService, paymentService } from '../services/products'
import SEO from '../components/seo/SEO'
import toast from 'react-hot-toast'

const paymentMethods = [
  { id: 'mercadopago', label: 'Mercado Pago', description: 'Tarjetas, efectivo, transferencias', icon: CreditCard },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Coordinar pago y entrega directamente', icon: MessageSquare },
]

const provinces = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
  'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila',
  'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Riseralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
]

export default function Checkout() {
  const { user, isAuthenticated } = useAuth()
  const { items, total, subtotal, discount, itemCount, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('mercadopago')
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    province: user?.province || '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [preferenceId, setPreferenceId] = useState(null)

  useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito')
    }
  }, [items.length, navigate])

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Nombre es requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'Apellido es requerido'
    if (!formData.email.trim()) newErrors.email = 'Email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono es requerido'
    if (!formData.address.trim()) newErrors.address = 'Dirección es requerida'
    if (!formData.city.trim()) newErrors.city = 'Ciudad es requerida'
    if (!formData.province) newErrors.province = 'Provincia es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setProcessing(true)
    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        department: formData.province,
        notes: formData.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
          name: item.name,
          sku: item.sku,
        })),
        subtotal,
        discount,
        total,
        paymentMethod,
      }

      const order = await orderService.create(orderData)
      setOrderCreated(true)
      setOrderId(order.id)

      if (paymentMethod === 'mercadopago') {
        const payment = await paymentService.createPreference(order.id, {
          payer: {
            name: formData.firstName,
            surname: formData.lastName,
            email: formData.email,
            phone: { number: formData.phone },
          },
          backUrls: {
            success: `${window.location.origin}/checkout/success?order=${order.orderNumber}`,
            failure: `${window.location.origin}/checkout/failure?order=${order.orderNumber}`,
            pending: `${window.location.origin}/checkout/pending?order=${order.orderNumber}`,
          },
        })
        setPreferenceId(payment.preferenceId)
        window.location.href = payment.initPoint
      } else {
        clearCart()
        navigate(`/checkout/success?order=${order.orderNumber}&whatsapp=true`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.')
    } finally {
      setProcessing(false)
    }
  }

  const steps = [
    { number: 1, label: 'Datos', Icon: User },
    { number: 2, label: 'Pago', Icon: CreditCard },
    { number: 3, label: 'Confirmación', Icon: CheckCircle },
  ]

  return (
    <>
      <SEO
        title="Finalizar compra | SYM COMPUTER"
        description="Finaliza tu compra de forma segura. Múltiples métodos de pago disponibles."
        noindex
      />

      <div className="min-h-screen bg-cream pt-20">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-900">Finalizar compra</h1>
            <p className="text-primary-900 mt-2">Revisa tu pedido y completa la información de envío</p>
          </motion.div>

          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {steps.map((s, index) => (
                <motion.div
                  key={s.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                    step >= s.number
                      ? 'bg-charcoal-600 text-white'
                      : 'bg-primary-50 border border-dark-border text-primary-900'
                  }`}>
                    {step > s.number ? <CheckCircle className="w-6 h-6" /> : <s.Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-sm font-medium mt-2 ${step >= s.number ? 'text-primary-900' : 'text-primary-900'}`}>
                    {s.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-1 -translate-x-1/2 ${step > index + 1 ? 'bg-charcoal-600' : 'bg-dark-border'} hidden md:block`} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-6"
                >
                  <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                    <Truck className="w-6 h-6 text-charcoal-500" />
                    Información de envío
                  </h2>

                  <form onSubmit={(e) => { e.preventDefault(); handleNext() }} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="label">Nombre *</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="label">Apellido *</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="label">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`input ${errors.email ? 'border-red-500' : ''}`}
                        required
                        autoComplete="email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="label">Teléfono *</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`input ${errors.phone ? 'border-red-500' : ''}`}
                        required
                        placeholder="+57 320 9088777"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="address" className="label">Dirección *</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`input ${errors.address ? 'border-red-500' : ''}`}
                        required
                        placeholder="Calle, número, piso, departamento"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="label">Ciudad *</label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`input ${errors.city ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="province" className="label">Provincia *</label>
                        <select
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className={`input ${errors.province ? 'border-red-500' : ''}`}
                          required
                        >
                          <option value="">Seleccionar provincia</option>
                          {provinces.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="label">Información adicional</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="input min-h-[100px] resize-y"
                        placeholder="Referencias, instrucciones de entrega, horarios preferidos..."
                      />
                    </div>

                    {!isAuthenticated && (
                      <div className="p-4 bg-primary-100 border border-dark-border rounded-xl">
                        <p className="text-primary-900 text-sm">
                          ¿Ya tienes cuenta? <Link to="/login?redirect=/checkout" className="text-charcoal-600 hover:underline font-medium">Inicia sesión</Link> para guardar tus datos y ver tu historial de pedidos.
                        </p>
                      </div>
                    )}

                    <button type="submit" className="btn-primary w-full py-4 text-lg" disabled={processing}>
                      Continuar al pago
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-6"
                  >
                    <h2 className="font-display font-semibold text-xl text-primary-900 mb-5 flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-charcoal-500" />
                      Método de pago
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === method.id
                              ? 'border-charcoal-500 bg-charcoal-600/10'
                              : 'border-dark-border hover:border-charcoal-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                              <method.icon className="w-6 h-6 text-charcoal-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-primary-900 truncate">{method.label}</p>
                              <p className="text-primary-900 text-sm truncate">{method.description}</p>
                            </div>
                          </div>
                          {paymentMethod === method.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-charcoal-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-primary-900" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-6"
                  >
                    <h2 className="font-display font-semibold text-xl text-primary-900 mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6 text-charcoal-500" />
                      Resumen del pedido
                    </h2>

                    <div className="space-y-2 mb-4">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 py-2 border-b border-dark-border/50">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary-900 truncate">{item.name}</p>
                            <p className="text-primary-900 text-xs">x{item.quantity}</p>
                          </div>
                          <span className="text-primary-900 font-medium whitespace-nowrap">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-dark-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-900">Subtotal</span>
                        <span className="text-primary-900">{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Descuento</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-primary-900">
                        <span>Envío</span>
                        <span>Calcular según ubicación</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold border-t border-dark-border pt-3">
                        <span className="text-primary-900">Total</span>
                        <span className="text-charcoal-600">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleBack}
                        className="btn-secondary w-full py-3"
                      >
                        Volver a datos
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className={`btn-primary w-full py-4 text-lg gap-3 ${paymentMethod === 'whatsapp' ? 'btn-whatsapp' : ''}`}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Procesando...
                          </>
                        ) : paymentMethod === 'mercadopago' ? (
                          <>
                            <CreditCard className="w-6 h-6" />
                            Pagar con Mercado Pago
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-6 h-6" />
                            Comprar por WhatsApp
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && orderCreated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-600/20 border border-green-500 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="font-display font-bold text-2xl text-primary-900 mb-2">¡Pedido creado!</h2>
                  <p className="text-primary-900 mb-6">Tu orden <strong className="text-primary-900">#{orderId}</strong> ha sido generada exitosamente.</p>
                  {paymentMethod === 'mercadopago' && (
                    <p className="text-primary-900 mb-6">Serás redirigido a Mercado Pago para completar el pago...</p>
                  )}
                  <button
                    onClick={() => navigate(`/checkout/success?order=${orderId}`)}
                    className="btn-primary w-full sm:w-auto"
                  >
                    Ver confirmación
                  </button>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6">Resumen</h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3 py-2">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary-900 truncate">{item.name}</p>
                        <p className="text-primary-900 text-xs">x{item.quantity} · {formatPrice(item.discountPrice || item.price)} c/u</p>
                      </div>
                      <span className="text-primary-900 font-medium whitespace-nowrap">{formatPrice((item.discountPrice || item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-dark-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary-900">Subtotal ({itemCount} items)</span>
                    <span className="text-primary-900">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-primary-900">
                    <span>Envío</span>
                    <span>Calcular en checkout</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold mt-4 border-t border-dark-border pt-4">
                  <span className="text-primary-900">Total</span>
                  <span className="text-charcoal-600">{formatPrice(total)}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-dark-border space-y-3">
                  <div className="flex items-center gap-3 text-sm text-primary-900">
                    <Shield className="w-5 h-5 text-charcoal-500" />
                    <span>Pago seguro garantizado</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-primary-900">
                    <Truck className="w-5 h-5 text-charcoal-500" />
                    <span>Envío a todo el país</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-primary-900">
                    <AlertCircle className="w-5 h-5 text-charcoal-500" />
                    <span>30 días para devoluciones</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}