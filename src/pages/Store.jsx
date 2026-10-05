import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Grid, List, Loader2 } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import { formatPrice } from '../utils/helpers'
import { productService, categoryService } from '../services/products'

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: Menor a mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a menor' },
  { value: 'best-sellers', label: 'Más vendidos' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
  { value: 'name-desc', label: 'Nombre: Z-A' },
]

const priceRanges = [
  { min: 0, max: 50000, label: 'Hasta $50.000' },
  { min: 50000, max: 150000, label: '$50.000 - $150.000' },
  { min: 150000, max: 500000, label: '$150.000 - $500.000' },
  { min: 500000, max: 1000000, label: '$500.000 - $1.000.000' },
  { min: 1000000, max: 0, label: 'Más de $1.000.000' },
]

export default function Store() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const currentPage = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  let category = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  let onSale = searchParams.get('onSale') === 'true'
  const inStock = searchParams.get('inStock') === 'true'
  const brand = searchParams.get('brand')
  const searchQuery = searchParams.get('q')

  // "ofertas" is a virtual category that maps to the on-sale filter
  if (category === 'ofertas') {
    category = null
    onSale = true
  }

  const activeFiltersCount = [
    category,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    brand,
  ].filter(Boolean).length

  const categoryName = category ? (categories.find(c => c.slug === category)?.name || category) : (onSale ? 'Ofertas' : null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sort,
        ...(category && { category }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(onSale && { onSale: 'true' }),
        ...(inStock && { inStock: 'true' }),
        ...(brand && { brand }),
        ...(searchQuery && { search: searchQuery }),
      }
       const data = await productService.getAll(params)
       setProducts(data.products || [])
       setTotalProducts(data.pagination?.total || 0)
       setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, sort, category, minPrice, maxPrice, onSale, inStock, brand, searchQuery])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAll({ active: true })
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  const updateParams = (newParams, replace = false) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    setSearchParams(params, { replace })
  }

  const handleSortChange = (value) => updateParams({ sort: value })
  const handleCategoryChange = (value) => updateParams({ category: value || null })
  const handlePriceRangeChange = (min, max) => updateParams({ minPrice: min || null, maxPrice: max || null })
  const handleOnSaleChange = (value) => updateParams({ onSale: value ? 'true' : null })
  const handleInStockChange = (value) => updateParams({ inStock: value ? 'true' : null })
  const handleBrandChange = (value) => updateParams({ brand: value || null })
  const handlePageChange = (page) => updateParams({ page: page > 1 ? page.toString() : null })

  const clearFilters = () => {
    updateParams({
      category: null,
      minPrice: null,
      maxPrice: null,
      onSale: null,
      inStock: null,
      brand: null,
      page: null,
    })
  }

  const hasActiveFilters = activeFiltersCount > 0

  const getUniqueBrands = () => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean))
    return Array.from(brands).sort()
  }

  const brands = getUniqueBrands()

  return (
    <>
<SEO
        title={searchQuery ? `Resultados para "${searchQuery}" | SYM COMPUTER` : category ? `${categoryName} | SYM COMPUTER` : onSale ? `Ofertas | SYM COMPUTER` : 'Tienda - SYM COMPUTER'}
        description={searchQuery ? `Resultados de búsqueda para "${searchQuery}"` : onSale ? 'Todos los productos en oferta y descuento.' : 'Explora nuestro catálogo completo de partes, equipos y accesorios para computadores. Filtrá por categoría, precio, marca y más.'}
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
            <nav className="flex items-center gap-2 text-sm text-primary-900 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-charcoal-600 transition-colors">Inicio</Link>
              <span>/</span>
              <Link to="/tienda" className="hover:text-charcoal-600 transition-colors">Tienda</Link>
              {category && (
                <>
                  <span>/</span>
                  <span className="text-primary-900">{categoryName}</span>
                </>
              )}
              {onSale && !category && (
                <>
                  <span>/</span>
                  <span className="text-primary-900">Ofertas</span>
                </>
              )}
              {searchQuery && (
                <>
                  <span>/</span>
                  <span className="text-primary-900">Búsqueda: "{searchQuery}"</span>
                </>
              )}
            </nav>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-900">
              {searchQuery ? `Resultados para "${searchQuery}"` : category ? categoryName : onSale ? 'Ofertas' : 'Todos los productos'}
            </h1>
            <p className="text-primary-900 mt-2">{totalProducts} {totalProducts === 1 ? 'producto' : 'productos'} encontrado{totalProducts !== 1 ? 's' : ''}</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside
              className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}
              aria-label="Filtros"
            >
              <div className="bg-primary-50 border border-dark-border rounded-2xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-lg text-primary-900">Filtros</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-charcoal-600 hover:text-charcoal-500 transition-colors"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-primary-900 mb-3 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-charcoal-500" aria-hidden="true" />
                      Categoría
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {categories.map(cat => (
                        <label key={cat.slug} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat.slug}
                            checked={category === cat.slug}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500"
                          />
                          <span className="text-sm text-primary-900 flex-1 truncate">{cat.name}</span>
                          <span className="text-primary-900 text-xs">({cat.productCount || 0})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-primary-900 mb-3">Rango de precio</h3>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <label key={`${range.min}-${range.max}`} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={minPrice == range.min && (maxPrice == range.max || (range.max === 0 && !maxPrice))}
                            onChange={() => handlePriceRangeChange(range.min === 0 ? null : range.min, range.max === 0 ? null : range.max)}
                            className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500"
                          />
                          <span className="text-sm text-primary-900">{range.label}</span>
                        </label>
                      ))}
                      <div className="flex gap-2 pt-2 border-t border-dark-border">
                        <input
                          type="number"
                          placeholder="Mín"
                          value={minPrice || ''}
                          onChange={(e) => handlePriceRangeChange(e.target.value || null, maxPrice)}
                          className="flex-1 input text-sm py-2"
                          min="0"
                        />
                        <input
                          type="number"
                          placeholder="Máx"
                          value={maxPrice || ''}
                          onChange={(e) => handlePriceRangeChange(minPrice, e.target.value || null)}
                          className="flex-1 input text-sm py-2"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-primary-900 mb-3">Marcas</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {brands.map(brandItem => (
                        <label key={brandItem} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={brand === brandItem}
                            onChange={(e) => handleBrandChange(e.target.checked ? brandItem : null)}
                            className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500 rounded"
                          />
                          <span className="text-sm text-primary-900">{brandItem}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-primary-900 mb-3">Disponibilidad</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => handleInStockChange(e.target.checked)}
                          className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500 rounded"
                        />
                        <span className="text-sm text-primary-900">Solo en stock</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onSale}
                          onChange={(e) => handleOnSaleChange(e.target.checked)}
                          className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500 rounded"
                        />
                        <span className="text-sm text-primary-900">Solo ofertas</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm text-primary-900 hidden sm:block">Ordenar:</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="input py-2 px-4 text-sm bg-primary-50 max-w-xs"
                    aria-label="Ordenar productos"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden btn-secondary px-4 py-2"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                    <span>Filtros</span>
                    {hasActiveFilters && (
                      <span className="w-5 h-5 bg-charcoal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="hidden sm:flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal-600/10 text-charcoal-600 border border-charcoal-600/20' : 'text-primary-900 hover:text-primary-900 hover:bg-primary-100'}`}
                      aria-label="Vista en cuadrícula"
                      aria-pressed={viewMode === 'grid'}
                    >
                      <Grid className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal-600/10 text-charcoal-600 border border-charcoal-600/20' : 'text-primary-900 hover:text-primary-900 hover:bg-primary-100'}`}
                      aria-label="Vista en lista"
                      aria-pressed={viewMode === 'list'}
                    >
                      <List className="w-5 h-5" aria-hidden="true" />
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
                  <svg className="w-20 h-20 text-primary-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  <h3 className="font-display font-semibold text-xl text-primary-900 mb-2">No se encontraron productos</h3>
                  <p className="text-primary-900 mb-6 max-w-md">Intenta ajustar tus filtros o busca con otros términos</p>
                  <button onClick={clearFilters} className="btn-outline">Limpiar filtros</button>
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn-secondary px-4 py-2 disabled:opacity-50"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                      </button>

                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === pageNum ? 'bg-charcoal-600 text-white' : 'bg-primary-50 text-primary-900 hover:bg-primary-100 hover:text-primary-900 border border-dark-border'}`}
                            aria-label={`Página ${pageNum}`}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn-secondary px-4 py-2 disabled:opacity-50"
                        aria-label="Página siguiente"
                      >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
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
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-primary-50 border-l border-dark-border flex flex-col lg:hidden"
          >
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
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
                  <h3 className="font-medium text-primary-900 mb-3">Categoría</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(cat => (
                      <label key={cat.slug} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat.slug}
                          checked={category === cat.slug}
                          onChange={(e) => { handleCategoryChange(e.target.value); setMobileFiltersOpen(false) }}
                          className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500"
                        />
                        <span className="text-sm text-primary-900 flex-1 truncate">{cat.name}</span>
                        <span className="text-primary-900 text-xs">({cat.productCount || 0})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-primary-900 mb-3">Rango de precio</h3>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={`${range.min}-${range.max}`} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={minPrice == range.min && (maxPrice == range.max || (range.max === 0 && !maxPrice))}
                          onChange={() => { handlePriceRangeChange(range.min === 0 ? null : range.min, range.max === 0 ? null : range.max); setMobileFiltersOpen(false) }}
                          className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500"
                        />
                        <span className="text-sm text-primary-900">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-primary-900 mb-3">Disponibilidad</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => handleInStockChange(e.target.checked)}
                        className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500 rounded"
                      />
                      <span className="text-sm text-primary-900">Solo en stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => handleOnSaleChange(e.target.checked)}
                        className="w-4 h-4 text-charcoal-600 border-dark-border bg-primary-100 focus:ring-charcoal-500 rounded"
                      />
                      <span className="text-sm text-primary-900">Solo ofertas</span>
                    </label>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="w-full btn-outline mt-4">
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}