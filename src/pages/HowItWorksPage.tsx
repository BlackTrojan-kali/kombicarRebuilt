// src/pages/HowItWorksPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle } from 'lucide-react';

export const HowItWorksPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: "Trouvez votre trajet",
      description: "Indiquez départ et destination. Comparez covoiturage et taxi, choisissez l'horaire qui vous convient."
    },
    {
      number: 2,
      title: "Réservez votre place",
      description: "Sélectionnez un conducteur vérifié, payez en mobile money ou cash, recevez votre confirmation."
    },
    {
      number: 3,
      title: "Voyagez en toute sérénité",
      description: "Retrouvez votre conducteur au point de rendez-vous, profitez du trajet, notez votre expérience."
    }
  ];

  return (
    // bg-base sert de fond général (plus sombre sur desktop d'après ta maquette)
    <div className="min-h-screen bg-base flex flex-col items-center pb-12">
      
      {/* Conteneur principal : Pleine largeur sur mobile, carte centrée sur Desktop */}
      <div className="w-full max-w-2xl bg-surface min-h-screen md:min-h-0 md:mt-8 md:rounded-[32px] md:shadow-lg md:border md:border-border-main overflow-hidden flex flex-col">
        
        {/* Navigation : Transparente/Floutée pour un effet moderne */}
        <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border-main">
          <div className="px-4 py-4 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
              aria-label="Retour"
            >
              <ChevronLeft size={20} className="text-text-main" />
            </button>
            {/* Sur desktop on peut laisser le titre invisible ici, l'accent est mis sur le gros titre en dessous */}
          </div>
        </div>

        {/* Contenu de la page */}
        <div className="px-6 pt-8 pb-12 md:px-12 md:pt-12">
          
          {/* En-tête de page */}
          <div className="mb-10">
            <p className="text-[11px] font-extrabold text-kombi-orange-500 uppercase tracking-widest mb-3">
              Comment ça marche
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main leading-tight mb-4">
              Voyager n'a jamais<br />
              été aussi <span className="text-kombi-orange-500">simple</span>
            </h1>
            <p className="text-text-muted text-sm md:text-base leading-relaxed">
              Trois étapes, et vous voilà parti. Voyez vous-même.
            </p>
          </div>

          {/* Liste des Étapes */}
          <div className="space-y-4 mb-10">
            {steps.map((step) => (
              <div 
                key={step.number} 
                className="bg-surface border border-border-main rounded-[20px] p-5 md:p-6 transition-all hover:shadow-sm hover:border-kombi-orange-500/30 flex gap-4 md:gap-5 items-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-kombi-orange-500 flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-bold text-text-main text-base mb-1.5">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carte Support / Contact */}
          <div className="bg-base border border-border-main rounded-[24px] p-6 md:p-8 text-center mt-4">
            <h3 className="text-lg font-bold text-text-main mb-2">Une question ?</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-sm mx-auto">
              Notre équipe support répond en moins de 5 minutes sur WhatsApp.
            </p>
            <a 
              href="https://wa.me/237000000000" // Remplacer par le numéro WhatsApp officiel
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto mx-auto inline-flex items-center justify-center gap-2 border-2 border-border-main hover:border-text-main hover:bg-surface text-text-main font-bold py-3.5 px-6 rounded-[16px] transition-all"
            >
              <MessageCircle size={18} />
              Discuter avec un agent
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};