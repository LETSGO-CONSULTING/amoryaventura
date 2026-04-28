import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string }
  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña requeridos' })
    return
  }

  const seller = await prisma.seller.findUnique({ where: { email } })
  if (!seller) {
    res.status(401).json({ error: 'Credenciales incorrectas' })
    return
  }

  const valid = await bcrypt.compare(password, seller.password)
  if (!valid) {
    res.status(401).json({ error: 'Credenciales incorrectas' })
    return
  }

  const token = jwt.sign(
    { sellerId: seller.id },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  )

  res.json({ token, seller: { id: seller.id, email: seller.email, name: seller.name } })
})

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const seller = await prisma.seller.findUnique({
    where: { id: req.sellerId },
    select: { id: true, email: true, name: true, createdAt: true },
  })
  if (!seller) {
    res.status(404).json({ error: 'No encontrado' })
    return
  }
  res.json(seller)
})

export default router
