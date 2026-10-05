import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const WishlistContext = createContext(null)

const STORAGE_KEY = 'techstore_wishlist'

function getStoredWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredWishlist(wishlist) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredWishlist()
    setItems(stored)
    setLoading(false)
  }, [])

  const toggleItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.some(item => item.productId === product.id)
      let updated
      if (exists) {
        updated = prev.filter(item => item.productId !== product.id)
      } else {
        updated = [...prev, {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || product.image,
          price: product.price,
          discountPrice: product.discountPrice,
        }]
      }
      setStoredWishlist(updated)
      return updated
    })
  }, [])

  const isInWishlist = useCallback((productId) => {
    return items.some(item => item.productId === productId)
  }, [items])

  const clearWishlist = useCallback(() => {
    setItems([])
    setStoredWishlist([])
  }, [])

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      toggleItem,
      isInWishlist,
      clearWishlist,
      count: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}