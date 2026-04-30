import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { tours } from '@/mocks/tours'
import TourCard from './TourCard'
import TourModal from './TourModal'
import type { Tour, TourCategory } from '@/models'

const CATEGORIES: TourCategory[] = ['Todos', 'Full Day', 'Fin de Semana', 'Aventura', 'Cultural', 'Social']

const I18N_KEYS: Record<TourCategory, string> = {
  Todos: 'tours.filter_all',
  'Full Day': 'tours.filter_fullday',
  'Fin de Semana': 'tours.filter_weekend',
  Aventura: 'tours.filter_adventure',
  Cultural: 'tours.filter_cultural',
  Social: 'tours.filter_social',
}

export default function ToursSection() {
  const { t } = useTranslation()
  const [active, setActive] = useState<TourCategory>('Todos')
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)

  const filtered =
    active === 'Todos'
      ? tours
      : active === 'Social'
      ? tours.filter((t) => t.isSocial)
      : tours.filter((t) => t.category === active)

  return (
    <>
      <section id="tours" className="section-padding bg-sand">
        <div className="container-base">
          <div className="text-center mb-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow mb-3"
            >
              {t('tours.eyebrow')}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              {t('tours.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="section-subtitle"
            >
              {t('tours.subtitle')}
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat
                    ? 'bg-coral text-white shadow-md shadow-coral/30'
                    : 'bg-white text-brand-secondary border border-brand-border hover:border-coral hover:text-coral'
                }`}
              >
                {t(I18N_KEYS[cat])}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((tour, i) => (
              <TourCard
                key={tour.id}
                tour={tour}
                index={i}
                onClick={() => setSelectedTour(tour)}
              />
            ))}
          </div>
        </div>
      </section>

      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
    </>
  )
}
