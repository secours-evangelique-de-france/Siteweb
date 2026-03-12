import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Search, Navigation, Star } from 'lucide-react';
import { ANTENNES } from '../data';
import { Antenne } from '../types';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type AntenneWithDist = Antenne & { distance?: number };

export default function FindAntenne() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AntenneWithDist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<AntenneWithDist | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', France')}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      const data = await res.json();

      if (!data.length) {
        setError("Adresse introuvable. Essayez avec une ville ou un code postal.");
        setResults([]);
        setLoading(false);
        return;
      }

      const { lat, lon } = data[0];
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lon);

      const sorted: AntenneWithDist[] = ANTENNES
        .map((a) => ({ ...a, distance: haversineKm(userLat, userLng, a.lat, a.lng) }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

      setResults(sorted);
      setSelected(sorted[0]);
      setSearched(true);
    } catch {
      setError("Erreur lors de la recherche. Vérifiez votre connexion et réessayez.");
    }

    setLoading(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const sorted: AntenneWithDist[] = ANTENNES
          .map((a) => ({ ...a, distance: haversineKm(latitude, longitude, a.lat, a.lng) }))
          .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
        setResults(sorted);
        setSelected(sorted[0]);
        setSearched(true);
        setQuery('Ma position actuelle');
        setLoading(false);
      },
      () => {
        setError("Impossible d'obtenir votre position.");
        setLoading(false);
      }
    );
  };

  const ACCENT_COLORS = [
    'var(--sef-red)', 'var(--sef-teal)', 'var(--sef-green)',
    'var(--sef-orange)', 'var(--sef-purple)', 'var(--sef-blue)',
  ];

  return (
    <section style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, var(--bg) 100%)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag" style={{ background: 'rgba(41,171,226,0.12)', color: 'var(--sef-teal)', marginBottom: '1rem' }}>
            Réseau d'antennes
          </span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Trouver une Antenne</h2>
          <div className="divider" style={{ background: 'var(--sef-teal)', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Entrez votre adresse ou ville pour trouver l'antenne SEF la plus proche de chez vous.
          </p>
        </div>

        {/* Search box */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
          marginBottom: '2.5rem',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search size={18} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }} />
              <input
                type="text"
                placeholder="Adresse, ville ou code postal..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
            <button
              className="btn btn-teal"
              onClick={search}
              disabled={loading}
              style={{ whiteSpace: 'nowrap' }}
            >
              {loading ? '⏳ Recherche...' : <><Search size={16} /> Rechercher</>}
            </button>
            <button
              className="btn btn-secondary"
              onClick={useMyLocation}
              disabled={loading}
              style={{ whiteSpace: 'nowrap' }}
            >
              <Navigation size={16} /> Ma position
            </button>
          </div>

          {error && (
            <div style={{
              background: '#FFF0EF',
              border: '1px solid #FFCCC9',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: 'var(--sef-red)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* All antennes (default) or search results */}
        {(!searched ? ANTENNES as AntenneWithDist[] : results).length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {(!searched ? ANTENNES as AntenneWithDist[] : results).map((a, i) => (
                <div
                  key={a.id}
                  onClick={() => setSelected(a)}
                  style={{
                    background: selected?.id === a.id ? '#EFF9FF' : 'white',
                    border: selected?.id === a.id ? `2px solid var(--sef-teal)` : '2px solid var(--border)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: `4px solid ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{a.nom}</strong>
                        {a.siege && (
                          <span className="tag" style={{ background: 'rgba(232,40,30,0.1)', color: 'var(--sef-red)', fontSize: '0.65rem' }}>
                            ⭐ Siège
                          </span>
                        )}
                        {searched && i === 0 && (
                          <span className="tag" style={{ background: 'rgba(75,174,79,0.1)', color: 'var(--sef-green)', fontSize: '0.65rem' }}>
                            La plus proche
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {a.adresse} — {a.codePostal} {a.ville}
                      </div>
                    </div>
                    {a.distance !== undefined && (
                      <span style={{
                        background: 'var(--sef-teal)',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {a.distance.toFixed(0)} km
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Detail card */}
            {selected && (
              <div style={{
                background: 'white',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
                position: 'sticky',
                top: '100px',
                animation: 'fadeIn 0.3s ease',
              }}>
                {/* Map placeholder */}
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, rgba(41,171,226,0.15), rgba(75,174,79,0.1))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      color: 'var(--sef-teal)',
                      fontWeight: 700,
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'var(--sef-red)',
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-45deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(232,40,30,0.3)',
                    }}>
                      <MapPin size={24} color="white" style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>Voir sur la carte →</span>
                  </a>
                  {/* Grid lines decoration */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.15,
                    backgroundImage: 'linear-gradient(#29ABE2 1px, transparent 1px), linear-gradient(90deg, #29ABE2 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                  }} />
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MapPin size={20} color="white" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
                        {selected.nom}
                        {selected.siege && <Star size={14} style={{ marginLeft: '0.4rem', color: 'var(--sef-yellow)', display: 'inline' }} />}
                      </h3>
                      {selected.distance !== undefined && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--sef-teal)', fontWeight: 600 }}>
                          à {selected.distance.toFixed(1)} km de vous
                        </span>
                      )}
                    </div>
                  </div>

                  {[
                    { icon: <MapPin size={16} />, label: `${selected.adresse}, ${selected.codePostal} ${selected.ville}`, color: 'var(--sef-red)' },
                    selected.tel && { icon: <Phone size={16} />, label: selected.tel, color: 'var(--sef-green)' },
                    selected.email && { icon: <Mail size={16} />, label: selected.email, color: 'var(--sef-teal)' },
                    selected.horaires && { icon: <Clock size={16} />, label: selected.horaires, color: 'var(--sef-purple)' },
                  ].filter(Boolean).map((item: any, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{ color: item.color }}>{item.icon}</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}
                    >
                      🗺️ Itinéraire
                    </a>
                    {selected.email && (
                      <a
                        href={`mailto:${selected.email}`}
                        className="btn btn-teal"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.9rem' }}
                      >
                        ✉️ Contacter
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show all antennes map link */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a
            href="https://www.google.com/maps/search/Secours+Evangélique+de+France"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            🗺️ Voir toutes les antennes sur Google Maps
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .antenne-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
