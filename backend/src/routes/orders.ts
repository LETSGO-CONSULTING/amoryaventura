import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/auth'
import { createCharge } from '../lib/culqi'

const router = Router()

interface OrderBody {
  customerName: string
  customerEmail: string
  customerPhone: string
  delivery: 'home' | 'pickup'
  address?: string
  district?: string
  city?: string
  notes?: string
  culqiToken: string
  items: { productId: string; quantity: number }[]
}

// POST /api/orders — create order + charge via Culqi
router.post('/', async (req: Request, res: Response) => {
  const body = req.body as OrderBody

  const { customerName, customerEmail, customerPhone, delivery, address, district, city, notes, culqiToken, items } = body

  if (!customerName || !customerEmail || !customerPhone || !culqiToken || !items?.length) {
    res.status(400).json({ error: 'Datos incompletos' })
    return
  }
  if (delivery === 'home' && !address) {
    res.status(400).json({ error: 'Dirección requerida para delivery a domicilio' })
    return
  }

  // Fetch products and validate stock
  const productIds = items.map(i => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } })

  if (products.length !== productIds.length) {
    res.status(400).json({ error: 'Uno o más productos no disponibles' })
    return
  }

  for (const item of items) {
    const product = products.find(p => p.id === item.productId)!
    if (product.stock < item.quantity) {
      res.status(400).json({ error: `Stock insuficiente para: ${product.name}` })
      return
    }
  }

  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)!
    return sum + product.price * item.quantity
  }, 0)

  // Create order (pending)
  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      customerPhone,
      delivery,
      address,
      district,
      city,
      notes,
      total,
      status: 'pending',
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: products.find(p => p.id === item.productId)!.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  })

  // Charge via Culqi
  try {
    const amountCentavos = Math.round(total * 100)
    const charge = await createCharge({
      amount: amountCentavos,
      currency: 'PEN',
      email: customerEmail,
      sourceId: culqiToken,
      description: `Pedido Amor y Aventura #${order.id.slice(-8)}`,
      orderId: order.id,
    })

    // Mark as paid, decrease stock
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', culqiChargeId: String(charge.id) },
    })

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    res.status(201).json({ ...order, status: 'paid', culqiChargeId: charge.id })
  } catch (err) {
    // Cancel order if payment fails
    await prisma.order.update({ where: { id: order.id }, data: { status: 'cancelled' } })
    const message = err instanceof Error ? err.message : 'Error al procesar el pago'
    res.status(402).json({ error: message })
  }
})

// GET /api/orders — seller only
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: { select: { name: true, image: true } } } },
    },
  })
  res.json(orders)
})

// GET /api/orders/:id — seller only
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } } },
  })
  if (!order) {
    res.status(404).json({ error: 'Pedido no encontrado' })
    return
  }
  res.json(order)
})

// PATCH /api/orders/:id/status — seller only
router.patch('/:id/status', requireAuth, async (req: Request, res: Response) => {
  const { status } = req.body as { status: string }
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
  })
  res.json(order)
})

export default router
