import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, Loader2, Image as ImageIcon, DollarSign, MessageSquare, Globe, Bell, Shield } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminSettingsService } from '../../services/admin'
import toast from 'react-hot-toast'

const defaultSettings = {
  site_name: 'SYM COMPUTER',
  site_url: 'https://symcomputer.com',
  whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  free_shipping_threshold: 100000,
  default_currency: 'COP',
  tax_rate: 0.21,
  mercadopago_enabled: true,
  maintenance_mode: false,
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const data = await adminSettingsService.getSettings()
      setSettings({ ...defaultSettings, ...(data.settings || {}) })
    } catch (error) {
      console.error('Fetch settings error:', error)
      toast.error('Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (logo) {
        await adminSettingsService.uploadLogo(logo)
      }
      await adminSettingsService.updateSettings({ settings })
      toast.success('Configuración actualizada correctamente')
      setLogo(null)
      setLogoPreview('')
      fetchSettings()
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error('Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-charcoal-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Configuración | SYM COMPUTER Admin"
        description="Configura los parámetros principales de SYM COMPUTER."
        noindex
      />

      <div className="space-y-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Configuración</h1>
          <p className="text-primary-900/60 mt-2">Ajustes generales de la tienda</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSave}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-charcoal-500" />
                  Información general
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="site_name" className="label">Nombre del sitio</label>
                    <input
                      id="site_name"
                      name="site_name"
                      type="text"
                      value={settings.site_name}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="site_url" className="label">URL del sitio</label>
                    <input
                      id="site_url"
                      name="site_url"
                      type="url"
                      value={settings.site_url}
                      onChange={handleChange}
                       className="input"
                     />
                  </div>
                   <div>
                     <label htmlFor="default_currency" className="label">Moneda</label>
                     <select
                       id="default_currency"
                       name="default_currency"
                       value={settings.default_currency}
                       onChange={handleChange}
                       className="input"
                       disabled
                     >
                       <option value="COP">COP - Peso Colombiano</option>
                     </select>
                     <p className="text-xs text-primary-900/50 mt-1">Moneda estandarizada a COP para toda la tienda</p>
                   </div>
                  <div>
                    <label htmlFor="tax_rate" className="label">Tasa de impuesto</label>
                    <input
                      id="tax_rate"
                      name="tax_rate"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={settings.tax_rate}
                      onChange={handleNumberChange}
                      className="input"
                    />
                    <p className="text-primary-900/50 text-xs mt-1">Ej: 0.21 para 21% de IVA</p>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-charcoal-500" />
                  WhatsApp y atención
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="whatsapp_number" className="label">Número de WhatsApp</label>
                    <input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      type="text"
                      value={settings.whatsapp_number}
                      onChange={handleChange}
                      className="input"
                      placeholder={import.meta.env.VITE_WHATSAPP_NUMBER || ''}
                    />
                    <p className="text-primary-900/50 text-xs mt-1">Incluye código de país sin el símbolo +</p>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-charcoal-500" />
                  Envíos y pagos
                </h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="free_shipping_threshold" className="label">Monto mínimo para envío gratis</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-900">$</span>
                      <input
                        id="free_shipping_threshold"
                        name="free_shipping_threshold"
                        type="number"
                        min="0"
                        value={settings.free_shipping_threshold}
                        onChange={handleNumberChange}
                        className="input pl-8"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="mercadopago_enabled"
                      checked={settings.mercadopago_enabled}
                      onChange={handleChange}
                      className="w-5 h-5 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                    />
                    <span className="text-primary-900 font-medium">Habilitar Mercado Pago como método de pago</span>
                  </label>
                </div>
              </section>

              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-charcoal-500" />
                  Mantenimiento
                </h2>
                <div className="space-y-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={handleChange}
                      className="w-5 h-5 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                    />
                    <span className="text-primary-900 font-medium">Modo mantenimiento</span>
                  </label>
                  <p className="text-primary-900/60 text-sm">Cuando está activo, los visitantes verán un aviso de mantenimiento. El panel administrativo seguirá disponible.</p>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-charcoal-500" />
                  Branding
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-charcoal-50 border border-charcoal-100">
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-primary-700" />
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-charcoal-200 hover:border-charcoal-400 hover:bg-charcoal-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors">
                      <Upload className="w-8 h-8 text-primary-700 mx-auto mb-2" />
                      <p className="text-primary-900/80 text-sm font-medium">Subir logo</p>
                      <p className="text-primary-900/50 text-xs">PNG, JPG, SVG</p>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                  <p className="text-primary-900/60 text-sm">El logo se mostrará en el navbar, footer y emails transaccionales.</p>
                </div>
              </section>

              <section className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-6 lg:p-8">
                <h2 className="font-display font-semibold text-xl text-primary-900 mb-6 flex items-center gap-2">
                  <Bell className="w-6 h-6 text-charcoal-500" />
                  Notificaciones
                </h2>
                <div className="space-y-3">
                  {['Nuevos pedidos', 'Pedidos pagados', 'Stock bajo', 'Usuarios registrados', 'Errores del sistema'].map((item, index) => (
                    <label key={item} className="flex items-center justify-between p-3 bg-charcoal-50/50 border border-charcoal-100 rounded-xl cursor-pointer hover:border-charcoal-200 transition-colors">
                      <span className="text-primary-900/80">{item}</span>
                      <input type="checkbox" defaultChecked={index < 4} className="w-5 h-5 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded" />
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-charcoal-100">
            <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto justify-center">
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar configuración</span>
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </>
  )
}