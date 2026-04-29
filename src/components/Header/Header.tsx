import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import Logo from '@/components/Logo/Logo'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher'
import { useCartStore } from '@/store/cartStore'

const WHATSAPP_NUMBER = '51928686294'

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: t('header.destinations'), href: '#destinos' },
    { label: t('header.tours'), href: '#tours' },
    { label: t('header.shop'), href: '/tienda', isRoute: true },
    { label: t('header.gallery'), href: '#galeria' },
  ]

  const isLight = !scrolled && location.pathname === '/'

  const handleAnchorNav = (anchor: string) => {
    const id = anchor.replace('#', '')
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 350)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container-base">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center">
            {/* Mobile: icon only, large */}
            <Logo variant="icon" size="md" light={isLight} className="md:hidden" />
            {/* Desktop: icon + text */}
            <Logo variant="horizontal" size="md" light={isLight} className="hidden md:flex" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-coral/10 hover:text-coral ${
                    isLight ? 'text-white/90' : 'text-brand-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleAnchorNav(link.href)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-coral/10 hover:text-coral ${
                    isLight ? 'text-white/90' : 'text-brand-secondary'
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher isLight={isLight} />
            <Link
              to="/carrito"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className={`relative p-2 rounded-full transition-all hover:bg-coral/10 ${isLight ? 'text-white' : 'text-brand-secondary'}`}
              aria-label={t('header.cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, quiero información sobre tours`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              {t('header.reserve')}
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/carrito" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className={`relative p-2 ${isLight && !mobileOpen ? 'text-white' : 'text-brand-dark'}`}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 ${isLight && !mobileOpen ? 'text-white' : 'text-brand-dark'}`}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-brand-border overflow-hidden"
          >
            <div className="container-base py-6 flex flex-col gap-2">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3 text-brand-dark font-medium rounded-xl hover:bg-sand transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => { setMobileOpen(false); handleAnchorNav(link.href) }}
                    className="px-4 py-3 text-brand-dark font-medium rounded-xl hover:bg-sand transition-colors text-left"
                  >
                    {link.label}
                  </button>
                )
              )}
              <div className="pt-2 flex items-center gap-3">
                <LanguageSwitcher isLight={false} />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm flex-1 text-center"
                >
                  {t('header.reserve')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
