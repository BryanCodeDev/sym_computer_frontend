import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Receipt, Package, BarChart3, LogOut, User
} from 'lucide-react'
import { posService } from '../../services/pos'
import { formatPrice } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'
import { debounce } from '../../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'
import CashRegisterModal from '../../components/pos/CashRegisterModal'
import ProductSearch from '../../components/pos/ProductSearch'
import ProductGrid from '../../components/pos/ProductGrid'
import Cart from '../../components/pos/Cart'
import PaymentModal from '../../components/pos/PaymentModal'
import ReceiptView from '../../components/pos/Receipt'
import PosReports from '../../components/pos/PosReports'

const EMPTY_CART = []

export default function POS() {
  const { user, logout } = useAuth()
  const [cashRegister, setCashRegister] = useState(null)
  const [cashRegisterLoading, setCashRegisterLoading] = useState(true)
  const [showCashRegisterModal, setShowCashRegisterModal] = useState(false)

  const [cart, setCart] = useState(EMPTY_CART)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchPagination, setSearchPagination] = useState({ page: 1, totalPages: 1 })

  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)
  const [showReports, setShowReports] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    loadCurrentCashRegister()
    const params = new URLSearchParams(location.search)
    const paymentSuccessOrder = params.get('paymentSuccess')
    if (paymentSuccessOrder) {
      navigate('/admin/caja', { replace: true })
      fetchReceiptForSuccess(paymentSuccessOrder)
    }
  }, [])

  useEffect(() => {
    if (!cashRegisterLoading && !cashRegister && !showReceipt) {
      setShowCashRegisterModal(true)
    }
  }, [cashRegisterLoading, cashRegister, showReceipt])

  const handleSearch = useCallback(async (query, page = 1) => {
    if (!query) {
      setSearchResults([])
      setSearchPagination({ page: 1, totalPages: 1 })
      return
    }
    setSearchLoading(true)
    try {
      const data = await posService.searchProducts(query)
      setSearchResults(data.products || [])
      setSearchPagination({
        page: data.pagination?.page || page,
        totalPages: data.pagination?.totalPages || 1,
      })
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Error al buscar productos')
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const debouncedSearch = useMemo(
    () => debounce((q) => handleSearch(q, 1), 300),
    [handleSearch]
  )

  const handleBarcode = useCallback(async (barcode) => {
    try {
      const data = await posService.getProductByBarcode(barcode)
      setSearchResults([data.product])
      setSearchPagination({ page: 1, totalPages: 1 })
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Producto no encontrado')
      } else {
        console.error('Barcode error:', error)
        toast.error('Error al buscar código de barras')
      }
    }
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim().length >= 2) {
      debouncedSearch(value.trim())
    } else if (value.trim().length === 0) {
      setSearchResults([])
    }
  }

  const handleBarcodeSubmit = (barcode) => {
    setSearchQuery(barcode)
    handleBarcode(barcode)
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('No hay suficiente stock')
          return prev
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart(EMPTY_CART)
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + ((item.originalPrice && item.originalPrice > item.price)
        ? item.originalPrice * item.quantity
        : item.price * item.quantity),
      0
    )
  }, [cart])

  const cartDiscount = useMemo(() => cartSubtotal - cartTotal, [cartSubtotal, cartTotal])

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Agrega productos al carrito')
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSubmit = async (paymentData) => {
    setShowPayment(false)
    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        sku: item.sku,
      }))

      const saleData = {
        items,
        paymentMethod: paymentData.method,
        cashReceived: paymentData.method === 'cash' ? paymentData.cashReceived : undefined,
        notes: paymentData.notes || undefined,
        customerName: paymentData.customerName || undefined,
        customerPhone: paymentData.customerPhone || undefined,
      }

      const data = await posService.createSale(saleData)

      if (paymentData.method === 'wompi') {
        window.location.href = data.wompi.redirectUrl
        return
      }

      const receipt = await posService.getReceipt(data.order.id)
      setReceiptData(receipt)
      setShowReceipt(true)
      clearCart()
      toast.success('Venta completada')
    } catch (error) {
      console.error('Sale error:', error)
      if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Error al procesar la venta')
      }
    }
  }

  const fetchReceiptForSuccess = async (orderId) => {
    try {
      const receipt = await posService.getReceipt(orderId)
      setReceiptData(receipt)
      setShowReceipt(true)
      toast.success('Pago procesado correctamente')
    } catch (error) {
      console.error('Fetch receipt error:', error)
      toast.error('No se pudo cargar el recibo')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewSale = () => {
    setShowReceipt(false)
    setReceiptData(null)
    setCart(EMPTY_CART)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  const handleCashRegisterOpened = (register) => {
    setCashRegister(register)
    setShowCashRegisterModal(false)
  }

  const handleCashRegisterClosed = () => {
    setCashRegister(null)
    setShowCashRegisterModal(false)
  }

  const openCashRegisterModal = () => setShowCashRegisterModal(true)

  const loadCurrentCashRegister = async () => {
    setCashRegisterLoading(true)
    try {
      const data = await posService.getCurrentCashRegister()
      setCashRegister(data.cashRegister || null)
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Load cash register error:', error)
        toast.error('Error al cargar la caja')
      }
      setCashRegister(null)
    } finally {
      setCashRegisterLoading(false)
    }
  }

  const closePos = async () => {
    await posService.closeCashRegister({ closingAmount: 0, notes: 'Cierre manual de POS' })
    setCashRegister(null)
    setShowCashRegisterModal(false)
  }

  const toggleReports = () => {
    setShowReports((prev) => !prev)
  }

  return (
    <>
      <Toaster position="top-right" />

       {cashRegisterLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-primary-900/70">Cargando caja...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-72px-80px)]">
          {/* Header interno del POS (controles de caja) */}
          <header className="bg-white border-b border-charcoal-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Package className="w-7 h-7 text-primary-600" />
              <h1 className="font-display font-bold text-xl text-black">Caja — SYM COMPUTER</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-primary-900/70">
                <User className="w-4 h-4" />
                <span>{user?.first_name} {user?.last_name}</span>
                <span className="text-primary-900/40">·</span>
                <span className="font-medium">{user?.role}</span>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={toggleReports}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    showReports
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-900/70 hover:bg-charcoal-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Reportes
                </button>
              )}
              <button
                onClick={openCashRegisterModal}
                className="px-3 py-1.5 text-sm font-medium text-primary-900/70 hover:bg-charcoal-100 rounded-lg transition-colors"
              >
                Caja: {cashRegister ? formatPrice(cashRegister.current_amount) : 'Cerrada'}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-primary-900/50 hover:bg-charcoal-100 hover:text-primary-900/80 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {showReports ? (
              <motion.div
                key="reports"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <PosReports />
              </motion.div>
            ) : showReceipt && receiptData ? (
              <motion.div
                key="receipt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <ReceiptView
                  receipt={receiptData}
                  onNewSale={handleNewSale}
                  onPrint={handlePrint}
                />
              </motion.div>
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-y-auto"
              >
                <div className="container-custom py-6">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Left: Product Search */}
                    <div className="xl:col-span-2 space-y-4">
                      <ProductSearch
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        onBarcodeSubmit={handleBarcodeSubmit}
                        onAddProduct={addToCart}
                        searchResults={searchResults}
                        searchLoading={searchLoading}
                        searchPagination={searchPagination}
                        onPageChange={(page) => handleSearch(searchQuery.trim(), page)}
                      />

                      <ProductGrid
                        products={searchResults}
                        loading={searchLoading}
                        onAddProduct={addToCart}
                        cart={cart}
                      />
                    </div>

                    {/* Right: Cart */}
                    <div className="xl:col-span-2">
                      <Cart
                        cart={cart}
                        cartTotal={cartTotal}
                        cartSubtotal={cartSubtotal}
                        cartDiscount={cartDiscount}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        clearCart={clearCart}
                        onCheckout={handleCheckout}
                        itemCount={cart.length}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <CashRegisterModal
        isOpen={showCashRegisterModal}
        onClose={() => setShowCashRegisterModal(false)}
        cashRegister={cashRegister}
        onOpened={handleCashRegisterOpened}
        onClosed={handleCashRegisterClosed}
        onCurrentChange={loadCurrentCashRegister}
      />

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSubmit={handlePaymentSubmit}
        cartTotal={cartTotal}
        cartDiscount={cartDiscount}
      />
    </>
  )
}
