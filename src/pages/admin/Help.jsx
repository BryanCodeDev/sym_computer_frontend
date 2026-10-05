import { useState, Fragment } from 'react'
import {
  BookOpen, BarChart3, Package, Tag, ShoppingCart,
  Users, Globe, Settings, HelpCircle, DollarSign, Store, Search
} from 'lucide-react'
import SEO from '../../components/seo/SEO'

const sections = [
  {
    id: 'overview',
    title: '¿Qué es SYM COMPUTER?',
    icon: <Package className="h-4 w-4" />,
    content: `SYM COMPUTER es un sistema integral de e-commerce y punto de venta para la venta de partes, equipos y accesorios para computadores. Permite administrar el catálogo de productos, órdenes, inventario, caja registradora POS, pagos en línea, facturación electrónica y reportes de negocio.

El sistema opera con **dos canales de venta**:
- **Tienda Online**: clientes navegan, agregan al carrito y pagan vía Mercado Pago.
- **Punto de Venta (POS)**: cajeros gestionan ventas en tienda física con caja registradora, en efectivo o tarjeta POS.

**Partes principales:**
1. **Portal público**: catálogo, carrito y checkout para clientes.
2. **Panel administrativo**: dashboard, productos, categorías, órdenes, usuarios, configuración.
3. **Módulo POS**: caja registradora, búsqueda de productos, carrito, pago y recibos — accesible para admins y cashiers.`,
  },
  {
    id: 'roles',
    title: 'Roles y Permisos',
    icon: <Users className="h-4 w-4" />,
    content: `El sistema maneja **cuatro roles** con distintos niveles de acceso:

### Administrador
- Acceso total al sistema
- Gestiona productos, categorías, órdenes, usuarios y configuración
- Ve todos los reportes y estadísticas
- Puede abrir/cerrar cualquier caja del POS
- Accede al módulo POS y al manual de ayuda

### Cajero (Cashier)
- Accede exclusivamente al módulo POS en <code>/admin/caja</code>
- Abre su propia caja con monto inicial
- Procesa ventas en efectivo o tarjeta POS
- Cierra su caja al final del turno (el sistema calcula la diferencia)
- Ve reportes diarios y el historial de su caja
- NO puede acceder al resto del panel administrativo

### Cliente (User)
- Navega la tienda online, agrega al carrito y paga
- Ve su historial de pedidos y detalles
- Edita su perfil (nombre, email, teléfono, dirección)

### Manager
- Rol reservado para futuras funciones de gestión de equipo
- Acceso limitado de administración`,
  },
  {
    id: 'dashboard',
    title: 'Dashboard / Resumen',
    icon: <BarChart3 className="h-4 w-4" />,
    content: `El dashboard muestra las métricas clave del negocio en un periodo seleccionado (por defecto, últimos 30 días).

**KPIs principales:**
- **Ventas totales**: suma de todos los ingresos (online + POS)
- **Ventas de hoy**: ingresos del día actual
- **Ventas del mes**: ingresos del mes en curso
- **Pedidos totales**: cantidad de órdenes creadas
- **Pedidos pendientes**: órdenes esperando pago o confirmación
- **Productos / Usuarios**: conteo de registros activos
- **Stock bajo**: productos que han cruzado el stock mínimo

**Comparativa Online vs POS:**
- Gráfica de barras con ventas por canal
- Gráfica de métodos de pago
- Efectivo en caja del día
- Ticket promedio

**Estado de pedidos:** gráfica circular de órdenes pagadas vs pendientes.

**Productos más vendidos:** top 5 productos por ingresos.`,
  },
  {
    id: 'pos',
    title: 'Módulo POS (Caja)',
    icon: <Store className="h-4 w-4" />,
    content: `El POS es el módulo para operar la tienda física. Se accede desde <code>/admin/caja</code> y requiere rol admin o cashier.

**Flujo de una venta POS:**
1. **Abrir caja**: el cajero ingresa el monto inicial (float). Se crea un registro de caja con <code>status='open'</code>.
2. **Buscar producto**: usa la barra de búsqueda o escanea el código de barras. La cuadrícula muestra productos con stock disponible.
3. **Agregar al carrito**: cada clic suma una unidad (respetando el stock máximo).
4. **Procesar pago**: elige efectivo o tarjeta POS y completa la transacción.
5. **Recibo**: se genera y puede imprimirse.

**Métodos de pago:**
- **Efectivo**: el cajero ingresa el monto recibido; el sistema valida que cubra el total y calcula el cambio.
- **Tarjeta POS**: la venta se registra; el cobro físico se realiza en el terminal de la tienda.

**Cierre de caja:**
- El cajero ingresa el monto físico de cierre
- El sistema calcula <code>expected = apertura + ventas</code> y <code>diferencia = cierre - esperado</code>
- Se guarda el cierre y la caja queda <code>status='closed'</code>

**Nota:** las ventas POS descuentan stock transaccionalmente. Si el stock es insuficiente, la venta se rechaza y se muestra un error.`,
  },
  {
    id: 'online-store',
    title: 'Tienda Online',
    icon: <Globe className="h-4 w-4" />,
    content: `La tienda online es la tienda pública donde los clientes navegan y compran.

**Navegación:**
- Categorías y filtros (precio, marca, rating)
- Página de producto con galería de imágenes, stock y botón de agregar al carrito
- Carrito persistente (localStorage para invitados, BD para usuarios)

**Checkout:**
1. El cliente revisa su carrito
2. Ingresa datos de envío (nombre, email, teléfono, dirección, ciudad, documento)
3. El sistema calcula el costo de envío según la zona de envío configurada para la ciudad
4. Se crea la orden (<code>channel='online'</code>, <code>status='pending'</code>) dentro de una transacción
4. El cliente es redirigido a Mercado Pago para pagar
5. Al confirmar el pago, la orden pasa a <code>status='paid'</code> y se genera la factura

**Seguimiento:** el cliente ve el estado de su pedido en <code>/cuenta/pedido/:id</code>.`,
  },
  {
    id: 'products',
    title: 'Gestión de Productos',
    icon: <Package className="h-4 w-4" />,
    content: `Los productos son el núcleo del catálogo. Cada producto pertenece a una categoría y opcionalmente a una marca.

**Campos de un producto:**
- **Nombre y slug**: identificador interno y URL
- **SKU y barcode**: códigos únicos (el barcode se usa en el POS)
- **Precio**: <code>price</code> (precio de venta) y <code>original_price</code> (precio base para calcular descuentos)
- **Stock**: cantidad disponible; <code>min_stock</code> define el umbral de alerta
- **Costo** (<code>cost_price</code>): precio de adquisición (solo admin)
- **Imágenes**: galería subida a Cloudinary
- **Estado**: <code>is_active</code> (visible), <code>is_featured</code> (destacado)

**Descuentos:**
- Si <code>original_price &gt; price</code>, se muestra el porcentaje de descuento y el precio tachado
- El cálculo es automático; no se configura un porcentaje manual

**Acciones (solo admin):**
- Crear, editar y eliminar productos (borrado lógico)
- Subir y reordenar imágenes
- Establecer imagen principal

**Alertas:**
- El dashboard muestra productos con <code>stock &lt;= min_stock</code>`,
  },
  {
    id: 'categories',
    title: 'Categorías',
    icon: <Tag className="h-4 w-4" />,
    content: `Las categorías organizan los productos en grupos. Pueden ser anidadas (categorías padre e hijas).

**Campos:**
- Nombre y slug (único)
- Descripción e imagen
- Estado (activo/inactivo)

**Reglas:**
- Una categoría con productos activos no se puede eliminar (falla la operación)
- Las categorías inactivas no aparecen en la tienda pública`,
  },
  {
    id: 'orders',
    title: 'Gestión de Pedidos',
    icon: <ShoppingCart className="h-4 w-4" />,
    content: `Las órdenes representan las compras de clientes. Cada orden tiene un channel (<code>online</code> o <code>pos</code>).

### Estados de una orden
- **pending**: Recién creada, esperando pago o confirmación
- **paid**: Pago confirmado
- **preparing**: En preparación para envío
- **shipped**: Enviada
- **delivered**: Entregada al cliente
- **cancelled**: Cancelada
- **refunded**: Reembolsada

### Transacción de creación
Cuando se crea una orden (online o POS), el backend:
1. Verifica y descuenta stock de cada producto (<code>FOR UPDATE</code>)
2. Inserta la orden con número único
3. Inserta los <code>order_items</code>
4. Registra el <code>order_status_history</code>
5. Si algo falla, hace rollback de toda la transacción

### Estados de pago
- **pending**: Pago iniciado pero no confirmado
- **approved**: Pago confirmado
- **rejected**: Pago rechazado

### Panel admin
- Lista todas las órdenes con paginación y filtro por estado
- Cambia el estado de una orden (y registra quién lo hizo en el historial)
- Ve el detalle con items, historial y factura`,
  },
  {
    id: 'users',
    title: 'Gestión de Usuarios',
    icon: <Users className="h-4 w-4" />,
    content: `Los usuarios son las personas que usan el sistema.

**Roles disponibles:** admin, user, cashier, manager

**Campos:**
- Nombre, email (único), teléfono, dirección, avatar
- Estado (activo/inactivo)
- Fecha de creación y última actualización

**Acciones (solo admin):**
- Listar, buscar y filtrar usuarios
- Ver detalle de un usuario
- Cambiar el rol de un usuario (admin ↔ user ↔ cashier)
- Activar/desactivar usuarios (borrado lógico)`,
  },
  {
    id: 'payments',
    title: 'Pagos y Facturación',
    icon: <DollarSign className="h-4 w-4" />,
    content: `### Mercado Pago (online)
Cuando un cliente completa el checkout, el sistema crea una preferencia de Mercado Pago y redirige al cliente a <code>init_point</code>. El cliente paga y es redirigido de vuelta al sitio (success/pending/failure).

El webhook (<code>POST /api/payments/webhook</code>) recibe notificaciones de Mercado Pago:
- Valida la firma HMAC
- Busca el <code>payment_id</code> en la tabla <code>payments</code>
- Actualiza <code>orders.payment_status</code> y <code>order_status_history</code>

El frontend sondea <code>GET /api/payments/status/:orderId</code> para mostrar el estado actual.

### Facturación electrónica (Factus)
Cuando una orden se paga (<code>payment_status='approved'</code>), el sistema llama <code>triggerInvoiceGeneration(orderId)</code>:
1. Obtiene tokens OAuth de Factus
2. Construye el payload con los items, IVA (19%), y datos del cliente
3. Si el cliente no tiene NIT, usa el NIT de la tienda
4. Si hay error, registra <code>invoices.status='error'</code> con el mensaje — la venta no se cancela

### POS
- **Efectivo (contra entrega)**: el cajero ingresa el monto recibido; el cambio se calcula y guarda en <code>notes</code>
- **Tarjeta (Wompi)**: la venta se registra como <code>payment_method='wompi'</code> y el cobro se procesa vía API de Wompi; el estado inicial es <code>pending</code> y pasa a <code>approved</code> al confirmarse el pago vía webhook`,
  },
  {
    id: 'settings',
    title: 'Configuración del Sitio',
    icon: <Settings className="h-4 w-4" />,
    content: `La configuración permite definir los datos del negocio y el entorno.

**Campos configurables (admin):**
- Nombre, dirección, teléfono, WhatsApp, email, redes sociales (Instagram, Facebook, TikTok, YouTube)
- Logo del sitio (subido a Cloudinary)
- Zonas de envío: costo por ciudad (ej: Mosquera = $0, Madrid = $5.000)
- Variables de entorno (backend .env): DB, JWT, Cloudinary, Wompi, Factus, email

**Cómo acceder:**
Solo administradores pueden acceder a la configuración desde el dashboard, botón "Configuración".

**Efecto:** los cambios (nombre, logo, redes) se reflejan inmediatamente en la tienda pública.`,
  },
  {
    id: 'faq',
    title: 'Preguntas Frecuentes',
    icon: <HelpCircle className="h-4 w-4" />,
    content: `**P: ¿Cómo abro la caja del POS?**
R: Desde el dashboard o el sidebar, ve a Caja (<code>/admin/caja</code>). Si no hay caja abierta, el sistema abre el modal automáticamente. Ingresa el monto inicial y confirma.

**P: ¿Puedo un cajero acceder al panel completo?**
R: No. El cajero (rol cashier) solo accede a <code>/admin/caja</code>. Si intenta entrar a otras rutas de <code>/admin</code>, es redirigido a la página principal.

**P: ¿Qué pasa si cierro la caja con menos dinero del esperado?**
R: El sistema calcula la diferencia (<code>difference = cierre - esperado</code>) y la muestra en el reporte de cajas. Si hay faltante, se registra como valor negativo.

**P: ¿Cómo escaneó un código de barras?**
R: En la pantalla de Caja, escribe o escanea el código de barras en el campo superior. Si el código coincide con un producto, se agrega al carrito. Los escáneres USB funcionan como teclado.

**P: ¿Se puede vender sin abrir caja?**
R: No. El endpoint <code>POST /api/pos/sale</code> verifica que exista una caja abierta para el usuario. Si no, responde con error 400.

**P: ¿Cómo imprimo un recibo?**
R: Después de completar una venta, haz clic en "Imprimir" en la pantalla del recibo. También puedes acceder al recibo desde <code>GET /api/pos/sale/:id/receipt</code>.

**P: ¿Cómo veo los reportes del POS?**
R: Los administradores ven un botón "Reportes" en la pantalla de Caja. Los cajeros ven reportes diarios. Los reportes incluyen: ventas por canal, métodos de pago, cajas recientes y efectivo del día.

**P: ¿Qué pasa si la factura de Factus falla?**
R: El error se guarda en <code>invoices.status='error'</code> con el mensaje. La venta se completa normalmente; puedes reintentar la facturación más tarde.

**P: ¿Cómo cambio el rol de un usuario?**
R: Solo el admin puede hacerlo. Desde <code>/admin/usuarios</code>, abre el menú de un usuario y selecciona "Cambiar rol".

**P: ¿Puedo eliminar un producto con ventas?**
R: Sí, pero se hace un borrado lógico (<code>deleted_at</code>). El producto desaparece de la tienda pero sus órdenes e históricos se conservan.`,
  },
]

const parseInlineBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2)
      if (inner.startsWith('<code>') && inner.endsWith('</code>')) {
        return <code key={i} className="font-mono bg-charcoal-600/10 text-charcoal-800 px-1.5 py-0.5 rounded text-[0.8em]">{inner.slice(6, -6)}</code>
      }
      return <strong key={i} className="font-semibold text-primary-900">{inner}</strong>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

const renderMarkdown = (content) => {
  const lines = content.split('\n')
  const blocks = []
  let listBuffer = []
  let listType = null

  const flushList = () => {
    if (listBuffer.length === 0) return
    const Tag = listType === 'ol' ? 'ol' : 'ul'
    blocks.push(
      <Tag key={`list-${blocks.length}`} className={`${listType === 'ol' ? 'list-decimal' : 'list-disc'} pl-5 space-y-1 my-3 text-primary-900/70`}>
        {listBuffer.map((item, i) => <li key={i}>{parseInlineBold(item)}</li>)}
      </Tag>
    )
    listBuffer = []
    listType = null
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('### ')) {
      flushList()
      blocks.push(<h4 key={idx} className="font-display text-lg text-primary-900 mt-5 mb-2 first:mt-0">{trimmed.slice(4)}</h4>)
      return
    }
    const numberedMatch = trimmed.match(/^(\d+)\.\s(.*)/)
    if (numberedMatch) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'
      listBuffer.push(numberedMatch[2])
      return
    }
    if (trimmed.startsWith('- ')) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'
      listBuffer.push(trimmed.slice(2))
      return
    }
    if (trimmed === '') {
      flushList()
      return
    }
    flushList()
    blocks.push(<p key={idx} className="mb-2.5 leading-relaxed text-primary-900/80">{parseInlineBold(trimmed)}</p>)
  })
  flushList()
  return blocks
}

const Help = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeContent = sections.find((s) => s.id === activeSection)

  return (
    <>
      <SEO
        title="Ayuda | SYM COMPUTER Admin"
        description="Manual del sistema SYM COMPUTER: roles, POS, tienda online, pagos y configuración."
        noindex
      />

      <div className="space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Guía del Sistema</h2>
            <p className="text-sm text-primary-700 mt-1">
              Manual de uso de SYM COMPUTER: roles, POS, tienda online y administración
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500" />
            <input
              type="text"
              placeholder="Buscar en el manual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 border border-dark-border rounded-xl text-sm bg-white focus:ring-2 focus:ring-charcoal-300/40 focus:border-charcoal-400 outline-none transition-all duration-200 text-primary-900 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-0">
          <div className="lg:col-span-1 min-w-0">
            <div className="bg-white border border-dark-border rounded-2xl shadow-card p-3 sm:p-4 lg:sticky lg:top-6 min-w-0">
              <nav className="space-y-1">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-charcoal-600/10 text-charcoal-700 shadow-sm'
                        : 'text-primary-900/70 hover:text-primary-900 hover:bg-charcoal-50/50'
                    }`}
                  >
                    <span className="flex-shrink-0">{section.icon}</span>
                    <span className="truncate text-left">{section.title}</span>
                  </button>
                ))}
              </nav>
              {filteredSections.length === 0 && (
                <p className="text-sm text-primary-900/40 text-center py-4">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 min-w-0">
            <div className="bg-white border border-dark-border rounded-2xl shadow-card p-5 sm:p-8 min-w-0">
              {activeContent && (
                <div className="prose prose-sm max-w-none min-w-0">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-charcoal-600">{sectionIcon(activeContent.id)}</span>
                    <h3 className="font-display text-2xl text-primary-900 m-0">
                      {activeContent.title}
                    </h3>
                  </div>
                  <div className="text-sm">
                    {renderMarkdown(activeContent.content)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function sectionIcon(id) {
  const icons = {
    overview: <Package className="h-8 w-8" />,
    roles: <Users className="h-8 w-8" />,
    dashboard: <BarChart3 className="h-8 w-8" />,
    pos: <Store className="h-8 w-8" />,
    'online-store': <Globe className="h-8 w-8" />,
    products: <Package className="h-8 w-8" />,
    categories: <Tag className="h-8 w-8" />,
    orders: <ShoppingCart className="h-8 w-8" />,
    users: <Users className="h-8 w-8" />,
    payments: <DollarSign className="h-8 w-8" />,
    settings: <Settings className="h-8 w-8" />,
    faq: <HelpCircle className="h-8 w-8" />,
  }
  return icons[id] || <BookOpen className="h-8 w-8" />
}

export default Help
