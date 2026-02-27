import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'orders.json')

function ensureDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readOrders() {
  ensureDir()
  if (!fs.existsSync(DATA_FILE)) return []
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeOrders(orders) {
  ensureDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

export function getAllOrders() {
  return readOrders()
}

export function getOrderById(orderId) {
  return readOrders().find((o) => o.orderId === orderId)
}

export function getOrderByEmailAndId(orderId, email) {
  const o = getOrderById(orderId)
  if (!o || o.email.toLowerCase() !== email.trim().toLowerCase()) return null
  return o
}

export function createOrder(order) {
  const orders = readOrders()
  orders.unshift(order)
  writeOrders(orders)
  return order
}

export function updateOrderStatus(orderId, status) {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.orderId === orderId)
  if (idx === -1) return null
  orders[idx].status = status
  orders[idx].updatedAt = new Date().toISOString()
  writeOrders(orders)
  return orders[idx]
}

export function updateOrder(orderId, updates) {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.orderId === orderId)
  if (idx === -1) return null
  Object.assign(orders[idx], updates)
  orders[idx].updatedAt = new Date().toISOString()
  writeOrders(orders)
  return orders[idx]
}

export function findOrderByPhonePeMerchantTransactionId(merchantTransactionId) {
  return readOrders().find((o) => o.phonePeMerchantTransactionId === merchantTransactionId)
}
