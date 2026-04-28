import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Café Premium Altura',
    category: 'Café',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    price: 38,
    originalPrice: 48,
    description: 'Café de altura cultivado en los Andes peruanos, tostado artesanal con notas de chocolate y frutos rojos.',
    region: 'Cajamarca',
    rating: 4.9,
    reviewCount: 312,
    isFeatured: true,
    stock: 45,
  },
  {
    name: 'Miel Pura de Flores Andinas',
    category: 'Miel',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=80',
    price: 32,
    description: 'Miel natural sin procesar, recolectada de colmenas en los valles andinos a más de 3000 msnm.',
    region: 'Apurímac',
    rating: 4.8,
    reviewCount: 186,
    isFeatured: true,
    stock: 28,
  },
  {
    name: 'Chocolate 70% Cacao Peruano',
    category: 'Chocolates',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&auto=format&fit=crop&q=80',
    price: 24,
    description: 'Tableta de chocolate artesanal elaborada con cacao peruano de origen único, premiado internacionalmente.',
    region: 'San Martín',
    rating: 4.9,
    reviewCount: 428,
    isNew: true,
    isFeatured: true,
    stock: 62,
  },
  {
    name: 'Manta Tejida a Mano',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&auto=format&fit=crop&q=80',
    price: 145,
    description: 'Manta tradicional tejida en telar de cintura por artesanas de comunidades andinas. Diseños únicos.',
    region: 'Cusco',
    rating: 4.7,
    reviewCount: 94,
    stock: 15,
  },
  {
    name: 'Quinoa Real Orgánica',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&auto=format&fit=crop&q=80',
    price: 28,
    description: 'Quinoa tricolor orgánica cultivada en el altiplano andino, el superalimento de los incas.',
    region: 'Puno',
    rating: 4.6,
    reviewCount: 203,
    stock: 80,
  },
  {
    name: 'Cerámica Shipibo-Conibo',
    category: 'Artesanías',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    price: 89,
    description: 'Pieza de cerámica pintada a mano con los patrones geométricos sagrados de la cultura Shipibo.',
    region: 'Ucayali',
    rating: 4.8,
    reviewCount: 67,
    isNew: true,
    stock: 12,
  },
  {
    name: 'Chicha Morada Gourmet',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
    price: 18,
    description: 'Concentrado de chicha morada elaborado con maíz morado peruano. Sin preservantes, sabor auténtico.',
    region: 'Lima',
    rating: 4.7,
    reviewCount: 156,
    isNew: true,
    stock: 50,
  },
  {
    name: 'Aceite de Sacha Inchi',
    category: 'Gourmet',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    price: 45,
    originalPrice: 55,
    description: 'Aceite prensado en frío del "maní del inca", rico en Omega 3 y antioxidantes naturales.',
    region: 'Amazonas',
    rating: 4.5,
    reviewCount: 89,
    isFeatured: true,
    stock: 35,
  },
]

async function main() {
  console.log('Seeding database...')

  await prisma.product.deleteMany()
  await prisma.seller.deleteMany()

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`Created ${products.length} products`)

  const hash = await bcrypt.hash('admin123', 10)
  await prisma.seller.create({
    data: {
      email: 'admin@amoryaventura.com',
      password: hash,
      name: 'Admin',
    },
  })
  console.log('Created seller: admin@amoryaventura.com / admin123')

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
