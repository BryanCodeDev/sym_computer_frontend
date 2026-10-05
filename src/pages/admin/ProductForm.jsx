import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Upload, X, Plus, Trash2, Loader2, Image as ImageIcon, Tag, DollarSign, Package, Layers, Sparkles, Link as LinkIcon } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminProductService, adminCategoryService as categoryService } from '../../services/admin'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '',
  slug: '',
  sku: '',
  categoryId: '',
  brandId: '',
  shortDescription: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  minStock: 5,
  brand: '',
  warranty: '',
  features: [],
  specifications: {},
  isActive: true,
  isFeatured: false,
  isNew: false,
  isOnSale: false,
  metaTitle: '',
  metaDescription: '',
}

function SectionHeader({ icon: Icon, children }) {
  return (
    <h2 className="font-display font-semibold text-lg text-primary-900 mb-6 flex items-center gap-3">
      <span className="w-9 h-9 rounded-lg bg-charcoal-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4.5 h-4.5 text-charcoal-700" aria-hidden="true" />
      </span>
      {children}
    </h2>
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [featureInput, setFeatureInput] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specValue, setSpecValue] = useState('')

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll({ active: true })
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Fetch categories error:', error)
      toast.error('Error al cargar categorías')
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const data = await adminProductService.getById(id)
      const product = data.product
      setForm({
        ...emptyForm,
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        categoryId: product.category_id?.toString() || '',
        brandId: product.brand_id?.toString() || '',
        shortDescription: product.short_description || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.original_price?.toString() || '',
        stock: product.stock?.toString() || '0',
        minStock: product.min_stock?.toString() || '5',
        brand: product.brand_name || '',
        warranty: product.warranty || '',
        features: product.features || [],
        specifications: product.specifications || {},
        isActive: product.is_active ?? true,
        isFeatured: product.is_featured ?? false,
        isNew: product.is_new ?? false,
        isOnSale: product.is_on_sale ?? false,
        metaTitle: product.meta_title || '',
        metaDescription: product.meta_description || '',
      })
      setImages(product.images || [])
      setPreviews(product.images?.map(img => img.url) || [])
    } catch (error) {
      console.error('Fetch product error:', error)
      toast.error('Error al cargar producto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const setMainImage = (index) => {
    const updated = [...previews]
    const [main] = updated.splice(index, 1)
    setPreviews([main, ...updated])
    const imageUpdated = [...images]
    const [mainImage] = imageUpdated.splice(index, 1)
    setImages([mainImage, ...imageUpdated])
    toast.success('Imagen principal actualizada')
  }

  const addFeature = () => {
    if (!featureInput.trim()) return
    setForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }))
    setFeatureInput('')
  }

  const removeFeature = (index) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  const addSpecification = () => {
    if (!specKey.trim() || !specValue.trim()) return
    setForm(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [specKey.trim()]: specValue.trim() },
    }))
    setSpecKey('')
    setSpecValue('')
  }

  const removeSpecification = (key) => {
    setForm(prev => {
      const updated = { ...prev.specifications }
      delete updated[key]
      return { ...prev, specifications: updated }
    })
  }

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setForm(prev => ({ ...prev, slug }))
  }

  const generateSKU = () => {
    const category = categories.find(c => c.id === parseInt(form.categoryId))
    const prefix = (category?.name || 'GEN').slice(0, 3).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    setForm(prev => ({ ...prev, sku: `${prefix}-${random}` }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
        stock: Number(form.stock) || 0,
        minStock: Number(form.minStock) || 5,
        specifications: form.specifications,
        features: form.features,
      }

      let productId = id
      if (isEditing) {
        await adminProductService.update(id, payload)
      } else {
        const created = await adminProductService.create(payload)
        productId = created.product.id
      }

      if (images.some(file => file instanceof File)) {
        const filesToUpload = images.filter(file => file instanceof File)
        await adminProductService.uploadImages(productId, filesToUpload)
      }

      toast.success(isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
      navigate('/admin/productos')
    } catch (error) {
      console.error('Save product error:', error)
      toast.error(error.response?.data?.error || 'Error al guardar producto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-charcoal-100" />
          <div className="absolute inset-0 rounded-full border-4 border-charcoal-600 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={isEditing ? 'Editar producto | SYM COMPUTER Admin' : 'Nuevo producto | SYM COMPUTER Admin'}
        description={isEditing ? 'Edita un producto del catálogo de SYM COMPUTER.' : 'Crea un nuevo producto en SYM COMPUTER.'}
        noindex
      />

      <div className="space-y-6 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-1.5 text-sm text-primary-500 mb-2">
              <Link to="/admin/productos" className="min-h-8 min-w-8 inline-flex items-center justify-center hover:text-charcoal-700 transition-colors -ml-1.5" aria-label="Volver a productos">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </Link>
              <span>Productos</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">{isEditing ? 'Editar producto' : 'Nuevo producto'}</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" aria-hidden="true" />
                <span>{isEditing ? 'Guardar cambios' : 'Crear producto'}</span>
              </>
            )}
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 min-w-0">
            <div className="lg:col-span-2 space-y-5 lg:space-y-6 min-w-0">
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={Sparkles}>Información básica</SectionHeader>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
                    <div>
                      <label htmlFor="name" className="label">Nombre del producto *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                        required
                        placeholder="Ej: Alimento seco Adulto Raza Pequeña 3kg"
                      />
                    </div>
                    <div>
                      <label htmlFor="sku" className="label">SKU *</label>
                      <div className="flex flex-wrap gap-2 min-w-0">
                        <input
                          id="sku"
                          name="sku"
                          type="text"
                          value={form.sku}
                          onChange={handleChange}
                          className="input min-w-0 flex-1"
                          required
                          placeholder="ALI-ADU-001"
                        />
                        <button type="button" onClick={generateSKU} className="btn-secondary px-3.5 flex-shrink-0" aria-label="Generar SKU">
                          <Sparkles className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
                    <div>
                      <label htmlFor="slug" className="label">Slug (URL amigable) *</label>
                      <div className="flex flex-wrap gap-2 min-w-0">
                        <input
                          id="slug"
                          name="slug"
                          type="text"
                          value={form.slug}
                          onChange={handleChange}
                          className="input min-w-0 flex-1"
                          required
                          placeholder="alimento-adulto-raza-pequena-3kg"
                        />
                        <button type="button" onClick={generateSlug} className="btn-secondary px-3.5 flex-shrink-0" aria-label="Generar slug">
                          <LinkIcon className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="brand" className="label">Marca</label>
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        value={form.brand}
                        onChange={handleChange}
                        className="input"
                        placeholder="Ej: Pedigree"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shortDescription" className="label">Descripción corta</label>
                    <textarea
                      id="shortDescription"
                      name="shortDescription"
                      value={form.shortDescription}
                      onChange={handleChange}
                      className="input min-h-[80px] resize-y"
                      placeholder="Breve descripción para tarjetas y listados"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="label">Descripción completa</label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="input min-h-[160px] resize-y font-mono text-sm"
                      placeholder="Descripción HTML o texto completo del producto"
                    />
                    <p className="text-primary-500 text-xs mt-1.5">Puedes usar HTML básico (&lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;)</p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={DollarSign}>Precio e inventario</SectionHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 min-w-0">
                  <div>
                    <label htmlFor="price" className="label">Precio actual *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-sm">$</span>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleNumberChange}
                        className="input pl-8"
                        required
                        placeholder="45900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="originalPrice" className="label">Precio anterior</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 text-sm">$</span>
                      <input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.originalPrice}
                        onChange={handleNumberChange}
                        className="input pl-8"
                        placeholder="59900"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="stock" className="label">Stock *</label>
                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleNumberChange}
                      className="input"
                      required
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <label htmlFor="minStock" className="label">Stock mínimo de alerta</label>
                    <input
                      id="minStock"
                      name="minStock"
                      type="number"
                      min="0"
                      value={form.minStock}
                      onChange={handleNumberChange}
                      className="input"
                      placeholder="5"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-3 min-w-0 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isOnSale"
                        checked={form.isOnSale}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-charcoal-600 border-dark-border bg-white focus:ring-charcoal-400 rounded"
                      />
                      <span className="text-primary-900 text-sm font-medium">Producto en oferta</span>
                    </label>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={Layers}>Características y especificaciones</SectionHeader>
                <div className="space-y-6 min-w-0">
                  <div>
                    <label htmlFor="warranty" className="label">Garantía</label>
                    <input
                      id="warranty"
                      name="warranty"
                      type="text"
                      value={form.warranty}
                      onChange={handleChange}
                      className="input"
                      placeholder="Ej: Garantía de satisfacción del fabricante"
                    />
                  </div>

                  <div>
                    <h3 className="label mb-2.5">Características destacadas</h3>
                    <div className="flex flex-wrap gap-2 min-w-0 mb-3">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                        className="input min-w-0 flex-1"
                        placeholder="Ej: Fórmula con Omega 3 y 6"
                      />
                      <button type="button" onClick={addFeature} className="btn-secondary px-3.5 flex-shrink-0" aria-label="Agregar característica">
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {form.features.map((feature, index) => (
                        <span key={index} className="inline-flex min-w-0 max-w-full items-center gap-2 pl-3 pr-1.5 py-1.5 bg-charcoal-50 border border-charcoal-200 rounded-full text-sm text-charcoal-800">
                          <span className="truncate">{feature}</span>
                          <button type="button" onClick={() => removeFeature(index)} className="min-h-6 min-w-6 flex items-center justify-center text-charcoal-500 hover:text-charcoal-800 transition-colors flex-shrink-0" aria-label={`Eliminar ${feature}`}>
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="label mb-2.5">Especificaciones técnicas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 min-w-0">
                      <input
                        type="text"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        placeholder="Clave (Ej: Peso neto)"
                        className="input"
                      />
                      <div className="flex flex-wrap gap-2 min-w-0">
                        <input
                          type="text"
                          value={specValue}
                          onChange={(e) => setSpecValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpecification() } }}
                          placeholder="Valor (Ej: 3 kg)"
                          className="input min-w-0 flex-1"
                        />
                        <button type="button" onClick={addSpecification} className="btn-secondary px-3.5 flex-shrink-0" aria-label="Agregar especificación">
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(form.specifications).map(([key, value]) => (
                        <div key={key} className="flex min-w-0 flex-wrap items-center justify-between gap-2 p-3 bg-primary-50 border border-dark-border rounded-xl">
                          <div className="min-w-0">
                            <p className="font-medium text-primary-900 text-sm truncate">{key}</p>
                            <p className="text-primary-600 text-sm truncate">{value}</p>
                          </div>
                          <button type="button" onClick={() => removeSpecification(key)} className="min-h-9 min-w-9 flex items-center justify-center text-primary-500 hover:text-charcoal-700 transition-colors flex-shrink-0" aria-label={`Eliminar ${key}`}>
                            <X className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={Tag}>SEO</SectionHeader>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="metaTitle" className="label">Meta title</label>
                    <input
                      id="metaTitle"
                      name="metaTitle"
                      type="text"
                      value={form.metaTitle}
                      onChange={handleChange}
                      className="input"
                      maxLength={200}
                       placeholder={`${form.name || 'Nombre del producto'} | SYM COMPUTER`}
                    />
                    <p className="text-primary-500 text-xs mt-1.5">Recomendado: menos de 60 caracteres</p>
                  </div>
                  <div>
                    <label htmlFor="metaDescription" className="label">Meta description</label>
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      className="input min-h-[80px] resize-y"
                      maxLength={300}
                      placeholder="Descripción para motores de búsqueda"
                    />
                    <p className="text-primary-500 text-xs mt-1.5">Recomendado: 150-160 caracteres</p>
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="space-y-5 lg:space-y-6 min-w-0">
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={Tag}>Categoría y estado</SectionHeader>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="categoryId" className="label">Categoría *</label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={form.categoryId}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 min-w-0 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-charcoal-600 border-dark-border bg-white focus:ring-charcoal-400 rounded"
                      />
                      <span className="text-primary-900 text-sm font-medium">Producto activo</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-charcoal-600 border-dark-border bg-white focus:ring-charcoal-400 rounded"
                      />
                      <span className="text-primary-900 text-sm font-medium">Destacado en home</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={form.isNew}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-charcoal-600 border-dark-border bg-white focus:ring-charcoal-400 rounded"
                      />
                      <span className="text-primary-900 text-sm font-medium">Nuevo ingreso</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isOnSale"
                        checked={form.isOnSale}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-charcoal-600 border-dark-border bg-white focus:ring-charcoal-400 rounded"
                      />
                      <span className="text-primary-900 text-sm font-medium">En oferta</span>
                    </label>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="min-w-0 bg-white border border-dark-border rounded-2xl p-4 sm:p-6"
              >
                <SectionHeader icon={ImageIcon}>Imágenes</SectionHeader>
                <div className="space-y-4">
                  <label className="block w-full border-2 border-dashed border-dark-border hover:border-charcoal-300 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-primary-50/40">
                    <Upload className="w-7 h-7 text-primary-500 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-primary-900 font-medium text-sm mb-1">Subir imágenes</p>
                    <p className="text-primary-500 text-xs">PNG, JPG, WebP · Máx 10MB cada una</p>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  <div className="grid grid-cols-2 gap-3 min-w-0">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-primary-50 border border-dark-border group">
                        <img src={preview} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-charcoal-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">Principal</span>
                        )}
                        <div className="absolute inset-0 bg-primary-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button type="button" onClick={() => setMainImage(index)} className="min-h-9 min-w-9 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors" aria-label="Establecer como principal">
                            <Sparkles className="w-4 h-4 text-charcoal-700" aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => removeImage(index)} className="min-h-9 min-w-9 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors" aria-label={`Eliminar imagen ${index + 1}`}>
                            <Trash2 className="w-4 h-4 text-red-600" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {previews.length === 0 && (
                    <p className="text-primary-500 text-xs text-center">La primera imagen será la principal</p>
                  )}
                </div>
              </motion.section>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}