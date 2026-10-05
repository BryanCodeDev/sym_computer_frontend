import { useState, useRef } from 'react'
import { Search, Package } from 'lucide-react'

export default function ProductSearch({
  searchQuery,
  onSearchChange,
  onBarcodeSubmit,
  searchResults,
  searchLoading,
  searchPagination,
  onPageChange,
  onAddProduct,
}) {
  const [barcodeInput, setBarcodeInput] = useState('')
  const inputRef = useRef(null)

  const handleBarcodeInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setBarcodeInput(value)
    if (value.length >= 3) {
      if (window.__barcodeTimer) clearTimeout(window.__barcodeTimer)
      window.__barcodeTimer = setTimeout(() => {
        if (value) {
          onBarcodeSubmit(value)
          setBarcodeInput('')
        }
      }, 300)
    }
  }

  return (
    <div className="space-y-4">
      {/* Barcode scanner input */}
       <form
        onSubmit={(e) => {
          e.preventDefault()
          if (barcodeInput.trim()) {
            onBarcodeSubmit(barcodeInput.trim())
            setBarcodeInput('')
          }
        }}
        className="relative"
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={barcodeInput}
          onChange={handleBarcodeInput}
          placeholder="Escanear código de barras..."
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-lg text-primary-900 transition-colors"
          autoComplete="off"
          autoFocus
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
        <button
          type="submit"
          disabled={!barcodeInput.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-600 disabled:opacity-50"
        >
          Ir
        </button>
      </form>

      {/* Text search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar producto por nombre o categoría..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-charcoal-200 rounded-xl focus:border-primary-600 focus:outline-none text-primary-900 transition-colors"
          autoComplete="off"
        />
        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
      </div>

      {/* Search results summary */}
      {searchQuery && !searchLoading && (
        <div className="flex justify-between items-center text-sm text-primary-900/70">
          <span>{searchResults.length} producto{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}</span>
          {searchPagination.totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(searchPagination.page - 1)}
                disabled={searchPagination.page <= 1}
                className="px-2 py-1 rounded border border-charcoal-200 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-2">
                Página {searchPagination.page} de {searchPagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(searchPagination.page + 1)}
                disabled={searchPagination.page >= searchPagination.totalPages}
                className="px-2 py-1 rounded border border-charcoal-200 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
