import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SERVICE_OPTIONS = [
  { id: 'xerox_bw', label: 'Xerox (B&W)', pricePerPage: 1 },
  { id: 'xerox_color', label: 'Colour Print', pricePerPage: 5 },
  { id: 'photo', label: 'Photo Print', pricePerPage: 10 },
  { id: 'lamination', label: 'Lamination (A4)', pricePerPage: 15 },
]

export default function PlaceOrder() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    service: 'xerox_bw',
    copies: 1,
    pages: 1,
    instructions: '',
    customerName: '',
    email: '',
    phone: '',
    file: null,
  })

  const selectedService = SERVICE_OPTIONS.find((s) => s.id === form.service)
  const totalPages = form.copies * form.pages
  const subtotal = selectedService ? totalPages * selectedService.pricePerPage : 0
  const total = Math.round(subtotal * 100) / 100

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size > 15 * 1024 * 1024) {
      setError('File must be under 15 MB')
      return
    }
    setError('')
    update('file', file || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (step === 1) {
      setStep(2)
      return
    }
    if (!form.customerName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill name, email and phone.')
      return
    }
    setLoading(true)
    try {
      const body = new FormData()
      body.append('service', form.service)
      body.append('copies', form.copies)
      body.append('pages', form.pages)
      body.append('instructions', form.instructions)
      body.append('customerName', form.customerName)
      body.append('email', form.email)
      body.append('phone', form.phone)
      body.append('amount', total)
      if (form.file) body.append('document', form.file)

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        body,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
        return
      }
      navigate(`/order/success?orderId=${data.orderId || ''}`)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page place-order">
      <div className="container">
        <h1>Place Order</h1>
        <p className="subtitle">Upload your document, choose options, pay online, and collect at the shop.</p>

        <form onSubmit={handleSubmit} className="order-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Service</label>
                <select
                  value={form.service}
                  onChange={(e) => update('service', e.target.value)}
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label} (₹{s.pricePerPage}/page)</option>
                  ))}
                </select>
              </div>
              <div className="row">
                <div className="form-group">
                  <label>Number of copies</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={form.copies}
                    onChange={(e) => update('copies', parseInt(e.target.value, 10) || 1)}
                  />
                </div>
                <div className="form-group">
                  <label>Pages per copy</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={form.pages}
                    onChange={(e) => update('pages', parseInt(e.target.value, 10) || 1)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Document (PDF or image, max 15 MB)</label>
                <input type="file" accept=".pdf,image/*" onChange={handleFile} />
                {form.file && <span className="file-name">{form.file.name}</span>}
              </div>
              <div className="form-group">
                <label>Instructions (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. double-sided, specific paper"
                  value={form.instructions}
                  onChange={(e) => update('instructions', e.target.value)}
                />
              </div>
              <div className="summary">
                <p>Total pages: {totalPages}</p>
                <p className="total">Amount: ₹{total}</p>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-group">
                <label>Your name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={form.customerName}
                  onChange={(e) => update('customerName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </div>
              <div className="summary">
                <p className="total">Amount to pay: ₹{total}</p>
              </div>
            </>
          )}
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            {step === 2 && (
              <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing…' : step === 1 ? 'Continue to payment' : 'Pay & place order'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .page { padding: 2rem 0 4rem; }
        .container { max-width: 560px; margin: 0 auto; padding: 0 1.25rem; }
        .page h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.35rem; }
        .subtitle { color: var(--gray); margin-bottom: 2rem; }
        .order-form { background: var(--black-card); border: 1px solid rgba(255,193,7,0.2); border-radius: 12px; padding: 1.5rem; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 0.35rem; color: var(--gray-light); }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          padding: 0.65rem 0.75rem;
          background: var(--black-soft);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 6px;
          color: var(--white);
        }
        .form-group input[type=file] { padding: 0.5rem 0; }
        .file-name { display: block; font-size: 0.85rem; color: var(--yellow); margin-top: 0.25rem; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .summary { margin: 1.25rem 0; padding: 1rem; background: var(--black-soft); border-radius: 8px; }
        .summary .total { font-size: 1.25rem; font-weight: 700; color: var(--yellow); }
        .error { color: var(--danger); margin-bottom: 1rem; font-size: 0.9rem; }
        .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .form-actions .btn { flex: 1; }
        @media (max-width: 480px) { .row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
