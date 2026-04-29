import iconImg from '@/img/logo-icon-only.png'

type LogoVariant = 'horizontal' | 'icon'
type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  light?: boolean
  className?: string
}

const iconSizes: Record<LogoSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

const titleSizes: Record<LogoSize, string> = {
  sm: 'text-sm',
  md: 'text-base md:text-lg',
  lg: 'text-xl md:text-2xl',
}

const subtitleSizes: Record<LogoSize, string> = {
  sm: 'text-[9px]',
  md: 'text-[10px] md:text-xs',
  lg: 'text-xs md:text-sm',
}

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  light = false,
  className = '',
}: LogoProps) {
  const titleColor = light ? 'text-white' : 'text-[#0F314C]'
  const subtitleColor = light ? 'text-white/75' : 'text-[#27545F]'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon — always shown, bigger when icon-only */}
      <img
        src={iconImg}
        alt="Amor y Aventura Tours"
        className={`
          object-contain flex-shrink-0
          ${variant === 'icon' ? iconSizes.lg : iconSizes[size]}
          transition-transform duration-200 group-hover:scale-105
        `}
      />

      {/* Text — hidden on icon variant */}
      {variant === 'horizontal' && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-extrabold tracking-tight ${titleSizes[size]} ${titleColor}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Amor y Aventura
          </span>
          <span
            className={`font-semibold tracking-[0.25em] uppercase ${subtitleSizes[size]} ${subtitleColor}`}
          >
            Tours
          </span>
        </div>
      )}
    </div>
  )
}
