import { useState } from 'react'
import { Link } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/order', label: 'Place Order' },
  { to: '/track', label: 'Track Order' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">◆</span>
          SaiXerox
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
          <span className={open ? 'open' : ''} />
        </button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="nav-link admin-link"
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>
        </nav>
      </div>
      <style>{`
        .header {
          background: var(--black-soft);
          border-bottom: 2px solid var(--yellow);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--yellow);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .logo-icon {
          font-size: 1.25rem;
          opacity: 0.9;
        }
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 4px;
        }
        .nav-toggle span {
          width: 24px;
          height: 2px;
          background: var(--yellow);
          transition: transform 0.2s;
        }
        .nav-toggle span.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .nav-toggle span.open:nth-child(2) { opacity: 0; }
        .nav-toggle span.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: var(--gray-light);
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--yellow); }
        .admin-link { color: var(--gray); font-size: 0.9rem; }
        @media (max-width: 768px) {
          .nav-toggle { display: flex; }
          .nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--black-soft);
            flex-direction: column;
            padding: 1rem;
            gap: 0.5rem;
            border-bottom: 2px solid var(--yellow);
            display: none;
          }
          .nav.open { display: flex; }
        }
      `}</style>
    </header>
  )
}
