import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { products } from '@/mocks/products'
import ProductCard from './ProductCard'
import type { ProductCategory } from '@/models'

const CATEGORIES: ProductCategory[] = ['Todos', 'Café', 'Miel', 'Chocolates', 'Artesanías', 'Textiles', 'Gourmet']

export default function ShopSection() {
  const { t } = useTranslation()
  const [active, setActive] = useState<ProductCategory>('Todos')

  const filtered = active === 'Todos' ? products : products.filter((p) => p.category === active)

  return (
    <section id="tienda" className="section-padding bg-sand">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-3"
          >
            {t('shop.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            {t('shop.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            {t('shop.subtitle')}
          </motion.p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 scrollbar-hide overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                active === cat
                  ? 'bg-coral text-white shadow-md shadow-coral/30'
                  : 'bg-white text-brand-secondary border border-brand-border hover:border-coral hover:text-coral'
              }`}
            >
              {cat === 'Todos' ? t('shop.filter_all') : cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="btn-primary">{t('shop.view_all')}</button>
        </div>
      </div>
    </section>
  )
}
