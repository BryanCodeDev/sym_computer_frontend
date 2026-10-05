import api from './api'

export const posService = {
  async searchProducts(query) {
    const response = await api.get('/pos/products/search', { params: { q: query } })
    return response.data
  },

  async getProductByBarcode(barcode) {
    const response = await api.get(`/pos/products/barcode/${encodeURIComponent(barcode)}`)
    return response.data
  },

  async createSale(saleData) {
    const response = await api.post('/pos/sale', saleData)
    return response.data
  },

  async getReceipt(orderId) {
    const response = await api.get(`/pos/sale/${orderId}/receipt`)
    return response.data
  },

  async getSales(params = {}) {
    const response = await api.get('/pos/sales', { params })
    return response.data
  },

  async openCashRegister(data) {
    const response = await api.post('/pos/cash-register/open', data)
    return response.data
  },

  async getCurrentCashRegister() {
    const response = await api.get('/pos/cash-register/current')
    return response.data
  },

  async closeCashRegister(data) {
    const response = await api.post('/pos/cash-register/close', data)
    return response.data
  },

  async getCashRegisterById(id) {
    const response = await api.get(`/pos/cash-register/${id}`)
    return response.data
  },

  async getCashRegisterHistory(params = {}) {
    const response = await api.get('/pos/cash-register/history', { params })
    return response.data
  },

  async getAllCashRegisters(params = {}) {
    const response = await api.get('/pos/cash-register/admin/history', { params })
    return response.data
  },

  async getDailyReport(params = {}) {
    const response = await api.get('/pos/reports/daily', { params })
    return response.data
  },

  async getReportsSummary(params = {}) {
    const response = await api.get('/pos/reports/summary', { params })
    return response.data
  },

  async getCashRegistersReport(params = {}) {
    const response = await api.get('/pos/reports/cash-registers', { params })
    return response.data
  },
}
