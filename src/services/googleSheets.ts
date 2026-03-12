/**
 * Implémentation Google Sheets du backend SEF
 * ─────────────────────────────────────────────────────────────────
 *
 * CONFIGURATION — 3 étapes :
 *
 * 1. Créez un Google Apps Script (script.google.com) → Nouveau projet
 *    Collez le code du fichier GOOGLE_APPS_SCRIPT.gs (voir /docs/)
 *    Déployez comme "Application Web" → Accès : "Tout le monde"
 *    Copiez l'URL de déploiement
 *
 * 2. Créez un fichier `.env` à la racine du projet :
 *    VITE_GAS_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * 3. Optionnel : renseignez l'ID Google Sheet pour les actualités
 *    VITE_NEWS_SHEET_ID=votre_sheet_id
 *
 * ─────────────────────────────────────────────────────────────────
 * Pour migrer vers un vrai backend plus tard :
 *   → Voir src/services/index.ts
 * ─────────────────────────────────────────────────────────────────
 */

import { ApiService } from './api.interface';
import { ContactFormData, VolunteerFormData, ServiceResult, NewsItem } from '../types';
import { LOCAL_NEWS } from '../data/news';

const GAS_URL = import.meta.env.VITE_GAS_URL as string | undefined;

async function postToGAS(action: string, payload: Record<string, unknown>): Promise<ServiceResult> {
  if (!GAS_URL) {
    // Mode démo : simule succès si pas de GAS configuré
    console.warn('[SEF Backend] VITE_GAS_URL non configuré — simulation succès');
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'Simulation (GAS non configuré)' };
  }

  const body = JSON.stringify({ action, ...payload });

  // GAS ne supporte pas CORS avec JSON body → on utilise no-cors + form-encode
  const form = new FormData();
  form.append('payload', body);

  try {
    const res = await fetch(GAS_URL, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json().catch(() => ({ success: true }));
    return { success: true, message: json.message ?? 'Envoyé avec succès' };
  } catch (err) {
    console.error('[SEF GAS]', err);
    return { success: false, message: 'Erreur réseau. Veuillez réessayer.' };
  }
}

export const googleSheetsService: ApiService = {
  async submitContact(data: ContactFormData): Promise<ServiceResult> {
    return postToGAS('contact', {
      to: 'contact@secoursevangeliquedefrance.com',
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  async submitVolunteer(data: VolunteerFormData): Promise<ServiceResult> {
    return postToGAS('benevole', {
      to: 'contact@secoursevangeliquedefrance.com',
      ...data,
      disponibilites: data.disponibilites.join(', '),
      timestamp: new Date().toISOString(),
    });
  },

  async getNews(): Promise<NewsItem[]> {
    // Si pas de GAS configuré → renvoie les actualités locales de démonstration
    if (!GAS_URL) return LOCAL_NEWS;

    try {
      const res = await fetch(`${GAS_URL}?action=news`);
      if (!res.ok) return LOCAL_NEWS;
      const json = await res.json();
      return Array.isArray(json.data) && json.data.length ? json.data : LOCAL_NEWS;
    } catch {
      return LOCAL_NEWS;
    }
  },
};
