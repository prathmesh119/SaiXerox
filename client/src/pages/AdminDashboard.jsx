import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'ready', 'collected']
const STATUS_LABELS = {
  pending: 'Received',
  paid: 'Paid',
  processing: 'Printing',
  ready: 'Ready',
  collected: 'Collected',
}
const SERVICE_LABELS = {
  xerox_bw: 'Xerox (B&W)',
  xerox_color: 'Colour Print',
  photo: 'Photo Print',
  lamination: 'Lamination (A4)',
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!authenticated) return
    loadOrders()
  }, [authenticated])

  const loadOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'X-Admin-Password': password },
      })
      if (res.status === 401) {
        setAuthenticated(false)
        setError('Invalid password')
        setLoading(false)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Password': password,
        },
        body: JSON.stringify({ orderId, status }),
      })
      if (res.status === 401) {
        setAuthenticated(false)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const login = (e) => {
    e.preventDefault()
    if (!password.trim()) return
    setError('')
    setAuthenticated(true)
  }

  if (!authenticated) {
    return (
      <div className="page admin">
        <div className="container small">
          <h1>Admin</h1>
          <p className="subtitle">Enter admin password to manage orders.</p>
          <form onSubmit={login} className="admin-login">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn btn-primary">Enter</button>
          </form>
        </div>
        <style>{`
          .page { padding: 3rem 0; }
          .container.small { max-width: 360px; margin: 0 auto; padding: 0 1.25rem; }
          .page h1 { font-size: 1.5rem; margin-bottom: 0.35rem; }
          .subtitle { color: var(--gray); margin-bottom: 1.5rem; }
          .admin-login { display: flex; flex-direction: column; gap: 1rem; }
          .admin-login input {
            padding: 0.75rem;
            background: var(--black-card);
            border: 1px solid rgba(255,193,7,0.3);
            border-radius: 8px;
            color: var(--white);
          }
          .error { color: var(--danger); font-size: 0.9rem; }
          .btn { padding: 0.75rem; font-weight: 600; border-radius: 8px; border: none; }
          .btn-primary { background: var(--yellow); color: var(--black); }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page admin">
      <div className="container">
        <h1>Orders</h1>
        <p className="subtitle">Update status so customers can see progress. Refresh to load new orders.</p>
        {error && <p className="error">{error}</p>}
        <button type="button" className="btn btn-outline refresh" onClick={loadOrders} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>

        <div className="orders-list">
          {orders.length === 0 && !loading && <p className="empty">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.orderId} className="order-row">
              <div className="order-info">
                <strong>{o.orderId}</strong>
                <span>{o.customerName} – {o.email}</span>
                <span>{SERVICE_LABELS[o.service] || o.service} · {o.copies}×{o.pages} · ₹{o.amount}</span>
              </div>
              <div className="order-actions">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.orderId, e.target.value)}
                  disabled={updating === o.orderId}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .page { padding: 2rem 0 4rem; }
        .container { max-width: 800px; margin: 0 auto; padding: 0 1.25rem; }
        .page h1 { font-size: 1.5rem; margin-bottom: 0.35rem; }
        .subtitle { color: var(--gray); margin-bottom: 1rem; }
        .error { color: var(--danger); margin-bottom: 1rem; }
        .refresh { margin-bottom: 1.5rem; }
        .btn { padding: 0.5rem 1rem; font-weight: 600; border-radius: 8px; }
        .btn-outline { background: transparent; color: var(--yellow); border: 2px solid var(--yellow); }
        .orders-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .empty { color: var(--gray); }
        .order-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.2);
          border-radius: 10px;
          padding: 1rem;
        }
        .order-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .order-info strong { color: var(--yellow); }
        .order-info span { font-size: 0.9rem; color: var(--gray); }
        .order-actions select {
          padding: 0.5rem 0.75rem;
          background: var(--black-soft);
          border: 1px solid var(--yellow);
          border-radius: 6px;
          color: var(--white);
        }
      `}</style>
    </div>
  )
}
