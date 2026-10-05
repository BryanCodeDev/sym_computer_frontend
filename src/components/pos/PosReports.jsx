import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, BarChart3, Banknote, Calendar, Loader2 } from 'lucide-react'
import { posService } from '../../services/pos'
import { formatPrice } from '../../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'

const CHANNEL_COLORS = { pos: '#22C55E', online: '#3B82F6' }
const PAYMENT_COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7']

const DATE_PRESETS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Últimos 30 días', value: '30d' },
]

function getDefaultDateRange(type) {
  const today = new Date()
  let from = today
  if (type === '7d') {
    from = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
  } else if (type === '30d') {
    from = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)
  }
  return {
    from: from.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
  }
}

export default function PosReports() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState(getDefaultDateRange('30d').from)
  const [dateTo, setDateTo] = useState(getDefaultDateRange('30d').to)
  const [activePreset, setActivePreset] = useState('30d')

  const fetchSummary = async () => {
    if (!dateFrom || !dateTo) return
    setLoading(true)
    try {
      const data = await posService.getReportsSummary({ from: dateFrom, to: dateTo })
      setSummary(data)
    } catch (error) {
      console.error('Reports error:', error)
      toast.error('Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [dateFrom, dateTo])

  const handlePresetChange = (preset) => {
    setActivePreset(preset)
    const range = getDefaultDateRange(preset === 'today' ? 'today' : preset)
    setDateFrom(range.from)
    setDateTo(range.to)
  }

  const channelData = summary ? [
    { name: 'Online', total: summary.byChannel?.online?.total || 0, count: summary.byChannel?.online?.count || 0, color: CHANNEL_COLORS.online },
    { name: 'POS', total: summary.byChannel?.pos?.total || 0, count: summary.byChannel?.pos?.count || 0, color: CHANNEL_COLORS.pos },
  ] : []

  const paymentData = summary?.byPaymentMethod?.map((p, i) => ({
    name: p.method === 'cash' ? 'Efectivo' : p.method === 'wompi' ? 'Tarjeta (Wompi)' : p.method,
    value: p.total,
    count: p.count,
    color: PAYMENT_COLORS[i % PAYMENT_COLORS.length],
  })) || []

  const cashRegisterData = summary?.recentCashRegisters || []

  return (
    <>
      <Toaster position="top-right" />
      <div className="container-custom py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-display font-bold text-2xl text-primary-900">Reportes POS</h1>
          <div className="flex gap-3 items-center">
            <div className="flex gap-1 bg-white border border-charcoal-200 rounded-lg p-1">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetChange(preset.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activePreset === preset.value
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-900/70 hover:bg-charcoal-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-1.5 border border-charcoal-200 rounded-lg text-sm focus:border-primary-600 focus:outline-none"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-1.5 border border-charcoal-200 rounded-lg text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : !summary ? (
          <p className="text-center py-12 text-primary-900/60">
            Error al cargar los reportes
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-charcoal-100 rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-900/70 mb-1">Ventas totales</p>
                    <p className="font-display font-bold text-xl text-primary-900">{formatPrice(summary.summary?.totalSales || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-charcoal-100 rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-900/70 mb-1">Órdenes</p>
                    <p className="font-display font-bold text-xl text-primary-900">{summary.summary?.orderCount || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-charcoal-100 rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-900/70 mb-1">Ticket promedio</p>
                    <p className="font-display font-bold text-xl text-primary-900">{formatPrice(summary.summary?.ticketPromedio || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-charcoal-100 rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-900/70 mb-1">Efectivo hoy</p>
                    <p className="font-display font-bold text-xl text-primary-900">{formatPrice(summary.todayCashSales || 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-charcoal-100 rounded-xl p-6 shadow-card">
                <h3 className="font-display font-semibold text-lg text-primary-900 mb-4">Ventas por canal</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={channelData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B6862' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E5E2D9', borderRadius: '12px' }}
                      formatter={(value) => [formatPrice(value), 'Total']}
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-charcoal-100 rounded-xl p-6 shadow-card">
                <h3 className="font-display font-semibold text-lg text-primary-900 mb-4">Métodos de pago</h3>
                {paymentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <Pie
                        data={paymentData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatPrice(value), 'Total']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center py-8 text-primary-900/50">No hay datos</p>
                )}
              </div>
            </div>

            {/* Recent Cash Registers */}
            <div className="bg-white border border-charcoal-100 rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg text-primary-900">Cajas recientes</h3>
                <Calendar className="w-4 h-4 text-primary-900/60" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-charcoal-100 bg-charcoal-50/40">
                      <th className="px-3 py-2 text-left text-xs font-medium text-primary-900/70">Usuario</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-primary-900/70">Apertura</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-primary-900/70">Cierre</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-primary-900/70">Diferencia</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-primary-900/70">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashRegisterData.map((reg) => (
                      <tr key={reg.id} className="border-b border-charcoal-100 hover:bg-charcoal-50/30">
                        <td className="px-3 py-2 font-medium text-primary-900">{reg.userName}</td>
                        <td className="px-3 py-2 text-right text-primary-900/80">{formatPrice(reg.openingAmount)}</td>
                        <td className="px-3 py-2 text-right text-primary-900/80">
                          {reg.closingAmount !== null ? formatPrice(reg.closingAmount) : '-'}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {reg.difference !== null ? (
                            <span className={reg.difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatPrice(reg.difference)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reg.status === 'open'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {reg.status === 'open' ? 'Abierta' : 'Cerrada'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
