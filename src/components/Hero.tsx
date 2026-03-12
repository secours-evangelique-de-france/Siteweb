import { NavPage } from '../types';

interface HeroProps {
  onNavigate: (page: NavPage) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FAFAF8 0%, #FFF8F4 50%, #F0F9FF 100%)',
      paddingTop: '90px',
    }}>
      {/* Subtle background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.05,
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(41,171,226,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(232,40,30,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(75,174,79,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 12s ease-in-out infinite',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left content */}
          <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(41,171,226,0.1)',
              border: '1px solid rgba(41,171,226,0.3)',
              borderRadius: '50px',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sef-teal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Association Loi 1901
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--text-primary)',
            }}>
              Ensemble,{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                servons
              </span>{' '}
              ceux qui en ont besoin
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              maxWidth: '520px',
              marginBottom: '2.5rem',
              animationDelay: '0.1s',
            }}>
              Le Secours Évangélique de France agit au quotidien pour accompagner les personnes
              vulnérables à travers ses antennes en France — alimentation, logement, santé,
              insertion, et bien plus encore.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('missions')} style={{ fontSize: '1rem' }}>
                Nos Missions
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('antennes')} style={{ fontSize: '1rem' }}>
                Trouver une Antenne
              </button>
              <a
                href="/brochure-sef.pdf"
                download="Brochure-SEF.pdf"
                className="btn"
                style={{
                  fontSize: '1rem',
                  background: 'white',
                  color: 'var(--sef-teal)',
                  border: '2px solid var(--sef-teal)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                📄 Télécharger la brochure
              </a>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              marginTop: '3rem',
              paddingTop: '3rem',
              borderTop: '1px solid var(--border)',
            }}>
              {[
                { value: '13', label: 'Antennes', color: 'var(--sef-red)' },
                { value: '10+', label: 'Missions', color: 'var(--sef-green)' },
                { value: '2000+', label: 'Familles aidées', color: 'var(--sef-teal)' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Decorative visual */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeUp 0.8s 0.2s ease both',
          }}>
            {/* Main card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: '0 30px 80px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: '420px',
              position: 'relative',
              zIndex: 2,
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="rainbow-bar" style={{ borderRadius: '4px', marginBottom: '1.5rem' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
                  Nos valeurs fondamentales
                </h3>
              </div>
              {[
                { icon: '✝️', title: 'Foi et Engagement', desc: 'Ancrés dans nos convictions évangéliques', color: 'var(--sef-purple)' },
                { icon: '🤝', title: 'Solidarité', desc: 'Chacun mérite dignité et respect', color: 'var(--sef-teal)' },
                { icon: '💪', title: 'Action Concrète', desc: 'Des actes qui changent des vies', color: 'var(--sef-green)' },
                { icon: '🌍', title: 'Inclusion', desc: 'Ouverts à toutes et à tous', color: 'var(--sef-orange)' },
              ].map((v) => (
                <div key={v.title} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${v.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    flexShrink: 0,
                  }}>{v.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.1rem' }}>{v.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.desc}</div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-primary"
                onClick={() => onNavigate('don')}
                style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
              >
                ❤️ Soutenir le SEF
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <div style={{
          width: '24px',
          height: '40px',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '6px',
        }}>
          <div style={{
            width: '4px',
            height: '8px',
            background: 'var(--sef-red)',
            borderRadius: '2px',
            animation: 'float 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
