import HeroSection from '@/components/HeroSection/HeroSection'
import DestinationsSection from '@/components/DestinationsSection/DestinationsSection'
import ToursSection from '@/components/ToursSection/ToursSection'
import ConnectionSection from '@/components/ConnectionSection/ConnectionSection'
import GallerySection from '@/components/GallerySection/GallerySection'
import VideoSection from '@/components/VideoSection/VideoSection'
import ShopSection from '@/components/ShopSection/ShopSection'
import TestimonialsSection from '@/components/TestimonialsSection/TestimonialsSection'
import CTASection from '@/components/CTASection/CTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <DestinationsSection />
      <ToursSection />
      <ConnectionSection />
      <GallerySection />
      <VideoSection />
      <ShopSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
