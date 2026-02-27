import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1>
            Fast <span className="highlight">Print</span> & <span className="highlight">Xerox</span>
          </h1>
          <p className="hero-tagline">
            Order online. We print. You collect. Multiple machines, no wait.
          </p>
          <div className="hero-cta">
            <Link to="/order" className="btn btn-primary">Place Order</Link>
            <Link to="/track" className="btn btn-outline">Track Order</Link>
          </div>
        </div>
      </section>
      <section className="features">
        <div className="container">
          <h2>Why SaiXerox?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Fast service</h3>
              <p>Multiple machines running so your job gets done quickly.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📄</span>
              <h3>Print & Xerox</h3>
              <p>Documents, photos, binding, laminating—all under one roof.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💳</span>
              <h3>Pay online</h3>
              <p>Secure payment when you order. No cash needed at the shop.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-bar">
        <div className="container">
          <p>Ready to get your documents printed?</p>
          <Link to="/order" className="btn btn-primary">Place your order</Link>
        </div>
      </section>
      <style>{`
        .page { min-height: 60vh; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        .hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,193,7,0.12) 0%, transparent 60%),
            linear-gradient(180deg, var(--black) 0%, var(--black-soft) 100%);
        }
        .hero-content { position: relative; text-align: center; }
        .hero h1 {
          font-size: clamp(2.25rem, 6vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .hero .highlight { color: var(--yellow); }
        .hero-tagline {
          font-size: 1.15rem;
          color: var(--gray-light);
          max-width: 420px;
          margin: 0 auto 2rem;
        }
        .hero-cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 1.75rem;
          font-weight: 600;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          background: var(--yellow);
          color: var(--black);
          border: none;
        }
        .btn-primary:hover { box-shadow: 0 6px 24px rgba(255,193,7,0.4); }
        .btn-outline {
          background: transparent;
          color: var(--yellow);
          border: 2px solid var(--yellow);
        }
        .features { padding: 4rem 0; }
        .features h2 {
          font-size: 1.75rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          color: var(--white);
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.2);
          border-radius: 12px;
          padding: 1.75rem;
          text-align: center;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: var(--yellow);
          transform: translateY(-4px);
        }
        .feature-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
        .feature-card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--yellow); }
        .feature-card p { color: var(--gray); font-size: 0.95rem; }
        .cta-bar {
          background: linear-gradient(90deg, rgba(255,193,7,0.15), rgba(255,193,7,0.05));
          border-top: 1px solid rgba(255,193,7,0.3);
          border-bottom: 1px solid rgba(255,193,7,0.3);
          padding: 2rem;
          text-align: center;
        }
        .cta-bar p { margin-bottom: 1rem; font-weight: 500; }
      `}</style>
    </div>
  )
}
