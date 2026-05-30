// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react'; 
// On importe maintenant le logo complet
import logoComplet from '../assets/logo-complet.png';

// --- ICÔNES SOCIAUX SUR-MESURE (Style Lucide) ---
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
// ------------------------------------------------

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border-main mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Section Marque et Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {/* Utilisation du logo complet, hauteur ajustée à h-10 pour une bonne lisibilité */}
              <img src={logoComplet} alt="Logo Kombicar" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mt-2">
              Un voyage confortable en toute sécurité. La plateforme de covoiturage et VTC de référence.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-text-muted hover:text-kombi-orange-500 transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-kombi-orange-500 transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-kombi-orange-500 transition-colors">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>

          {/* Section Liens Utiles */}
          <div>
            <h3 className="text-text-main font-semibold mb-4 uppercase text-sm tracking-wider">Liens Utiles</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/recherche" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Rechercher un trajet</Link>
              </li>
              <li>
                <Link to="/publier" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Publier un trajet</Link>
              </li>
              <li>
                <Link to="/vtc" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Réserver un VTC</Link>
              </li>
              <li>
                <Link to="/comment-ca-marche" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Comment ça marche ?</Link>
              </li>
            </ul>
          </div>

          {/* Section Légal & Support */}
          <div>
            <h3 className="text-text-main font-semibold mb-4 uppercase text-sm tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/aide" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Centre d'aide</Link>
              </li>
              <li>
                <Link to="/cgu" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Conditions Générales</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Confidentialité</Link>
              </li>
              <li>
                <Link to="/securite" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">Sécurité</Link>
              </li>
            </ul>
          </div>

          {/* Section Contacts */}
          <div>
            <h3 className="text-text-main font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-kombi-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm text-text-muted">Yaoundé, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-kombi-orange-500 shrink-0" />
                <span className="text-sm text-text-muted">+237 6XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-kombi-orange-500 shrink-0" />
                <a href="mailto:contact@kombicar.com" className="text-sm text-text-muted hover:text-kombi-orange-500 transition-colors">contact@kombicar.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-border-main mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {currentYear} Kombicar. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-text-muted bg-base px-2 py-1 rounded border border-border-main">Paiement Sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};