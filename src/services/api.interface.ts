/**
 * Interface abstraite du backend SEF
 * ─────────────────────────────────────────────────────────────────
 * Pour remplacer Google Sheets par un vrai backend :
 *   1. Créez un fichier `realBackend.service.ts` qui implémente `ApiService`
 *   2. Dans `src/services/index.ts`, remplacez l'import GS par votre nouveau service
 *   3. C'est tout — tous les composants utilisent uniquement cette interface
 * ─────────────────────────────────────────────────────────────────
 */

import { ContactFormData, VolunteerFormData, ServiceResult, NewsItem } from '../types';

export interface ApiService {
  /** Envoie le formulaire de contact → email + log GS */
  submitContact(data: ContactFormData): Promise<ServiceResult>;

  /** Envoie le formulaire bénévole/membre → log GS + email de confirmation */
  submitVolunteer(data: VolunteerFormData): Promise<ServiceResult>;

  /** Récupère les actualités depuis GS (ou API) */
  getNews(): Promise<NewsItem[]>;
}
