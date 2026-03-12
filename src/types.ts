export type NavPage = 'accueil' | 'missions' | 'antennes' | 'benevole' | 'don' | 'galerie' | 'actualites' | 'contact';

// ── News ──────────────────────────────────────────────────────────
export interface NewsItem {
  id: string;
  titre: string;
  resume: string;
  contenu: string;
  date: string;
  categorie: NewsCategorie;
  image?: string;
  antenne?: string;
  lien?: string;
  epingle?: boolean;
}
export type NewsCategorie = 'terrain' | 'evenement' | 'partenariat' | 'don' | 'benevole' | 'annonce';

// ── Backend service ───────────────────────────────────────────────
export interface ContactFormData {
  prenom: string; nom: string; email: string; sujet: string; message: string;
}
export interface VolunteerFormData {
  type: string; prenom: string; nom: string; email: string; tel: string;
  ville: string; competences: string; disponibilites: string[]; message: string;
}
export interface ServiceResult { success: boolean; message: string; }

export interface GalleryPhoto {
  id: string;
  url: string;
  thumb: string;
  titre: string;
  categorie: GalleryCategorie;
  lieu?: string;
}

export type GalleryCategorie = 'all' | 'terrain' | 'jeunesse' | 'alimentation' | 'evenements' | 'benevoles';

export interface Antenne {
  id: string;
  nom: string;
  siege?: boolean;
  adresse: string;
  ville: string;
  codePostal: string;
  tel?: string;
  email?: string;
  lat: number;
  lng: number;
  horaires?: string;
}

export interface Mission {
  id: string;
  titre: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  actions: string[];
}
