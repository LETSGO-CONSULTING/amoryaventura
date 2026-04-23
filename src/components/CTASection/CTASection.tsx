import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ShoppingBag } from 'lucide-react'

const BG_IMG = 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=1600&auto=format&fit=crop&q=80'
const WHATSAPP_NUMBER = '51928686294'

export default function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMG})` }}
      />
      <div className="absolute inset-0 bg-vino/85" />

      <div className="relative z-10 container-base section-padding text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-coral text-sm font-semibold tracking-widest uppercase mb-4">
            Amor y Aventura
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 text-balance">
            {t('cta.title_1')}{' '}
            <span className="text-coral italic">{t('cta.title_2')}</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tours"
              className="bg-coral hover:bg-coral-dark text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              {t('cta.explore_tours')}
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsapp.message'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1fbc5a] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('cta.whatsapp')}
            </a>
            <a
              href="#tienda"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold px-8 py-4 rounded-full transition-all inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('cta.shop')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
