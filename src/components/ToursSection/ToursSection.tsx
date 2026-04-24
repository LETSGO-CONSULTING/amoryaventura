import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, MessageCircle, Sparkles } from 'lucide-react'
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

const WHATSAPP = '+51928686294'

const PACKAGES = [
  {
    id: '2d1n',
    name: 'Escapada Verde',
    duration: '2 Días / 1 Noche',
    badge: 'Más elegido',
    badgeColor: 'bg-coral text-white',
    price: 349,
    tours: ['Tour Oxapampa', 'Tour Pozuzo'],
    schedule: [
      { day: 'Día 1', label: 'Full Day Oxapampa', time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Pozuzo', time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '2 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    highlight: 'olive',
    msg: 'Hola! Quiero información sobre el paquete *Escapada Verde (2D/1N)* para Oxapampa.',
  },
  {
    id: '3d2n',
    name: 'Exploradores',
    duration: '3 Días / 2 Noches',
    badge: 'Recomendado',
    badgeColor: 'bg-vino text-white',
    price: 449,
    tours: ['Tour Oxapampa', 'Tour Pozuzo', 'Tour Villa Rica'],
    schedule: [
      { day: 'Día 1', label: 'Full Day Oxapampa', time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Pozuzo', time: '10:30 am – 6:30 pm' },
      { day: 'Día 3', label: 'Full Day Villa Rica', time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '3 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    highlight: 'vino',
    msg: 'Hola! Quiero información sobre el paquete *Exploradores (3D/2N)* para Oxapampa.',
  },
  {
    id: '4d3n',
    name: 'Gran Aventura',
    duration: '4 Días / 3 Noches',
    badge: 'Experiencia completa',
    badgeColor: 'bg-olive text-white',
    price: 549,
    tours: ['Tour Oxapampa', 'Tour Pozuzo', 'Tour Villa Rica', 'Tour Perené'],
    schedule: [
      { day: 'Día 1', label: 'Full Day Pozuzo', time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Villa Rica', time: '10:30 am – 6:30 pm' },
      { day: 'Día 3', label: 'Full Day Perené', time: '10:30 am – 6:30 pm' },
      { day: 'Día 4', label: 'Full Day Oxapampa', time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '4 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    highlight: 'olive',
    msg: 'Hola! Quiero información sobre el paquete *Gran Aventura (4D/3N)* para Oxapampa.',
  },
]

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

  const handleWA = (msg: string) => {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <section id="tours" className="section-padding bg-sand">
        <div className="container-base">
          {/* Header */}
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

          {/* Filter chips */}
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

          {/* Tour grid */}
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

      {/* Packages section */}
      <section id="paquetes" className="section-padding bg-warm">
        <div className="container-base">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow mb-3"
            >
              Paquetes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              Nuestros Paquetes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="section-subtitle"
            >
              Todo incluido desde Lima. Elige los días que tienes y nosotros hacemos el resto.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  i === 1 ? 'ring-2 ring-vino' : ''
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1.5 w-full ${
                    pkg.highlight === 'olive' ? 'bg-olive' : 'bg-vino'
                  }`}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Badge */}
                  <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-4 flex items-center gap-1 ${pkg.badgeColor}`}>
                    <Sparkles className="w-3 h-3" />
                    {pkg.badge}
                  </span>

                  <h3 className="text-xl font-bold text-brand-dark mb-1">{pkg.name}</h3>
                  <p className="text-sm text-brand-secondary mb-5">{pkg.duration}</p>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="text-xs text-brand-secondary">Desde</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-brand-dark">S/. {pkg.price}</span>
                      <span className="text-sm text-brand-secondary">/ persona</span>
                    </div>
                  </div>

                  {/* Schedule day by day */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide mb-2">
                      Itinerario
                    </p>
                    <div className="space-y-1.5">
                      {pkg.schedule.map((s) => (
                        <div key={s.day} className="flex items-center gap-2">
                          <span className="flex-shrink-0 text-[10px] font-bold bg-coral/10 text-coral px-2 py-0.5 rounded-full">
                            {s.day}
                          </span>
                          <span className="text-xs text-brand-dark font-medium truncate">{s.label}</span>
                          <span className="text-[10px] text-brand-secondary ml-auto flex-shrink-0">{s.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Includes */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-brand-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-olive flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleWA(pkg.msg)}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg shadow-[#25D366]/20 text-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Consultar por WhatsApp
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour detail modal */}
      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
    </>
  )
}
