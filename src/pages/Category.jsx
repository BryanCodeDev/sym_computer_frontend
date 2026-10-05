import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Grid, List, Filter, X } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import { categoryService, productService } from '../services/products'
import { formatNumber } from '../utils/helpers'

export default function Category() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    onSale: false,
    inStock: false,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const totalPages = Math.ceil(totalProducts / 12)

  useEffect(() => {
    fetchCategory()
    fetchProducts()
  }, [slug, currentPage, sort, filters])

  const fetchCategory = async () => {
    try {
      const data = await categoryService.getBySlug(slug)
      setCategory(data.category)
    } catch (error) {
      console.error('Fetch category error:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort,
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.onSale && { onSale: 'true' }),
        ...(filters.inStock && { inStock: 'true' }),
      }
      const data = await categoryService.getWithProducts(slug, params)
      setProducts(data.products || [])
      setTotalProducts(data.pagination?.total ?? 0)
    } catch (error) {
      console.error('Fetch products error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading && !category) {
    return (
      <>
        <SEO title="Cargando..." />
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-charcoal-600 border-t-transparent" />
        </div>
      </>
    )
  }

  if (!category) {
    return (
      <>
        <SEO title="Categoría no encontrada" noindex />
        <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
          <div className="container-custom text-center py-20">
            <h1 className="font-display font-bold text-3xl text-primary-900 mb-2">Categoría no encontrada</h1>
            <p className="text-primary-900/60 mb-6">La categoría que buscas no existe.</p>
            <Link to="/tienda" className="btn-primary inline-flex">Ver todas las categorías</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${category.name} | SYM COMPUTER`}
        description={category.seoDescription || category.description || `Explora nuestra selección de ${category.name.toLowerCase()}. ${category.productCount || 0} productos disponibles.`}
        image={category.imageUrl}
        type="website"
      />

      <div className="min-h-screen bg-cream pt-20">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <nav className="flex items-center gap-2 text-sm text-primary-900/60 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-charcoal-600 transition-colors">Inicio</Link>
              <span>/</span>
              <Link to="/tienda" className="hover:text-charcoal-600 transition-colors">Tienda</Link>
              <span>/</span>
              <span className="text-primary-900 font-medium">{category.name}</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-900">{category.name}</h1>
                <p className="text-primary-900/60 mt-2">{category.productCount || 0} {category.productCount === 1 ? 'producto' : 'productos'} disponible{category.productCount !== 1 ? 's' : ''}</p>
              </div>
              {category.description && (
                <p className="text-primary-900/70 max-w-2xl">{category.description}</p>
              )}
            </div>
            {category.imageUrl && (
              <div className="mt-6 rounded-2xl overflow-hidden aspect-video max-w-4xl">
                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
              </div>
            )}
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`} aria-label="Filtros">
              <div className="bg-white border border-charcoal-100 shadow-card rounded-2xl p-4 sm:p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h2 className="font-display font-semibold text-lg text-primary-900">Filtros</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-primary-900 hover:text-charcoal-600" aria-label="Cerrar filtros">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="font-display font-semibold text-lg text-primary-900 mb-4 hidden lg:block">Filtros</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-primary-900 mb-3">Rango de precio</h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                        className="flex-1 input text-sm py-2"
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        className="flex-1 input text-sm py-2"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-900 mb-3">Opciones</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.onSale}
                          onChange={(e) => setFilters({...filters, onSale: e.target.checked})}
                          className="w-4 h-4 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                        />
                        <span className="text-sm text-primary-900">Solo ofertas</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                          className="w-4 h-4 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                        />
                        <span className="text-sm text-primary-900">Solo en stock</span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => setFilters({ minPrice: '', maxPrice: '', brand: '', onSale: false, inStock: false })}
                    className="w-full text-sm text-charcoal-600 hover:text-charcoal-500 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm text-primary-900/60 hidden sm:block">Ordenar:</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input py-2 px-4 text-sm bg-primary-50 max-w-xs"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                    <option value="best-sellers">Más vendidos</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                  </select>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden btn-secondary px-4 py-2"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                    <span>Filtros</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal-600/10 text-charcoal-600 border border-charcoal-600/20' : 'text-primary-900 hover:text-primary-900 hover:bg-charcoal-50'}`}
                      aria-label="Vista en cuadrícula"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal-600/10 text-charcoal-600 border border-charcoal-600/20' : 'text-primary-900 hover:text-primary-900 hover:bg-charcoal-50'}`}
                      aria-label="Vista en lista"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list" aria-busy="true">
                  {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} variant={viewMode} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center"
                >
                  <h2 className="font-display font-bold text-xl text-primary-900 mb-2">No hay productos</h2>
                  <p className="text-primary-900/60 mb-6">No se encontraron productos con los filtros actuales</p>
                  <button onClick={() => setFilters({ minPrice: '', maxPrice: '', brand: '', onSale: false, inStock: false })} className="btn-outline">Limpiar filtros</button>
                </motion.div>
              ) : (
                <>
                  <div
                    className={`grid gap-4 sm:gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
                    role="list"
                  >
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        role="listitem"
                      >
                        <ProductCard product={product} variant={viewMode === 'list' ? 'list' : 'default'} />
                      </motion.div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <motion.nav
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-2 mt-12"
                      aria-label="Paginación"
                    >
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary px-4 py-2 disabled:opacity-50"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) pageNum = i + 1
                        else if (currentPage <= 3) pageNum = i + 1
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                        else pageNum = currentPage - 2 + i
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === pageNum ? 'bg-charcoal-600 text-white' : 'bg-white text-primary-900 hover:bg-charcoal-50 hover:text-primary-900 border border-charcoal-100'}`}
                            aria-label={`Página ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn-secondary px-4 py-2 disabled:opacity-50"
                        aria-label="Página siguiente"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </button>
                    </motion.nav>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white border-l border-charcoal-100 flex flex-col lg:hidden"
          >
            <div className="p-4 border-b border-charcoal-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-primary-900">Filtros</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-primary-900 hover:text-charcoal-600"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-primary-900 mb-3">Rango de precio</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="flex-1 input text-sm py-2"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="flex-1 input text-sm py-2"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-primary-900 mb-3">Opciones</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.onSale}
                        onChange={(e) => setFilters({...filters, onSale: e.target.checked})}
                        className="w-4 h-4 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                      />
                      <span className="text-sm text-primary-900">Solo ofertas</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                        className="w-4 h-4 text-charcoal-600 border-charcoal-200 bg-charcoal-50 focus:ring-charcoal-500 rounded"
                      />
                      <span className="text-sm text-primary-900">Solo en stock</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => setFilters({ minPrice: '', maxPrice: '', brand: '', onSale: false, inStock: false })}
                  className="w-full text-sm text-charcoal-600 hover:text-charcoal-500 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}