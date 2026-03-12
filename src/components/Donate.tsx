import { useState } from 'react';
import { CheckCircle, Heart, ExternalLink, CreditCard, Building } from 'lucide-react';

const HELLOASSO_URL = 'https://www.helloasso.com/associations/secours-evangelique-de-france/formulaires/1';
const AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function Donate() {
  const [amount, setAmount] = useState<number | null>(50);
  const [custom, setCustom] = useState('');
  const [frequency, setFrequency] = useState<'unique' | 'mensuel'>('mensuel');
  const [payMethod, setPayMethod] = useState<'helloasso' | 'form'>('helloasso');
  const [step, setStep] = useState<'amount' | 'details' | 'done'>('amount');
  const [form, setForm] = useState({ prenom: '', nom: '', email: '' });

  const finalAmount = custom ? parseFloat(custom) : amount;
  const taxReduction = finalAmount ? Math.round(finalAmount * 0.66) : 0;
  const coutReel = finalAmount ? Math.round(finalAmount * 0.34) : 0;

  if (step === 'done') {
    return (
      <section style={{ background: 'linear-gradient(135deg, #FFF0EF, #FFF8F0)', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 20px 60px rgba(232,40,30,0.3)', animation: 'fadeUp 0.5s ease' }}>
            <CheckCircle size={48} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>Merci pour votre générosité !</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Votre don de <strong style={{ color: 'var(--sef-red)' }}>{finalAmount}€</strong> va contribuer directement à nos missions. Un reçu fiscal vous sera envoyé à <strong>{form.email}</strong>.
          </p>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              💡 Grâce à la déduction fiscale de 66%, votre don de <strong style={{ color: 'var(--sef-red)' }}>{finalAmount}€</strong> ne vous coûte réellement que <strong style={{ color: 'var(--sef-green)' }}>{coutReel}€</strong>.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setStep('amount'); setAmount(50); setCustom(''); }}>Faire un autre don</button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: 'linear-gradient(135deg, #FFF8F4, #FFF0EF 50%, var(--bg))' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="tag" style={{ background: 'rgba(232,40,30,0.1)', color: 'var(--sef-red)', marginBottom: '1rem' }}>Soutenez nos actions</span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Faire un Don</h2>
          <div className="divider" style={{ background: 'var(--sef-red)', margin: '1rem auto 1.5rem' }} />
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Votre générosité permet au SEF de poursuivre ses missions. Les dons sont déductibles à 66% de l'impôt.
          </p>
        </div>

        {/* HelloAsso banner */}
        <div style={{
          background: 'linear-gradient(135deg, #00B3A4, #008578)',
          borderRadius: '20px', padding: '2rem', marginBottom: '2.5rem', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🤝</div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.25rem' }}>Dons via HelloAsso</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Plateforme solidaire française — <strong>0% de commission</strong>, 100% pour le SEF.<br />
                Paiement sécurisé CB, reçu fiscal automatique.
              </p>
            </div>
          </div>
          <a
            href={HELLOASSO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: 'white', color: '#00B3A4', fontWeight: 700, gap: '0.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Donner via HelloAsso <ExternalLink size={16} />
          </a>
        </div>

        {/* Payment method selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          {[
            { id: 'helloasso', icon: <Building size={20} />, label: 'HelloAsso', desc: '0% frais, recommandé', color: '#00B3A4' },
            { id: 'form', icon: <CreditCard size={20} />, label: 'Formulaire direct', desc: 'Paiement en ligne', color: 'var(--sef-red)' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setPayMethod(opt.id as any)} style={{
              padding: '1.25rem', borderRadius: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              border: `2px solid ${payMethod === opt.id ? opt.color : 'var(--border)'}`,
              background: payMethod === opt.id ? `${opt.color}10` : 'white',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
              transition: 'all 0.2s',
            }}>
              <span style={{ color: payMethod === opt.id ? opt.color : 'var(--text-muted)' }}>{opt.icon}</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: payMethod === opt.id ? opt.color : 'var(--text-primary)' }}>{opt.label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</span>
            </button>
          ))}
        </div>

        {payMethod === 'helloasso' ? (
          /* HelloAsso widget embed */
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.07)' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', background: '#00B3A410', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🤝</div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>Donner via HelloAsso</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sécurisé · 0% frais · Reçu fiscal automatique</p>
              </div>
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                HelloAsso est la plateforme solidaire de référence pour les associations françaises.<br />
                <strong>Aucune commission</strong> n'est prélevée sur votre don.
              </p>
              <a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ justifyContent: 'center', fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex', gap: '0.5rem' }}>
                <Heart size={18} /> Ouvrir le formulaire HelloAsso <ExternalLink size={16} />
              </a>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Vous serez redirigé vers la page HelloAsso du SEF (lien sécurisé).
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Amount form */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(['mensuel', 'unique'] as const).map(f => (
                  <button key={f} onClick={() => setFrequency(f)} style={{
                    flex: 1, padding: '0.7rem', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    border: `2px solid ${frequency === f ? 'var(--sef-red)' : 'var(--border)'}`,
                    background: frequency === f ? 'rgba(232,40,30,0.06)' : 'white',
                    color: frequency === f ? 'var(--sef-red)' : 'var(--text-secondary)',
                    fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s',
                  }}>
                    {f === 'mensuel' ? '🔄 Don mensuel' : '1️⃣ Don unique'}
                  </button>
                ))}
              </div>

              <label style={{ marginBottom: '0.75rem' }}>Choisissez un montant</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(''); }} style={{
                    padding: '0.9rem', borderRadius: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                    border: `2px solid ${amount === a && !custom ? 'var(--sef-red)' : 'var(--border)'}`,
                    background: amount === a && !custom ? 'var(--sef-red)' : 'white',
                    color: amount === a && !custom ? 'white' : 'var(--text-primary)',
                    fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s',
                  }}>{a}€</button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <input type="number" min="1" placeholder="Autre montant" value={custom} onChange={e => { setCustom(e.target.value); setAmount(null); }} style={{ paddingRight: '2.5rem' }} />
                <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>€</span>
              </div>

              {finalAmount && finalAmount > 0 && (
                <div style={{ marginTop: '1.25rem', background: 'rgba(75,174,79,0.08)', border: '1px solid rgba(75,174,79,0.2)', borderRadius: '12px', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--sef-green)', marginBottom: '0.25rem' }}>💡 Avantage fiscal</div>
                  Don de <strong>{finalAmount}€</strong> → Réduction : <strong style={{ color: 'var(--sef-green)' }}>{taxReduction}€</strong> → Coût réel : <strong style={{ color: 'var(--sef-red)' }}>{coutReel}€</strong>
                </div>
              )}

              {step === 'amount' && (
                <button className="btn btn-primary" onClick={() => setStep('details')} disabled={!finalAmount || finalAmount <= 0} style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', fontSize: '1rem', padding: '1rem' }}>
                  <Heart size={18} /> Continuer — {finalAmount}€ {frequency === 'mensuel' ? '/mois' : ''}
                </button>
              )}

              {step === 'details' && (
                <form onSubmit={e => { e.preventDefault(); setStep('done'); }} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><label>Prénom *</label><input required value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} /></div>
                    <div><label>Nom *</label><input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
                  </div>
                  <div><label>Email *</label><input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Pour votre reçu fiscal" /></div>
                  <div style={{ background: '#FFF8F0', borderRadius: '10px', padding: '0.9rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    🔒 Paiement sécurisé SSL. Reçu fiscal CERFA envoyé sous 48h.
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setStep('amount')} style={{ flex: 1, justifyContent: 'center' }}>← Retour</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', fontSize: '1rem' }}>❤️ Confirmer {finalAmount}€</button>
                  </div>
                </form>
              )}
            </div>

            {/* Impact + trust */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>Votre don, un impact concret</h3>
              {[
                { amount: 10, impact: "Un colis alimentaire d'urgence pour une famille", color: 'var(--sef-orange)', icon: '🛒' },
                { amount: 25, impact: "Une séance de soutien scolaire individuel", color: 'var(--sef-teal)', icon: '📚' },
                { amount: 50, impact: "Une consultation médicale pour une personne sans ressources", color: 'var(--sef-green)', icon: '❤️' },
                { amount: 100, impact: "Une semaine d'hébergement d'urgence pour une famille", color: 'var(--sef-purple)', icon: '🏠' },
                { amount: 200, impact: "Un mois de cours de français pour une famille réfugiée", color: 'var(--sef-red)', icon: '🌍' },
              ].map(item => (
                <div key={item.amount} onClick={() => { setAmount(item.amount); setCustom(''); if (step === 'details') setStep('amount'); }} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', background: 'white',
                  borderRadius: '14px', padding: '1rem 1.25rem',
                  border: `2px solid ${amount === item.amount && !custom ? item.color : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: amount === item.amount && !custom ? `0 8px 30px ${item.color}22` : 'none',
                }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: item.color, marginBottom: '0.2rem' }}>{item.amount}€</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.impact}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
                <div className="rainbow-bar" style={{ marginBottom: '1.25rem', borderRadius: '4px' }} />
                <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                  <strong style={{ color: 'white' }}>Association reconnue d'intérêt public</strong><br />
                  Déduction fiscale de <strong style={{ color: 'var(--sef-yellow)' }}>66%</strong> du montant versé.<br />
                  <strong style={{ color: 'white' }}>100% de votre don</strong> va aux missions du SEF.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
