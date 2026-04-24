import { useEffect, useState } from 'react'
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
  const [activeFilters, setActiveFilters] = useState<Array<keyof typeof AMENITY_CONFIG>>([])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) setActiveFilters([])
    return () => { document.body.style.overflow = '' }
  }, [open])

  const toggleFilter = (key: keyof typeof AMENITY_CONFIG) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  const filteredHotels = activeFilters.length === 0
    ? hotels
    : hotels.filter((h) => activeFilters.every((f) => h.amenities.includes(f)))

  const handlePick = (hotel: Hotel) => {
    onSelect(hotel)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden"
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
                className="w-9 h-9 rounded-full bg-sand hover:bg-brand-border flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-brand-secondary" />
              </button>
            </div>

            {/* Filter chips */}
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-sand border-b border-brand-border flex-wrap">
              <span className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wide mr-1">Filtrar:</span>
              {(Object.entries(AMENITY_CONFIG) as Array<[keyof typeof AMENITY_CONFIG, typeof AMENITY_CONFIG[keyof typeof AMENITY_CONFIG]]>).map(([key, { icon: Icon, label, color }]) => {
                const active = activeFilters.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleFilter(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      active
                        ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                        : 'bg-white text-brand-secondary border-brand-border hover:border-brand-dark hover:text-brand-dark'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : color}`} />
                    {label}
                  </button>
                )
              })}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-[10px] text-coral underline ml-1"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Hotel list — scrollable */}
            <div className="flex-1 overflow-y-auto">
              {filteredHotels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-secondary">
                  <p className="text-sm font-medium">Sin alojamientos con esos servicios</p>
                  <button onClick={() => setActiveFilters([])} className="text-xs text-coral underline mt-2">
                    Limpiar filtros
                  </button>
                </div>
              )}
              {(['Hospedaje', 'Hotel', 'Cabañas', 'Hotel / Cabaña'] as const).map((type) => {
                const group = filteredHotels.filter((h) => h.type === type)
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
                            className={`w-full text-left rounded-2xl px-4 py-3 border-2 transition-all duration-150 ${
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
                                <div className="flex items-center gap-3 mt-1.5">
                                  {(Object.keys(AMENITY_CONFIG) as Array<keyof typeof AMENITY_CONFIG>).map((key) => {
                                    const { icon: Icon, label, color } = AMENITY_CONFIG[key]
                                    const has = hotel.amenities.includes(key)
                                    return (
                                      <span key={key} title={label} className={has ? color : 'text-brand-border'}>
                                        <Icon className="w-4 h-4" />
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
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
              <button onClick={onClose} className="btn-primary text-sm px-6 py-2.5">
                Confirmar · S/. {selected.prices[pkgId]}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
