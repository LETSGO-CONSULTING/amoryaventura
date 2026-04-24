import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { destinations } from '@/mocks/destinations'
import { attractions } from '@/mocks/attractions'
import type { AttractionZone } from '@/models'

const ZONES = [
  { id: 'Oxapampa', label: 'Oxapampa', status: 'active' as const },
  { id: 'Tarapoto', label: 'Tarapoto', status: 'coming_soon' as const },
  { id: 'Pucallpa', label: 'Pucallpa', status: 'coming_soon' as const },
]

const SUB_ZONES: AttractionZone[] = ['Todos', 'Oxapampa', 'Pozuzo', 'Villa Rica', 'Perené']

const TAG_COLORS: Record<string, string> = {
  Catarata:    'bg-blue-500/20 text-blue-200',
  Laguna:      'bg-cyan-500/20 text-cyan-200',
  Río:         'bg-sky-500/20 text-sky-200',
  Cultura:     'bg-amber-500/20 text-amber-200',
  Historia:    'bg-orange-500/20 text-orange-200',
  Naturaleza:  'bg-green-500/20 text-green-200',
  Pueblo:      'bg-rose-500/20 text-rose-200',
  Ícono:       'bg-coral/20 text-coral',
  Gastronomía: 'bg-yellow-500/20 text-yellow-200',
  Café:        'bg-amber-700/20 text-amber-300',
}

export default function DestinationsSection() {
  const { t } = useTranslation()
  const [activeZone, setActiveZone] = useState('Oxapampa')
  const [activeSub, setActiveSub] = useState<AttractionZone>('Todos')

  const isComingSoon = ZONES.find((z) => z.id === activeZone)?.status === 'coming_soon'
  const comingSoonDest = destinations.find((d) => d.zone === activeZone)

  const filteredAttractions = activeSub === 'Todos'
    ? attractions
    : attractions.filter((a) => a.zone === activeSub)

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

        {/* Content */}
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
              <div className="relative h-72 md:h-96">
                <img
                  src={comingSoonDest?.image}
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
                      {comingSoonDest?.description ?? 'Muy pronto operaremos en este destino.'}
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
              key="oxapampa-attractions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Sub-zone filter */}
              <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {SUB_ZONES.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSub(sub)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeSub === sub
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'bg-white text-brand-secondary border border-brand-border hover:border-brand-dark hover:text-brand-dark'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Attractions grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSub}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {filteredAttractions.map((attraction, i) => (
                    <motion.div
                      key={attraction.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                    >
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Tag */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TAG_COLORS[attraction.tag] ?? 'bg-white/20 text-white'}`}>
                          {attraction.tag}
                        </span>
                      </div>

                      {/* Sub-zone badge (only when showing Todos) */}
                      {activeSub === 'Todos' && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/80 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {attraction.zone}
                          </span>
                        </div>
                      )}

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white text-base font-bold leading-tight mb-1">
                          {attraction.name}
                        </h3>
                        <p className="text-white/60 text-xs leading-snug line-clamp-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          {attraction.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
