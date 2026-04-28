import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Clock,
  Users,
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  Backpack,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react'
import type { Tour } from '@/models'
import BookingFormModal, { type BookingData } from './BookingFormModal'

interface Props {
  tour: Tour | null
  onClose: () => void
}

const WHATSAPP = '+51928686294'

export default function TourModal({ tour, onClose }: Props) {
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    if (tour) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setBookingOpen(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [tour])

  const handleWhatsApp = (data: BookingData) => {
    if (!tour) return
    const fmt = (iso: string) =>
      new Date(iso + 'T12:00:00').toLocaleDateString('es-PE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    const dateStr =
      data.dateStart === data.dateEnd
        ? fmt(data.dateStart)
        : `del ${fmt(data.dateStart)} al ${fmt(data.dateEnd)}`
    const pax = `${data.adults} adulto${data.adults !== 1 ? 's' : ''}${data.children > 0 ? ` y ${data.children} niño${data.children !== 1 ? 's' : ''}` : ''}`
    const obs = data.observations ? `\n📝 *Observaciones:* ${data.observations}` : ''
    const msg = encodeURIComponent(
      `Hola! Me interesa reservar el *${tour.title}*.\n\n📅 *Fecha:* ${dateStr}\n👥 *Personas:* ${pax}${obs}\n\n¿Tienen disponibilidad?`
    )
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank')
    setBookingOpen(false)
  }

  return (
    <AnimatePresence>
      {tour && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-6 md:bottom-6 md:w-full md:max-w-2xl z-50 flex flex-col bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Hero image */}
            <div className="relative h-52 md:h-64 flex-shrink-0">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {tour.destination}, Perú
                </div>
                <h2 className="text-white text-2xl font-bold leading-tight">{tour.title}</h2>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-5 space-y-6">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-brand-secondary">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-coral" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-coral" />
                    Hasta {tour.groupSize} personas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong className="text-brand-dark">{tour.rating}</strong>
                    <span className="text-xs">({tour.reviewCount} reseñas)</span>
                  </span>
                </div>

                {/* Departure */}
                {tour.departure && (
                  <div className="flex items-center gap-2 bg-olive/10 border border-olive/20 rounded-xl px-4 py-3">
                    <CalendarCheck className="w-5 h-5 text-olive flex-shrink-0" />
                    <span className="text-sm font-medium text-olive">{tour.departure}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-brand-secondary leading-relaxed text-sm">{tour.description}</p>

                {/* Itinerary */}
                <div>
                  <h3 className="font-bold text-brand-dark text-base mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-coral" />
                    Itinerario
                  </h3>
                  <ol className="space-y-2">
                    {tour.itinerary.map((stop, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04 }}
                        className="flex items-start gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-brand-dark pt-0.5">{stop}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>

                {/* Includes / Not includes */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-brand-dark text-sm mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-olive" />
                      Incluye
                    </h3>
                    <ul className="space-y-1.5">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="text-xs text-brand-secondary flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-olive flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark text-sm mb-2 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-coral" />
                      No incluye
                    </h3>
                    <ul className="space-y-1.5">
                      {tour.notIncludes.map((item, i) => (
                        <li key={i} className="text-xs text-brand-secondary flex items-start gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-coral/60 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* What to bring */}
                <div>
                  <h3 className="font-bold text-brand-dark text-sm mb-2 flex items-center gap-1.5">
                    <Backpack className="w-4 h-4 text-coral" />
                    ¿Qué llevar?
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tour.whatToBring.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-sand text-brand-secondary border border-brand-border px-3 py-1.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spacer for sticky footer */}
                <div className="h-4" />
              </div>
            </div>

            {/* Sticky footer CTA */}
            <div className="flex-shrink-0 border-t border-brand-border bg-white px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-brand-secondary">Precio por persona</p>
                <p className="text-2xl font-bold text-brand-dark">
                  S/. {tour.price}
                  <span className="text-sm font-normal text-brand-secondary ml-1">/ persona</span>
                </p>
              </div>
              <button
                onClick={() => setBookingOpen(true)}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-[#25D366]/30 text-sm flex-shrink-0"
              >
                <MessageCircle className="w-5 h-5" />
                Reservar por WhatsApp
              </button>
            </div>
          </motion.div>

          <BookingFormModal
            open={bookingOpen}
            tourName={tour.title}
            onClose={() => setBookingOpen(false)}
            onConfirm={handleWhatsApp}
          />
        </>
      )}
    </AnimatePresence>
  )
}
