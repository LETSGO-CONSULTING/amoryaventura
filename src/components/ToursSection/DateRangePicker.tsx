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

  // Which step the user is on
  const step: 1 | 2 = !start || (start && end) ? 1 : 2

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
    if (step === 1) {
      // Always start fresh
      onChange(day, null)
    } else {
      // step === 2: pick end
      if (isSameDay(day, start!)) {
        onChange(day, day)           // same day = single
      } else if (day < start!) {
        onChange(day, start!)        // clicked before start → swap
      } else {
        onChange(start!, day)
      }
    }
  }

  const effectiveEnd =
    end ?? (step === 2 && hoverDate && start && hoverDate > start ? hoverDate : null)

  const nights =
    start && end && !isSameDay(start, end)
      ? Math.round((end.getTime() - start.getTime()) / 86400000)
      : null

  const fmtShort = (d: Date) =>
    d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })

  return (
    <div className="rounded-2xl border border-brand-border overflow-hidden bg-white">
      {/* Step indicator */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-sand border-b border-brand-border">
        <StepPill
          num={1}
          label={start ? fmtShort(start) : 'Inicio'}
          active={step === 1}
          done={!!start}
        />
        <div className="h-px flex-1 bg-brand-border" />
        <StepPill
          num={2}
          label={end ? fmtShort(end) : 'Fin'}
          active={step === 2}
          done={!!end}
        />
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-brand-border">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-sand transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-brand-secondary" />
        </button>
        <span className="text-xs font-bold text-brand-dark capitalize tracking-wide">
          {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-sand transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 text-brand-secondary" />
        </button>
      </div>

      <div className="px-2 pb-2 pt-1.5">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-0.5">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] font-semibold text-brand-secondary/50 py-0.5 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="h-8" />

            const isPast = day < today
            const isToday = isSameDay(day, today)
            const isStart = !!start && isSameDay(day, start)
            const isEnd = !!end && isSameDay(day, end)
            const isSingle = !!(start && end && isSameDay(start, end))
            const inRange =
              !!(start && effectiveEnd && !isSameDay(start, effectiveEnd) && isBetween(day, start, effectiveEnd))
            const isHoverEnd =
              !end && !!hoverDate && isSameDay(day, hoverDate) && !!start && hoverDate > start

            const isRangeStart = isStart && !isSingle && !!effectiveEnd
            const isRangeEnd = (isEnd || isHoverEnd) && !isSingle && !!start

            return (
              <div
                key={day.toISOString()}
                className={[
                  'h-8 flex items-center justify-center',
                  isPast ? 'cursor-not-allowed' : 'cursor-pointer',
                  inRange ? 'bg-coral/10' : '',
                  isRangeStart ? 'rounded-l-full bg-coral/10' : '',
                  isRangeEnd ? 'rounded-r-full bg-coral/10' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !isPast && handleClick(day)}
                onMouseEnter={() => !isPast && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
              >
                <span
                  className={[
                    'w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors duration-100 select-none font-medium',
                    isPast
                      ? 'text-brand-secondary/25'
                      : isStart || isEnd
                        ? 'bg-coral text-white font-bold shadow-sm shadow-coral/40'
                        : isHoverEnd
                          ? 'bg-coral/25 text-coral'
                          : isToday
                            ? 'ring-1 ring-olive text-olive font-semibold'
                            : 'text-brand-dark hover:bg-coral/15 hover:text-coral',
                  ].filter(Boolean).join(' ')}
                >
                  {day.getDate()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-2 border-t border-brand-border bg-sand min-h-[32px] flex items-center justify-center">
        {start && end ? (
          isSameDay(start, end) ? (
            <p className="text-xs text-brand-secondary text-center leading-tight">
              <span className="font-bold text-coral">1 día · </span>
              {start.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          ) : (
            <p className="text-xs text-brand-secondary text-center leading-tight">
              <span className="font-bold text-coral">{nights} noche{nights !== 1 ? 's' : ''}</span>
              {' · '}
              {fmtShort(start)} → {fmtShort(end)}
            </p>
          )
        ) : start ? (
          <p className="text-[10px] text-coral font-medium text-center animate-pulse">
            ↑ Ahora toca la fecha de regreso
          </p>
        ) : (
          <p className="text-[10px] text-brand-secondary/50 text-center">
            Toca un día para empezar
          </p>
        )}
      </div>
    </div>
  )
}

function StepPill({
  num,
  label,
  active,
  done,
}: {
  num: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div
      className={[
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all',
        active
          ? 'bg-coral text-white'
          : done
            ? 'bg-coral/15 text-coral'
            : 'bg-brand-border/60 text-brand-secondary/60',
      ].join(' ')}
    >
      <span
        className={[
          'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold',
          active ? 'bg-white/30' : done ? 'bg-coral/20' : 'bg-brand-secondary/20',
        ].join(' ')}
      >
        {num}
      </span>
      <span className="max-w-[60px] truncate">{label}</span>
    </div>
  )
}
