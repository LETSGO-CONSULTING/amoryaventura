import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { tours } from '@/mocks/tours'
import TourCard from './TourCard'
import TourModal from './TourModal'
import PackageCard from './PackageCard'
import type { Hotel, Package } from './PackageCard'
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

const HOTELS: Hotel[] = [
  { id: 'h1',  name: 'Oxarima',          type: 'Hospedaje',      location: 'A 2 cuadras de la Plaza',    amenities: ['cochera', 'pet'],                    prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549 } },
  { id: 'h2',  name: 'Misuri',           type: 'Hospedaje',      location: 'A 3 cuadras de la Plaza',    amenities: [],                                    prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549 } },
  { id: 'h3',  name: 'Amaia',            type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: [],                                    prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549 } },
  { id: 'h4',  name: 'Panduro',          type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: [],                                    prices: { '2d1n': 379, '3d2n': 479, '4d3n': 579 } },
  { id: 'h5',  name: 'Yanachaga',        type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: ['cochera'],                           prices: { '2d1n': 379, '3d2n': 479, '4d3n': 579 } },
  { id: 'h6',  name: 'Chimi',            type: 'Hospedaje',      location: 'A 1 cuadra de la Plaza',     amenities: [],                                    prices: { '2d1n': 399, '3d2n': 499, '4d3n': 599 } },
  { id: 'h7',  name: 'Chimi House',      type: 'Hotel',          location: 'A 1.4 km de la Plaza',       amenities: ['piscina', 'cochera'],                prices: { '2d1n': 449, '3d2n': 549, '4d3n': 649 } },
  { id: 'h8',  name: 'Tunki Lodge',      type: 'Hotel',          location: 'Frente a la Plaza',          amenities: ['piscina', 'desayuno', 'pet'],        prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699 } },
  { id: 'h9',  name: "D'palo",           type: 'Cabañas',        location: 'A 4 cuadras de la Plaza',    amenities: ['piscina', 'desayuno', 'cochera'],    prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699 } },
  { id: 'h10', name: 'Esperanza',        type: 'Hotel',          location: 'A 3 cuadras de la Plaza',    amenities: ['piscina', 'desayuno', 'cochera'],    prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699 } },
  { id: 'h11', name: 'Hassinger',        type: 'Hotel',          location: 'A 1.7 km de la Plaza',       amenities: ['piscina', 'desayuno', 'cochera'],    prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749 } },
  { id: 'h12', name: 'Casa Oxapampina',  type: 'Hotel / Cabaña', location: 'A 2.7 km de la Plaza',       amenities: ['piscina', 'desayuno', 'cochera'],    prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749 } },
  { id: 'h13', name: 'Biosfera Lodge',   type: 'Hotel / Cabaña', location: 'A 2.1 km de la Plaza',       amenities: ['cochera'],                           prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749 } },
]

const PACKAGES: Package[] = [
  {
    id: '2d1n',
    name: 'Escapada Verde',
    duration: '2 Días / 1 Noche',
    badge: 'Más elegido',
    badgeColor: 'bg-coral text-white',
    highlight: 'coral',
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
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Escapada Verde (2D/1N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
  },
  {
    id: '3d2n',
    name: 'Exploradores',
    duration: '3 Días / 2 Noches',
    badge: 'Recomendado',
    badgeColor: 'bg-vino text-white',
    highlight: 'vino',
    featured: true,
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
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Exploradores (3D/2N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
  },
  {
    id: '4d3n',
    name: 'Gran Aventura',
    duration: '4 Días / 3 Noches',
    badge: 'Experiencia completa',
    badgeColor: 'bg-olive text-white',
    highlight: 'olive',
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
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Gran Aventura (4D/3N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} hotels={HOTELS} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Tour detail modal */}
      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
    </>
  )
}
