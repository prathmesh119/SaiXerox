import { useState } from 'react'

const STATUS_LABELS = {
  pending: 'Order received',
  paid: 'Payment received',
  processing: 'Printing',
  ready: 'Ready for pickup',
  collected: 'Collected',
}
const SERVICE_LABELS = {
  xerox_bw: 'Xerox (B&W)',
  xerox_color: 'Colour Print',
  photo: 'Photo Print',
  lamination: 'Lamination (A4)',
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (e) => {
    e.preventDefault()
    setError('')
    setOrder(null)
    if (!orderId.trim() || !email.trim()) {
      setError('Enter order ID and email.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `/api/orders/track?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order not found')
      setOrder(data)
    } catch (err) {
      setError(err.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page track">
      <div className="container">
        <h1>Track your order</h1>
        <p className="subtitle">Enter the order ID and email you used when placing the order.</p>

        <form onSubmit={search} className="track-form">
          <div className="form-group">
            <label>Order ID</label>
            <input
              type="text"
              placeholder="e.g. SX-xxxx"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching…' : 'Track'}
          </button>
        </form>

        {order && (
          <div className="order-card">
            <h2>Order {order.orderId}</h2>
            <div className="status-badge" data-status={order.status}>
              {STATUS_LABELS[order.status] || order.status}
            </div>
            <dl className="order-details">
              <dt>Service</dt>
              <dd>{SERVICE_LABELS[order.service] || order.service}</dd>
              <dt>Copies × Pages</dt>
              <dd>{order.copies} × {order.pages}</dd>
              <dt>Amount</dt>
              <dd>₹{order.amount}</dd>
              <dt>Customer</dt>
              <dd>{order.customerName} – {order.email}</dd>
              {order.instructions && (
                <>
                  <dt>Instructions</dt>
                  <dd>{order.instructions}</dd>
                </>
              )}
            </dl>
          </div>
        )}
      </div>
      <style>{`
        .page { padding: 2rem 0 4rem; }
        .container { max-width: 480px; margin: 0 auto; padding: 0 1.25rem; }
        .page h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.35rem; }
        .subtitle { color: var(--gray); margin-bottom: 1.5rem; }
        .track-form {
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.2);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 0.35rem; color: var(--gray-light); }
        .form-group input {
          width: 100%;
          padding: 0.65rem 0.75rem;
          background: var(--black-soft);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 6px;
          color: var(--white);
        }
        .error { color: var(--danger); margin-bottom: 1rem; font-size: 0.9rem; }
        .btn { width: 100%; padding: 0.85rem; font-weight: 600; border-radius: 8px; border: none; }
        .btn-primary { background: var(--yellow); color: var(--black); }
        .order-card {
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .order-card h2 { font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--yellow); }
        .status-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .status-badge[data-status=pending] { background: rgba(255,193,7,0.2); color: var(--yellow); }
        .status-badge[data-status=paid] { background: rgba(67,160,71,0.3); color: #81c784; }
        .status-badge[data-status=processing] { background: rgba(33,150,243,0.3); color: #64b5f6; }
        .status-badge[data-status=ready] { background: rgba(67,160,71,0.3); color: #a5d6a7; }
        .status-badge[data-status=collected] { background: var(--gray); color: var(--black); }
        .order-details { display: grid; grid-template-columns: auto 1fr; gap: 0.35rem 1.5rem; }
        .order-details dt { color: var(--gray); }
        .order-details dd { margin: 0; color: var(--white); }
      `}</style>
    </div>
  )
}
