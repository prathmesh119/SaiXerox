import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">◆</span> SaiXerox
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/order">Place Order</Link>
          <Link to="/track">Track Order</Link>
        </div>
        <p className="footer-copy">
          Fast print & Xerox. Order online, collect at shop.
        </p>
      </div>
      <style>{`
        .footer {
          background: var(--black-soft);
          border-top: 1px solid rgba(255,193,7,0.3);
          margin-top: 4rem;
          padding: 2rem 1.25rem;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        .footer-brand {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--yellow);
          margin-bottom: 1rem;
        }
        .logo-icon { opacity: 0.9; }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        .footer-links a { color: var(--gray-light); font-weight: 500; }
        .footer-copy { color: var(--gray); font-size: 0.9rem; }
      `}</style>
    </footer>
  )
}
