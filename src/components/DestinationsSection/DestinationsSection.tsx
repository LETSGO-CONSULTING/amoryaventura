import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { destinations } from '@/mocks/destinations'

const ZONES = [
  { id: 'Oxapampa', label: 'Oxapampa', status: 'active' as const },
  { id: 'Tarapoto', label: 'Tarapoto', status: 'coming_soon' as const },
  { id: 'Pucallpa', label: 'Pucallpa', status: 'coming_soon' as const },
]

export default function DestinationsSection() {
  const { t } = useTranslation()
  const [activeZone, setActiveZone] = useState('Oxapampa')

  const isComingSoon = ZONES.find((z) => z.id === activeZone)?.status === 'coming_soon'
  const filtered = destinations.filter((d) => d.zone === activeZone)

  return (
    <section id="destinos" className="section-padding bg-warm">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-10">
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
            Descubre los destinos que operamos hoy y los que vienen pronto.
          </motion.p>
        </div>

        {/* Zone filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {ZONES.map((zone) => {
            const isActive = activeZone === zone.id
            const isSoon = zone.status === 'coming_soon'
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-coral text-white shadow-md shadow-coral/30'
                    : 'bg-white text-brand-secondary border border-brand-border hover:border-coral hover:text-coral'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {zone.label}
                {isSoon && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-olive/15 text-olive'
                    }`}
                  >
                    Pronto
                  </span>
                )}
              </button>
            )
          })}
        </motion.div>

        {/* Coming soon overlay */}
        <AnimatePresence mode="wait">
          {isComingSoon ? (
            <motion.div
              key="coming-soon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl"
            >
              {/* Background image blurred */}
              <div className="relative h-72 md:h-96">
                <img
                  src={filtered[0]?.image}
                  alt={activeZone}
                  className="w-full h-full object-cover brightness-50 blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-8 max-w-md"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-coral" />
                      <span className="text-coral font-bold text-sm tracking-widest uppercase">Próximamente</span>
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-2">{activeZone}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-5">
                      {filtered[0]?.description ?? 'Muy pronto operaremos en este destino.'}
                    </p>
                    <a
                      href={`https://wa.me/51928686294?text=${encodeURIComponent(`Hola! Me interesa saber cuándo habrá tours a *${activeZone}*. ¿Cuándo empiezan?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
                    >
                      Avísame cuando esté disponible
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeZone}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                    i === 0 ? 'sm:col-span-2 aspect-[3/2]' : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {dest.toursCount} {dest.toursCount === 1 ? 'tour' : 'tours'}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{dest.region}</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-1 leading-tight">{dest.name}</h3>
                    <p className="text-white/60 text-xs leading-snug line-clamp-2 mb-3">{dest.description}</p>
                    <div className="flex items-center gap-2 text-coral text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>{t('destinations.explore')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
