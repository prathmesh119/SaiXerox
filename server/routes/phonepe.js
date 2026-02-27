import { Router } from 'express'
import { getPhonePeStatus, isPhonePePaymentSuccess } from '../phonepe.js'
import { findOrderByPhonePeMerchantTransactionId, updateOrderStatus } from '../store.js'

export const phonePeRouter = Router()

function extractMerchantTransactionId(req) {
  const direct =
    req.query.merchantTransactionId ||
    req.query.merchantTransactionID ||
    req.query.transactionId ||
    req.query.transactionID
  if (direct) return String(direct)

  const encoded = req.query.response
  if (encoded) {
    try {
      const json = JSON.parse(Buffer.from(String(encoded), 'base64').toString('utf8'))
      return (
        json?.data?.merchantTransactionId ||
        json?.merchantTransactionId ||
        json?.merchantTransactionID ||
        null
      )
    } catch {
      return null
    }
  }
  return null
}

phonePeRouter.get('/phonepe/callback', async (req, res) => {
  const merchantTransactionId = extractMerchantTransactionId(req)
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

  if (!merchantTransactionId) {
    return res.redirect(`${frontendUrl}/order?error=missing_transaction`)
  }

  const order = findOrderByPhonePeMerchantTransactionId(merchantTransactionId)
  if (!order) {
    return res.redirect(`${frontendUrl}/order?error=order_not_found`)
  }

  try {
    const status = await getPhonePeStatus({ merchantTransactionId })
    if (isPhonePePaymentSuccess(status)) {
      updateOrderStatus(order.orderId, 'paid')
      return res.redirect(`${frontendUrl}/order/success?orderId=${encodeURIComponent(order.orderId)}`)
    }
    return res.redirect(`${frontendUrl}/order?error=payment_not_success&orderId=${encodeURIComponent(order.orderId)}`)
  } catch (err) {
    return res.redirect(`${frontendUrl}/order?error=payment_verify_failed&orderId=${encodeURIComponent(order.orderId)}`)
  }
})

// Optional internal status check (useful for debugging)
phonePeRouter.post('/phonepe/status', async (req, res) => {
  const { merchantTransactionId } = req.body || {}
  if (!merchantTransactionId) return res.status(400).json({ error: 'merchantTransactionId required' })
  try {
    const status = await getPhonePeStatus({ merchantTransactionId })
    res.json(status)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Status check failed' })
  }
})

