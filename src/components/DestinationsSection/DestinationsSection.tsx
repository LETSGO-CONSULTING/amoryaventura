import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { destinations } from '@/mocks/destinations'

export default function DestinationsSection() {
  const { t } = useTranslation()

  return (
    <section id="destinos" className="section-padding bg-warm">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-3"
          >
            {t('destinations.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            {t('destinations.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            {t('destinations.subtitle')}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                i === 0 ? 'sm:col-span-2 lg:col-span-1 aspect-[3/2] lg:aspect-[4/5]' : 'aspect-[4/3]'
              }`}
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tours badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {dest.toursCount} tours
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{dest.region}</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-3 leading-tight">{dest.name}</h3>
                <div className="flex items-center gap-2 text-coral text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>{t('destinations.explore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button className="btn-outline">
            {t('destinations.view_all')}
          </button>
        </div>
      </div>
    </section>
  )
}
