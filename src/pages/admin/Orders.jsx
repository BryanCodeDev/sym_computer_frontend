import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Eye, Package, Loader2, X } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminOrderService } from '../../services/admin'
import { formatPrice, formatDate, formatDateTime, getOrderStatusConfig, getPaymentStatusConfig } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [history, setHistory] = useState([])
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [processing, setProcessing] = useState(false)

  const orderStatuses = [
    { value: 'pending', label: 'Pendiente', color: 'red' },
    { value: 'paid', label: 'Pagado', color: 'blue' },
    { value: 'preparing', label: 'Preparando', color: 'purple' },
    { value: 'shipped', label: 'Enviado', color: 'indigo' },
    { value: 'delivered', label: 'Entregado', color: 'green' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' },
    { value: 'refunded', label: 'Reembolsado', color: 'gray' },
  ]

  useEffect(() => {
    fetchOrders()
  }, [currentPage, status, paymentStatus, searchParams.get('status')])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(searchParams.get('status') && { status: searchParams.get('status') }),
        ...(search && { search }),
      }
      const data = await adminOrderService.getAll(params)
      setOrders(data.orders || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Fetch orders error:', error)
      toast.error('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchOrders()
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPaymentStatus('')
    setCurrentPage(1)
    setSearchParams({})
    fetchOrders()
  }

  const openStatusModal = async (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setStatusModalOpen(true)
    try {
      const data = await adminOrderService.getStatusHistory(order.id)
      setHistory(data.history || [])
    } catch (error) {
      console.error('Fetch history error:', error)
    }
  }

  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return
    setProcessing(true)
    try {
      await adminOrderService.updateStatus(selectedOrder.id, newStatus)
      toast.success('Estado del pedido actualizado')
      setStatusModalOpen(false)
      fetchOrders()
    } catch (error) {
      console.error('Update order status error:', error)
      toast.error(error.response?.data?.error || 'Error al actualizar estado')
    } finally {
      setProcessing(false)
    }
  }

  const hasFilters = search || status || paymentStatus || searchParams.get('status')

  return (
    <>
      <SEO
        title="Pedidos | SYM COMPUTER Admin"
        description="Gestiona los pedidos de SYM COMPUTER."
        noindex
      />

      <div className="space-y-6 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Pedidos</h1>
            <p className="text-primary-600 mt-1 text-sm">Gestiona y da seguimiento a todos los pedidos</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderStatuses.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setCurrentPage(1) }}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                  status === s.value
                    ? 'bg-charcoal-600 text-white border-charcoal-600'
                    : 'bg-white border-dark-border text-primary-700 hover:border-charcoal-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="p-4 sm:p-5 bg-white border border-dark-border rounded-2xl"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por número, cliente o email..."
                className="w-full pl-10 pr-4 py-2.5 bg-primary-50 border border-dark-border rounded-xl text-primary-900 text-sm placeholder:text-primary-500 focus:outline-none focus:border-charcoal-400 focus:ring-2 focus:ring-charcoal-100 transition-colors"
              />
            </div>
            <select
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value); setCurrentPage(1) }}
              className="py-2.5 px-4 bg-primary-50 border border-dark-border rounded-xl text-primary-900 text-sm focus:outline-none focus:border-charcoal-400"
            >
              <option value="">Todos los pagos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="cancelled">Cancelado</option>
              <option value="refunded">Reembolsado</option>
            </select>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-secondary px-5 text-sm">
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
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-charcoal-500" aria-hidden="true" />
              </div>
              <h2 className="font-display font-bold text-xl text-primary-900 mb-1">No se encontraron pedidos</h2>
              <p className="text-primary-600 text-sm">Prueba con otros filtros o espera a que lleguen nuevos pedidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[840px] text-sm">
                <thead>
                  <tr className="border-b border-dark-border bg-primary-50/60 text-left text-primary-600">
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Pedido</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Cliente</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Fecha</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Total</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Pago</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide">Estado</th>
                    <th className="py-3.5 px-5 font-medium text-xs uppercase tracking-wide text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const orderStatus = getOrderStatusConfig(order.status)
                    const paymentStatusInfo = getPaymentStatusConfig(order.payment_status)
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.02 }}
                        className="border-b border-dark-border/60 last:border-0 hover:bg-primary-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <p className="font-mono font-medium text-primary-900 text-xs">{order.order_number}</p>
                          <p className="text-primary-500 text-xs mt-0.5">{order.item_count} producto{order.item_count !== 1 ? 's' : ''}</p>
                        </td>
                        <td className="py-3.5 px-5">
                          <p className="font-medium text-primary-900">{order.customer_name}</p>
                          <p className="text-primary-500 text-xs truncate max-w-xs">{order.customer_email}</p>
                        </td>
                        <td className="py-3.5 px-5 text-primary-700 whitespace-nowrap">{formatDate(order.created_at)}</td>
                        <td className="py-3.5 px-5 font-display font-bold text-charcoal-700">{formatPrice(order.total)}</td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            paymentStatusInfo.color === 'green'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {paymentStatusInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${orderStatus.bg} ${orderStatus.text} ${orderStatus.border}`}>
                            {orderStatus.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center justify-end">
                            <button onClick={() => openStatusModal(order)} className="min-h-9 min-w-9 flex items-center justify-center text-primary-600 hover:text-charcoal-700 hover:bg-primary-50 rounded-lg transition-colors" aria-label={`Gestionar ${order.order_number}`}>
                              <Eye className="w-4 h-4" aria-hidden="true" />
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
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary px-4 py-2 min-h-10 text-sm disabled:opacity-50">Anterior</button>
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
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary px-4 py-2 min-h-10 text-sm disabled:opacity-50">Siguiente</button>
            </div>
          )}
        </motion.div>
      </div>

      {statusModalOpen && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-primary-950/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setStatusModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-dark-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-dark-border flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-primary-900">Pedido #{selectedOrder.order_number}</h2>
                <p className="text-primary-500 text-sm mt-0.5">{formatDateTime(selectedOrder.created_at)}</p>
              </div>
              <button onClick={() => setStatusModalOpen(false)} className="p-1 text-primary-500 hover:text-charcoal-700 transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">Cliente</h3>
                  <p className="text-primary-900 font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-primary-600 text-sm">{selectedOrder.customer_email}</p>
                  <p className="text-primary-600 text-sm">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">Envío</h3>
                  <p className="text-primary-900 font-medium">{selectedOrder.address}</p>
                  <p className="text-primary-600 text-sm">{selectedOrder.city}, {selectedOrder.province}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">Productos</h3>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                      <div>
                        <p className="font-medium text-primary-900 text-sm">{item.product_name}</p>
                        <p className="text-primary-500 text-xs">{item.quantity} × {formatPrice(item.discount_price || item.unit_price)}</p>
                      </div>
                      <span className="font-display font-bold text-charcoal-700">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-dark-border pt-4">
                <span className="text-primary-900">Total</span>
                <span className="text-charcoal-700">{formatPrice(selectedOrder.total)}</span>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">Cambiar estado</h3>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-primary-50 border border-dark-border rounded-xl text-primary-900 text-sm focus:outline-none focus:border-charcoal-400 mb-3"
                >
                  {orderStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={handleStatusChange} disabled={processing} className="btn-primary w-full py-3">
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <span>Actualizar estado</span>
                  )}
                </button>
              </div>

              {history.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-primary-500 mb-2">Historial de cambios</h3>
                  <div className="space-y-2">
                    {history.map((event, index) => (
                      <div key={index} className="p-3 bg-primary-50 rounded-xl">
                        <p className="font-medium text-primary-900 text-sm">{event.status}</p>
                        <p className="text-primary-600 text-sm">{event.notes || 'Sin notas'}</p>
                        <p className="text-primary-400 text-xs mt-1">{formatDateTime(event.created_at)} · {event.first_name ? `${event.first_name} ${event.last_name}` : 'Sistema'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}