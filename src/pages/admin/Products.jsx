import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Copy, Eye, AlertTriangle, Package, Loader2, X, Star, Power } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminProductService } from '../../services/admin'
import { formatPrice, getStockStatus } from '../../utils/helpers'
import toast from 'react-hot-toast'

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      active
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-600 border border-red-200'
    }`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [currentPage, status, searchParams.get('filter')])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 20,
        status: status || undefined,
        ...(searchParams.get('filter') === 'low-stock' && { lowStock: 'true' }),
        ...(search && { search }),
      }
      const data = await adminProductService.getAll(params)
      setProducts(data.products || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalProducts(data.pagination?.total || 0)
    } catch (error) {
      console.error('Fetch products error:', error)
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const product = products.find(p => p.id === id)
    if (product) {
      setDeleteModal(product)
    }
  }

  const confirmDelete = async () => {
    if (!deleteModal) return
    try {
      await adminProductService.delete(deleteModal.id)
      toast.success('Producto eliminado correctamente')
      setDeleteModal(null)
      fetchProducts()
    } catch (error) {
      console.error('Delete product error:', error)
      toast.error('Error al eliminar producto')
    }
  }

  const handleDuplicate = async (id) => {
    try {
      await adminProductService.duplicate(id)
      toast.success('Producto duplicado correctamente')
      fetchProducts()
    } catch (error) {
      console.error('Duplicate product error:', error)
      toast.error('Error al duplicar producto')
    }
  }

  const handleToggleFeatured = async (id) => {
    try {
      await adminProductService.toggleFeatured(id)
      toast.success('Estado destacado actualizado')
      fetchProducts()
    } catch (error) {
      console.error('Toggle featured error:', error)
      toast.error('Error al actualizar producto')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await adminProductService.toggleStatus(id)
      toast.success('Estado actualizado')
      fetchProducts()
    } catch (error) {
      console.error('Toggle status error:', error)
      toast.error('Error al actualizar producto')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setCurrentPage(1)
    setSearchParams({})
    fetchProducts()
  }

  const hasFilters = search || status || searchParams.get('filter') === 'low-stock'

  return (
    <>
      <SEO
        title="Productos | SYM COMPUTER Admin"
        description="Gestiona el catálogo de productos de SYM COMPUTER."
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
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Productos</h1>
            <p className="text-primary-600 mt-1 text-sm">{totalProducts} productos en el catálogo</p>
          </div>
          <Link to="/admin/productos/nuevo" className="btn-primary w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" aria-hidden="true" />
            <span>Nuevo producto</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="min-w-0 p-4 sm:p-5 bg-white border border-dark-border rounded-2xl"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 min-w-0">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, SKU o slug..."
                className="w-full pl-10 pr-4 py-2.5 bg-primary-50 border border-dark-border rounded-xl text-primary-900 text-sm placeholder:text-primary-500 focus:outline-none focus:border-charcoal-400 focus:ring-2 focus:ring-charcoal-100 transition-colors"
              />
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setCurrentPage(1) }}
              className="py-2.5 px-4 bg-primary-50 border border-dark-border rounded-xl text-primary-900 text-sm focus:outline-none focus:border-charcoal-400 w-full sm:w-auto"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-secondary px-5 text-sm w-full sm:w-auto">
                Limpiar filtros
              </button>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white border border-dark-border rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-5 space-y-3" role="list" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-charcoal-500" aria-hidden="true" />
              </div>
              <h2 className="font-display font-bold text-xl text-primary-900 mb-1">No se encontraron productos</h2>
              <p className="text-primary-600 text-sm mb-6">Prueba con otros filtros o crea un nuevo producto</p>
              <Link to="/admin/productos/nuevo" className="btn-primary">Crear producto</Link>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[840px] text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-primary-50/60 text-left text-primary-600">
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Producto</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">SKU</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Categoría</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Precio</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Stock</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Estado</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock, product.min_stock)
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.02 }}
                        onClick={() => setSelectedProduct(product.id)}
                        className={`border-b border-dark-border/60 last:border-0 hover:bg-primary-50/50 cursor-pointer transition-colors ${
                          selectedProduct === product.id ? 'bg-mustard-50' : ''
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary-50 border border-dark-border flex-shrink-0">
                              <img src={product.main_image || '/assets/images/producto1.webp'} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-primary-900 truncate max-w-xs">{product.name}</p>
                              <p className="text-primary-500 text-xs truncate">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-primary-700 font-mono text-xs">{product.sku}</td>
                        <td className="py-3.5 px-5 text-primary-700">{product.category_name || 'Sin categoría'}</td>
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-charcoal-700">{formatPrice(product.price)}</p>
                          {product.original_price && product.original_price > product.price && (
                            <p className="text-primary-500 text-xs line-through">{formatPrice(product.original_price)}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-medium ${stockStatus.level === 'out' ? 'text-red-600' : stockStatus.level === 'low' ? 'text-mustard-600' : 'text-green-700'}`}>
                              {product.stock}
                            </span>
                            {stockStatus.level === 'low' && <AlertTriangle className="w-3.5 h-3.5 text-mustard-500" aria-hidden="true" />}
                            {stockStatus.level === 'out' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />}
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <StatusBadge active={product.is_active} />
                            {product.is_featured && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-charcoal-50 text-charcoal-700 border border-charcoal-200">
                                Destacado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/admin/productos/${product.id}/editar`} onClick={(e) => e.stopPropagation()} className="min-h-9 min-w-9 flex items-center justify-center text-primary-600 hover:text-charcoal-700 hover:bg-primary-50 rounded-lg transition-colors" aria-label={`Editar ${product.name}`}>
                              <Edit className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link to={`/producto/${product.slug}`} onClick={(e) => e.stopPropagation()} target="_blank" className="min-h-9 min-w-9 flex items-center justify-center text-primary-600 hover:text-charcoal-700 hover:bg-primary-50 rounded-lg transition-colors" aria-label={`Ver ${product.name}`}>
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <button onClick={(e) => { e.stopPropagation(); handleDuplicate(product.id) }} className="min-h-9 min-w-9 flex items-center justify-center text-primary-600 hover:text-charcoal-700 hover:bg-primary-50 rounded-lg transition-colors" aria-label={`Duplicar ${product.name}`}>
                              <Copy className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleToggleFeatured(product.id) }} className={`min-h-9 min-w-9 flex items-center justify-center rounded-lg transition-colors ${product.is_featured ? 'text-charcoal-700 bg-charcoal-50' : 'text-primary-600 hover:text-charcoal-700 hover:bg-primary-50'}`} aria-label={`Marcar como destacado ${product.name}`}>
                              <Star className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(product.id) }} className={`min-h-9 min-w-9 flex items-center justify-center rounded-lg transition-colors ${product.is_active ? 'text-primary-600 hover:text-mustard-600 hover:bg-mustard-50' : 'text-primary-600 hover:text-green-700 hover:bg-green-50'}`} aria-label={`${product.is_active ? 'Desactivar' : 'Activar'} ${product.name}`}>
                              <Power className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id) }} className="min-h-9 min-w-9 flex items-center justify-center text-primary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Eliminar ${product.name}`}>
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 sm:p-5 border-t border-dark-border">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">Anterior</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-charcoal-600 text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-dark-border'}`}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-50">Siguiente</button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/50 backdrop-blur-sm"
            onClick={() => setDeleteModal(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="bg-white border border-dark-border rounded-2xl p-6 w-full max-w-md shadow-card-hover"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
                </div>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="p-1 text-primary-500 hover:text-charcoal-700 transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <h2 id="delete-modal-title" className="font-display font-bold text-lg text-primary-900 mb-2">Eliminar producto</h2>
              <p className="text-primary-600 text-sm mb-6">
                ¿Estás seguro de que quieres eliminar <strong className="text-primary-900 font-medium">"{deleteModal.name}"</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}