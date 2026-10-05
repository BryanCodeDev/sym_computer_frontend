import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ShoppingCart, Package, Users, TrendingUp, AlertTriangle, DollarSign, Clock, CheckCircle } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminDashboardService, adminPosService } from '../../services/admin'
import { formatPrice, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const COLORS = ['#2F5D50', '#C9A860', '#243D35', '#8B7355', '#1a2f28']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [salesChart, setSalesChart] = useState(null)
  const [ordersChart, setOrdersChart] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [posSummary, setPosSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
    fetchPosSummary()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const [statsData, salesData, ordersData, topData, lowData] = await Promise.all([
        adminDashboardService.getStats(),
        adminDashboardService.getSalesChart({ days: 30 }),
        adminDashboardService.getOrdersChart({ days: 30 }),
        adminDashboardService.getTopProducts(10),
        adminDashboardService.getLowStock(10),
      ])
      setStats(statsData.stats || {})
      setSalesChart(salesData)
      setOrdersChart(ordersData)
      setTopProducts(topData.products || [])
      setLowStock(lowData.products || [])
    } catch (error) {
      console.error('Fetch dashboard error:', error)
      toast.error('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchPosSummary = async () => {
    try {
      const posData = await adminPosService.getReportsSummary()
      setPosSummary(posData || null)
    } catch (error) {
      console.error('Fetch POS summary error:', error)
      setPosSummary(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-charcoal-600 border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    { label: 'Ventas totales', value: stats?.totalSales, icon: DollarSign, color: 'mint', format: 'money' },
    { label: 'Ventas de hoy', value: stats?.todaySales, icon: TrendingUp, color: 'mint', format: 'money' },
    { label: 'Ventas del mes', value: stats?.monthSales, icon: ShoppingCart, color: 'mint', format: 'money' },
    { label: 'Pedidos totales', value: stats?.totalOrders, icon: Package, color: 'mint', format: 'number' },
    { label: 'Pedidos pendientes', value: stats?.pendingOrders, icon: Clock, color: 'mustard', format: 'number' },
    { label: 'Productos', value: stats?.totalProducts, icon: Package, color: 'mint', format: 'number' },
    { label: 'Usuarios', value: stats?.totalUsers, icon: Users, color: 'mint', format: 'number' },
    { label: 'Stock bajo', value: stats?.lowStockCount, icon: AlertTriangle, color: stats?.lowStockCount > 0 ? 'alert' : 'mint', format: 'number' },
  ]

  const salesData = salesChart?.labels?.map((label, index) => ({
    name: label,
    ventas: salesChart.data[index],
    pedidos: salesChart.counts[index],
  })) || []

  const ordersData = ordersChart?.labels?.map((label, index) => ({
    name: label,
    total: ordersChart.total[index],
    pendientes: ordersChart.pending[index],
    pagados: ordersChart.paid[index],
    cancelados: ordersChart.cancelled[index],
  })) || []

  const pieData = [
    { name: 'Pagados', value: stats.totalOrders - stats.pendingOrders },
    { name: 'Pendientes', value: stats.pendingOrders },
  ]

  return (
    <>
      <SEO
        title="Dashboard | SYM COMPUTER Admin"
        description="Panel de administración de SYM COMPUTER."
        noindex
      />

      <div className="space-y-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Dashboard</h1>
          <p className="text-black mt-2">Bienvenido al panel de administración de SYM COMPUTER</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon
            const value = card.format === 'money' ? formatPrice(card.value) : card.value
            const colorClasses = {
              mint: 'bg-charcoal-600/10 text-charcoal-600 border-charcoal-600/20',
              mustard: 'bg-mustard-100 text-mustard-800 border-mustard-300',
              alert: 'bg-red-600/10 text-red-600 border-red-600/20',
            }
            const tone = colorClasses[card.color]
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl hover:border-charcoal-300 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center ${tone}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  {card.color === 'alert' && (
                    <span className="badge-red">Revisar</span>
                  )}
                </div>
                <p className="min-w-0 font-display font-bold text-xl sm:text-2xl text-primary-900 mb-1 break-words">{value}</p>
                <p className="text-primary-700 text-sm">{card.label}</p>
              </motion.div>
            )
          })}
         </div>

         {posSummary && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.35 }}
             className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl"
           >
             <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
               <h2 className="font-display font-semibold text-xl text-primary-900">Comparativa Online vs POS</h2>
               <Link to="/pos" className="text-charcoal-600 hover:text-charcoal-500 text-sm font-medium transition-colors">Ir a POS</Link>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
               <div className="bg-cream-100 rounded-xl p-4 border border-dark-border">
                 <p className="text-sm text-primary-700 mb-1">Ventas Online</p>
                 <p className="font-display font-bold text-xl text-primary-900">{formatPrice(posSummary.byChannel?.online?.total || 0)}</p>
                 <p className="text-xs text-primary-900/60">{posSummary.byChannel?.online?.count || 0} órdenes</p>
               </div>
               <div className="bg-charcoal-600/10 rounded-xl p-4 border border-dark-border">
                 <p className="text-sm text-primary-700 mb-1">Ventas POS</p>
                 <p className="font-display font-bold text-xl text-primary-900">{formatPrice(posSummary.byChannel?.pos?.total || 0)}</p>
                 <p className="text-xs text-primary-900/60">{posSummary.byChannel?.pos?.count || 0} órdenes</p>
               </div>
               <div className="bg-mustard-100 rounded-xl p-4 border border-dark-border">
                 <p className="text-sm text-primary-700 mb-1">Efectivo hoy</p>
                 <p className="font-display font-bold text-xl text-primary-900">{formatPrice(posSummary.todayCashSales || 0)}</p>
               </div>
               <div className="bg-primary-100 rounded-xl p-4 border border-dark-border">
                 <p className="text-sm text-primary-700 mb-1">Ticket promedio</p>
                 <p className="font-display font-bold text-xl text-primary-900">{formatPrice(posSummary.summary?.ticketPromedio || 0)}</p>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div>
                 <h3 className="font-display font-semibold text-sm text-primary-900 mb-4">Ventas por canal (últimos 30 días)</h3>
                 <ResponsiveContainer width="100%" height={200}>
                   <BarChart
                     data={[
                       { name: 'Online', total: posSummary.byChannel?.online?.total || 0 },
                       { name: 'POS', total: posSummary.byChannel?.pos?.total || 0 },
                     ]}
                     margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#6B6862" fontSize={12} />
                     <YAxis axisLine={false} tickLine={false} stroke="#6B6862" fontSize={12} />
                     <Tooltip
                       contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E2D9', borderRadius: '12px' }}
                       formatter={(value) => formatPrice(value)}
                     />
                     <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#C9A860" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>

               <div>
                 <h3 className="font-display font-semibold text-sm text-primary-900 mb-4">Métodos de pago POS</h3>
                 <ResponsiveContainer width="100%" height={200}>
                   <BarChart
                     data={posSummary.byPaymentMethod?.map(p => ({ name: p.method, value: p.total })) || []}
                     margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#6B6862" fontSize={12} />
                     <YAxis axisLine={false} tickLine={false} stroke="#6B6862" fontSize={12} />
                     <Tooltip
                       contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E2D9', borderRadius: '12px' }}
                       formatter={(value) => formatPrice(value)}
                     />
                     <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#22C55E" />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </motion.div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="min-w-0 lg:col-span-2 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="font-display font-semibold text-xl text-primary-900">Ventas de los últimos 30 días</h2>
              <span className="text-primary-700 text-sm">Últimos 30 días</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                <XAxis dataKey="name" stroke="#6B6862" fontSize={12} />
                <YAxis stroke="#6B6862" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E2D9', borderRadius: '12px', color: '#1A1815', boxShadow: '0 8px 20px rgba(26,24,21,0.08)' }}
                  formatter={(value) => formatPrice(value)}
                />
                <Legend />
                <Bar dataKey="ventas" fill="#C9A860" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl overflow-hidden"
          >
            <h2 className="font-display font-semibold text-lg sm:text-xl text-primary-900 mb-6">Estado de pedidos</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E2D9', borderRadius: '12px', color: '#1A1815', boxShadow: '0 8px 20px rgba(26,24,21,0.08)' }}
                  formatter={(value) => `${value} pedidos`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[index] }} />
                  <span className="text-primary-700">{entry.name}</span>
                  <span className="text-primary-900 font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="font-display font-semibold text-xl text-primary-900">Pedidos por estado</h2>
              <span className="text-primary-700 text-sm">Últimos 30 días</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={ordersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                <XAxis dataKey="name" stroke="#6B6862" fontSize={12} />
                <YAxis stroke="#6B6862" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E2D9', borderRadius: '12px', color: '#1A1815', boxShadow: '0 8px 20px rgba(26,24,21,0.08)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#C9A860" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pendientes" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pagados" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="font-display font-semibold text-xl text-primary-900">Productos más vendidos</h2>
              <Link to="/admin/productos" className="text-charcoal-600 hover:text-charcoal-500 text-sm font-medium transition-colors">Ver todos</Link>
            </div>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-primary-700 text-center py-8">No hay productos vendidos aún</p>
              ) : topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex flex-wrap items-center gap-3 p-3 bg-cream-100 rounded-xl border border-dark-border">
<div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-charcoal-600 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                  <img src={product.image || '/assets/images/producto1.webp'} alt={product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary-900 truncate">{product.name}</p>
                    <p className="text-primary-700 text-sm">{product.total_sold} vendidos</p>
                  </div>
                  <span className="flex-shrink-0 font-display font-bold text-charcoal-600 text-sm sm:text-base">{formatPrice(product.revenue)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="min-w-0 p-4 sm:p-6 bg-white border border-dark-border rounded-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="font-display font-semibold text-xl text-primary-900">Alertas de stock bajo</h2>
            <Link to="/admin/productos?filter=low-stock" className="text-charcoal-600 hover:text-charcoal-500 text-sm font-medium transition-colors">Ver inventario</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-wrap items-center gap-3 text-green-600">
              <CheckCircle className="w-6 h-6" />
                <p className="font-medium min-w-0">No hay productos con stock bajo</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-dark-border text-left text-primary-700">
                    <th className="py-3 pr-4">Producto</th>
                    <th className="py-3 pr-4">SKU</th>
                    <th className="py-3 pr-4">Stock</th>
                    <th className="py-3 pr-4">Mínimo</th>
                    <th className="py-3 pr-4">Precio</th>
                    <th className="py-3 pr-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((product) => (
                    <tr key={product.id} className="border-b border-dark-border/50 hover:bg-primary-50/50">
                      <td className="py-3 pr-4 font-medium text-primary-900 truncate max-w-xs">{product.name}</td>
                      <td className="py-3 pr-4 text-primary-700 font-mono text-xs">{product.sku}</td>
                      <td className={`py-3 pr-4 font-medium ${product.stock <= product.min_stock ? 'text-red-500' : 'text-primary-900'}`}>{product.stock}</td>
                      <td className="py-3 pr-4 text-primary-700">{product.min_stock}</td>
                      <td className="py-3 pr-4 text-charcoal-600">{formatPrice(product.price)}</td>
                      <td className="py-3 pr-4">
                        <span className="badge-red">Bajo</span>
                      </td>
                    </tr>
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