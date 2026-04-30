import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, Users, Baby, MessageCircle, Minus, Plus, PawPrint } from 'lucide-react'
import DateRangePicker from './DateRangePicker'

export interface BookingData {
  dateStart: string
  dateEnd: string
  adults: number
  children: number
  observations: string
}

interface Props {
  open: boolean
  tourName: string
  onClose: () => void
  onConfirm: (data: BookingData) => void
}

function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

export default function BookingFormModal({ open, tourName, onClose, onConfirm }: Props) {
  const [dateStart, setDateStart] = useState<Date | null>(null)
  const [dateEnd, setDateEnd] = useState<Date | null>(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [observations, setObservations] = useState('')

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setDateStart(start)
    setDateEnd(end)
  }

  const canSubmit = !!(dateStart && dateEnd)

  const handleSubmit = () => {
    if (!canSubmit) return
    onConfirm({
      dateStart: toISO(dateStart!),
      dateEnd: toISO(dateEnd!),
      adults,
      children,
      observations,
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            key="booking-panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-h-[90svh] md:max-h-[85vh] md:w-[560px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-brand-border flex-shrink-0">
              <div>
                <p className="text-xs text-brand-secondary font-medium mb-0.5">Reservando</p>
                <h3 className="text-base font-bold text-brand-dark leading-tight line-clamp-1">{tourName}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-sand hover:bg-brand-border flex items-center justify-center transition-colors flex-shrink-0 ml-3"
              >
                <X className="w-4 h-4 text-brand-secondary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-5 space-y-5">
                {/* Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <CalendarDays className="w-4 h-4 text-coral" />
                    ¿Qué días?
                  </label>
                  <DateRangePicker
                    start={dateStart}
                    end={dateEnd}
                    onChange={handleDateChange}
                  />
                </div>

                {/* Adults */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <Users className="w-4 h-4 text-coral" />
                    Adultos
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary hover:border-coral hover:text-coral transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold text-brand-dark w-8 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary hover:border-coral hover:text-coral transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-brand-secondary">persona{adults !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <Baby className="w-4 h-4 text-coral" />
                    Niños
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary hover:border-coral hover:text-coral transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold text-brand-dark w-8 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-secondary hover:border-coral hover:text-coral transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-brand-secondary">niño{children !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-brand-dark mb-2">
                    <PawPrint className="w-4 h-4 text-olive" />
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="¿Llevas mascotas? ¿Alguna restricción alimentaria u otra indicación?"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-dark placeholder:text-brand-secondary/60 focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-brand-border bg-white">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg shadow-[#25D366]/20 text-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar por WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
