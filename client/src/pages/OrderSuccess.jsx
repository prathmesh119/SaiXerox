import { useSearchParams, Link } from 'react-router-dom'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <div className="page success">
      <div className="container">
        <div className="success-card">
          <span className="success-icon">✓</span>
          <h1>Order placed</h1>
          {orderId && <p className="order-id">Order ID: <strong>{orderId}</strong></p>}
          <p className="message">
            {orderId
              ? 'We’ll start your print as soon as payment is confirmed. Use Track Order with this ID and your email to see status.'
              : 'Your order has been received. Check your email for order ID and tracking link.'}
          </p>
          <div className="actions">
            <Link to="/track" className="btn btn-primary">Track order</Link>
            <Link to="/" className="btn btn-outline">Back to home</Link>
          </div>
        </div>
      </div>
      <style>{`
        .page { padding: 3rem 0; min-height: 60vh; display: flex; align-items: center; }
        .container { max-width: 480px; margin: 0 auto; padding: 0 1.25rem; }
        .success-card {
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }
        .success-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: var(--success);
          color: white;
          font-size: 1.75rem;
          font-weight: bold;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        .success-card h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
        .order-id { color: var(--yellow); margin-bottom: 0.5rem; }
        .message { color: var(--gray-light); font-size: 0.95rem; margin-bottom: 1.5rem; }
        .actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn { padding: 0.75rem 1.25rem; font-weight: 600; border-radius: 8px; }
        .btn-primary { background: var(--yellow); color: var(--black); border: none; }
        .btn-outline { background: transparent; color: var(--yellow); border: 2px solid var(--yellow); }
      `}</style>
    </div>
  )
}
