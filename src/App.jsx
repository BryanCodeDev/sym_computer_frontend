import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './layouts/Layout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutFailure from './pages/CheckoutFailure'
import CheckoutPending from './pages/CheckoutPending'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Account from './pages/account/Account'
import OrderDetail from './pages/account/OrderDetail'
import Category from './pages/Category'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import { PrivacyPolicy, Terms, Returns, DataPolicy } from './pages/legal/index'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminCategories from './pages/admin/Categories'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import AdminHelp from './pages/admin/Help'
import POS from './pages/pos/POS'
import { ProtectedRoute, AdminRoute, CashierRoute } from './components/auth/RouteGuards'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tienda" element={<Store />} />
              <Route path="categoria/:slug" element={<Category />} />
              <Route path="buscar" element={<Search />} />
              <Route path="producto/:slug" element={<ProductDetail />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkout/success" element={<CheckoutSuccess />} />
              <Route path="checkout/failure" element={<CheckoutFailure />} />
              <Route path="checkout/pending" element={<CheckoutPending />} />
               <Route path="nosotros" element={<About />} />
               <Route path="contacto" element={<Contact />} />
               <Route path="politica-privacidad" element={<PrivacyPolicy />} />
              <Route path="terminos" element={<Terms />} />
              <Route path="cambios-devoluciones" element={<Returns />} />
              <Route path="tratamiento-datos" element={<DataPolicy />} />

              <Route element={<ProtectedRoute />}>
                <Route path="cuenta" element={<Account />} />
                <Route path="cuenta/pedido/:id" element={<OrderDetail />} />
              </Route>

              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Register />} />
            </Route>

            <Route path="/admin/*" element={<AdminLayout />}>
              <Route element={<AdminRoute />}>
                <Route path="" element={<AdminDashboard />} />
                <Route path="productos" element={<AdminProducts />} />
                <Route path="productos/nuevo" element={<AdminProductForm />} />
                <Route path="productos/:id/editar" element={<AdminProductForm />} />
                <Route path="categorias" element={<AdminCategories />} />
                <Route path="pedidos" element={<AdminOrders />} />
                <Route path="usuarios" element={<AdminUsers />} />
                <Route path="configuracion" element={<AdminSettings />} />
                <Route path="ayuda" element={<AdminHelp />} />
              </Route>

              <Route path="caja" element={<CashierRoute />}>
                <Route index element={<POS />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App