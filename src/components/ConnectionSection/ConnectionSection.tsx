import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Users, Heart, Sparkles, ArrowRight } from 'lucide-react'

const STATS = [
  { value: '2,400+', key: 'connection.stat_travelers' },
  { value: '150+', key: 'connection.stat_experiences' },
  { value: '48', key: 'connection.stat_destinations' },
  { value: '4.9★', key: 'connection.stat_rating' },
]

const features = [
  {
    Icon: Users,
    titleKey: 'connection.feature_1_title',
    descKey: 'connection.feature_1_desc',
    color: 'bg-coral/10 text-coral',
  },
  {
    Icon: Heart,
    titleKey: 'connection.feature_2_title',
    descKey: 'connection.feature_2_desc',
    color: 'bg-vino/10 text-vino',
  },
  {
    Icon: Sparkles,
    titleKey: 'connection.feature_3_title',
    descKey: 'connection.feature_3_desc',
    color: 'bg-olive/20 text-olive',
  },
]

const GROUP_IMGS = [
  'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488085061851-baffda87a73e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop&q=80',
]

export default function ConnectionSection() {
  const { t } = useTranslation()

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-[#F8F4EF] via-[#FFFDFB] to-[#f5ede8]">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-vino/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container-base relative z-10">
        {/* Top: headline + photo mosaic */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-eyebrow mb-4"
            >
              {t('connection.eyebrow')}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-brand-dark leading-tight mb-6"
            >
              {t('connection.title_1')}{' '}
              <span className="text-vino italic">{t('connection.title_2')}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-brand-secondary text-lg leading-relaxed mb-8"
            >
              {t('connection.subtitle')}
            </motion.p>

            {/* Features */}
            <div className="space-y-5 mb-10">
              {features.map(({ Icon, titleKey, descKey, color }, i) => (
                <motion.div
                  key={titleKey}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-0.5">{t(titleKey)}</h4>
                    <p className="text-brand-secondary text-sm leading-relaxed">{t(descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              href="#tours"
              className="btn-primary inline-flex items-center gap-2"
            >
              {t('connection.cta')}
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Right: photo mosaic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {GROUP_IMGS.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl ${i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              >
                <img
                  src={src}
                  alt={`Viajeros conectados ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <blockquote className="text-2xl md:text-3xl font-semibold text-vino italic leading-relaxed max-w-3xl mx-auto">
            {t('connection.quote')}
          </blockquote>
          <cite className="text-brand-secondary text-sm mt-3 block not-italic">
            {t('connection.quote_author')}
          </cite>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border rounded-2xl overflow-hidden shadow-sm"
        >
          {STATS.map(({ value, key }) => (
            <div key={key} className="bg-white px-8 py-8 text-center">
              <div className="text-3xl font-bold text-coral mb-1">{value}</div>
              <div className="text-brand-secondary text-sm">{t(key)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
