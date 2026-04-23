import { motion } from 'framer-motion'
import { MapPin, ChevronDown, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const HERO_IMG = 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1920&auto=format&fit=crop&q=80'
const WHATSAPP_NUMBER = '51928686294'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 container-base text-center px-6">
        {/* Eyebrow */}
        <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 text-white/90 text-sm font-medium mb-8">
          <MapPin className="w-4 h-4 text-coral" />
          <span>{t('hero.eyebrow')}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.2)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          {t('hero.title_1')}{' '}
          <span className="text-coral italic">{t('hero.title_2')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#tours"
            className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
          >
            {t('hero.cta_tours')}
          </a>
          <a
            href="#tienda"
            className="btn-ghost-white inline-flex items-center justify-center gap-2 text-base px-8 py-4"
          >
            <ShoppingBag className="w-5 h-5" />
            {t('hero.cta_shop')}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, quiero información sobre sus tours`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1fbc5a] text-white font-semibold inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-base"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t('hero.cta_contact')}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.5)}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/15 pt-8"
        >
          {[
            { value: '2,400+', label: t('hero.stat_travelers') },
            { value: '48', label: t('hero.stat_destinations') },
            { value: '4.9★', label: t('hero.stat_rating') },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-coral">{stat.value}</div>
              <div className="text-white/60 text-xs md:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-10"
      >
        <ChevronDown className="w-7 h-7" />
      </motion.div>
    </section>
  )
}
