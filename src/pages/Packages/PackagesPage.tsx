import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Heart, Star, Clock, Flame, Trophy, CheckCircle2, ChevronRight, Building2, MapPin, Waves, Coffee, Car, PawPrint, X, MessageCircle, CalendarDays } from 'lucide-react'
import { HOTELS, GROUP_PACKAGES, SINGLES_PACKAGES } from '@/mocks/packages'
import type { Hotel, SinglesPackage } from '@/mocks/packages'
import PackageCard from '@/components/ToursSection/PackageCard'
import DateRangePicker from '@/components/ToursSection/DateRangePicker'
import imgSolteros from '@/img/photos/pozuzo.jpeg'
import imgGrupos from '@/img/photos/dorcher.jpeg'

const WHATSAPP_NUMBER = '51928686294'

const AMENITY_ICONS = {
  piscina:  { icon: Waves,    label: 'Piscina',      color: 'text-blue-400' },
  desayuno: { icon: Coffee,   label: 'Desayuno',     color: 'text-amber-500' },
  cochera:  { icon: Car,      label: 'Cochera',      color: 'text-slate-500' },
  pet:      { icon: PawPrint, label: 'Pet Friendly', color: 'text-olive' },
} as const

const AGE_SEGMENTS = [
  { label: 'Primera Aventura',      range: '18 – 25', dotColor: 'bg-logo-green',  border: 'border-logo-green' },
  { label: 'En Mi Mejor Momento',   range: '26 – 38', dotColor: 'bg-vino',        border: 'border-vino' },
  { label: 'Libre y Sin Límites',   range: '39 – 55', dotColor: 'bg-logo-teal',   border: 'border-logo-teal' },
]

const CATEGORIES = [
  { key: 'singles', label: 'Conexiones Reales', icon: Heart,  description: 'Solo para solteros' },
  { key: 'groups',  label: 'Para Grupos',        icon: Users,  description: 'Amigos, familia, empresas' },
]

// ── Hotel selector modal (singles) ────────────────────────────────────────────
function SinglesHotelModal({
  open, pkgId, pkgName, selected, onSelect, onClose,
}: {
  open: boolean
  pkgId: string
  pkgName: string
  selected: Hotel
  onSelect: (h: Hotel) => void
  onClose: () => void
}) {
  const [filters, setFilters] = useState<Array<keyof typeof AMENITY_ICONS>>([])

  const toggle = (k: keyof typeof AMENITY_ICONS) =>
    setFilters((p) => p.includes(k) ? p.filter((f) => f !== k) : [...p, k])

  const filtered = filters.length === 0
    ? HOTELS
    : HOTELS.filter((h) => filters.every((f) => h.amenities.includes(f)))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-h-[90svh] md:max-h-[85vh] md:w-[640px] flex flex-col bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-brand-border">
              <div>
                <p className="text-xs text-vino font-semibold uppercase tracking-widest mb-0.5">{pkgName}</p>
                <h2 className="text-lg font-bold text-brand-dark">Elige tu alojamiento</h2>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full bg-sand hover:bg-brand-border flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-brand-secondary" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-sand border-b border-brand-border flex-wrap">
              <span className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wide mr-1">Filtrar:</span>
              {(Object.entries(AMENITY_ICONS) as Array<[keyof typeof AMENITY_ICONS, typeof AMENITY_ICONS[keyof typeof AMENITY_ICONS]]>).map(([key, { icon: Icon, label, color }]) => {
                const active = filters.includes(key)
                return (
                  <button key={key} onClick={() => toggle(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      active ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-brand-secondary border-brand-border hover:border-brand-dark hover:text-brand-dark'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : color}`} />
                    {label}
                  </button>
                )
              })}
              {filters.length > 0 && (
                <button onClick={() => setFilters([])} className="text-[10px] text-vino underline ml-1">Limpiar</button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {(['Hospedaje', 'Hotel', 'Cabañas', 'Hotel / Cabaña'] as const).map((type) => {
                const group = filtered.filter((h) => h.type === type)
                if (!group.length) return null
                return (
                  <div key={type}>
                    <div className="px-6 pt-4 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">{type}</span>
                    </div>
                    <div className="px-3 space-y-1 pb-2">
                      {group.map((hotel) => {
                        const isSel = hotel.id === selected.id
                        const price = hotel.prices[pkgId]
                        return (
                          <motion.button key={hotel.id} onClick={() => { onSelect(hotel); onClose() }} whileTap={{ scale: 0.98 }}
                            className={`w-full text-left rounded-2xl px-4 py-3 border-2 transition-all duration-150 ${
                              isSel ? 'border-vino bg-vino/5' : 'border-transparent hover:border-brand-border bg-sand hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {isSel && <CheckCircle2 className="w-4 h-4 text-vino flex-shrink-0" />}
                                  <p className={`text-sm font-bold truncate ${isSel ? 'text-vino' : 'text-brand-dark'}`}>{hotel.name}</p>
                                </div>
                                <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  {hotel.location}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  {(Object.keys(AMENITY_ICONS) as Array<keyof typeof AMENITY_ICONS>).map((k) => {
                                    const { icon: Icon, label, color } = AMENITY_ICONS[k]
                                    return (
                                      <span key={k} title={label} className={hotel.amenities.includes(k) ? color : 'text-brand-border'}>
                                        <Icon className="w-4 h-4" />
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <p className={`text-xl font-bold ${isSel ? 'text-vino' : 'text-brand-dark'}`}>S/. {price}</p>
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

            <div className="flex-shrink-0 border-t border-brand-border bg-white px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-brand-secondary">Seleccionado</p>
                <p className="text-sm font-bold text-brand-dark">{selected.name}</p>
              </div>
              <button onClick={onClose} className="bg-vino hover:bg-vino-light text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
                Confirmar · S/. {selected.prices[pkgId]}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const INTERESTS = [
  { id: 'trekking',   label: '🥾 Senderismo' },
  { id: 'camping',    label: '🏕️ Camping' },
  { id: 'aventura',   label: '🌊 Aventura acuática' },
  { id: 'fotografia', label: '📸 Fotografía' },
  { id: 'musica',     label: '🎵 Música' },
  { id: 'gastronomia',label: '🍽️ Gastronomía' },
  { id: 'naturaleza', label: '🌿 Naturaleza' },
  { id: 'ciclismo',   label: '🚴 Ciclismo' },
  { id: 'yoga',       label: '🧘 Yoga / Meditación' },
  { id: 'baile',      label: '🎉 Baile y fiestas' },
  { id: 'cultura',    label: '🏛️ Cultura e historia' },
  { id: 'cafe',       label: '☕ Cafés y tertulia' },
]

function ageToSegment(age: number): string {
  if (age >= 18 && age <= 25) return 'Primera Aventura (18–25)'
  if (age >= 26 && age <= 38) return 'En Mi Mejor Momento (26–38)'
  if (age >= 39 && age <= 55) return 'Libre y Sin Límites (39–55)'
  return `${age} años`
}

// ── Booking form modal (singles) ──────────────────────────────────────────────
function SinglesBookingModal({
  open, pkgName, hotel, price, onClose,
}: {
  open: boolean
  pkgName: string
  hotel: Hotel
  price: number
  onClose: () => void
}) {
  const [dateStart,  setDateStart]  = useState<Date | null>(null)
  const [dateEnd,    setDateEnd]    = useState<Date | null>(null)
  const [age,        setAge]        = useState('')
  const [interests,  setInterests]  = useState<string[]>([])
  const [obs,        setObs]        = useState('')

  const ageNum = parseInt(age, 10)
  const ageValid = !isNaN(ageNum) && ageNum >= 18 && ageNum <= 70
  const canSubmit = !!(dateStart && dateEnd && ageValid)

  const toggleInterest = (id: string) =>
    setInterests((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id])

  const toISO = (d: Date) => d.toISOString().split('T')[0]
  const fmt = (iso: string) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

  const handleSubmit = () => {
    if (!canSubmit) return
    const dateStr =
      toISO(dateStart!) === toISO(dateEnd!)
        ? fmt(toISO(dateStart!))
        : `del ${fmt(toISO(dateStart!))} al ${fmt(toISO(dateEnd!))}`
    const segStr = ageToSegment(ageNum)
    const interestsStr = interests.length > 0
      ? `\n✨ *Intereses:* ${interests.map((id) => INTERESTS.find((i) => i.id === id)?.label).join(', ')}`
      : ''
    const obsStr = obs ? `\n📝 *Notas:* ${obs}` : ''
    const msg = `Hola! Quiero inscribirme en *Conexiones Reales — ${pkgName}* con alojamiento en *${hotel.name}* por S/. ${price} por persona.\n\n📅 *Fecha:* ${dateStr}\n🎂 *Edad:* ${age} años · ${segStr}${interestsStr}${obsStr}\n\n¿Tienen disponibilidad?`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-h-[90svh] md:max-h-[85vh] md:w-[680px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-brand-border flex-shrink-0">
              <div>
                <p className="text-xs text-vino font-semibold mb-0.5">Conexiones Reales</p>
                <h3 className="text-base font-bold text-brand-dark">{pkgName} · {hotel.name}</h3>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-sand hover:bg-brand-border flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-brand-secondary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-5 space-y-5">
                {/* Fechas */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <CalendarDays className="w-4 h-4 text-vino" />
                    ¿Qué días estarás en Oxapampa?
                  </label>
                  <DateRangePicker start={dateStart} end={dateEnd} onChange={(s, e) => { setDateStart(s); setDateEnd(e) }} />
                </div>

                {/* Edad */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <Users className="w-4 h-4 text-vino" />
                    Tu edad
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={18}
                      max={70}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Ej: 28"
                      className={`w-28 border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-dark focus:outline-none transition-colors ${
                        age && !ageValid ? 'border-coral focus:border-coral' : 'border-brand-border focus:border-vino'
                      }`}
                    />
                    {ageValid && (
                      <span className="text-xs text-brand-secondary bg-sand px-3 py-1.5 rounded-full">
                        {ageToSegment(ageNum)}
                      </span>
                    )}
                    {age && !ageValid && (
                      <span className="text-xs text-coral">Edad entre 18 y 70</span>
                    )}
                  </div>
                </div>

                {/* Intereses */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-1">
                    <Heart className="w-4 h-4 text-vino" />
                    Tus intereses
                  </label>
                  <p className="text-xs text-brand-secondary mb-3">Selecciona los que más te identifican</p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => {
                      const active = interests.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => toggleInterest(interest.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150 ${
                            active
                              ? 'bg-vino text-white border-vino shadow-sm'
                              : 'bg-white text-brand-secondary border-brand-border hover:border-vino/40 hover:text-brand-dark'
                          }`}
                        >
                          {interest.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <CheckCircle2 className="w-4 h-4 text-olive" />
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    placeholder="¿Alguna restricción o indicación especial?"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-secondary/60 focus:outline-none focus:ring-2 focus:ring-vino/40 focus:border-vino transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-brand-border bg-white">
              {!canSubmit && (
                <p className="text-xs text-brand-secondary text-center mb-2">Selecciona fechas y tu edad para continuar</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Inscribirme por WhatsApp · S/. {price}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Singles package card ──────────────────────────────────────────────────────
function SinglesPackageCard({ pkg, index }: { pkg: SinglesPackage; index: number }) {
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(HOTELS[0])
  const [hotelOpen,    setHotelOpen]    = useState(false)
  const [bookingOpen,  setBookingOpen]  = useState(false)

  const price = selectedHotel.prices[pkg.id]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className={`relative flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white ${
          pkg.highlight ? 'ring-2 ring-vino' : ''
        }`}
      >
        {pkg.highlight && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-vino text-white text-center text-xs font-bold py-1.5 tracking-widest uppercase">
            ⭐ Más popular
          </div>
        )}

        <div className={`h-1.5 w-full ${pkg.highlight ? 'bg-vino' : 'bg-logo-teal'}`} />

        <div className="flex flex-col flex-1 p-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-brand-secondary" />
              <span className="text-sm text-brand-secondary">{pkg.days} días</span>
            </div>
            <h3 className="text-xl font-bold text-brand-dark">{pkg.title}</h3>
            <p className="text-sm text-brand-secondary mt-0.5">{pkg.subtitle}</p>
          </div>

          {/* Dynamic price */}
          <div>
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

          {/* Hotel selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">Alojamiento</p>
              <button onClick={() => setHotelOpen(true)} className="text-xs text-vino font-semibold hover:underline flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Ver los {HOTELS.length} disponibles
              </button>
            </div>
            <button
              onClick={() => setHotelOpen(true)}
              className="w-full text-left rounded-2xl border-2 border-vino bg-vino/5 px-4 py-3 hover:bg-vino/10 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-vino truncate">{selectedHotel.name}</p>
                  <p className="text-xs text-brand-secondary flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    {selectedHotel.type} · {selectedHotel.location}
                  </p>
                  {selectedHotel.amenities.length > 0 && (
                    <div className="flex gap-2 mt-1.5">
                      {selectedHotel.amenities.map((a) => {
                        const { icon: Icon, label, color } = AMENITY_ICONS[a]
                        return <span key={a} title={label} className={color}><Icon className="w-3.5 h-3.5" /></span>
                      })}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-vino flex-shrink-0">S/. {price}</span>
              </div>
            </button>
          </div>

          {/* Dynamics */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-vino uppercase tracking-wide mb-2">
              <Flame className="w-3.5 h-3.5" />
              Dinámicas incluidas
            </div>
            <ul className="space-y-1.5">
              {pkg.dynamics.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-brand-secondary">
                  <Trophy className="w-3.5 h-3.5 text-coral mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Includes */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-logo-navy uppercase tracking-wide mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Incluye
            </div>
            <ul className="space-y-1.5">
              {pkg.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-sm text-brand-secondary">
                  <CheckCircle2 className="w-3.5 h-3.5 text-olive mt-0.5 flex-shrink-0" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-2">
            <button
              onClick={() => setBookingOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                pkg.highlight
                  ? 'bg-vino hover:bg-vino-light text-white shadow-vino/20'
                  : 'bg-brand-dark hover:bg-brand-secondary text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              Inscribirme ahora
            </button>
          </div>
        </div>
      </motion.div>

      <SinglesHotelModal
        open={hotelOpen}
        pkgId={pkg.id}
        pkgName={`${pkg.title} · ${pkg.subtitle}`}
        selected={selectedHotel}
        onSelect={setSelectedHotel}
        onClose={() => setHotelOpen(false)}
      />

      <SinglesBookingModal
        open={bookingOpen}
        pkgName={pkg.title}
        hotel={selectedHotel}
        price={price}
        onClose={() => setBookingOpen(false)}
      />
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PackagesPage() {
  const [activeCategory, setActiveCategory] = useState('singles')

  return (
    <div className="min-h-screen bg-warm">
      {/* Hero */}
      <section className="pt-16 bg-sand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center pt-12 pb-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-eyebrow mb-4"
          >
            Paquetes Turísticos
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-4"
          >
            Viaja a tu manera,<br />
            <span className="text-coral">vive tu historia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-brand-secondary text-base md:text-lg max-w-xl mx-auto mb-8"
          >
            Paquetes todo incluido desde Lima — para solteros que buscan conexión o grupos que quieren aventura.
          </motion.p>

          {/* Tab CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10 md:mb-12"
          >
            <button
              onClick={() => setActiveCategory('singles')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeCategory === 'singles'
                  ? 'bg-vino text-white shadow-lg shadow-vino/25'
                  : 'bg-white border border-brand-border text-brand-secondary hover:border-vino hover:text-vino'
              }`}
            >
              <Heart className="w-4 h-4" />
              Conexiones Reales
            </button>
            <button
              onClick={() => setActiveCategory('groups')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                activeCategory === 'groups'
                  ? 'bg-logo-navy text-white shadow-lg shadow-logo-navy/25'
                  : 'bg-white border border-brand-border text-brand-secondary hover:border-logo-navy hover:text-logo-navy'
              }`}
            >
              <Users className="w-4 h-4" />
              Para Grupos
            </button>
          </motion.div>

          {/* Visual */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-t-3xl overflow-hidden shadow-2xl shadow-brand-dark/20"
              >
                <img
                  src={activeCategory === 'singles' ? imgSolteros : imgGrupos}
                  alt={activeCategory === 'singles' ? 'Conexiones Reales' : 'Para Grupos'}
                  className="w-full h-[280px] md:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-left">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                    {activeCategory === 'singles' ? 'Solo para solteros' : 'Amigos · Familia · Empresas'}
                  </p>
                  <h3 className="text-white text-2xl md:text-3xl font-bold">
                    {activeCategory === 'singles' ? 'Conexiones Reales' : 'Para Grupos'}
                  </h3>
                </div>
                <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5">
                  {activeCategory === 'singles'
                    ? AGE_SEGMENTS.map((s) => (
                        <span key={s.label} className="text-xs bg-white/90 backdrop-blur-sm text-brand-dark font-medium px-3 py-1 rounded-full shadow-sm">
                          {s.label} · {s.range}
                        </span>
                      ))
                    : ['2 Días / 1 Noche', '3 Días / 2 Noches', '4 Días / 3 Noches'].map((d) => (
                        <span key={d} className="text-xs bg-white/90 backdrop-blur-sm text-brand-dark font-medium px-3 py-1 rounded-full shadow-sm">
                          {d}
                        </span>
                      ))
                  }
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Conexiones Reales ── */}
      {activeCategory === 'singles' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-vino font-semibold text-sm uppercase tracking-widest mb-3">
                <Heart className="w-4 h-4" />
                Conexiones Reales
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
                Tours exclusivos para solteros
              </h2>
              <p className="text-brand-secondary max-w-xl mx-auto">
                Grupos mixtos curados por edad. Dinámicas, retos y aventura — conocer personas es parte natural del viaje.
              </p>
            </div>

            {/* Age segments */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {AGE_SEGMENTS.map((seg) => (
                <div key={seg.label} className={`flex items-center gap-2 border-2 ${seg.border} rounded-full px-4 py-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${seg.dotColor}`} />
                  <span className="font-semibold text-sm text-brand-dark">{seg.label}</span>
                  <span className="text-xs text-brand-secondary">{seg.range} años</span>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="bg-sand rounded-2xl p-6 mb-10 grid sm:grid-cols-3 gap-6 text-center">
              {[
                { step: '01', title: 'Elige tu paquete',    desc: 'Duración y destino según tu disponibilidad' },
                { step: '02', title: 'Elige alojamiento',   desc: 'Desde hospedaje hasta lodge premium — precio ajusta automáticamente' },
                { step: '03', title: 'Vive la experiencia', desc: 'Dinámicas, retos y conexiones reales en entornos únicos del Perú' },
              ].map((item) => (
                <div key={item.step}>
                  <div className="text-3xl font-bold text-vino/20 mb-1">{item.step}</div>
                  <div className="font-bold text-brand-dark mb-1">{item.title}</div>
                  <div className="text-sm text-brand-secondary">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SINGLES_PACKAGES.map((pkg, i) => (
                <SinglesPackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>

            <p className="text-center text-sm text-brand-secondary mt-8">
              Grupos de 10–16 personas · Solo solteros · Asignación curada por Amor y Aventura
            </p>
          </motion.div>
        </section>
      )}

      {/* ── Para Grupos ── */}
      {activeCategory === 'groups' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-logo-navy font-semibold text-sm uppercase tracking-widest mb-3">
                <Users className="w-4 h-4" />
                Para Grupos
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-3">
                Nuestros Paquetes
              </h2>
              <p className="text-brand-secondary max-w-xl mx-auto">
                Todo incluido desde Lima. Elige los días que tienes y nosotros hacemos el resto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {GROUP_PACKAGES.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} hotels={HOTELS} index={i} />
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}
