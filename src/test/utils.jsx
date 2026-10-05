import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'

/**
 * Monta un árbol con los providers reales en vez de contexts falsos. Los
 * contexts no se exportan (solo los hooks), y además así se prueba el
 * comportamiento de verdad: estado, efectos y persistencia en localStorage.
 */
export function renderWithProviders(ui, { route = '/' } = {}) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper })
}

export { userEvent, waitFor }
