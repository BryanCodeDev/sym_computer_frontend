import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Menu, ChevronDown, User, LogOut, ExternalLink, Bell } from 'lucide-react'

export default function AdminTopbar({ onOpenSidebar }) {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 h-16 lg:h-[72px] bg-white border-b border-dark-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors flex-shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <img src="/assets/images/Logo.webp" alt="" className="w-7 h-7 flex-shrink-0" />
          <span className="font-display font-bold text-base lg:text-lg text-primary-900 truncate">
            Panel administrativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 lg:gap-3 flex-shrink-0">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-charcoal-700 transition-colors px-3 py-2 rounded-lg hover:bg-primary-50"
        >
          Ver tienda
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>

        <button
          className="relative p-2 rounded-full text-primary-700 hover:bg-primary-50 hover:text-charcoal-700 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
        </button>

        <span className="w-px h-6 bg-dark-border hidden sm:block" aria-hidden="true" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full border border-dark-border hover:border-charcoal-300 transition-all duration-200"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="w-7 h-7 rounded-full bg-charcoal-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-primary-900 max-w-[8rem] truncate">
              {user?.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-primary-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-dark-border rounded-2xl py-2 shadow-card overflow-hidden"
              >
                <Link
                  to="/cuenta"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" aria-hidden="true" />
                  Mi cuenta
                </Link>
                <Link
                  to="/"
                  className="sm:hidden flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Ver tienda
                </Link>
                <hr className="my-2 border-dark-border" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}