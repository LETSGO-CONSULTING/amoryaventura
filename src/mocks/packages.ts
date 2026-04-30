export interface Hotel {
  id: string
  name: string
  type: 'Hospedaje' | 'Hotel' | 'Cabañas' | 'Hotel / Cabaña'
  location: string
  amenities: ('piscina' | 'desayuno' | 'cochera' | 'pet')[]
  prices: Record<string, number>
}

export interface GroupPackage {
  id: string
  name: string
  duration: string
  badge: string
  badgeColor: string
  highlight: string
  schedule: { day: string; label: string; time: string }[]
  includes: string[]
  msg: (hotel: string, price: number) => string
  featured?: boolean
}

export interface SinglesPackage {
  id: string
  days: number
  title: string
  subtitle: string
  dynamics: string[]
  includes: string[]
  highlight: boolean
}

export const HOTELS: Hotel[] = [
  { id: 'h1',  name: 'Oxarima',          type: 'Hospedaje',      location: 'A 2 cuadras de la Plaza',    amenities: ['cochera', 'pet'],                prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549, 'cr-2d': 360, 'cr-3d': 460, 'cr-4d': 560 } },
  { id: 'h2',  name: 'Misuri',           type: 'Hospedaje',      location: 'A 3 cuadras de la Plaza',    amenities: [],                                prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549, 'cr-2d': 360, 'cr-3d': 460, 'cr-4d': 560 } },
  { id: 'h3',  name: 'Amaia',            type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: [],                                prices: { '2d1n': 349, '3d2n': 449, '4d3n': 549, 'cr-2d': 360, 'cr-3d': 460, 'cr-4d': 560 } },
  { id: 'h4',  name: 'Panduro',          type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: [],                                prices: { '2d1n': 379, '3d2n': 479, '4d3n': 579, 'cr-2d': 390, 'cr-3d': 490, 'cr-4d': 590 } },
  { id: 'h5',  name: 'Yanachaga',        type: 'Hospedaje',      location: 'A 5 cuadras de la Plaza',    amenities: ['cochera'],                       prices: { '2d1n': 379, '3d2n': 479, '4d3n': 579, 'cr-2d': 390, 'cr-3d': 490, 'cr-4d': 590 } },
  { id: 'h6',  name: 'Chimi',            type: 'Hospedaje',      location: 'A 1 cuadra de la Plaza',     amenities: [],                                prices: { '2d1n': 399, '3d2n': 499, '4d3n': 599, 'cr-2d': 410, 'cr-3d': 510, 'cr-4d': 610 } },
  { id: 'h7',  name: 'Chimi House',      type: 'Hotel',          location: 'A 1.4 km de la Plaza',       amenities: ['piscina', 'cochera'],            prices: { '2d1n': 449, '3d2n': 549, '4d3n': 649, 'cr-2d': 460, 'cr-3d': 560, 'cr-4d': 660 } },
  { id: 'h8',  name: 'Tunki Lodge',      type: 'Hotel',          location: 'Frente a la Plaza',          amenities: ['piscina', 'desayuno', 'pet'],    prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699, 'cr-2d': 510, 'cr-3d': 610, 'cr-4d': 710 } },
  { id: 'h9',  name: "D'palo",           type: 'Cabañas',        location: 'A 4 cuadras de la Plaza',    amenities: ['piscina', 'desayuno', 'cochera'],prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699, 'cr-2d': 510, 'cr-3d': 610, 'cr-4d': 710 } },
  { id: 'h10', name: 'Esperanza',        type: 'Hotel',          location: 'A 3 cuadras de la Plaza',    amenities: ['piscina', 'desayuno', 'cochera'],prices: { '2d1n': 499, '3d2n': 599, '4d3n': 699, 'cr-2d': 510, 'cr-3d': 610, 'cr-4d': 710 } },
  { id: 'h11', name: 'Hassinger',        type: 'Hotel',          location: 'A 1.7 km de la Plaza',       amenities: ['piscina', 'desayuno', 'cochera'],prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749, 'cr-2d': 560, 'cr-3d': 660, 'cr-4d': 760 } },
  { id: 'h12', name: 'Casa Oxapampina',  type: 'Hotel / Cabaña', location: 'A 2.7 km de la Plaza',       amenities: ['piscina', 'desayuno', 'cochera'],prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749, 'cr-2d': 560, 'cr-3d': 660, 'cr-4d': 760 } },
  { id: 'h13', name: 'Biosfera Lodge',   type: 'Hotel / Cabaña', location: 'A 2.1 km de la Plaza',       amenities: ['cochera'],                       prices: { '2d1n': 549, '3d2n': 649, '4d3n': 749, 'cr-2d': 560, 'cr-3d': 660, 'cr-4d': 760 } },
]

export const GROUP_PACKAGES: GroupPackage[] = [
  {
    id: '2d1n',
    name: 'Escapada Verde',
    duration: '2 Días / 1 Noche',
    badge: 'Más elegido',
    badgeColor: 'bg-coral text-white',
    highlight: 'coral',
    schedule: [
      { day: 'Día 1', label: 'Full Day Oxapampa', time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Pozuzo',   time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '2 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Escapada Verde (2D/1N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
  },
  {
    id: '3d2n',
    name: 'Exploradores',
    duration: '3 Días / 2 Noches',
    badge: 'Recomendado',
    badgeColor: 'bg-vino text-white',
    highlight: 'vino',
    featured: true,
    schedule: [
      { day: 'Día 1', label: 'Full Day Oxapampa', time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Pozuzo',   time: '10:30 am – 6:30 pm' },
      { day: 'Día 3', label: 'Full Day Villa Rica', time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '3 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Exploradores (3D/2N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
  },
  {
    id: '4d3n',
    name: 'Gran Aventura',
    duration: '4 Días / 3 Noches',
    badge: 'Experiencia completa',
    badgeColor: 'bg-olive text-white',
    highlight: 'olive',
    schedule: [
      { day: 'Día 1', label: 'Full Day Pozuzo',    time: '10:30 am – 6:30 pm' },
      { day: 'Día 2', label: 'Full Day Villa Rica', time: '10:30 am – 6:30 pm' },
      { day: 'Día 3', label: 'Full Day Perené',    time: '10:30 am – 6:30 pm' },
      { day: 'Día 4', label: 'Full Day Oxapampa',  time: '10:30 am – 6:30 pm' },
    ],
    includes: [
      'Bus cama 160° desde Lima',
      'Traslados internos',
      'Hospedaje baño privado + TV Smart',
      '4 tours full day con guía',
      'Tickets de ingreso',
      'Sesión fotográfica',
      'Sorteos de productos locales',
      'Atención 24/7 por WhatsApp',
    ],
    msg: (hotel, price) =>
      `Hola! Quiero reservar el paquete *Gran Aventura (4D/3N)* con alojamiento en *${hotel}* por S/. ${price} por persona. ¿Tienen disponibilidad?`,
  },
]

export const SINGLES_PACKAGES: SinglesPackage[] = [
  {
    id: 'cr-2d',
    days: 2,
    title: 'Escapada Conexión',
    subtitle: '1 noche · Intro al grupo',
    highlight: false,
    dynamics: [
      'Dinámica de presentación grupal',
      'Reto de equipos (naturaleza)',
      'Fogata de cierre + conversación',
    ],
    includes: [
      'Transporte ida y vuelta',
      'Guía social certificado',
      'Alojamiento 1 noche',
      'Alimentación incluida',
    ],
  },
  {
    id: 'cr-3d',
    days: 3,
    title: 'Aventura Real',
    subtitle: '2 noches · Experiencia completa',
    highlight: true,
    dynamics: [
      'Formación de equipos competitivos',
      'Retos diarios con puntuación',
      'Competencia de aventura en naturaleza',
      'Fogata + dinámica nocturna',
      'Ceremonia de cierre del grupo',
    ],
    includes: [
      'Transporte ida y vuelta',
      'Guía social certificado',
      'Alojamiento 2 noches',
      'Alimentación incluida',
      'Kit de bienvenida',
    ],
  },
  {
    id: 'cr-4d',
    days: 4,
    title: 'Conexión Profunda',
    subtitle: '3 noches · Full experience',
    highlight: false,
    dynamics: [
      'Formación de equipos competitivos',
      'Retos diarios con ranking acumulado',
      'Reto final de aventura',
      'Dinámica nocturna cada noche',
      'Ceremonia de premiación',
      'Álbum grupal de fotos',
    ],
    includes: [
      'Transporte ida y vuelta',
      'Guía social certificado',
      'Alojamiento 3 noches',
      'Alimentación completa',
      'Kit de bienvenida premium',
      'Sesión fotográfica profesional',
    ],
  },
]
