import api from './api'

export const productService = {
  async getAll(params = {}) {
    const response = await api.get('/products', { params })
    return response.data
  },

  async getBySlug(slug) {
    const response = await api.get(`/products/${slug}`)
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/products/id/${id}`)
    return response.data
  },

  async getFeatured(limit = 8) {
    const response = await api.get('/products/featured', { params: { limit } })
    return response.data
  },

  async getOnSale(limit = 8) {
    const response = await api.get('/products/on-sale', { params: { limit } })
    return response.data
  },

  async getNewArrivals(limit = 8) {
    const response = await api.get('/products/new-arrivals', { params: { limit } })
    return response.data
  },

  async search(query, params = {}) {
    const response = await api.get('/products/search', { params: { q: query, ...params } })
    return response.data
  },

  async getRelated(productId, limit = 4) {
    const response = await api.get(`/products/${productId}/related`, { params: { limit } })
    return response.data
  },
}

export const categoryService = {
  async getAll(params = {}) {
    const response = await api.get('/categories', { params })
    return response.data
  },

  async getBySlug(slug) {
    const response = await api.get(`/categories/${slug}`)
    return response.data
  },

  async getWithProducts(slug, params = {}) {
    const response = await api.get(`/categories/${slug}/products`, { params })
    return response.data
  },
}

export const cartService = {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  },

  async addItem(productId, quantity = 1) {
    const response = await api.post('/cart', { productId, quantity })
    return response.data
  },

  async updateItem(productId, quantity) {
    const response = await api.put(`/cart/${productId}`, { quantity })
    return response.data
  },

  async removeItem(productId) {
    const response = await api.delete(`/cart/${productId}`)
    return response.data
  },

  async clearCart() {
    const response = await api.delete('/cart')
    return response.data
  },

  async sync(items) {
    const response = await api.post('/cart/sync', { items })
    return response.data
  },
}

export const orderService = {
  async create(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  async getMyOrders(params = {}) {
    const response = await api.get('/orders/my', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async getByNumber(orderNumber) {
    const response = await api.get(`/orders/number/${orderNumber}`)
    return response.data
  },
}

export const paymentService = {
  async createPreference(orderId, paymentData) {
    const response = await api.post('/payments/create-preference', { orderId, ...paymentData })
    return response.data
  },

  async getStatus(paymentId) {
    const response = await api.get(`/payments/status/${paymentId}`)
    return response.data
  },
}

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async register(data) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async updateProfile(data) {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/auth/password', { currentPassword, newPassword })
    return response.data
  },

  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },
}

export const whatsappService = {
  generateProductMessage(product, quantity = 1) {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER
    const text = `Hola, estoy interesado en comprar:

Producto: ${product.name}
Precio: $${product.discountPrice || product.price}
Cantidad: ${quantity}

¿Me pueden brindar información para realizar la compra?`
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  },

  generateCartMessage(items, total) {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER
    const productsText = items.map(item =>
      `- ${item.name} x${item.quantity} = $${(item.discountPrice || item.price) * item.quantity}`
    ).join('\n')
    const text = `Hola, quiero realizar el siguiente pedido:

${productsText}

Total: $${total}

¿Me pueden brindar información para finalizar la compra?`
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  },

  generateGeneralMessage() {
    const number = import.meta.env.VITE_WHATSAPP_NUMBER
    const text = 'Hola, me gustaría recibir información sobre sus productos.'
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  },
}