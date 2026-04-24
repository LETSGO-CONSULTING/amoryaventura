import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Waves, Coffee, Car, PawPrint, CheckCircle2 } from 'lucide-react'
import type { Hotel } from './PackageCard'

const AMENITY_CONFIG = {
  piscina: { icon: Waves, label: 'Piscina', color: 'text-blue-400' },
  desayuno: { icon: Coffee, label: 'Desayuno', color: 'text-amber-500' },
  cochera: { icon: Car, label: 'Cochera', color: 'text-slate-500' },
  pet: { icon: PawPrint, label: 'Pet Friendly', color: 'text-olive' },
} as const

interface Props {
  open: boolean
  pkgId: string
  pkgName: string
  hotels: Hotel[]
  selected: Hotel
  onSelect: (hotel: Hotel) => void
  onClose: () => void
}

export default function HotelSelectorModal({
  open, pkgId, pkgName, hotels, selected, onSelect, onClose,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handlePick = (hotel: Hotel) => {
    onSelect(hotel)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-8 md:bottom-8 md:w-full md:max-w-2xl z-50 flex flex-col bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <p className="text-xs text-coral font-semibold uppercase tracking-widest mb-0.5">
                  {pkgName}
                </p>
                <h2 className="text-lg font-bold text-brand-dark">
                  Elige tu alojamiento
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-sand hover:bg-brand-border flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-brand-secondary" />
              </button>
            </div>

            {/* Legend */}
            <div className="flex-shrink-0 flex items-center gap-4 px-6 py-3 bg-sand border-b border-brand-border text-xs text-brand-secondary flex-wrap">
              {Object.entries(AMENITY_CONFIG).map(([key, { icon: Icon, label, color }]) => (
                <span key={key} className="flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </span>
              ))}
            </div>

            {/* Hotel list */}
            <div className="flex-1 overflow-y-auto">
              {/* Type groups */}
              {(['Hospedaje', 'Hotel', 'Cabañas', 'Hotel / Cabaña'] as const).map((type) => {
                const group = hotels.filter((h) => h.type === type)
                if (!group.length) return null
                return (
                  <div key={type}>
                    <div className="px-6 pt-4 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
                        {type}
                      </span>
                    </div>
                    <div className="px-3 space-y-1 pb-2">
                      {group.map((hotel) => {
                        const isSelected = hotel.id === selected.id
                        const price = hotel.prices[pkgId]
                        return (
                          <motion.button
                            key={hotel.id}
                            onClick={() => handlePick(hotel)}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left rounded-2xl px-4 py-3.5 border-2 transition-all duration-150 ${
                              isSelected
                                ? 'border-coral bg-coral/5'
                                : 'border-transparent hover:border-brand-border bg-sand hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-coral flex-shrink-0" />}
                                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-coral' : 'text-brand-dark'}`}>
                                    {hotel.name}
                                  </p>
                                </div>
                                <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  {hotel.location}
                                </p>

                                {/* Amenity icons */}
                                <div className="flex items-center gap-3 mt-2">
                                  {(Object.keys(AMENITY_CONFIG) as Array<keyof typeof AMENITY_CONFIG>).map((key) => {
                                    const { icon: Icon, label, color } = AMENITY_CONFIG[key]
                                    const has = hotel.amenities.includes(key)
                                    return (
                                      <span
                                        key={key}
                                        title={label}
                                        className={has ? color : 'text-brand-border'}
                                      >
                                        <Icon className="w-4 h-4" />
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="flex-shrink-0 text-right">
                                <p className={`text-xl font-bold ${isSelected ? 'text-coral' : 'text-brand-dark'}`}>
                                  S/. {price}
                                </p>
                                <p className="text-[10px] text-brand-secondary">/ persona</p>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="h-4" />
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-brand-border bg-white px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-brand-secondary">Seleccionado</p>
                <p className="text-sm font-bold text-brand-dark">{selected.name}</p>
              </div>
              <button
                onClick={onClose}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Confirmar · S/. {selected.prices[pkgId]}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
