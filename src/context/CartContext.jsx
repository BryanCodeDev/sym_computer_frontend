import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const STORAGE_KEY = 'techstore_cart'

function getStoredCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [synced, setSynced] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const stored = getStoredCart()
    setItems(stored)
    setLoading(false)
  }, [])

  const syncWithBackend = useCallback(async () => {
    if (!isAuthenticated) {
      setSynced(true)
      return
    }
    try {
      const response = await api.get('/cart')
      if (response.data.items?.length) {
        setItems(response.data.items)
        setStoredCart(response.data.items)
      } else if (items.length) {
        await api.post('/cart/sync', { items })
      }
      setSynced(true)
    } catch (error) {
      console.error('Cart sync failed:', error)
      setSynced(true)
    }
  }, [items, isAuthenticated])

  useEffect(() => {
    if (items.length && !synced) {
      syncWithBackend()
    }
  }, [items, synced, syncWithBackend])

  useEffect(() => {
    setSynced(false)
  }, [isAuthenticated])

  const toggleCart = useCallback(() => setCartOpen(prev => !prev), [])
  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id)
      let updated
      if (existing) {
        updated = prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      } else {
        updated = [...prev, {
          productId: product.id,
          quantity,
          price: product.price,
          discountPrice: product.discountPrice,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || product.image,
          sku: product.sku,
          stock: product.stock,
        }]
      }
      setStoredCart(updated)
      return updated
    })

    // Se propaga al backend. Sin esto el carrito vive solo en el navegador y
    // el servidor nunca sabe qué hay: al siguiente sync, lo que el usuario
    // quitó reaparece porque el servidor todavía lo tiene.
    api.post('/cart', { productId: product.id, quantity }).catch(error => {
      console.error('Error al agregar al carrito:', error)
    })
  }, [])

  const removeItem = useCallback(async (productId) => {
    setItems(prev => {
      const updated = prev.filter(item => item.productId !== productId)
      setStoredCart(updated)
      return updated
    })

    // Se propaga al backend para que la baja no se revierta en el siguiente
    // syncWithBackend (que vuelve a cargar los items guardados en el servidor).
    try {
      await api.delete(`/cart/${productId}`)
    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
    }
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems(prev => {
      const updated = prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
      setStoredCart(updated)
      return updated
    })

    // Mismo motivo que en addItem: si el cambio de cantidad no llega al
    // servidor, la próxima carga lo revierte al valor guardado allí.
    api.put(`/cart/${productId}`, { quantity }).catch(error => {
      console.error('Error al actualizar cantidad:', error)
    })
  }, [removeItem])

  const clearCart = useCallback(async () => {
    setItems([])
    setStoredCart([])

    try {
      await api.delete('/cart')
    } catch (error) {
      console.error('Error al vaciar el carrito:', error)
    }
  }, [])

  const getItem = useCallback((productId) => {
    return items.find(item => item.productId === productId)
  }, [items])

  const subtotal = items.reduce((sum, item) => {
    const price = item.discountPrice || item.price
    return sum + price * item.quantity
  }, 0)

  const discount = items.reduce((sum, item) => {
    if (item.discountPrice && item.price > item.discountPrice) {
      return sum + (item.price - item.discountPrice) * item.quantity
    }
    return sum
  }, 0)

  const total = subtotal
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      loading,
      cartOpen,
      toggleCart,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItem,
      subtotal,
      discount,
      total,
      itemCount,
      syncWithBackend,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}