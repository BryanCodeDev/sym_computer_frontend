export function formatPrice(price, currency = 'COP', locale = 'es-CO') {
  if (price === null || price === undefined) return '$0'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatNumber(num, locale = 'es-CO') {
  return new Intl.NumberFormat(locale).format(num)
}

export function calculateDiscount(originalPrice, currentPrice) {
  // El backend devuelve DECIMAL como string (mysql2 no los coerciona), así que
  // comparar sin Number() es una comparación LÉXICA: '10000.00' <= '9500.00'
  // da TRUE porque '1' < '9' y el descuento salía 0 en los productos rebajados
  // cuyo precio actual tiene más dígitos que el original.
  const original = Number(originalPrice)
  const current = Number(currentPrice)
  if (!original || !Number.isFinite(original) || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

/** ¿El producto está en oferta? Fuente única de verdad para toda la UI. */
export function hasDiscount(product) {
  if (!product) return false
  return calculateDiscount(product.originalPrice, product.price) > 0
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text, length = 100) {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function debounce(fn, delay = 300) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function throttle(fn, limit = 300) {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }
  return new Date(date).toLocaleDateString('es-CO', defaultOptions)
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${year}${month}${day}-${random}`
}

export function getStockStatus(stock) {
  if (stock <= 0) return { label: 'Agotado', class: 'badge-red', available: false }
  if (stock <= 5) return { label: `Stock bajo (${stock})`, class: 'badge-yellow', available: true }
  return { label: 'Disponible', class: 'badge-green', available: true }
}

export function getOrderStatusConfig(status) {
  const configs = {
    pending: { label: 'Pendiente', color: 'blue', bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-600/30' },
    paid: { label: 'Pagado', color: 'blue', bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-600/30' },
    preparing: { label: 'Preparando', color: 'purple', bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600/30' },
    shipped: { label: 'Enviado', color: 'indigo', bg: 'bg-indigo-600/20', text: 'text-indigo-400', border: 'border-indigo-600/30' },
    delivered: { label: 'Entregado', color: 'green', bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-600/30' },
    cancelled: { label: 'Cancelado', color: 'red', bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600/30' },
    refunded: { label: 'Reembolsado', color: 'gray', bg: 'bg-gray-600/20', text: 'text-primary-900', border: 'border-gray-600/30' },
  }
  return configs[status] || configs.pending
}

export function getPaymentStatusConfig(status) {
  const configs = {
    pending: { label: 'Pendiente', color: 'blue' },
    approved: { label: 'Aprobado', color: 'green' },
    rejected: { label: 'Rechazado', color: 'red' },
    cancelled: { label: 'Cancelado', color: 'gray' },
    refunded: { label: 'Reembolsado', color: 'blue' },
    in_process: { label: 'En proceso', color: 'blue' },
    in_mediation: { label: 'En mediación', color: 'purple' },
    charged_back: { label: 'Contracargo', color: 'red' },
  }
  return configs[status] || configs.pending
}

export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params) {
    if (result[key]) {
      if (!Array.isArray(result[key])) result[key] = [result[key]]
      result[key].push(value)
    } else {
      result[key] = value
    }
  }
  return result
}

export function buildQueryString(params) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v))
      } else {
        searchParams.set(key, value)
      }
    }
  })
  return searchParams.toString()
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone) {
  const re = /^[\d\s+()-]{10,}$/
  return re.test(phone)
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateSKU(category, brand) {
  const cat = category.slice(0, 3).toUpperCase()
  const br = brand.slice(0, 3).toUpperCase()
  const num = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${cat}-${br}-${num}`
}

export function getImageUrl(path, options = {}) {
  if (!path) return '/assets/images/producto1.webp'
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_CLOUDINARY_URL || ''
  const { width, height, quality = 'auto', format = 'auto' } = options
  if (base && (width || height)) {
    const transforms = []
    if (width) transforms.push(`w_${width}`)
    if (height) transforms.push(`h_${height}`)
    transforms.push(`q_${quality}`, `f_${format}`)
    return `${base}/${transforms.join(',')}/${path}`
  }
  return `${base}/${path}`
}

export function getProductImage(product, index = 0) {
  if (product.images && product.images.length > index) {
    return product.images[index].url
  }
  return product.image || '/assets/images/producto1.webp'
}

/**
 * Mensaje de consulta por WhatsApp a partir de un producto.
 *
 * Antes, getWhatsAppUrl() esperaba un string y los dos llamantes le pasaban un
 * objeto: encodeURIComponent(objeto) produceía "text=%5Bobject%20Object%5D" y
 * el vendedor abría el chat con un mensaje vacío. Ahora la normalización vive
 * aquí, en un sitio testeable.
 */
export function getProductMessage(product) {
  if (!product || !product.name) return ''

  const price = Number(product.price) || 0
  const original = Number(product.originalPrice ?? product.discountPrice) || 0
const lines = [
    'Hola, me interesa este producto de SYM COMPUTER:',
    '',
    `*${product.name}*`,
  ]

  if (original > price) {
    lines.push(`Precio: ${formatPrice(price)} (antes ${formatPrice(original)}, ${calculateDiscount(original, price)}% de descuento)`)
  } else {
    lines.push(`Precio: ${formatPrice(price)}`)
  }

  if (product.sku) lines.push(`SKU: ${product.sku}`)
  if (product.slug && typeof window !== 'undefined') {
    lines.push('', `${window.location.origin}/producto/${product.slug}`)
  }

  return lines.join('\n')
}

/**
 * Acepta un mensaje ya redactado o un producto, del que compone el mensaje.
 * Aceptar ambos evita el "[object Object]" en cualquier llamante nuevo.
 */
export function getWhatsAppUrl(message, quantity) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER
  const text = typeof message === 'string' ? message : getProductMessage(message)
  const suffix = quantity > 1 ? `\n\nCantidad: ${quantity}` : ''
  return `https://wa.me/${number}?text=${encodeURIComponent(text + suffix)}`
}

export function getWhatsAppUrlForCart(items, total) {
  const productsText = items.map(item =>
    `- ${item.name} x${item.quantity} = $${((item.discountPrice || item.price) * item.quantity).toLocaleString('es-CO')}`
  ).join('\n')
  const text = `Hola, quiero realizar el siguiente pedido:\n\n${productsText}\n\nTotal: $${total.toLocaleString('es-CO')}\n\n¿Me pueden brindar información para finalizar la compra?`
  const number = import.meta.env.VITE_WHATSAPP_NUMBER
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}