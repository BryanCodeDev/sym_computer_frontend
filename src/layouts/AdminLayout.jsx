import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Settings, HelpCircle, LogOut, Store } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminTopbar from '../components/layout/AdminTopbar'

const navSections = [
  {
    label: 'General',
    items: [{ path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'Catálogo',
    items: [
      { path: '/admin/productos', label: 'Productos', icon: Package },
      { path: '/admin/categorias', label: 'Categorías', icon: Tag },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { path: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
      { path: '/admin/usuarios', label: 'Usuarios', icon: Users },
    ],
  },
  {
    label: 'Punto de venta',
    items: [
      { path: '/admin/caja', label: 'Caja', icon: Store },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { path: '/admin/configuracion', label: 'Configuración', icon: Settings },
      { path: '/admin/ayuda', label: 'Ayuda', icon: HelpCircle },
    ],
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, sidebarOpen])

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, sidebarOpen])

  // Cierra el sidebar en móvil cada vez que cambia de página
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
  }

  const isItemActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)

  return (
    <>
      <AdminTopbar onOpenSidebar={() => setSidebarOpen(true)} />

      <div className="min-h-screen bg-primary-50/50 flex overflow-x-clip">
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-primary-950/30 z-40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <aside
          className={`${
            isMobile
              ? `fixed left-0 top-16 bottom-0 z-[45] transform transition-transform duration-300 ease-in-out ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'lg:sticky lg:top-[72px] lg:self-start lg:h-[calc(100vh-72px)]'
          } w-72 bg-white border-r border-dark-border flex flex-col`}
        >
          {/* Nav con scroll propio — independiente del resto de la página */}
          <nav className="flex-1 overflow-y-auto min-h-0 py-3 px-3 admin-sidebar-scroll">
            {navSections.map((section, sIndex) => (
              <div key={section.label} className={sIndex > 0 ? 'mt-5' : ''}>
                <p className="px-3.5 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-black">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isItemActive(item)
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-charcoal-600 text-white shadow-sm'
                            : 'text-black hover:bg-primary-50'
                        }`}
                      >
                        <Icon
                          className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                            active ? 'text-white' : 'text-primary-400 group-hover:text-charcoal-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.label}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer fijo: no se mueve con el scroll del nav */}
          <div className="p-3 border-t border-dark-border flex-shrink-0">
            <div className="flex items-center gap-3 px-3.5 py-2.5">
              <div className="w-9 h-9 rounded-full bg-charcoal-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary-900 truncate">{user?.name}</p>
                <p className="text-xs text-black truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-primary-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
            >
              <LogOut className="w-[18px] h-[18px]" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </>
  )
}