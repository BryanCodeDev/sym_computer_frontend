import { motion } from 'framer-motion'
import SEO from '../components/seo/SEO'
import Hero from '../components/home/Hero'
import Categories from '../components/home/Categories'
import FeaturedProducts from '../components/home/FeaturedProducts'
import TrustSection from '../components/home/TrustSection'
import Brands from '../components/home/Brands'
import AllySection from '../components/home/Allysection'
import HowItWorks from '../components/home/HowItWorks'
import Newsletter from '../components/home/Newsletter'

export default function Home() {
  return (
    <>
      <SEO
        title="SYM COMPUTER - Tecnología que impulsa tus ideas | Partes, Equipos y Accesorios"
        description="Más de 14 años como importadores y distribuidores de tecnología: partes, equipos y accesorios de ASUS, MSI, AMD, Intel, Samsung, HP y más, con garantías reales y asesoría especializada."
        type="website"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <Categories />
        <FeaturedProducts />
        <TrustSection />
        <Brands />
        <AllySection />
        <HowItWorks />
        <Newsletter />
      </motion.div>
    </>
  )
}