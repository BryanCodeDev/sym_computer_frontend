import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X, Filter, Loader2 } from 'lucide-react'
import SEO from '../components/seo/SEO'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import { productService } from '../services/products'
import { debounce } from '../utils/helpers'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState('relevance')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch()
      } else {
        setResults([])
        setTotalResults(0)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    setLoading(true)
    try {
      const data = await productService.search(query, { sort, limit: 20 })
      setResults(data.products || [])
      setTotalResults(data.total || 0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
      performSearch()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSearchParams({})
    setResults([])
    setTotalResults(0)
  }

  return (
    <>
      <SEO
        title={`Búsqueda: "${query}" | SYM COMPUTER`}
         description={query ? `Resultados de búsqueda para "${query}"` : 'Busca procesadores, tarjetas gráficas, memorias y más'}
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
            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos, marcas, categorías..."
                  className="w-full px-6 py-4 pl-14 pr-14 bg-primary-50 border border-dark-border rounded-xl text-primary-900 placeholder:text-primary-700 focus:outline-none focus:border-charcoal-500 focus:ring-1 focus:ring-charcoal-500 text-lg"
                  autoFocus
                  autoComplete="off"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-700" aria-hidden="true" />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-primary-900 hover:text-charcoal-600 transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </form>

            {query && (
              <p className="text-center text-primary-900 mt-4">
                {loading ? 'Buscando...' : `${totalResults} resultado${totalResults !== 1 ? 's' : ''} para "${query}"`}
              </p>
            )}
          </motion.div>

          {query && !loading && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white border border-dark-border flex items-center justify-center mb-4">
                <SearchIcon className="w-9 h-9 text-charcoal-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-primary-900 mb-2">No se encontraron resultados</h2>
              <p className="text-primary-800 mb-6 max-w-md">Intenta con otros términos de búsqueda o revisa la ortografía</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['alimento', 'snack', 'cama', 'juguete', 'correa', 'comedero'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); setSearchParams({ q: term }) }}
                    className="px-4 py-2 bg-primary-50 border border-dark-border rounded-full text-primary-900 hover:border-charcoal-600 hover:text-primary-900 transition-colors text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {query && results.length > 0 && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <p className="text-primary-900">
                  {totalResults} {totalResults === 1 ? 'producto' : 'productos'} encontrado{totalResults !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm text-primary-900 hidden sm:block">Ordenar:</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input py-2 px-4 text-sm bg-primary-50 max-w-xs"
                  >
                    <option value="relevance">Relevancia</option>
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                    <option value="best-sellers">Más vendidos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list">
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    role="listitem"
                  >
                    <ProductCard product={product} variant="default" />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} variant="default" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}