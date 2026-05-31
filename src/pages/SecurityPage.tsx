// src/pages/SecurityPage.tsx
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Phone, 
  Star, 
  MapPin, 
  ChevronLeft 
} from 'lucide-react';

export const SecurityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base pb-12">
      {/* En-tête avec bouton retour (facultatif si tu as déjà un layout global, mais utile sur mobile) */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm md:hidden">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main ml-4">Sécurité</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-8 md:pt-12">
        {/* Titres */}
        <div className="mb-6">
          <p className="text-xs font-bold text-kombi-orange-500 uppercase tracking-wider mb-2">
            Notre engagement
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-text-main leading-tight">
            Votre sécurité,<br />notre priorité.
          </h1>
        </div>

        {/* Carte principale foncée */}
        <div className="bg-[#1f232e] text-white rounded-[24px] p-6 mb-4 shadow-lg">
          <div className="w-10 h-10 rounded-full bg-[#2a2f3a] border border-[#373e4d] flex items-center justify-center mb-5 text-kombi-orange-500">
            <Shield size={20} />
          </div>
          <h2 className="text-xl font-bold mb-3">Une communauté<br />de confiance</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Chaque membre est vérifié : pièce d'identité, numéro de téléphone et historique de trajets. Vous voyagez en toute sérénité.
          </p>
        </div>

        {/* Grille de 4 cartes */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          
          {/* Carte 1 : Identité */}
          <div className="bg-surface border border-border-main rounded-[20px] p-4 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 flex items-center justify-center mb-4">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Identité vérifiée</h3>
              <p className="text-xs text-text-muted leading-relaxed">CNI scannée et validée par notre équipe.</p>
            </div>
          </div>

          {/* Carte 2 : Support */}
          <div className="bg-surface border border-border-main rounded-[20px] p-4 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-kombi-green-500 flex items-center justify-center mb-4">
              <Phone size={16} />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Support 7j/7</h3>
              <p className="text-xs text-text-muted leading-relaxed">WhatsApp et téléphone disponibles à tout moment.</p>
            </div>
          </div>

          {/* Carte 3 : Avis */}
          <div className="bg-surface border border-border-main rounded-[20px] p-4 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 flex items-center justify-center mb-4">
              <Star size={16} />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Système d'avis</h3>
              <p className="text-xs text-text-muted leading-relaxed">Chaque trajet est noté par les deux parties.</p>
            </div>
          </div>

          {/* Carte 4 : Suivi */}
          <div className="bg-surface border border-border-main rounded-[20px] p-4 shadow-sm flex flex-col justify-between">
            <div className="w-8 h-8 rounded-full bg-kombi-dark-500 text-white flex items-center justify-center mb-4">
              <MapPin size={16} />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm mb-1">Suivi en direct</h3>
              <p className="text-xs text-text-muted leading-relaxed">Partagez votre trajet en temps réel.</p>
            </div>
          </div>

        </div>

        {/* Bouton d'action */}
        <button className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm py-4 rounded-[16px] transition-colors shadow-md">
          En savoir plus sur la sécurité
        </button>

      </div>
    </div>
  );
};