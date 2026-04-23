import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

interface Props {
  isLight?: boolean
}

export default function LanguageSwitcher({ isLight = false }: Props) {
  const { i18n } = useTranslation()

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        isLight
          ? 'border-white/30 text-white/90 hover:bg-white/10'
          : 'border-brand-border text-brand-secondary hover:border-coral hover:text-coral'
      }`}
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="uppercase">{i18n.language === 'es' ? 'EN' : 'ES'}</span>
    </button>
  )
}
