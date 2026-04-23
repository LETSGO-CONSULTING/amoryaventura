import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Star, Quote } from 'lucide-react'
import { testimonials } from '@/mocks/testimonials'

export default function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="section-padding bg-warm overflow-hidden">
      <div className="container-base">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-3"
          >
            {t('testimonials.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            {t('testimonials.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            {t('testimonials.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-12"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-brand-border h-full flex flex-col">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-coral/30 mb-4 flex-shrink-0" />

                  {/* Social tag */}
                  {item.isSocialConnection && (
                    <span className="inline-flex items-center text-xs font-medium text-vino bg-vino/8 px-3 py-1 rounded-full mb-4 self-start border border-vino/15">
                      {t('testimonials.social_tag')}
                    </span>
                  )}

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-brand-secondary text-sm leading-relaxed flex-1 mb-5 italic">
                    "{item.text}"
                  </p>

                  {/* Tour tag */}
                  {item.tourName && (
                    <span className="text-xs text-coral font-medium bg-coral/8 px-3 py-1 rounded-full self-start mb-5">
                      {item.tourName}
                    </span>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-brand-border pt-4">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{item.name}</p>
                      <p className="text-brand-secondary text-xs">{item.city}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      <style>{`
        .swiper-pagination-bullet {
          background: #E8DED7;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #FF6B6B;
        }
      `}</style>
    </section>
  )
}
