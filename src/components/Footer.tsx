import { NavPage } from '../types';
import logoSef from '../assets/logosef.jpeg';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const nav = (page: NavPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#0F0F0F', color: 'rgba(255,255,255,0.75)' }}>
      <div className="rainbow-bar" />

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-legal {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .footer-legal {
            gap: 1rem;
            font-size: 0.75rem;
          }
          .footer-brand-text {
            font-size: 0.85rem !important;
          }
          .footer-contact-item {
            font-size: 0.82rem !important;
          }
          .footer-email {
            font-size: 0.75rem !important;
            word-break: break-all;
          }
          .footer-cta-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .footer-cta-row a,
          .footer-cta-row button {
            text-align: center;
            justify-content: center;
          }
          .footer-section-hidden {
            display: none;
          }
        }
      `}</style>

      <div className="container" style={{ padding: '4rem 0 2rem' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <img src={logoSef} alt="SEF" style={{ height: '56px', width: 'auto', marginBottom: '1rem' }} />
            <p className="footer-brand-text" style={{ lineHeight: 1.8, fontSize: '0.9rem', maxWidth: '280px' }}>
              Le Secours Évangélique de France — Association Loi 1901 œuvrant pour l'aide aux personnes
              en difficulté à travers toute la France.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['📘', '📸', '▶️'].map((icon, i) => (
                <div key={i} style={{
                  width: '38px', height: '38px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1rem',
                  transition: 'background 0.2s',
                }}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Navigation
            </h5>
            {([
              ['accueil', 'Accueil'],
              ['missions', 'Nos Missions'],
              ['actualites', 'Actualités'],
              ['antennes', 'Trouver une Antenne'],
              ['galerie', 'Galerie'],
              ['benevole', 'Devenir Bénévole'],
              ['don', 'Faire un Don'],
              ['contact', 'Contact'],
            ] as [NavPage, string][]).map(([page, label]) => (
              <button
                key={page}
                onClick={() => nav(page)}
                style={{
                  display: 'block', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.65)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                  padding: '0.3rem 0', textAlign: 'left', lineHeight: 1.8,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Missions — masqué sur mobile */}
          <div className="footer-section-hidden">
            <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Missions
            </h5>
            {['Jeunesse', 'Santé & Soins', 'NOUBES', 'Réinsertion', 'Famille', 'Séniors', 'Hébergement'].map((m) => (
              <div key={m} style={{ fontSize: '0.875rem', padding: '0.3rem 0', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)' }}>
                {m}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Contact
            </h5>
            <div style={{ lineHeight: 2, color: 'rgba(255,255,255,0.65)' }}>
              <div className="footer-contact-item" style={{ fontSize: '0.875rem' }}>📍 Croissy-Beaubourg (77)</div>
              <div className="footer-contact-item" style={{ fontSize: '0.875rem' }}>📞 01 60 05 XX XX</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}>
                <span style={{ flexShrink: 0 }}>✉️</span>
                <span className="footer-email" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  contact@secoursevangeliquedefrance.com
                </span>
              </div>
              <div className="footer-contact-item" style={{ fontSize: '0.875rem' }}>🕐 Lun–Ven, 9h–17h</div>
            </div>
            <div className="footer-cta-row" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => nav('don')}
                style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}
              >
                ❤️ Faire un don
              </button>
              <a
                href="/brochure-sef.pdf"
                download="Brochure-SEF.pdf"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '50px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.85rem', fontWeight: 600,
                  color: 'white', textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
              >
                📄 Brochure PDF
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom" style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span>© {new Date().getFullYear()} Secours Évangélique de France — Association Loi 1901</span>
          <div className="footer-legal">
            {['Mentions légales', 'Confidentialité', 'RGPD'].map((l) => (
              <span key={l} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
