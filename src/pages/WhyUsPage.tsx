// src/pages/WhyUsPage.tsx
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  DollarSign, 
  Zap, 
  Shield, 
  Users, 
  Check, 
  ArrowRight,
  Apple,
  Play
} from 'lucide-react';

// Assure-toi que le chemin vers l'image est correct selon la structure de ton projet
import appImg from '../assets/app-img.png'; 

export const WhyUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base flex flex-col items-center pb-12">
      
      {/* Conteneur principal : Pleine largeur sur mobile, carte centrée sur Desktop */}
      <div className="w-full max-w-2xl bg-surface min-h-screen md:min-h-0 md:mt-8 md:rounded-[32px] md:shadow-xl md:border md:border-border-main overflow-hidden flex flex-col">
        
        {/* Navigation : Transparente/Floutée pour un effet moderne */}
        <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border-main md:hidden">
          <div className="px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
              aria-label="Retour"
            >
              <ChevronLeft size={20} className="text-text-main" />
            </button>
          </div>
        </div>

        {/* Bouton retour Desktop (Optionnel mais pratique si pas de header global) */}
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
            <p className="text-[11px] font-extrabold text-kombi-orange-500 uppercase tracking-widest mb-3">
              Pourquoi nous
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main leading-tight mb-4">
              Quatre bonnes raisons<br />de choisir <span className="text-kombi-orange-500">Kombicar</span>
            </h1>
          </div>

          {/* Grille des 4 raisons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            
            {/* Carte 1 : Économisez */}
            <div className="bg-surface border border-border-main rounded-[20px] p-5 transition-all hover:shadow-md hover:border-green-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign size={24} />
              </div>
              <h3 className="font-bold text-text-main text-base mb-2">Économisez</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Jusqu'à -60% comparé à un taxi seul. Partagez les frais.
              </p>
            </div>

            {/* Carte 2 : Réservez vite */}
            <div className="bg-surface border border-border-main rounded-[20px] p-5 transition-all hover:shadow-md hover:border-yellow-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-text-main text-base mb-2">Réservez vite</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                3 clics, c'est tout. Confirmation instantanée.
              </p>
            </div>

            {/* Carte 3 : Voyagez sûr */}
            <div className="bg-surface border border-border-main rounded-[20px] p-5 transition-all hover:shadow-md hover:border-kombi-orange-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-kombi-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-text-main text-base mb-2">Voyagez sûr</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Conducteurs vérifiés, suivi en temps réel, support 7j/7.
              </p>
            </div>

            {/* Carte 4 : Rencontrez */}
            <div className="bg-surface border border-border-main rounded-[20px] p-5 transition-all hover:shadow-md hover:border-gray-500/30 group">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-text-main text-base mb-2">Rencontrez</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Une communauté de 12 000+ voyageurs au Cameroun.
              </p>
            </div>

          </div>

          {/* ========================================================= */}
          {/* BANNIÈRE TÉLÉCHARGEMENT D'APPLICATION */}
          {/* ========================================================= */}
          <div className="bg-[#ffcc00] rounded-[24px] pt-8 px-6 md:pt-12 md:px-10 text-black relative overflow-hidden shadow-sm mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-1 pb-8 md:pb-12 z-10 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 leading-tight">
                Simplifiez votre expérience,<br />téléchargez l'app !
              </h2>
              <p className="text-black/80 font-medium text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                Réservez vos trajets et gérez vos covoiturages directement depuis votre poche, où que vous soyez.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                {/* Bouton App Store */}
                <a 
                  href="https://apps.apple.com/us/app/kombicar/id6468362045"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-5 rounded-xl hover:bg-gray-50 transition-transform hover:scale-105 shadow-sm w-full sm:w-auto"
                >
                  <Apple size={28} className="shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] font-medium leading-none mb-1">Télécharger sur</div>
                    <div className="text-base leading-none">App Store</div>
                  </div>
                </a>
                
                {/* Bouton Google Play */}
                <a 
                  href="https://play.google.com/store/apps/details?id=com.kombicar.mobile"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-black text-white font-bold py-3 px-5 rounded-xl hover:bg-gray-900 transition-transform hover:scale-105 shadow-sm w-full sm:w-auto"
                >
                  <Play size={24} className="fill-white shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] font-medium leading-none mb-1 text-gray-300">DISPONIBLE SUR</div>
                    <div className="text-base leading-none">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Image du téléphone coupée proprement vers le bas */}
            <div className="w-full md:w-5/12 flex justify-center z-10 self-end mt-4 md:mt-0">
              <img 
                src={appImg} 
                alt="Application mobile Kombicar" 
                className="w-full max-w-[200px] md:max-w-[260px] object-contain drop-shadow-2xl translate-y-4 md:translate-y-6" 
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* CARTE SOMBRE CALL-TO-ACTION */}
          {/* ========================================================= */}
          <div className="bg-[#181c25] rounded-[24px] p-8 text-white relative overflow-hidden shadow-xl">
            {/* Décoration d'arrière-plan */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-kombi-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Rejoignez 12 000+ voyageurs
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                Chaque jour, des centaines de Camerounais se déplacent grâce à Kombicar.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check size={18} className="text-kombi-orange-500 shrink-0" />
                  <span>4,8/5 de note moyenne</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check size={18} className="text-kombi-orange-500 shrink-0" />
                  <span>+ de 280 trajets actifs aujourd'hui</span>
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check size={18} className="text-kombi-orange-500 shrink-0" />
                  <span>60 villes desservies au Cameroun</span>
                </li>
              </ul>

              <Link 
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-bold py-3.5 px-6 rounded-full transition-colors"
              >
                Commencer maintenant <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};