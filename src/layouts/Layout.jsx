import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CartDrawer from '../components/cart/CartDrawer'
import { ScrollToTop } from '../components/ui/ScrollToTop'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 min-h-0">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}