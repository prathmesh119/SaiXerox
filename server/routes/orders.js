import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'
import { createOrder, getOrderByEmailAndId, updateOrder } from '../store.js'
import { createPhonePePayPage, isPhonePeConfigured } from '../phonepe.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
})

export const ordersRouter = Router()

ordersRouter.post('/create', upload.single('document'), async (req, res) => {
  try {
    const {
      service,
      copies,
      pages,
      instructions,
      customerName,
      email,
      phone,
      amount,
    } = req.body

    const orderId = `SX-${uuidv4().slice(0, 8).toUpperCase()}`
    const amountNum = parseFloat(amount) || 0
    const docPath = req.file ? `/uploads/${req.file.filename}` : null

    const order = {
      orderId,
      service: service || 'xerox_bw',
      copies: parseInt(copies, 10) || 1,
      pages: parseInt(pages, 10) || 1,
      instructions: (instructions || '').trim(),
      customerName: (customerName || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      amount: amountNum,
      documentPath: docPath,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    createOrder(order)

    if (isPhonePeConfigured() && amountNum > 0) {
      const pay = await createPhonePePayPage({
        orderId,
        amountInr: amountNum,
        customerPhone: order.phone,
        customerEmail: order.email,
      })
      updateOrder(orderId, { phonePeMerchantTransactionId: pay.merchantTransactionId })
      res.json({ orderId, paymentUrl: pay.paymentUrl })
    } else {
      res.json({
        orderId,
        message: 'Order created. Payment not configured or amount is zero.',
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Order creation failed' })
  }
})

ordersRouter.get('/track', (req, res) => {
  const { orderId, email } = req.query
  if (!orderId || !email) {
    return res.status(400).json({ error: 'orderId and email required' })
  }
  const order = getOrderByEmailAndId(orderId.trim(), email.trim())
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const { documentPath, stripeSessionId, phonePeMerchantTransactionId, ...publicOrder } = order
  res.json(publicOrder)
})
