import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { ordersRouter } from './routes/orders.js'
import { adminRouter } from './routes/admin.js'
import { phonePeRouter } from './routes/phonepe.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)
app.use('/api/payments', phonePeRouter)

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
