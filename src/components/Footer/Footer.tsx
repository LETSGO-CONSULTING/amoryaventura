import { Heart, Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const tourLinks = ['Machu Picchu', 'Lago Titicaca', 'Huacachina', 'Amazonas', 'Valle Sagrado', 'Cañón del Colca']
  const shopLinks = ['Café Premium', 'Chocolates', 'Miel Andina', 'Textiles', 'Artesanías', 'Gourmet']
  const companyLinks = [t('footer.about'), t('footer.contact'), t('footer.blog'), t('footer.privacy'), t('footer.terms')]

  return (
    <footer className="bg-vino text-white">
      <div className="container-base py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-coral rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg">Amor y Aventura</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-coral rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t('footer.tours')}</h4>
            <ul className="space-y-2">
              {tourLinks.map((link) => (
                <li key={link}>
                  <a href="#tours" className="text-white/50 hover:text-coral text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t('footer.shop')}</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link}>
                  <a href="#tienda" className="text-white/50 hover:text-coral text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t('footer.company')}</h4>
            <ul className="space-y-2 mb-6">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 hover:text-coral text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              {[
                { Icon: MapPin, text: 'Oxapampa, Perú' },
                { Icon: Phone, text: '+51 928 686 294' },
                { Icon: Mail, text: 'hola@amoryaventura.pe' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
                  <Icon className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>© 2024 Amor y Aventura. {t('footer.rights')}</p>
          <p>{t('footer.made')}</p>
        </div>
      </div>
    </footer>
  )
}
