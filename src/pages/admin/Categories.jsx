import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2, Sparkles, X } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminCategoryService } from '../../services/admin'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await adminCategoryService.getAll()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Fetch categories error:', error)
      toast.error('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const openForm = (category = null) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        seoTitle: category.seo_title || '',
        seoDescription: category.seo_description || '',
      })
      setPreview(category.image_url || '')
    } else {
      setEditingId(null)
      setFormData({ name: '', slug: '', description: '', seoTitle: '', seoDescription: '' })
      setPreview('')
    }
    setImage(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '', seoTitle: '', seoDescription: '' })
    setImage(null)
    setPreview('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value))
      if (image) formDataToSend.append('image', image)

      if (editingId) {
        await adminCategoryService.update(editingId, formDataToSend)
        toast.success('Categoría actualizada correctamente')
      } else {
        await adminCategoryService.create(formDataToSend)
        toast.success('Categoría creada correctamente')
      }
      closeForm()
      fetchCategories()
    } catch (error) {
      console.error('Save category error:', error)
      toast.error(error.response?.data?.error || 'Error al guardar categoría')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return
    try {
      await adminCategoryService.delete(id)
      toast.success('Categoría eliminada correctamente')
      fetchCategories()
    } catch (error) {
      console.error('Delete category error:', error)
      toast.error(error.response?.data?.error || 'Error al eliminar categoría')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await adminCategoryService.toggleStatus(id)
      toast.success('Estado de categoría actualizado')
      fetchCategories()
    } catch (error) {
      console.error('Toggle category status error:', error)
      toast.error('Error al actualizar categoría')
    }
  }

  return (
    <>
      <SEO
        title="Categorías | SYM COMPUTER Admin"
        description="Gestiona las categorías del catálogo de SYM COMPUTER."
        noindex
      />

      <div className="space-y-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Categorías</h1>
            <p className="text-primary-700 mt-2">{categories.length} categorías en el catálogo</p>
          </div>
          <button onClick={() => openForm()} className="btn-primary w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            <span>Nueva categoría</span>
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 bg-primary-50 border border-dark-border rounded-2xl p-4 sm:p-6 lg:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 min-w-0 pb-6 border-b border-dark-border">
              <h2 className="font-display font-semibold text-lg sm:text-xl text-primary-900 min-w-0">{editingId ? 'Editar categoría' : 'Nueva categoría'}</h2>
              <button onClick={closeForm} className="min-h-10 min-w-10 p-2 text-primary-700 hover:text-charcoal-600 hover:bg-primary-100 rounded-lg transition-colors flex-shrink-0" aria-label="Cerrar formulario">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 min-w-0 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
                <div>
                  <label htmlFor="name" className="label">Nombre *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="label">Slug *</label>
                  <div className="flex flex-wrap gap-2 min-w-0">
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="input min-w-0 flex-1"
                      required
                    />
                    <button type="button" onClick={generateSlug} className="btn-secondary px-4 flex-shrink-0" aria-label="Generar slug">
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="label">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[100px] resize-y"
                />
              </div>

              <div>
                <label htmlFor="image" className="label">Imagen</label>
                <div className="flex flex-wrap items-center gap-4 min-w-0">
                  {preview && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-primary-100 border border-dark-border flex-shrink-0">
                      <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 min-w-0 border-2 border-dashed border-dark-border hover:border-charcoal-300 rounded-xl p-4 text-center cursor-pointer transition-colors">
                    <ImageIcon className="w-8 h-8 text-primary-700 mx-auto mb-2" />
                    <p className="text-primary-900 text-sm font-medium">Subir imagen</p>
                    <p className="text-primary-900 text-xs">PNG, JPG, WebP</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
                <div>
                  <label htmlFor="seoTitle" className="label">SEO title</label>
                  <input
                    id="seoTitle"
                    name="seoTitle"
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="input"
                    maxLength={200}
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="label">SEO description</label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="input min-h-[80px] resize-y"
                    maxLength={300}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 sm:gap-4 pt-4 border-t border-dark-border">
                <button type="button" onClick={closeForm} className="btn-secondary w-full sm:w-auto">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Guardar cambios' : 'Crear categoría'}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-primary-50 border border-dark-border rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-6 space-y-4" role="list" aria-busy="true">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-primary-50/50 text-left text-primary-700">
                    <th className="py-4 px-6 font-medium">Categoría</th>
                    <th className="py-4 px-6 font-medium">Slug</th>
                    <th className="py-4 px-6 font-medium">Productos</th>
                    <th className="py-4 px-6 font-medium">Estado</th>
                    <th className="py-4 px-6 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="border-b border-dark-border/50 hover:bg-primary-50/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} className="w-12 h-12 rounded-xl object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-primary-700" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-primary-900 truncate">{category.name}</p>
                            <p className="text-primary-700 text-xs truncate">{category.description || 'Sin descripción'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-primary-700 font-mono text-xs">{category.slug}</td>
                      <td className="py-4 px-6 text-primary-900">{category.product_count || 0}</td>
                      <td className="py-4 px-6">
                        <span className={category.is_active ? 'badge-stock' : 'badge-red'}>
                          {category.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/categoria/${category.slug}`} target="_blank" className="min-h-10 min-w-10 p-2 text-primary-900 hover:text-charcoal-600 hover:bg-primary-100 rounded-lg transition-colors" aria-label={`Ver ${category.name}`}>
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button onClick={() => openForm(category)} className="min-h-10 min-w-10 p-2 text-primary-900 hover:text-charcoal-600 hover:bg-primary-100 rounded-lg transition-colors" aria-label={`Editar ${category.name}`}>
                            <Edit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleToggleStatus(category.id)} className={`min-h-10 min-w-10 p-2 rounded-lg transition-colors ${category.is_active ? 'text-primary-900 hover:text-charcoal-600 hover:bg-charcoal-600/10' : 'text-primary-900 hover:text-green-400 hover:bg-green-600/10'}`} aria-label={`${category.is_active ? 'Desactivar' : 'Activar'} ${category.name}`}>
                            {category.is_active ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button onClick={() => handleDelete(category.id)} className="min-h-10 min-w-10 p-2 text-primary-900 hover:text-red-500 hover:bg-red-600/10 rounded-lg transition-colors" aria-label={`Eliminar ${category.name}`}>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}