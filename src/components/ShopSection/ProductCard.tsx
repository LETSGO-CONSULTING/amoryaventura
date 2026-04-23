import { useState } from 'react'
import { Star, ShoppingCart, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/models'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { t } = useTranslation()
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="card-base group flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-olive text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {t('shop.new')}
            </span>
          )}
          {discount && (
            <span className="bg-coral text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-brand-secondary mb-1">
          {t('shop.from_region')} {product.region}
        </p>
        <h3 className="font-semibold text-brand-dark text-sm leading-snug mb-2 flex-1">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs text-brand-secondary ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-brand-dark">S/. {product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-brand-secondary line-through">S/. {product.originalPrice}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            added
              ? 'bg-olive text-white'
              : 'bg-sand hover:bg-coral hover:text-white text-brand-dark border border-brand-border hover:border-coral'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              {t('shop.added')}
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {t('shop.add_cart')}
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
