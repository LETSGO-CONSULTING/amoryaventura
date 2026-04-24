export interface Destination {
  id: string
  name: string
  region: string
  zone: string
  image: string
  description: string
  toursCount: number
  featured?: boolean
  status: 'active' | 'coming_soon'
}

export interface Tour {
  id: string
  title: string
  slug: string
  destination: string
  image: string
  category: TourCategory
  duration: string
  groupSize: number
  difficulty: 'Fácil' | 'Moderado' | 'Difícil'
  rating: number
  reviewCount: number
  price: number
  currency: 'PEN' | 'USD'
  isSocial: boolean
  isNew: boolean
  isPopular: boolean
  highlights: string[]
  includes: string[]
  notIncludes: string[]
  itinerary: string[]
  whatToBring: string[]
  departure?: string
  description: string
}

export type TourCategory = 'Todos' | 'Full Day' | 'Fin de Semana' | 'Aventura' | 'Cultural' | 'Social'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  image: string
  price: number
  originalPrice?: number
  description: string
  region: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
  stock: number
}

export type ProductCategory = 'Todos' | 'Café' | 'Miel' | 'Chocolates' | 'Artesanías' | 'Textiles' | 'Gourmet'

export interface Testimonial {
  id: string
  name: string
  age?: number
  city: string
  avatar: string
  rating: number
  text: string
  tourName?: string
  date: string
  isSocialConnection?: boolean
}

export interface GalleryItem {
  id: string
  image: string
  alt: string
  location: string
  size: 'small' | 'medium' | 'large'
}

export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  duration: string
  location: string
  youtubeId?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export type AttractionZone = 'Todos' | 'Oxapampa' | 'Pozuzo' | 'Villa Rica' | 'Perené'

export interface Attraction {
  id: string
  name: string
  zone: Exclude<AttractionZone, 'Todos'>
  image: string
  description: string
  tag: string
}
