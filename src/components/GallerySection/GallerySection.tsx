import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ZoomIn } from 'lucide-react'
import { galleryItems } from '@/mocks/gallery'

export default function GallerySection() {
  const { t } = useTranslation()

  return (
    <section id="galeria" className="section-padding bg-warm">
      <div className="container-base">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-3"
          >
            {t('gallery.eyebrow')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            {t('gallery.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>

        {/* Masonry grid via CSS columns */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  item.size === 'large' ? 'aspect-[3/4]' : item.size === 'medium' ? 'aspect-square' : 'aspect-[4/3]'
                }`}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white">
                  <ZoomIn className="w-7 h-7" />
                  <span className="text-xs font-medium px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    {item.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <button className="btn-outline">{t('gallery.view_all')}</button>
        </div>
      </div>
    </section>
  )
}
