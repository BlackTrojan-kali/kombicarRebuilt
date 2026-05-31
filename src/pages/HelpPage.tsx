// src/pages/HelpPage.tsx
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Globe, 
  LifeBuoy
} from 'lucide-react';

// --- ICÔNES SOCIAUX SUR-MESURE ---
const FacebookIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base flex flex-col items-center pb-12">
      
      {/* Conteneur principal : Pleine largeur sur mobile, carte centrée sur Desktop */}
      <div className="w-full max-w-2xl bg-surface min-h-screen md:min-h-0 md:mt-8 md:rounded-[32px] md:shadow-xl md:border md:border-border-main overflow-hidden flex flex-col">
        
        {/* Navigation Mobile : Transparente/Floutée */}
        <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border-main md:hidden">
          <div className="px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
              aria-label="Retour"
            >
              <ChevronLeft size={20} className="text-text-main" />
            </button>
            <h1 className="text-lg font-bold text-text-main ml-4">Aide & Contact</h1>
          </div>
        </div>

        {/* Bouton retour Desktop */}
        <div className="hidden md:flex px-8 pt-8">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
            >
              <ChevronLeft size={20} className="text-text-main" />
            </button>
        </div>

        {/* Contenu de la page */}
        <div className="px-6 pt-6 pb-12 md:px-12 md:pt-8">
          
          {/* En-tête de page */}
          <div className="mb-10 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-kombi-orange-500 flex items-center justify-center mb-6 mx-auto md:mx-0">
              <LifeBuoy size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main leading-tight mb-4">
              Assistance <span className="text-kombi-orange-500">Kombicar</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-md">
              Votre support <strong className="text-text-main">24/7</strong> pour vos réservations, trajets et informations.
            </p>
          </div>

          {/* ========================================================= */}
          {/* COORDONNÉES PAR VILLE */}
          {/* ========================================================= */}
          <h2 className="text-xl font-extrabold text-text-main mb-6">Nos bureaux locaux</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            
            {/* Carte Yaoundé */}
            <div className="bg-base border border-border-main rounded-[24px] p-6 transition-all hover:shadow-md hover:border-kombi-orange-500/30">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-kombi-orange-500" size={24} />
                <h3 className="text-xl font-bold text-text-main">Yaoundé</h3>
              </div>
              <div className="space-y-3">
                <a href="tel:+237678361119" className="flex items-center p-3 rounded-xl bg-surface border border-border-main hover:border-blue-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0 mr-3">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Appel Direct</p>
                    <p className="font-bold text-text-main group-hover:text-blue-500 text-sm">(+237) 678 361 119</p>
                  </div>
                </a>
                <a href="https://wa.me/237678361119" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl bg-surface border border-border-main hover:border-green-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0 mr-3">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">WhatsApp</p>
                    <p className="font-bold text-text-main group-hover:text-green-500 text-sm">(+237) 678 361 119</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Carte Douala */}
            <div className="bg-base border border-border-main rounded-[24px] p-6 transition-all hover:shadow-md hover:border-kombi-orange-500/30">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-kombi-orange-500" size={24} />
                <h3 className="text-xl font-bold text-text-main">Douala</h3>
              </div>
              <div className="space-y-3">
                <a href="tel:+237655730577" className="flex items-center p-3 rounded-xl bg-surface border border-border-main hover:border-blue-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0 mr-3">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Appel Direct</p>
                    <p className="font-bold text-text-main group-hover:text-blue-500 text-sm">(+237) 655 730 577</p>
                  </div>
                </a>
                <a href="https://wa.me/237655730577" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl bg-surface border border-border-main hover:border-green-500/50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0 mr-3">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">WhatsApp</p>
                    <p className="font-bold text-text-main group-hover:text-green-500 text-sm">(+237) 655 730 577</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* BANNIÈRE AIDE IMMÉDIATE */}
          {/* ========================================================= */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-[20px] p-6 text-center mb-10">
            <p className="text-kombi-orange-600 dark:text-kombi-orange-400 font-bold text-sm md:text-base">
              Besoin d'une aide immédiate ? N'hésitez pas à nous appeler directement !
            </p>
          </div>

          {/* ========================================================= */}
          {/* SERVICES DE L'ASSISTANCE */}
          {/* ========================================================= */}
          <div className="mb-10">
            <h2 className="text-xl font-extrabold text-text-main mb-6">Comment pouvons-nous vous aider ?</h2>
            <div className="bg-base border border-border-main rounded-[24px] p-6 md:p-8">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="text-kombi-green-500 shrink-0 mt-0.5" size={24} />
                  <div>
                    <strong className="text-text-main block mb-1">Réservations & support covoiturage</strong> 
                    <p className="text-sm text-text-muted leading-relaxed">Aide pour planifier vos voyages, modifier vos horaires et gérer vos places.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="text-kombi-green-500 shrink-0 mt-0.5" size={24} />
                  <div>
                    <strong className="text-text-main block mb-1">Informations trajets & véhicules</strong> 
                    <p className="text-sm text-text-muted leading-relaxed">Détails sur les itinéraires disponibles, les tarifs et les types de véhicules (VTC ou Covoiturage).</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RÉSEAUX SOCIAUX */}
          {/* ========================================================= */}
          <div className="text-center pt-6 border-t border-border-main">
            <h2 className="text-lg font-bold text-text-main mb-6">Restez Connectés</h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <a 
                href="https://www.kombicar.app/" 
                target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border-main hover:border-kombi-orange-500 hover:text-kombi-orange-500 rounded-full font-bold text-sm text-text-main transition-all shadow-sm"
              >
                <Globe size={18} /> Site Web
              </a>
              <a 
                href="https://www.facebook.com/kombicar.cmr?mibextid=wwXIfr&mibextid=wwXIfr" 
                target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border-main hover:border-blue-500 hover:text-blue-500 rounded-full font-bold text-sm text-text-main transition-all shadow-sm"
              >
                <FacebookIcon size={18} /> Facebook
              </a>
              <a 
                href="https://www.instagram.com/kombicar_cmr?igsh=YjVhd3NrZ2tldzlq&utm_source=qr" 
                target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border-main hover:border-pink-500 hover:text-pink-500 rounded-full font-bold text-sm text-text-main transition-all shadow-sm"
              >
                <InstagramIcon size={18} /> Instagram
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};