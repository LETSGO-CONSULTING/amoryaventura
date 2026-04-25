import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  start: Date | null
  end: Date | null
  onChange: (start: Date | null, end: Date | null) => void
}

const DAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isBetween(d: Date, a: Date, b: Date) {
  const t = d.getTime()
  const lo = a < b ? a : b
  const hi = a < b ? b : a
  return t > lo.getTime() && t < hi.getTime()
}

export default function DateRangePicker({ start, end, onChange }: Props) {
  const today = startOfDay(new Date())

  const [viewMonth, setViewMonth] = useState(() => {
    const d = start ?? today
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const firstDayOfWeek = (viewMonth.getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d))
  }
  while (cells.length % 7 !== 0) cells.push(null)

  const handleClick = (day: Date) => {
    if (day < today) return
    if (!start || (start && end)) {
      onChange(day, null)
    } else {
      if (isSameDay(day, start)) {
        onChange(day, day)
      } else if (day < start) {
        onChange(day, start)
      } else {
        onChange(start, day)
      }
    }
  }

  const effectiveEnd = end ?? (hoverDate && start && !end && hoverDate > start ? hoverDate : null)

  const nights =
    start && end && !isSameDay(start, end)
      ? Math.round((end.getTime() - start.getTime()) / 86400000)
      : null

  return (
    <div className="bg-sand rounded-2xl border border-brand-border overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-border transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-brand-secondary" />
        </button>
        <span className="text-sm font-bold text-brand-dark capitalize tracking-wide">
          {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-border transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-brand-secondary" />
        </button>
      </div>

      <div className="px-3 pb-3 pt-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-brand-secondary/60 py-1 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="h-9" />

            const isPast = day < today
            const isToday = isSameDay(day, today)
            const isStart = !!start && isSameDay(day, start)
            const isEnd = !!end && isSameDay(day, end)
            const isSingle = !!(start && end && isSameDay(start, end))
            const inRange = !!(start && effectiveEnd && !isSameDay(start, effectiveEnd) && isBetween(day, start, effectiveEnd))
            const isHoverEnd = !end && !!hoverDate && isSameDay(day, hoverDate) && !!start && hoverDate > start

            const isRangeStart = isStart && !isSingle && !!effectiveEnd
            const isRangeEnd = (isEnd || isHoverEnd) && !isSingle && !!start

            return (
              <div
                key={day.toISOString()}
                className={[
                  'relative h-9 flex items-center justify-center',
                  isPast ? 'cursor-not-allowed' : 'cursor-pointer',
                  inRange ? 'bg-coral/10' : '',
                  isRangeStart ? 'rounded-l-full bg-coral/10' : '',
                  isRangeEnd ? 'rounded-r-full bg-coral/10' : '',
                  !inRange && !isRangeStart && !isRangeEnd ? 'rounded-full' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !isPast && handleClick(day)}
                onMouseEnter={() => !isPast && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
              >
                <span
                  className={[
                    'w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-150 select-none',
                    isPast
                      ? 'text-brand-secondary/25 font-normal'
                      : isStart || isEnd
                        ? 'bg-coral text-white font-bold shadow-md shadow-coral/30 scale-105'
                        : isHoverEnd
                          ? 'bg-coral/30 text-coral font-semibold'
                          : isToday
                            ? 'ring-1 ring-olive text-olive font-semibold'
                            : 'text-brand-dark font-medium hover:bg-coral/20 hover:text-coral',
                  ].filter(Boolean).join(' ')}
                >
                  {day.getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selection summary */}
      <div className="px-4 py-2.5 border-t border-brand-border min-h-[36px] flex items-center justify-center">
        {start && end ? (
          isSameDay(start, end) ? (
            <p className="text-xs text-brand-secondary text-center">
              <span className="font-bold text-coral">1 día</span>
              {' · '}
              {start.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          ) : (
            <p className="text-xs text-brand-secondary text-center">
              <span className="font-bold text-coral">{nights} noche{nights !== 1 ? 's' : ''}</span>
              {' · del '}
              <span className="font-medium text-brand-dark">
                {start.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
              </span>
              {' al '}
              <span className="font-medium text-brand-dark">
                {end.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
              </span>
            </p>
          )
        ) : start ? (
          <p className="text-xs text-brand-secondary/60 text-center">
            Selecciona la fecha de regreso o toca el mismo día
          </p>
        ) : (
          <p className="text-xs text-brand-secondary/40 text-center">
            Toca un día para comenzar
          </p>
        )}
      </div>
    </div>
  )
}
