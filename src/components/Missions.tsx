import { useState } from 'react';
import { MISSIONS } from '../data';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NavPage } from '../types';

const MISSION_PHOTOS: Record<string, string> = {
  jeunesse:    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=75',
  sante:       'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=75',
  education:   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75',
  famille:     'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=600&q=75',
  hebergement: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=75',
  alimentation:'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=75',
  insertion:   'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=75',
  seniors:     'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&q=75',
  culture:     'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=75',
  animation:   'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=75',
};

interface MissionsProps {
  onNavigate: (page: NavPage) => void;
}

export default function Missions({ onNavigate }: MissionsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="tag" style={{ background: 'rgba(41,171,226,0.12)', color: 'var(--sef-teal)', marginBottom: '1rem' }}>
            Ce que nous faisons
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Nos Missions</h2>
          <div className="divider" style={{ background: 'linear-gradient(to right, var(--sef-red), var(--sef-orange))', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Le SEF agit dans de nombreux domaines pour accompagner les personnes en situation de
            vulnérabilité, avec amour et engagement chrétien.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {MISSIONS.map((mission, i) => {
            const isOpen = expanded === mission.id;
            const photo = MISSION_PHOTOS[mission.id];
            return (
              <div
                key={mission.id}
                style={{
                  background: 'white',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: `1px solid ${isOpen ? mission.color + '50' : 'var(--border)'}`,
                  boxShadow: isOpen ? `0 12px 40px ${mission.color}20` : '0 2px 12px rgba(0,0,0,0.04)',
                  animation: `fadeUp 0.5s ${i * 0.06}s ease both`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setExpanded(isOpen ? null : mission.id)}
              >
                {/* Photo banner */}
                <div style={{
                  height: '160px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: `${mission.color}15`,
                }}>
                  {photo && (
                    <img
                      src={photo}
                      alt={mission.titre}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        transform: isOpen ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, ${mission.color}CC 0%, ${mission.color}22 60%, transparent 100%)`,
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      {mission.icon}
                    </div>
                    <h3 style={{
                      color: 'white',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                      lineHeight: 1.3,
                      maxWidth: '200px',
                    }}>
                      {mission.titre}
                    </h3>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '0.25rem',
                    color: 'white',
                  }}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {mission.description}
                  </p>
                  {isOpen && (
                    <div style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: `1px solid ${mission.color}25`,
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      <p style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: mission.color,
                        marginBottom: '0.75rem',
                      }}>
                        Actions concrètes
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {mission.actions.map((action) => (
                          <li key={action} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                          }}>
                            <span style={{
                              width: '7px', height: '7px',
                              borderRadius: '50%',
                              background: mission.color,
                              flexShrink: 0,
                            }} />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA with real background photo */}
        <div style={{
          marginTop: '4rem',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(26,26,26,0.92), rgba(45,45,45,0.88))',
          }} />
          <div className="rainbow-bar" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div style={{
            position: 'relative',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'white',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Vous souhaitez nous rejoindre ?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.75rem', maxWidth: '500px', margin: '0 auto 1.75rem' }}>
              Devenez bénévole ou membre du SEF et contribuez à nos missions au quotidien.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onNavigate('benevole')}>🙌 Devenir Bénévole</button>
              <button
                className="btn"
                onClick={() => onNavigate('don')}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                ❤️ Faire un Don
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
