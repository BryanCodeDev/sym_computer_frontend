import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Shield, UserCheck, UserX, Loader2 } from 'lucide-react'
import SEO from '../../components/seo/SEO'
import { adminUserService } from '../../services/admin'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, role])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = { page: currentPage, limit: 20, ...(role && { role }), ...(search && { search }) }
      const data = await adminUserService.getAll(params)
      setUsers(data.users || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const openUser = async (user) => {
    setSelectedUser(user)
    setUserModalOpen(true)
  }

  const handleToggleStatus = async (user) => {
    try {
      await adminUserService.toggleStatus(user.id)
      toast.success(`Usuario ${user.isActive ? 'desactivado' : 'activado'}`)
      fetchUsers()
    } catch (error) {
      console.error('Toggle user status error:', error)
      toast.error('Error al actualizar usuario')
    }
  }

  const handleChangeRole = async (user, newRole) => {
    setSaving(true)
    try {
      await adminUserService.changeRole(user.id, newRole)
      toast.success(`Rol cambiado a ${newRole === 'admin' ? 'administrador' : 'usuario'}`)
      fetchUsers()
    } catch (error) {
      console.error('Change role error:', error)
      toast.error('Error al cambiar rol')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SEO
        title="Usuarios | SYM COMPUTER Admin"
        description="Gestiona los usuarios de SYM COMPUTER."
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
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-primary-900">Usuarios</h1>
            <p className="text-primary-900/60 mt-2">Gestiona cuentas, roles y permisos</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white border border-charcoal-100 shadow-card rounded-2xl"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-700" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email o teléfono..."
                className="w-full pl-12 pr-4 py-3 bg-charcoal-50 border border-charcoal-200 rounded-xl text-primary-900 placeholder:text-primary-700/60 focus:outline-none focus:border-charcoal-500 focus:ring-1 focus:ring-charcoal-500"
              />
            </div>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setCurrentPage(1) }}
              className="input py-3 px-4 bg-charcoal-50"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="user">Usuarios</option>
            </select>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-charcoal-100 shadow-card rounded-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-6 space-y-4" role="list" aria-busy="true">
              {[...Array(8)].map((_, i) => (
                <motion.div key={i} className="skeleton h-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto min-w-0">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-charcoal-100 bg-charcoal-50/40 text-left text-primary-900/70">
                    <th className="py-4 px-6 font-medium">Usuario</th>
                    <th className="py-4 px-6 font-medium">Email</th>
                    <th className="py-4 px-6 font-medium">Rol</th>
                    <th className="py-4 px-6 font-medium">Estado</th>
                    <th className="py-4 px-6 font-medium">Registro</th>
                    <th className="py-4 px-6 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="border-b border-charcoal-100 hover:bg-charcoal-50/40"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-charcoal-600 to-charcoal-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-primary-900">{user.firstName} {user.lastName}</p>
                            <p className="text-primary-900/50 text-xs">{user.phone || 'Sin teléfono'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-primary-900/70 truncate max-w-xs">{user.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-charcoal-600/10 text-charcoal-600 border border-charcoal-600/20' : 'bg-primary-100 text-primary-700 border border-primary-200'}`}>
                          {user.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-charcoal-50 text-charcoal-700 border border-charcoal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-primary-900/60 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openUser(user)} className="p-2 text-primary-900 hover:text-charcoal-600 hover:bg-charcoal-50 rounded-lg transition-colors" aria-label={`Ver ${user.email}`}>
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleToggleStatus(user)} className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-primary-900 hover:text-red-600 hover:bg-red-50' : 'text-primary-900 hover:text-charcoal-600 hover:bg-charcoal-600/10'}`} aria-label={`${user.isActive ? 'Desactivar' : 'Activar'} ${user.email}`}>
                            {user.isActive ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 sm:p-6 border-t border-charcoal-100">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary px-4 py-2 min-h-10 disabled:opacity-50">Anterior</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === pageNum ? 'bg-charcoal-600 text-white' : 'bg-white text-primary-900 hover:bg-charcoal-50 hover:text-primary-900 border border-charcoal-100'}`}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary px-4 py-2 min-h-10 disabled:opacity-50">Siguiente</button>
            </div>
          )}
        </motion.div>
      </div>

      {userModalOpen && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-charcoal-100 shadow-card-hover rounded-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-charcoal-100">
              <h2 className="font-display font-bold text-xl text-primary-900">Detalles del usuario</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-primary-900/60 text-sm">Nombre</p>
                <p className="font-medium text-primary-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <p className="text-primary-900/60 text-sm">Email</p>
                <p className="font-medium text-primary-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-primary-900/60 text-sm">Teléfono</p>
                <p className="font-medium text-primary-900">{selectedUser.phone || 'No registrado'}</p>
              </div>
              <div>
                <p className="text-primary-900/60 text-sm">Rol</p>
                <div className="flex items-center gap-2 mt-2">
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleChangeRole(selectedUser, e.target.value)}
                    className="input py-2 px-3 bg-charcoal-50 text-sm"
                    disabled={saving}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {saving && <Loader2 className="w-5 h-5 animate-spin text-charcoal-500" />}
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-charcoal-100">
                <button onClick={() => setUserModalOpen(false)} className="btn-secondary">Cerrar</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}