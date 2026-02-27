import { Router } from 'express'
import { getAllOrders, updateOrderStatus } from '../store.js'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

function auth(req, res, next) {
  const pass = req.headers['x-admin-password']
  if (pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export const adminRouter = Router()

adminRouter.get('/orders', auth, (req, res) => {
  const orders = getAllOrders().map((o) => {
    const { documentPath, stripeSessionId, ...rest } = o
    return rest
  })
  res.json({ orders })
})

adminRouter.patch('/orders/status', auth, (req, res) => {
  const { orderId, status } = req.body
  if (!orderId || !status) {
    return res.status(400).json({ error: 'orderId and status required' })
  }
  const valid = ['pending', 'paid', 'processing', 'ready', 'collected']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const updated = updateOrderStatus(orderId, status)
  if (!updated) return res.status(404).json({ error: 'Order not found' })
  res.json(updated)
})
