import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2, ArrowLeft, MessageSquare } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice, getWhatsAppUrlForCart } from '../utils/helpers'
import SEO from '../components/seo/SEO'
import RemoveItemDialog from '../components/cart/RemoveItemDialog'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, total, subtotal, discount, itemCount, updateQuantity, removeItem, clearCart, loading } = useCart()
  const [itemToRemove, setItemToRemove] = useState(null)
  const navigate = useNavigate()

  const handleConfirmRemove = async () => {
    if (!itemToRemove) return
    await removeItem(itemToRemove.productId)
    toast.success(`"${itemToRemove.name}" se eliminó del carrito`)
    setItemToRemove(null)
  }

  const handleClearCart = async () => {
    await clearCart()
    toast.success('Carrito vaciado')
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  const handleWhatsApp = () => {
    if (items.length === 0) return
    window.open(getWhatsAppUrlForCart(items, total), '_blank')
  }

  return (
    <>
      <SEO
        title="Carrito de compras | SYM COMPUTER"
        description="Revisa tu carrito de compras y finaliza tu pedido de forma segura."
        noindex
      />

      <div className="min-h-screen bg-cream pt-20">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-primary-900">Carrito de compras</h1>
            <p className="text-primary-900/60 mt-2">{itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito</p>
          </motion.div>

          {loading ? (
            <div className="space-y-4" role="list" aria-busy="true">
              {[...Array(3)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="skeleton h-32 rounded-xl" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white border border-charcoal-100 flex items-center justify-center mb-6">
                <svg className="w-9 h-9 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4m0 0h14m-5 5v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1m14-5l-3.5-3.5a2 2 0 00-2.828 0L8 11m7 0l-3.5 3.5a2 2 0 01-2.828 0"/></svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-primary-900 mb-2">Tu carrito está vacío</h2>
              <p className="text-primary-900/60 mb-8 max-w-md">Aún no has agregado ningún producto. ¡Empieza a explorar nuestra tienda!</p>
              <Link to="/tienda" className="btn-primary inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Continuar comprando
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white border border-charcoal-100 shadow-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]" role="table">
                        <thead>
                          <tr className="border-b border-charcoal-100 bg-charcoal-50/40">
                            <th className="px-4 py-3 text-left text-sm font-medium text-primary-900/70">Producto</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-primary-900/70 hidden sm:table-cell">Precio</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-primary-900/70">Cantidad</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-primary-900/70">Subtotal</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-primary-900"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <motion.tr
                              key={`${item.productId}-${index}`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="border-b border-charcoal-100 hover:bg-charcoal-50/40"
                            >
                              <td className="px-4 py-3">
                                <Link to={`/producto/${item.slug}`} className="flex items-center gap-3">
                                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-primary-100 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-primary-900 truncate">{item.name}</p>
                                    <p className="text-primary-900/50 text-sm">{item.sku}</p>
                                    {item.discountPrice && item.price > item.discountPrice && (
                                      <p className="text-charcoal-600 text-sm font-medium">Ahorras {formatPrice((item.price - item.discountPrice) * item.quantity)}</p>
                                    )}
                                  </div>
                                </Link>
                              </td>
                              <td className="px-4 py-3 text-center hidden sm:table-cell">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="font-medium text-primary-900">{formatPrice(item.discountPrice || item.price)}</span>
                                  {item.discountPrice && item.price > item.discountPrice && (
                                    <span className="text-primary-900 line-through text-sm">{formatPrice(item.price)}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="w-9 h-9 rounded-lg bg-charcoal-50 border border-charcoal-200 flex items-center justify-center text-primary-900 hover:border-charcoal-600 hover:text-charcoal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Disminuir cantidad"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const val = Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1))
                                      updateQuantity(item.productId, val)
                                    }}
                                    min="1"
                                    max={item.stock}
                                    className="w-14 text-center bg-charcoal-50 border border-charcoal-200 rounded-lg text-primary-900 focus:outline-none focus:border-charcoal-500"
                                    aria-label="Cantidad"
                                  />
                                  <button
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                    className="w-9 h-9 rounded-lg bg-charcoal-50 border border-charcoal-200 flex items-center justify-center text-primary-900 hover:border-charcoal-600 hover:text-charcoal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Aumentar cantidad"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-primary-900">
                                {formatPrice((item.discountPrice || item.price) * item.quantity)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => setItemToRemove(item)}
                                  className="p-2 text-primary-900 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label={`Eliminar ${item.name}`}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {items.length > 0 && (
                      <div className="p-6 border-t border-charcoal-100 flex justify-end">
                        <button
                          onClick={handleClearCart}
                          className="text-primary-900 hover:text-charcoal-600 text-sm font-medium transition-colors"
                        >
                          Vaciar carrito
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <Link to="/tienda" className="btn-secondary w-full sm:w-auto">
                      <ArrowLeft className="w-5 h-5" />
                      Seguir comprando
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="sticky top-24 bg-white border border-charcoal-100 shadow-card rounded-2xl p-4 sm:p-6"
                  >
                    <h2 className="font-display font-semibold text-xl text-primary-900 mb-6">Resumen del pedido</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-primary-900/60">Subtotal ({itemCount} items)</span>
                        <span className="text-primary-900/80">{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-charcoal-600 font-medium">
                          <span>Descuento</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-primary-900/60 border-t border-charcoal-100 pt-3">
                        <span>Envío</span>
                        <span>Calcular en checkout</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xl font-bold mb-6 border-t border-charcoal-100 pt-4">
                      <span className="text-primary-900">Total</span>
                      <span className="text-charcoal-600">{formatPrice(total)}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={items.length === 0}
                      className="btn-primary w-full py-4 text-lg mb-3"
                    >
                      Ir al checkout
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="btn-whatsapp w-full py-4 text-lg gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Comprar por WhatsApp</span>
                    </button>

                    <div className="mt-6 pt-6 border-t border-charcoal-100 space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-primary-900/70">
                        <svg className="w-5 h-5 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Pago seguro con Mercado Pago</span>
                      </div>
                      <div className="flex items-center gap-3 text-primary-900/70">
                        <svg className="w-5 h-5 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Envíos a todo el país</span>
                      </div>
                      <div className="flex items-center gap-3 text-primary-900/70">
                        <svg className="w-5 h-5 text-charcoal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>Garantía oficial en todos los productos</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <RemoveItemDialog
        item={itemToRemove}
        onCancel={() => setItemToRemove(null)}
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}