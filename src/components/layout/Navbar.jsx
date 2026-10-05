import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { Search, Menu, X, User, ShoppingCart, ChevronDown, LayoutDashboard, LogOut, Home } from 'lucide-react'

const navLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/tienda', label: 'Tienda' },
  { path: '/tienda?category=ofertas', label: 'Ofertas' },
  { path: '/nosotros', label: 'Nosotros' },
  { path: '/contacto', label: 'Contacto' },
]

function NavLink({ to, active, index, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={to}
        className={`relative py-1 text-[15px] font-medium transition-colors duration-200 ${
          active ? 'text-charcoal-700' : 'text-primary-800 hover:text-charcoal-600'
        }`}
      >
        {children}
        <span
          className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-charcoal-600 transition-all duration-300 ${
            active ? 'w-full' : 'w-0'
          }`}
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  )
}

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { itemCount, toggleCart } = useCart()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setSearchOpen(false)
        setDropdownOpen(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleMenuBackdropClick = useCallback((e) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      setMobileMenuOpen(false)
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const isActive = useCallback((path) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
  }, [location.pathname])

  return (
    <>
      {/* Franja de confianza — refuerza cobertura y contacto, tono cercano y profesional */}
      {!isAdminRoute && (
        <div className="hidden lg:block bg-charcoal-700 text-white/90 text-xs">
          <div className="container-custom flex items-center justify-between h-9">
            <span>Envíos a Bogotá, alrededores y todo Colombia</span>
            <a href="tel:+573001027616" className="hover:text-white transition-colors">
              ¿Dudas? Escríbenos al (+57) 300 102 7616
            </a>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-dark-border shadow-card'
            : 'bg-white border-b border-transparent'
        }`}
      >
        <nav className="container-custom" aria-label="Navegación principal">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            <Link to="/" className="flex items-center gap-2.5 z-10 shrink-0" aria-label="SYM COMPUTER - Inicio">
              <img src="/assets/images/Logo.webp" alt="" className="w-9 h-9 lg:w-10 lg:h-10" />
              <span className="font-display font-bold text-lg lg:text-xl text-primary-900 tracking-tight">
                SYM COMPUTER
              </span>
            </Link>

            <div className="flex items-center gap-2 lg:gap-6">
              <div className="lg:hidden flex items-center gap-1">
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="p-2 text-primary-800 hover:text-charcoal-600 transition-colors"
                  aria-label="Buscar productos"
                  aria-expanded={mobileSearchOpen}
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-primary-800 hover:text-charcoal-600 transition-colors"
                  aria-label={`Carrito: ${itemCount} productos`}
                >
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </button>
                {!isAdminRoute && (
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-primary-800 hover:text-charcoal-600 transition-colors"
                    aria-label="Abrir menú"
                    aria-expanded={mobileMenuOpen}
                  >
                    <Menu className="w-6 h-6" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="hidden lg:flex items-center gap-7 whitespace-nowrap">
                {navLinks.map((link, index) => (
                  <NavLink key={link.path} to={link.path} active={isActive(link.path)} index={index}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-200 ${
                      searchOpen
                        ? 'bg-charcoal-50 border-charcoal-300 text-charcoal-700'
                        : 'bg-primary-50 border-dark-border text-primary-800 hover:border-charcoal-300'
                    }`}
                    aria-label="Buscar productos"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm">Buscar</span>
                  </button>
                  <AnimatePresence>
                    {searchOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 max-w-[90vw]"
                      >
                        <form onSubmit={handleSearch} className="relative">
                          <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Busca procesadores, tarjetas gráficas, accesorios..."
                            className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-dark-border text-primary-900 placeholder:text-primary-500 focus:outline-none focus:border-charcoal-400 focus:ring-2 focus:ring-charcoal-100 transition-colors shadow-card"
                            autoFocus
                            aria-label="Buscar productos"
                          />
                          <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary-600 hover:text-charcoal-600 transition-colors"
                            aria-label="Buscar"
                          >
                            <Search className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={toggleCart}
                  className="relative p-2.5 rounded-full text-primary-800 hover:text-charcoal-700 hover:bg-primary-50 transition-colors"
                  aria-label={`Carrito: ${itemCount} productos`}
                >
                  <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-charcoal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </button>

                <span className="w-px h-6 bg-dark-border" aria-hidden="true" />

                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDropdownOpen(dropdownOpen === 'user' ? null : 'user')
                      }}
                      className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-dark-border hover:border-charcoal-300 transition-all duration-200"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen === 'user'}
                    >
                      <div className="w-7 h-7 rounded-full bg-charcoal-600 flex items-center justify-center text-white font-semibold text-xs">
                        {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-primary-900 max-w-[8rem] truncate">
                        {user?.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-primary-600 transition-transform ${dropdownOpen === 'user' ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen === 'user' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 max-w-[90vw] bg-white border border-dark-border rounded-2xl py-2 shadow-card overflow-hidden"
                        >
                          <Link to="/cuenta" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 transition-colors" onClick={() => setDropdownOpen(null)}>
                            <User className="w-4 h-4" aria-hidden="true" />
                            Mi cuenta
                          </Link>
                          {isAdmin && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 transition-colors" onClick={() => setDropdownOpen(null)}>
                              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                              Panel admin
                            </Link>
                          )}
                          <hr className="my-2 border-dark-border" />
                          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 transition-colors" onClick={() => setDropdownOpen(null)}>
                            <Home className="w-4 h-4" aria-hidden="true" />
                            Volver al inicio
                          </Link>
                          <hr className="my-2 border-dark-border" />
                          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-900 hover:text-charcoal-700 hover:bg-primary-50 text-left transition-colors">
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            Cerrar sesión
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="px-3.5 py-2 text-sm font-medium text-primary-800 hover:text-charcoal-700 transition-colors">
                      Iniciar sesión
                    </Link>
                    <Link to="/registro" className="btn-primary text-sm px-5 py-2.5">
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {mobileSearchOpen && (
            <div className="lg:hidden pb-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca alimento, snacks, accesorios..."
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-primary-50 border border-dark-border text-primary-900 placeholder:text-primary-500 focus:outline-none focus:border-charcoal-400 transition-colors"
                  autoFocus
                  aria-label="Buscar productos"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-primary-600 hover:text-charcoal-600 transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          )}
        </nav>
      </header>

      {!isAdminRoute && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <Fragment>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-primary-950/30"
                onClick={handleMenuBackdropClick}
              />
              <motion.div
                ref={mobileMenuRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white flex flex-col shadow-card"
              >
                <div className="p-5 flex items-center justify-between border-b border-dark-border">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/assets/images/Logo.webp" alt="SYM COMPUTER" className="w-9 h-9" />
                    <span className="font-display font-bold text-lg text-primary-900">SYM COMPUTER</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-primary-700 hover:text-charcoal-700 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200 touch-manipulation ${
                        isActive(link.path)
                          ? 'bg-charcoal-50 text-charcoal-700'
                          : 'text-primary-800 hover:bg-primary-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <div className="pt-4 mt-3 border-t border-dark-border space-y-1">
                      <Link to="/cuenta" className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-800 hover:bg-primary-50 transition-colors touch-manipulation" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4" aria-hidden="true" /> Mi cuenta
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-primary-800 hover:bg-primary-50 transition-colors touch-manipulation" onClick={() => setMobileMenuOpen(false)}>
                          <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Panel admin
                        </Link>
                      )}
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary-800 hover:bg-primary-50 text-left transition-colors touch-manipulation">
                        <LogOut className="w-4 h-4" aria-hidden="true" /> Cerrar sesión
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 mt-3 border-t border-dark-border space-y-2">
                      <Link to="/login" className="block w-full px-4 py-3 rounded-xl bg-primary-50 border border-dark-border text-primary-900 text-center font-medium hover:border-charcoal-300 transition-colors touch-manipulation" onClick={() => setMobileMenuOpen(false)}>
                        Iniciar sesión
                      </Link>
                      <Link to="/registro" className="block w-full btn-primary text-center touch-manipulation" onClick={() => setMobileMenuOpen(false)}>
                        Registrarse
                      </Link>
                    </div>
                  )}
                </nav>

                <div className="p-4 border-t border-dark-border text-xs text-primary-600">
                  Envíos a Bogotá, alrededores y todo Colombia
                </div>
              </motion.div>
            </Fragment>
          )}
        </AnimatePresence>
      )}
    </>
  )
}