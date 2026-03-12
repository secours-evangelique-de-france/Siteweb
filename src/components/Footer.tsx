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
    <footer style={{
      background: '#0F0F0F',
      color: 'rgba(255,255,255,0.75)',
    }}>
      <div className="rainbow-bar" />

      <div className="container" style={{ padding: '4rem 0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <img src={logoSef} alt="SEF" style={{ height: '60px', width: 'auto', marginBottom: '1rem', filter: 'brightness(1)' }} />
            <p style={{ lineHeight: 1.8, fontSize: '0.9rem', maxWidth: '280px' }}>
              Le Secours Évangélique de France est une Association Loi 1901 œuvrant pour l'aide aux personnes
              en difficulté à travers toute la France.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {['📘', '📸', '▶️'].map((icon, i) => (
                <div key={i} style={{
                  width: '38px', height: '38px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
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

          {/* Missions */}
          <div>
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
            <div style={{ fontSize: '0.875rem', lineHeight: 2, color: 'rgba(255,255,255,0.65)' }}>
              <div>📍 Croissy-Beaubourg (77)</div>
              <div>📞 01 60 05 XX XX</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}>
                <span style={{ flexShrink: 0 }}>✉️</span>
                <span style={{ wordBreak: 'break-all' }}>contact@secoursevangeliquedefrance.com</span>
              </div>
              <div>🕐 Lun–Ven, 9h–17h</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => nav('don')}
              style={{ marginTop: '1.25rem', fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}
            >
              ❤️ Faire un don
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <span>© {new Date().getFullYear()} Secours Évangélique de France — Association Loi 1901</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Mentions légales', 'Politique de confidentialité', 'RGPD'].map((l) => (
              <span key={l} style={{ cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
