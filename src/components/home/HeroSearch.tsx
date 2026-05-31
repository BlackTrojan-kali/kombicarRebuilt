// src/components/home/HeroSearch.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, MapPin } from 'lucide-react';
import { LocationAutocomplete } from '../ui/LocationAutocomplete';
import toast from 'react-hot-toast';

type RideType = 'covoiturage' | 'taxi';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const [rideType, setRideType] = useState<RideType>('covoiturage');
  
  // États des filtres
  const [startCity, setStartCity] = useState('');
  const [startPlaceId, setStartPlaceId] = useState('');
  const [endCity, setEndCity] = useState('');
  const [endPlaceId, setEndPlaceId] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!startCity && !endCity) {
      toast.error("Veuillez indiquer au moins une ville de départ ou d'arrivée.");
      return;
    }

    // Redirection vers la future page de recherche avec les filtres
    // On passe les données via le state du router
    navigate('/recherche', { 
      state: { 
        rideType,
        startCity, 
        startPlaceId,
        endCity,
        endPlaceId,
        date, 
        passengers 
      } 
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface border border-border-main rounded-3xl p-6 md:p-8 shadow-xl relative z-20">
      
      {/* En-tête du composant */}
      <div className="mb-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-kombi-green-600 dark:text-kombi-green-400 text-xs font-bold mb-4">
          <span className="w-2 h-2 rounded-full bg-kombi-green-500 animate-pulse"></span>
          284 trajets actifs aujourd'hui
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main leading-tight mb-3">
          Trouvez votre <span className="text-kombi-orange-500">trajet</span><br />en quelques secondes
        </h1>
        <p className="text-text-muted text-sm">
          Covoiturage et taxi entre Douala, Yaoundé et toutes les grandes villes du Cameroun.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        
        {/* Onglets Covoiturage / Taxi */}
        <div className="flex p-1 bg-base rounded-2xl border border-border-main mb-6">
          <button
            type="button"
            onClick={() => setRideType('covoiturage')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
              rideType === 'covoiturage' 
                ? 'bg-surface shadow-sm text-text-main' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <MapPin size={18} />
            Covoiturage
          </button>
          <button
            type="button"
            onClick={() => setRideType('taxi')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
              rideType === 'taxi' 
                ? 'bg-surface shadow-sm text-text-main' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Car size={18} /> {/* Remplacer par l'icône de ton choix si besoin */}
            Taxi
          </button>
        </div>

        {/* Champs de recherche */}
        <div className="bg-surface border border-border-main rounded-2xl shadow-sm relative z-30">
          
          {/* Départ */}
          <div className="p-2 border-b border-border-main">
            <LocationAutocomplete
              placeholder="Ville de départ (ex: Bonanjo, Douala)"
              value={startCity}
              onChangeText={setStartCity}
              onPlaceSelect={(desc, id) => { setStartCity(desc); setStartPlaceId(id); }}
            />
          </div>
          
          {/* Arrivée */}
          <div className="p-2 border-b border-border-main">
            <LocationAutocomplete
              placeholder="Ville d'arrivée (ex: Yaoundé centre)"
              value={endCity}
              onChangeText={setEndCity}
              onPlaceSelect={(desc, id) => { setEndCity(desc); setEndPlaceId(id); }}
            />
          </div>

          {/* Date & Passagers */}
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border-main">
            <div className="flex-1 p-2">
              <div className="flex items-center px-3 py-2">
                <Calendar size={18} className="text-text-muted mr-3 shrink-0" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-text-main font-medium text-sm [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
            
            <div className="flex-1 p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center">
                  <User size={18} className="text-text-muted mr-3 shrink-0" />
                  <span className="text-text-main font-medium text-sm">{passengers} passager{passengers > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-7 h-7 rounded-full bg-base border border-border-main flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                  <button type="button" onClick={() => setPassengers(Math.min(8, passengers + 1))} className="w-7 h-7 rounded-full bg-base border border-border-main flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de recherche */}
        <button
          type="submit"
          className="w-full mt-4 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Rechercher un trajet
        </button>

      </form>

      {/* Statistiques rapides (Bas du composant) */}
      <div className="mt-8 pt-6 border-t border-border-main flex items-center justify-between px-2">
        <div className="text-center">
          <p className="text-lg font-bold text-text-main">12 K+</p>
          <p className="text-xs text-text-muted">Voyageurs</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-text-main">4,8 ⭐</p>
          <p className="text-xs text-text-muted">Note moyenne</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-text-main">60+</p>
          <p className="text-xs text-text-muted">Villes</p>
        </div>
      </div>

    </div>
  );
};

// SVG Icon pour le bouton taxi (A rajouter au dessus du composant ou à importer)
const Car = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);