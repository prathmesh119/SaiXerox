export default function Services() {
  const services = [
    { name: 'Xerox (B&W)', desc: 'Single & double side, multiple copies', price: 'From ₹1/page' },
    { name: 'Colour Print', desc: 'A4 colour printing', price: 'From ₹5/page' },
    { name: 'Photo Print', desc: 'Glossy photo prints', price: 'Per sheet' },
    { name: 'Binding', desc: 'Spiral, soft cover', price: 'Per document' },
    { name: 'Lamination', desc: 'A4 lamination', price: 'Per sheet' },
    { name: 'Scan to PDF', desc: 'Document scanning', price: 'Per page' },
  ]

  return (
    <div className="page services">
      <div className="container">
        <h1>Our Services</h1>
        <p className="subtitle">Fast print and Xerox with multiple machines. Order online and collect at the shop.</p>
        <div className="service-grid">
          {services.map((s) => (
            <div key={s.name} className="service-card">
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="price">{s.price}</span>
            </div>
          ))}
        </div>
        <p className="note">Exact pricing is calculated when you place an order based on pages and options.</p>
      </div>
      <style>{`
        .page { padding: 3rem 0; min-height: 60vh; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
        .page h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: var(--white);
        }
        .subtitle { color: var(--gray); margin-bottom: 2rem; }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .service-card {
          background: var(--black-card);
          border: 1px solid rgba(255,193,7,0.2);
          border-radius: 12px;
          padding: 1.5rem;
          transition: border-color 0.2s;
        }
        .service-card:hover { border-color: var(--yellow); }
        .service-card h3 { color: var(--yellow); font-size: 1.15rem; margin-bottom: 0.35rem; }
        .service-card p { color: var(--gray-light); font-size: 0.95rem; margin-bottom: 0.5rem; }
        .service-card .price { color: var(--gray); font-size: 0.9rem; font-weight: 600; }
        .note { margin-top: 2rem; color: var(--gray); font-size: 0.9rem; }
      `}</style>
    </div>
  )
}
