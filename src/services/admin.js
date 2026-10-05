import api from './api'

export const adminProductService = {
  async getAll(params = {}) {
    const response = await api.get('/admin/products', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/admin/products/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/admin/products', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/admin/products/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },

  async duplicate(id) {
    const response = await api.post(`/admin/products/${id}/duplicate`)
    return response.data
  },

  async toggleFeatured(id) {
    const response = await api.patch(`/admin/products/${id}/featured`)
    return response.data
  },

  async toggleStatus(id) {
    const response = await api.patch(`/admin/products/${id}/status`)
    return response.data
  },

  async uploadImages(id, files) {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    const response = await api.post(`/admin/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async deleteImage(productId, imageId) {
    const response = await api.delete(`/admin/products/${productId}/images/${imageId}`)
    return response.data
  },

  async reorderImages(productId, imageIds) {
    const response = await api.patch(`/admin/products/${productId}/images/reorder`, { imageIds })
    return response.data
  },

  async setMainImage(productId, imageId) {
    const response = await api.patch(`/admin/products/${productId}/images/${imageId}/main`)
    return response.data
  },
}

export const adminCategoryService = {
  async getAll(params = {}) {
    const response = await api.get('/admin/categories', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/admin/categories/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/admin/categories', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/admin/categories/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/admin/categories/${id}`)
    return response.data
  },

  async toggleStatus(id) {
    const response = await api.patch(`/admin/categories/${id}/status`)
    return response.data
  },
}

export const adminOrderService = {
  async getAll(params = {}) {
    const response = await api.get('/admin/orders', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/admin/orders/${id}`)
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/admin/orders/${id}/status`, { status })
    return response.data
  },

  async getStatusHistory(id) {
    const response = await api.get(`/admin/orders/${id}/history`)
    return response.data
  },
}

export const adminUserService = {
  async getAll(params = {}) {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  async toggleStatus(id) {
    const response = await api.patch(`/admin/users/${id}/status`)
    return response.data
  },

  async changeRole(id, role) {
    const response = await api.patch(`/admin/users/${id}/role`, { role })
    return response.data
  },
}

export const adminDashboardService = {
  async getStats() {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  async getSalesChart(params = {}) {
    const response = await api.get('/admin/dashboard/sales-chart', { params })
    return response.data
  },

  async getOrdersChart(params = {}) {
    const response = await api.get('/admin/dashboard/orders-chart', { params })
    return response.data
  },

  async getTopProducts(limit = 10) {
    const response = await api.get('/admin/dashboard/top-products', { params: { limit } })
    return response.data
  },

  async getLowStock(limit = 10) {
    const response = await api.get('/admin/dashboard/low-stock', { params: { limit } })
    return response.data
  },
}

export const adminPosService = {
  async getReportsSummary(params = {}) {
    const response = await api.get('/pos/reports/summary', { params })
    return response.data
  },

  async getCashRegistersReport(params = {}) {
    const response = await api.get('/pos/reports/cash-registers', { params })
    return response.data
  },

  async getAllCashRegisters(params = {}) {
    const response = await api.get('/pos/cash-register/admin/history', { params })
    return response.data
  },

  async getSalesByChannel(params = {}) {
    const response = await api.get('/pos/reports/admin/by-channel', { params })
    return response.data
  },

  async getSalesByPaymentMethod(params = {}) {
    const response = await api.get('/pos/reports/admin/by-payment-method', { params })
    return response.data
  },

  async getAdminDailyReport(params = {}) {
    const response = await api.get('/pos/reports/admin/daily', { params })
    return response.data
  },
}

export const adminSettingsService = {
  async getSettings() {
    const response = await api.get('/admin/settings')
    return response.data
  },

  async updateSettings(data) {
    const response = await api.put('/admin/settings', data)
    return response.data
  },

  async uploadLogo(file) {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post('/admin/settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
}