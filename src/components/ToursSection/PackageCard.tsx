import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle, Sparkles, Waves, Coffee, Car, PawPrint, MapPin, Building2 } from 'lucide-react'
import HotelSelectorModal from './HotelSelectorModal'

export interface Hotel {
  id: string
  name: string
  type: string
  location: string
  amenities: ('piscina' | 'desayuno' | 'cochera' | 'pet')[]
  prices: Record<string, number>
}

export interface Package {
  id: string
  name: string
  duration: string
  badge: string
  badgeColor: string
  highlight: string
  schedule: { day: string; label: string; time: string }[]
  includes: string[]
  msg: (hotel: string, price: number) => string
  featured?: boolean
}

const AMENITY_ICONS = {
  piscina: { icon: Waves, label: 'Piscina', color: 'text-blue-400' },
  desayuno: { icon: Coffee, label: 'Desayuno', color: 'text-amber-500' },
  cochera: { icon: Car, label: 'Cochera', color: 'text-slate-500' },
  pet: { icon: PawPrint, label: 'Pet Friendly', color: 'text-olive' },
}

interface Props {
  pkg: Package
  hotels: Hotel[]
  index: number
}

export default function PackageCard({ pkg, hotels, index }: Props) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(hotels[0])
  const [modalOpen, setModalOpen] = useState(false)

  const price = selectedHotel.prices[pkg.id]

  const handleWA = () => {
    const msg = pkg.msg(selectedHotel.name, price)
    window.open(`https://wa.me/51928686294?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12 }}
        className={`relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
          pkg.featured ? 'ring-2 ring-vino' : ''
        }`}
      >
        {/* Top accent */}
        <div className={`h-1.5 w-full ${pkg.highlight === 'vino' ? 'bg-vino' : pkg.highlight === 'coral' ? 'bg-coral' : 'bg-olive'}`} />

        <div className="p-6 flex flex-col flex-1">
          {/* Badge */}
          <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-4 flex items-center gap-1 ${pkg.badgeColor}`}>
            <Sparkles className="w-3 h-3" />
            {pkg.badge}
          </span>

          <h3 className="text-xl font-bold text-brand-dark mb-1">{pkg.name}</h3>
          <p className="text-sm text-brand-secondary mb-5">{pkg.duration}</p>

          {/* Dynamic price */}
          <div className="mb-5">
            <span className="text-xs text-brand-secondary">Precio por persona</span>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={price}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-brand-dark"
              >
                S/. {price}
              </motion.span>
              <span className="text-sm text-brand-secondary">/ persona</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide mb-2">Itinerario</p>
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

          {/* Selected hotel preview */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">
                Alojamiento
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="text-xs text-coral font-semibold hover:underline flex items-center gap-1"
              >
                <Building2 className="w-3 h-3" />
                Ver los {hotels.length} disponibles
              </button>
            </div>

            {/* Current selection card */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-full text-left rounded-2xl border-2 border-coral bg-coral/5 px-4 py-3 transition-all hover:bg-coral/10"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-coral truncate">{selectedHotel.name}</p>
                  <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {selectedHotel.type} · {selectedHotel.location}
                  </p>
                  {selectedHotel.amenities.length > 0 && (
                    <div className="flex gap-2 mt-1.5">
                      {selectedHotel.amenities.map((a) => {
                        const { icon: Icon, label, color } = AMENITY_ICONS[a]
                        return (
                          <span key={a} title={label} className={color}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-coral flex-shrink-0">S/. {price}</span>
              </div>
            </button>
          </div>

          {/* Includes */}
          <ul className="space-y-1.5 mb-6 flex-1">
            {pkg.includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-brand-secondary">
                <CheckCircle2 className="w-3.5 h-3.5 text-olive flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleWA}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg shadow-[#25D366]/20 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Reservar por WhatsApp
          </button>
        </div>
      </motion.div>

      <HotelSelectorModal
        open={modalOpen}
        pkgId={pkg.id}
        pkgName={`${pkg.name} · ${pkg.duration}`}
        hotels={hotels}
        selected={selectedHotel}
        onSelect={setSelectedHotel}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
