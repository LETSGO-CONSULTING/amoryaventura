import { Clock, Users, Star, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Tour } from '@/models'

interface Props {
  tour: Tour
  index?: number
  onClick?: () => void
}

export default function TourCard({ tour, index = 0, onClick }: Props) {
  const { t } = useTranslation()

  const badge = tour.isSocial
    ? { label: t('tours.badge_social'), className: 'bg-vino text-white' }
    : tour.isNew
    ? { label: t('tours.badge_new'), className: 'bg-olive text-white' }
    : tour.isPopular
    ? { label: t('tours.badge_popular'), className: 'bg-coral text-white' }
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className="card-base group flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video flex-shrink-0">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${badge.className}`}>
            {tour.isSocial && <Zap className="w-3 h-3" />}
            {badge.label}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
          {t('tours.from')} S/. {tour.price}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-brand-secondary mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {tour.duration}
          </span>
          <span className="text-brand-border">·</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {t('tours.group_size')} {tour.groupSize}
          </span>
          <span className="text-brand-border">·</span>
          <span>{tour.difficulty}</span>
        </div>

        <h3 className="font-bold text-brand-dark text-lg leading-snug mb-2">{tour.title}</h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(tour.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs text-brand-secondary ml-1">
            {tour.rating} ({tour.reviewCount} {t('tours.rating_reviews')})
          </span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            onClick={onClick}
            className="btn-outline text-sm py-2.5 px-4"
          >
            {t('tours.view_tour')}
          </button>
          <button
            onClick={onClick}
            className="btn-primary text-sm py-2.5 px-4"
          >
            {t('tours.reserve')}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
