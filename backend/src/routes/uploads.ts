import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth } from '../middleware/auth'

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Solo imágenes permitidas'))
  },
})

const router = Router()

router.post('/image', requireAuth, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se recibió imagen' })
    return
  }
  const host = `${req.protocol}://${req.get('host')}`
  res.json({ url: `${host}/uploads/${req.file.filename}` })
})

export default router
