import axios from 'axios'

/**
 * El backend monta TODO bajo /api (ver src/app.js del backend). Una
 * VITE_API_URL sin ese sufijo hace que cada petición pegue en la raíz y
 * responda 404: la tienda aparece vacía y el login falla, sin ninguna pista
 * de la causa. Se normaliza aquí para que una variable mal escrita no pueda
 * tumbar la aplicación entera.
 *
 * Conviene dejar VITE_API_URL vacía en producción. La sesión se guarda en una
 * cookie httpOnly con sameSite=lax: si el frontend llama al backend por su
 * dominio, la petición es cross-site, el navegador no manda la cookie y todos
 * los endpoints autenticados responden 401. Con la variable vacía todo va a
 * /api en el mismo origen y netlify.toml lo reenvía desde el servidor.
 */
export function normalizeBaseUrl(value) {
  const base = (value || '/api').replace(/\/+$/, '')
  return base.endsWith('/api') ? base : `${base}/api`
}

const configuredBaseUrl = import.meta.env.VITE_API_URL
const baseURL = normalizeBaseUrl(configuredBaseUrl)

if (configuredBaseUrl && normalizeBaseUrl(configuredBaseUrl) !== configuredBaseUrl.replace(/\/+$/, '')) {
  console.warn(
    `[api] VITE_API_URL="${configuredBaseUrl}" no terminaba en /api; se usa "${baseURL}".`
  )
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      const isAuthMe = url.includes('/auth/me')
      if (!isAuthMe && window.location.pathname !== '/login' && window.location.pathname !== '/registro') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
    }
    return Promise.reject(error)
  }
)

export default api