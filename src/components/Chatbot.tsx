import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown, AlertCircle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ── Config Gemini ──────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Un seul modèle fixe — pas de boucle multi-modèles
const GEMINI_MODEL = 'gemini-1.5-flash';

// ── Prompt système SEF ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel du Secours Évangélique de France (SEF), une association Loi 1901 reconnue d'intérêt public.

TON RÔLE :
- Accueillir chaleureusement les visiteurs du site web du SEF
- Répondre aux questions sur l'association, ses missions, ses antennes
- Orienter les personnes vers les bons services (dons, bénévolat, aide)
- Parler au nom du SEF avec bienveillance, professionnalisme et chaleur humaine

INFORMATIONS SUR LE SEF :

Association : Secours Évangélique de France
Siège : 2 Allée du Clos des Charmes, 77183 Croissy-Beaubourg
Email : contact@secoursevangeliquedefrance.com
Horaires siège : Lun–Ven 9h–17h
Fondée sur des valeurs évangéliques chrétiennes

NOS 13 ANTENNES :
Île-de-France : Croissy-Beaubourg (siège), Les Mureaux, La Défense, Boissy-Saint-Léger, Versailles, Gonesse, Chanteloup-les-Vignes, Viry-Châtillon, Créteil, Massy
Province : Orléans, Le Mans, Compiègne

NOS 10 MISSIONS :
1. 🌱 Jeunesse — soutien scolaire, clubs jeunes, activités éducatives
2. ❤️ Santé & Soins — consultations, accompagnement médical
3. 📚 Réussite Éducative — tutorat, orientation scolaire
4. 🏠 Famille & Enfants — accompagnement parental, aide à la parentalité
5. 🏘️ Hébergement & Logement — hébergement d'urgence, relogement
6. 🛒 NOUBES (Nourriture & Besoins Essentiels) — colis alimentaires, épicerie solidaire, hygiène
7. 💼 Réinsertion & Emploi — CV, formations, insertion professionnelle
8. 🌟 Séniors & Retraités — visites à domicile, accompagnement
9. 🎨 Culture, Art & Sport — activités culturelles, sorties
10. 🗺️ Animation des Territoires — événements locaux, cohésion sociale

DONS :
- Via HelloAsso (0% de frais, recommandé)
- Réduction fiscale de 66% du montant du don
- Exemple : 50€ donnés = seulement 17€ de coût réel après déduction

BÉNÉVOLAT :
- Ouvert à tous les profils
- Bénévole (temps libre) ou Membre adhérent
- Formulaire en ligne sur le site

RÈGLES DE COMPORTEMENT :
- Réponds TOUJOURS en français
- Sois chaleureux, empathique et professionnel
- Utilise des emojis avec modération
- Si une personne semble en détresse, oriente-la vers le 115 (urgence logement) ou le 3114 (urgence psychologique)
- Ne donne JAMAIS d'informations médicales, juridiques ou financières précises
- Si tu ne sais pas quelque chose, propose de contacter contact@secoursevangeliquedefrance.com
- Reste TOUJOURS dans le contexte du SEF et de l'aide sociale
- Réponses concises (3-5 phrases max sauf si l'utilisateur demande plus de détails)`;

const QUICK_REPLIES = [
  '📍 Trouver une antenne',
  '❤️ Faire un don',
  '🙌 Devenir bénévole',
  '🛒 Aide alimentaire',
  '📞 Nous contacter',
];

// ── File d'attente : 1 seule requête à la fois ─────────────────────
let requestInFlight = false;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function askGemini(history: GeminiMessage[], userMessage: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return "⚙️ Clé API manquante. Ajoutez `VITE_GEMINI_API_KEY` dans votre `.env`.\n\nContactez-nous : contact@secoursevangeliquedefrance.com";
  }

  // Bloque si une requête est déjà en cours
  if (requestInFlight) throw new Error('IN_FLIGHT');
  requestInFlight = true;

  try {
    // Prompt système injecté dans le premier échange
    const systemTurn: GeminiMessage[] = history.length === 0 ? [
      { role: 'user',  parts: [{ text: SYSTEM_PROMPT + '\n\nCompris ? Réponds juste "Oui."' }] },
      { role: 'model', parts: [{ text: 'Oui.' }] },
    ] : [];

    const contents: GeminiMessage[] = [
      ...systemTurn,
      ...history,
      { role: 'user', parts: [{ text: userMessage }] },
    ];

    const body = {
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    };

    const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // 1 seul retry sur 429 (attente 5s)
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?? 'Je n\'ai pas pu générer une réponse. Veuillez réessayer.';
      }

      if (res.status === 429) {
        if (attempt === 0) {
          await sleep(5000); // attend 5s avant de réessayer une seule fois
          continue;
        }
        throw new Error('RATE_LIMIT');
      }

      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Erreur ${res.status}`);
    }

    throw new Error('RATE_LIMIT');
  } finally {
    requestInFlight = false;
  }
}

// ── Rendu texte avec sauts de ligne ───────────────────────────────
function renderText(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i} style={{ display: 'block', marginBottom: line === '' ? '0.35rem' : '0.05rem' }}>
      {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
    </span>
  ));
}

// ══════════════════════════════════════════════════════════════════
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'bot',
      text: 'Bonjour ! 👋 Je suis l\'assistant IA du SEF, propulsé par Gemini. Posez-moi n\'importe quelle question sur nos missions, nos antennes, les dons ou le bénévolat !',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setMessages(m => [...m, { id: Date.now() + 'u', role: 'user', text, time }]);
    setInput('');
    setTyping(true);

    try {
      const reply = await askGemini(geminiHistory, text);
      const replyTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      setGeminiHistory(h => [
        ...h,
        { role: 'user',  parts: [{ text }] },
        { role: 'model', parts: [{ text: reply }] },
      ]);

      setMessages(m => [...m, { id: Date.now() + 'b', role: 'bot', text: reply, time: replyTime }]);
    } catch (err: any) {
      const msg = err.message ?? '';
      const friendlyText =
        msg === 'RATE_LIMIT' ? '⏳ Trop de requêtes. Patientez 1 minute puis réessayez.' :
        msg === 'IN_FLIGHT'  ? '⏳ Une réponse est déjà en cours, patientez…' :
        `❌ Erreur : ${msg}\n\nContactez-nous : contact@secoursevangeliquedefrance.com`;

      setMessages(m => [...m, { id: Date.now() + 'e', role: 'bot', time, text: friendlyText }]);
    } finally {
      setTyping(false);
    }
  };

  const isConfigured = Boolean(GEMINI_API_KEY);

  return (
    <>
      {/* ── Bouton flottant ──────────────────────────────────── */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setMinimized(false); }}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 8000,
            width: '62px', height: '62px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(232,40,30,0.4)',
            animation: 'float 4s ease-in-out infinite',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          title="Discuter avec l'assistant SEF"
        >
          <MessageCircle size={26} color="white" />
          <span style={{
            position: 'absolute', width: '100%', height: '100%',
            borderRadius: '50%', background: 'rgba(232,40,30,0.35)',
            animation: 'pulse-ring 2s ease-out infinite',
          }} />
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: 'var(--sef-blue)', color: 'white',
            borderRadius: '50px', padding: '2px 6px',
            fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.05em',
            border: '2px solid white',
          }}>IA</span>
        </button>
      )}

      {/* ── Fenêtre chat ─────────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 8000,
          width: '370px', maxWidth: 'calc(100vw - 2rem)',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'fadeUp 0.3s ease',
          maxHeight: minimized ? '64px' : '580px',
          transition: 'max-height 0.3s ease',
        }}>

          {/* Header */}
          <div
            onClick={() => setMinimized(m => !m)}
            style={{
              background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
              padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              flexShrink: 0, cursor: 'pointer', userSelect: 'none',
            }}
          >
            <div style={{
              width: '40px', height: '40px',
              background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '1.1rem',
            }}>✝️</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Assistant SEF
                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50px', padding: '1px 8px', fontSize: '0.65rem', fontWeight: 800 }}>
                  Gemini IA
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '1px' }}>
                <span style={{ width: '6px', height: '6px', background: isConfigured ? '#4ADE80' : '#FCD34D', borderRadius: '50%', display: 'inline-block' }} />
                {isConfigured ? 'IA active · Gemini 1.5 Flash' : 'Clé API manquante'}
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setOpen(false); }}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: 'white', display: 'flex' }}>
              <X size={16} />
            </button>
            <button onClick={e => { e.stopPropagation(); setMinimized(m => !m); }}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: 'white', display: 'flex' }}>
              <ChevronDown size={16} style={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
          </div>

          {!minimized && (
            <>
              {!isConfigured && (
                <div style={{
                  background: '#FFFBEB', borderBottom: '1px solid #FCD34D',
                  padding: '0.6rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.75rem', color: '#92400E',
                }}>
                  <AlertCircle size={14} />
                  Ajoutez <code style={{ background: '#FEF3C7', padding: '0 4px', borderRadius: '4px' }}>VITE_GEMINI_API_KEY</code> dans votre <code>.env</code>
                </div>
              )}

              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                background: '#FAFAF8',
              }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '0.5rem', alignItems: 'flex-end',
                  }}>
                    {msg.role === 'bot' && (
                      <div style={{
                        width: '28px', height: '28px', flexShrink: 0,
                        background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '0.7rem',
                      }}>✝️</div>
                    )}
                    <div style={{
                      maxWidth: '82%',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))'
                        : 'white',
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem', lineHeight: 1.65,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                    }}>
                      {renderText(msg.text)}
                      <div style={{
                        fontSize: '0.62rem', marginTop: '0.3rem', textAlign: 'right',
                        color: msg.role === 'user' ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)',
                      }}>{msg.time}</div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{
                      width: '28px', height: '28px',
                      background: 'linear-gradient(135deg, var(--sef-red), var(--sef-orange))',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.7rem',
                    }}>✝️</div>
                    <div style={{
                      background: 'white', border: '1px solid var(--border)',
                      borderRadius: '16px 16px 16px 4px',
                      padding: '0.75rem 1rem', display: 'flex', gap: '4px', alignItems: 'center',
                    }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} style={{
                          width: '7px', height: '7px', background: 'var(--sef-red)',
                          borderRadius: '50%', display: 'inline-block',
                          animation: `float 1s ${i * 0.2}s ease-in-out infinite`,
                        }} />
                      ))}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        Gemini réfléchit…
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Réponses rapides */}
              <div style={{
                padding: '0.6rem 1rem 0.25rem',
                display: 'flex', gap: '0.4rem', flexWrap: 'wrap',
                borderTop: '1px solid var(--border)', background: 'white',
              }}>
                {QUICK_REPLIES.map(qr => (
                  <button key={qr} onClick={() => send(qr)} disabled={typing}
                    style={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: '50px', padding: '0.28rem 0.7rem',
                      fontSize: '0.7rem', cursor: typing ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-body)', fontWeight: 600,
                      color: 'var(--text-secondary)', transition: 'all 0.2s',
                      whiteSpace: 'nowrap', opacity: typing ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (!typing) { (e.currentTarget).style.borderColor = 'var(--sef-red)'; (e.currentTarget).style.color = 'var(--sef-red)'; }}}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border)'; (e.currentTarget).style.color = 'var(--text-secondary)'; }}
                  >{qr}</button>
                ))}
              </div>

              {/* Zone de saisie */}
              <div style={{
                padding: '0.75rem 1rem',
                display: 'flex', gap: '0.5rem', alignItems: 'center',
                borderTop: '1px solid var(--border)', background: 'white',
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                  placeholder={typing ? 'Gemini réfléchit…' : 'Votre message…'}
                  disabled={typing}
                  style={{
                    flex: 1, border: '1.5px solid var(--border)', borderRadius: '10px',
                    padding: '0.65rem 0.9rem', fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)', outline: 'none',
                    opacity: typing ? 0.6 : 1,
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--sef-red)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  style={{
                    background: input.trim() && !typing ? 'var(--sef-red)' : 'var(--border)',
                    border: 'none', borderRadius: '10px', padding: '0.65rem',
                    cursor: input.trim() && !typing ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s', flexShrink: 0,
                  }}
                >
                  <Send size={17} color="white" />
                </button>
              </div>

              <div style={{
                padding: '0.4rem 1rem', background: 'white',
                borderTop: '1px solid var(--border)',
                fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center',
              }}>
                Propulsé par Google Gemini · Les réponses peuvent être inexactes
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
