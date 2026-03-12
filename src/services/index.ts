/**
 * Point d'entrée unique du backend SEF
 * ─────────────────────────────────────────────────────────────────
 * Pour changer de backend, modifiez uniquement cet import :
 *
 *   EmailJS + SMTP OVH (actuel) :
 *     import { emailjsService as backend } from './emailjs.service';
 *
 *   Google Apps Script :
 *     import { googleSheetsService as backend } from './googleSheets';
 *
 *   API REST custom (futur) :
 *     import { restApiService as backend } from './restApi';
 * ─────────────────────────────────────────────────────────────────
 */
export { emailjsService as backend } from './emailjs.service';

