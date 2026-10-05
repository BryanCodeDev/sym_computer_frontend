import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../products/ProductCard'
import { productService } from '../../services/products'

export default function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getFeatured(12)
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-neutral-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-24 bg-neutral-100" aria-labelledby="featured-title">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-l-4 border-[#971111] pl-5"
          >
            <h2 id="featured-title" className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              Productos destacados
            </h2>
            <p className="text-neutral-600 mt-2">Lo más buscado en tecnología, con garantía y respaldo.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Link
              to="/tienda"
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-black hover:bg-[#971111] text-white font-semibold px-6 py-3 transition-colors"
            >
              Ver todo el catálogo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: Math.min(index, 4) * 0.05 }}
              role="listitem"
            >
              <ProductCard product={product} variant="featured" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}