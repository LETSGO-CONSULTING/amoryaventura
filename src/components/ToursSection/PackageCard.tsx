import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, MessageCircle, Sparkles, Waves, Coffee, Car, PawPrint, MapPin } from 'lucide-react'

export interface Hotel {
  id: string
  names: string[]
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
  piscina: { icon: Waves, label: 'Piscina' },
  desayuno: { icon: Coffee, label: 'Desayuno' },
  cochera: { icon: Car, label: 'Cochera' },
  pet: { icon: PawPrint, label: 'Pet Friendly' },
}

interface Props {
  pkg: Package
  hotels: Hotel[]
  index: number
}

export default function PackageCard({ pkg, hotels, index }: Props) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(hotels[0])

  const price = selectedHotel.prices[pkg.id]
  const hotelLabel = selectedHotel.names.join(' / ')

  const handleWA = () => {
    const msg = pkg.msg(hotelLabel, price)
    window.open(`https://wa.me/51928686294?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
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

        {/* Hotel selector */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide mb-2">
            Elige tu alojamiento
          </p>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
            {hotels.map((hotel) => {
              const isSelected = hotel.id === selectedHotel.id
              const hPrice = hotel.prices[pkg.id]
              return (
                <button
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 border transition-all duration-150 ${
                    isSelected
                      ? 'border-coral bg-coral/5 shadow-sm'
                      : 'border-brand-border hover:border-coral/50 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-coral' : 'text-brand-dark'}`}>
                        {hotel.names.join(' / ')}
                      </p>
                      <p className="text-[10px] text-brand-secondary flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                        {hotel.type} · {hotel.location}
                      </p>
                      {hotel.amenities.length > 0 && (
                        <div className="flex gap-1.5 mt-1">
                          {hotel.amenities.map((a) => {
                            const { icon: Icon, label } = AMENITY_ICONS[a]
                            return (
                              <span key={a} title={label} className="text-olive">
                                <Icon className="w-3 h-3" />
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <span className={`flex-shrink-0 text-sm font-bold ${isSelected ? 'text-coral' : 'text-brand-dark'}`}>
                      S/. {hPrice}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
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
          Consultar por WhatsApp
        </button>
      </div>
    </motion.div>
  )
}
