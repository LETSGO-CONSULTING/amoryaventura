import { motion } from 'framer-motion'
import { Play, MapPin } from 'lucide-react'

const VIDEOS = [
  {
    id: '1',
    title: 'Machu Picchu · La ciudad en las nubes',
    thumbnail: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=700&auto=format&fit=crop&q=80',
    duration: '3:42',
    location: 'Cusco, Perú',
  },
  {
    id: '2',
    title: 'Amazonas · Expedición en la selva',
    thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&auto=format&fit=crop&q=80',
    duration: '5:18',
    location: 'Loreto, Perú',
  },
  {
    id: '3',
    title: 'Huacachina · Adrenalina en las dunas',
    thumbnail: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&auto=format&fit=crop&q=80',
    duration: '2:55',
    location: 'Ica, Perú',
  },
]

export default function VideoSection() {
  return (
    <section className="section-padding bg-sand">
      <div className="container-base">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-eyebrow mb-3"
          >
            Videos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Siente la experiencia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            Déjate inspirar por los destinos más impresionantes del Perú antes de vivirlos.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-video"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <Play className="w-6 h-6 text-coral fill-coral ml-1" />
                </div>
              </div>

              {/* Duration badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
                {video.duration}
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1 text-white/70 text-xs mb-1">
                  <MapPin className="w-3 h-3" />
                  {video.location}
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
