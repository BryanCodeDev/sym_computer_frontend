# SYM COMPUTER — Frontend

Tienda pública y panel de administración de SYM COMPUTER, en React + Vite. Es un cliente de la API del backend: **no guarda catálogo ni categorías propios**, todo lo que muestra viene de la API.

---

## ¿Qué es esta aplicación?

Una SPA con tres zonas:

1. **Tienda pública**: catálogo, categorías, buscador, ficha de producto, carrito y checkout.
2. **Área de cliente**: perfil e historial de pedidos.
3. **Panel de administración**: productos, categorías, pedidos, usuarios, configuración, manual de ayuda y el módulo POS de caja.

---

## Requisitos

- **Node.js 20**.
- El **backend levantándose en `http://localhost:3001`**. El frontend no funciona solo: todo el contenido llega por API.

---

## Puesta en marcha

```bash
npm install
cp .env.example .env      # y rellena los valores
npm run dev               # http://localhost:5173
```

**`VITE_API_URL` debe quedar vacío en desarrollo.** Es deliberado:

1. `services/api.js` hace `VITE_API_URL || '/api'`, así que con la variable vacía la base queda en `/api`.
2. `vite.config.js` proxea `/api` hacia `http://localhost:3001`.

El resultado es que el navegador solo habla con el servidor de Vite: sin CORS y sin que las cookies de sesión crucen de dominio.

---

## Estructura del proyecto

```
frontend/
├── src/
│   ├── main.jsx              Punto de entrada y providers
│   ├── App.jsx               Rutas del sitio
│   ├── components/           Componentes por dominio
│   │   ├── auth/             Guardas de rutas por rol
│   │   ├── cart/             Carrito lateral y diálogo de quitar
│   │   ├── home/             Secciones del inicio
│   │   ├── layout/           Navbar, footer, topbar de admin
│   │   ├── pos/              Módulos del punto de venta
│   │   ├── products/         ProductCard y esqueleto de carga
│   │   ├── seo/              Componente SEO
│   │   └── ui/               Utilidades transversales
│   ├── context/              Auth, carrito y favoritos
│   ├── layouts/              Layout público y layout de admin
│   ├── pages/                Una carpeta/página por ruta
│   ├── services/             Cliente HTTP y servicios por dominio
│   ├── test/                 Pruebas, mocks MSW y utilidades
│   └── utils/helpers.js      Formato de precio, slugs, WhatsApp, imágenes
├── netlify.toml              Build, cabeceras y redirect de /api
├── tailwind.config.js
└── vite.config.js            Proxy de desarrollo y configuración de Vitest
```

---

## Variables de entorno

Solo tres, y todas deben empezar por `VITE_` para que Vite las exponga.

| Variable | Obligatoria | Para qué |
|---|---|---|
| `VITE_API_URL` | No en local | Base de la API. Vacía = usa `/api` y el proxy de Vite |
| `VITE_WHATSAPP_NUMBER` | **Sí** | Número para los enlaces de compra por WhatsApp |
| `VITE_CLOUDINARY_URL` | No | Prefijo de Cloudinary para armar URLs de imagen |

**`VITE_WHATSAPP_NUMBER` no tiene valor por defecto en el código.** Sin ella los enlaces salen como `https://wa.me/undefined?text=...` y el cliente abre un chat vacío.

El número está además escrito a mano en dos sitios que no pasan por variables, porque uno es SEO estático y el otro JSX. Si lo cambias, actualiza los tres:

- `src/utils/helpers.js` y `src/services/products.js` (usan la variable)
- `index.html` (JSON-LD, ~línea 36)
- `src/components/layout/Navbar.jsx` (~línea 112)

**Recordatorio de seguridad**: todo lo que empiece por `VITE_` queda incrustado en el bundle publicado. Nunca coloques un secreto con ese prefijo.

---

## Enrutado

Las rutas viven en `App.jsx`. El árbol de layouts es el que impone las guardas.

### Público

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/tienda` | Catálogo con filtros y paginación |
| `/categoria/:slug` | Productos de una categoría |
| `/buscar` | Buscador |
| `/producto/:slug` | Ficha de producto |
| `/carrito` | Carrito |
| `/checkout` | Datos de envío y pago |
| `/checkout/success` · `/pending` · `/failure` | Retorno del checkout |
| `/nosotros` · `/contacto` | Institucionales |
| `/politica-privacidad` · `/terminos` · `/cambios-devoluciones` · `/tratamiento-datos` | Legales |
| `/login` · `/registro` | Autenticación |

### Con sesión

`/cuenta` y `/cuenta/pedido/:id`, envueltas en `ProtectedRoute`.

### Administración

`/admin/*` bajo `AdminRoute`: dashboard, productos, categorías, pedidos, usuarios, configuración y ayuda.

### POS

`/admin/caja` bajo `CashierRoute`, la única ruta que abre un cajero. Un cajero que intente entrar a cualquier otra ruta de `/admin` es redirigido.

---

## Estado y datos

**Contexts**: `AuthContext` (sesión y usuario), `CartContext` (carrito) y `WishlistContext` (favoritos). Los contexts no se exportan, solo sus hooks.

**Servicios**: `src/services/` traduce cada endpoint en un método. Ninguno guarda datos de ejemplo ni tiene un *fallback*: si la API falla, la lista queda vacía. Un producto o categoría inventado en el código se mostraría aunque la tienda real no lo tenga.

**Cliente HTTP**: un único axios en `services/api.js` con `withCredentials: true`. Su interceptor de respuesta hace un redirect duro a `/login` ante cualquier 401, excepto en `/auth/me` y en las propias pantallas de login y registro.

**Carrito de invitados**: se guarda en `localStorage`; al iniciar sesión se sincroniza con el servidor.

---

## SEO

`components/seo/SEO.jsx` centraliza las etiquetas por página usando `react-helmet-async`: title, description, canonical, Open Graph, Twitter Card y JSON-LD.

**Detalle que costó sangre**: el JSON-LD debe pasarse como **hijo** del `<script>`, nunca con `dangerouslySetInnerHTML`.

```jsx
// Funciona
<script type="application/ld+json">{JSON.stringify(data)}</script>

// No emite nada: la etiqueta se descarta en silencio
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
```

Helmet lee el contenido de los hijos del script; con `dangerouslySetInnerHTML` no encuentra nada, descarta la etiqueta y el structured data nunca llega al navegador. El síntoma es silencioso: la página funciona y no aparece ningún error.

Los datos que llegan de la API pueden ser `null`, y los parámetros por defecto de un componente solo sustituyen `undefined`. Por eso el componente normaliza los huecos antes de usarlos.

---

## Estilos

TailwindCSS con un tema propio (`tailwind.config.js`). Las clases de marca son `btn-primary`, `btn-outline`, `section-title`, `input`, `label` y las paletas `primary-*` y `charcoal-*`.

Animaciones con `framer-motion`, iconos de `lucide-react` y carruseles de `swiper`.

---

## Pruebas

```bash
npm test                # suite completa
npm run test:watch
npm run test:coverage
```

Estado actual: **88 pruebas en 4 archivos**, todas en verde.

- **Entorno**: `jsdom` vía `vitest`, sin navegador real.
- **Providers reales**: los componentes se montan con `AuthProvider`, `CartProvider` y `WishlistProvider` de verdad, no con contexts falsos. Así se prueba el comportamiento de verdad, incluidos la persistencia y los efectos.
- **Red simulada con MSW**: `onUnhandledRequest: 'error'` obliga a declarar cada endpoint. Una suite que olvide un handler falla en vez de salir a internet.
- **`SEO.test.jsx`**: Helmet aplica las etiquetas en un efecto aparte del render, así que las pruebas deben esperar con `waitFor` antes de leer `document.head`.

```bash
npm run lint          # 0 errores, avisos heredados pendientes
npm run lint:strict   # falla si queda un solo aviso
npm run build
```

`lint:strict` todavía no está en la CI a propósito: hay 62 avisos heredados y el gate se activa cuando se cierre esa deuda.

---

## Integración continua

`.github/workflows/ci.yml`, en la raíz del repositorio. Para el frontend ejecuta, en orden: `npm run lint`, `npm test` y `npm run build`. La cobertura no se mide en el frontend.

---

## Build y despliegue

**Direcciones de producción:**

| Servicio | URL |
|---|---|
| Frontend | `https://symcomputer.netlify.app` |
| Backend | `https://symcomputer-backend-production.up.railway.app` |

```bash
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
```

**Netlify** es el destino de publicación, configurado en `netlify.toml`:

1. Compila con `npm run build` y publica `dist/`.
2. Redirige `/api/*` al backend en Railway, así que en producción **no hace falta** definir `VITE_API_URL`: el proxy lo resuelve.
3. Redirige todo lo demás a `index.html` para que el enrutado del lado del cliente funcione al recargar.
4. Añade cabeceras de seguridad y cachea `/assets/*` y los SVG de forma inmutable.

Como el build ocurre en el servidor de Netlify, las variables se configuran ahí (Site settings → Environment variables), no en un `.env`.

---

## Problemas frecuentes

**P: La tienda sale vacía.**
R: El backend no está levantado o `VITE_API_URL` apunta a otro sitio. Revisa la consola del navegador: la petición a `/api/products` va al proxy de Vite, no a internet.

**P: Los enlaces de WhatsApp abren un chat con `undefined`.**
R: Falta `VITE_WHATSAPP_NUMBER` en `.env`. Recuerda reiniciar `npm run dev` después de cambiar una variable: Vite solo las lee al arrancar.

**P: `Cannot read properties of null`.**
R: Casi siempre es un campo que la API devuelve en `null` y el componente asume que existe. Es el mismo motivo por el que `SEO.jsx` normaliza sus props.

**P: Los precios se ven raros o las comparaciones fallan.**
R: `mysql2` devuelve los `DECIMAL` como texto. En el backend hay que envolver con `Number()`; en el frontend, `formatPrice` ya asume un valor utilizable.

**P: Un test falla solo al ejecutarlo con el resto.**
R: Suele ser una petición sin handler en MSW. Con `onUnhandledRequest: 'error'` la suite falla en vez de pedir red real, que es justo lo que se busca.
