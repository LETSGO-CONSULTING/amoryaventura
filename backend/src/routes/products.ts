import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/products — public, supports ?category=&search=&sort=&featured=
router.get('/', async (req: Request, res: Response) => {
  const { category, search, sort, featured } = req.query as Record<string, string>

  const where: Record<string, unknown> = { active: true }
  if (category && category !== 'Todos') where.category = category
  if (featured === 'true') where.isFeatured = true
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { region: { contains: search, mode: 'insensitive' } },
    ]
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  else if (sort === 'price_desc') orderBy = { price: 'desc' }
  else if (sort === 'name') orderBy = { name: 'asc' }
  else if (sort === 'rating') orderBy = { rating: 'desc' }

  const products = await prisma.product.findMany({ where, orderBy })
  res.json(products)
})

// GET /api/products/:id — public
router.get('/:id', async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } })
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }
  res.json(product)
})

// POST /api/products — seller only
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const data = req.body as {
    name: string; category: string; image: string; price: number;
    originalPrice?: number; description: string; region: string; stock: number;
    isNew?: boolean; isFeatured?: boolean;
  }
  const product = await prisma.product.create({ data })
  res.status(201).json(product)
})

// PUT /api/products/:id — seller only
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  })
  res.json(product)
})

// DELETE /api/products/:id — seller only (soft delete)
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  await prisma.product.update({
    where: { id: req.params.id },
    data: { active: false },
  })
  res.json({ ok: true })
})

export default router
