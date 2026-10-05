import { motion } from 'framer-motion'
import { X, Printer, ShoppingCart, Package } from 'lucide-react'
import { formatPrice, formatDateTime, getImageUrl, getProductImage } from '../../utils/helpers'

export default function ReceiptView({ receipt, onNewSale, onPrint }) {
  if (!receipt) return null

  const { business, order, items, invoice } = receipt

  const getPaymentLabel = (method) => {
    switch (method) {
    case 'cash': return 'Efectivo (contra entrega)'
    case 'wompi': return 'Tarjeta (Wompi)'
      case 'mercadopago': return 'Mercado Pago'
      default: return method
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewSale}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Nueva venta
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPrint}
            className="btn-primary flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </motion.button>
        </div>

        <div className="bg-white border border-charcoal-100 shadow-card rounded-2xl overflow-hidden" id="receipt-to-print">
          <div className="bg-primary-900 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-2xl mb-1">
                  {business?.name || 'SYM COMPUTER'}
                </h1>
                <p className="text-primary-200">{business?.website || ''}</p>
                <p className="text-primary-200">Tel: {business?.phone || 'N/A'}</p>
              </div>
              <div className="text-right text-sm text-primary-200">
                <p>{formatDateTime(order?.createdAt)}</p>
                <p className="mt-1">Factura #{order?.orderNumber || order?.id}</p>
                {order?.paymentMethod && (
                  <p className="mt-1">Pago: {getPaymentLabel(order.paymentMethod)}</p>
                )}
              </div>
            </div>
          </div>

          {order?.customerName && (
            <div className="p-6 border-b border-charcoal-100">
              <h3 className="font-medium text-sm text-primary-900/70 mb-1">Cliente</h3>
              <p className="font-semibold text-primary-900">{order.customerName}</p>
              {order.customerDocumentType && order.customerDocumentNumber && (
                <p className="text-sm text-primary-900/60">
                  {order.customerDocumentType} {order.customerDocumentNumber}
                </p>
              )}
            </div>
          )}

          <div className="p-6 border-b border-charcoal-100">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-primary-100 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-8 h-8 text-charcoal-400 m-2" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-primary-900">{item.productName}</p>
                    <p className="text-xs text-primary-900/60">SKU: {item.sku}</p>
                    <p className="text-xs text-primary-900/60">
                      {item.unitPrice ? formatPrice(item.unitPrice) : ''} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary-900">{formatPrice(item.subtotal)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary-900/70">Subtotal</span>
              <span className="text-primary-900/90">{formatPrice(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-primary-900/70">Descuento</span>
                <span className="text-charcoal-600">-{formatPrice(order.discount)}</span>
              </div>
            )}

            {order.shippingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-primary-900/70">Envío</span>
                <span className="text-primary-900/90">{formatPrice(order.shippingCost)}</span>
              </div>
            )}

            {order.cashReceived !== null && order.cashReceived !== undefined && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-900/70">Efectivo recibido</span>
                  <span className="text-primary-900/90">{formatPrice(order.cashReceived)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-900/70">Cambio</span>
                  <span className="text-primary-900/90">{formatPrice(order.change)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-2xl font-bold pt-3 border-t border-charcoal-100">
              <span className="text-primary-900">TOTAL</span>
              <span className="text-charcoal-600">{formatPrice(order.total)}</span>
            </div>
          </div>

          {invoice && (
            <div className="p-6 border-t border-charcoal-100 bg-charcoal-50/30">
              <h3 className="font-medium text-sm text-primary-900/70 mb-2">Factura Electrónica</h3>
              <p className="text-sm text-primary-900">
                <span className="text-primary-900/60">Número:</span> {invoice.invoiceNumber || invoice.id}
              </p>
              {invoice.factusId && (
                <p className="text-sm text-primary-900">
                  <span className="text-primary-900/60">ID Factus:</span> {invoice.factusId}
                </p>
              )}
              {invoice.cufe && (
                <p className="text-sm text-primary-900">
                  <span className="text-primary-900/60">CUFE:</span> {invoice.cufe}
                </p>
              )}
              {invoice.pdfUrl && (
                <a
                  href={invoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline inline-block mt-2"
                >
                  Ver factura PDF
                </a>
              )}
              {invoice.errorMessage && (
                <p className="text-sm text-red-600 mt-2">
                  <span className="font-medium">Nota:</span> {invoice.errorMessage}
                </p>
              )}
            </div>
          )}

          <div className="bg-charcoal-50 text-center py-4 border-t border-charcoal-100">
            <p className="text-sm text-primary-900/70">¡Gracias por su compra!</p>
            <p className="text-xs text-primary-900/50 mt-1">Producto de alta calidad para tu mascota</p>
          </div>
        </div>
      </div>
    </div>
  )
}
