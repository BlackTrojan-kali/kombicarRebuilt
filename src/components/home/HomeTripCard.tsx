// src/components/home/HomeTripCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Briefcase, ChevronRight } from 'lucide-react';
import type{ TripListItem } from '../../types/TripTypes';

interface HomeTripCardProps {
  tripData: TripListItem;
}

export const HomeTripCard: React.FC<HomeTripCardProps> = ({ tripData }) => {
  const { trip, departureArea, arrivalArea, driver, vehicule } = tripData;

  // Formatage de l'heure
  const departureDate = new Date(trip.departureDate);
  const timeString = departureDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const dateString = departureDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <Link 
      to={`/trajets/${trip.id}`} 
      className="block bg-surface border border-border-main rounded-3xl p-5 hover:border-kombi-orange-500 hover:shadow-md transition-all group"
    >
      {/* En-tête : Date, Heure et Prix */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-text-main font-bold text-lg">
            <Clock size={18} className="text-kombi-orange-500" />
            {timeString}
          </div>
          <p className="text-sm text-text-muted capitalize">{dateString}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-kombi-orange-500">
            {trip.pricePerPlace.toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
          </p>
          <p className="text-xs text-text-muted">{trip.placesLeft} place{trip.placesLeft > 1 ? 's' : ''} libre{trip.placesLeft > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Itinéraire (Timeline visuelle) */}
      <div className="relative pl-3 mb-6">
        {/* Ligne verticale */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border-main"></div>
        
        {/* Départ */}
        <div className="relative mb-4">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-kombi-orange-500 bg-surface"></div>
          <p className="font-bold text-text-main text-sm">{departureArea.homeTownName}</p>
          {departureArea.name !== departureArea.homeTownName && (
            <p className="text-xs text-text-muted truncate">{departureArea.name}</p>
          )}
        </div>

        {/* Arrivée */}
        <div className="relative">
          <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-kombi-blue-500 bg-kombi-blue-500"></div>
          <p className="font-bold text-text-main text-sm">{arrivalArea.homeTownName}</p>
          {arrivalArea.name !== arrivalArea.homeTownName && (
            <p className="text-xs text-text-muted truncate">{arrivalArea.name}</p>
          )}
        </div>
      </div>

      {/* Pied de carte : Chauffeur & Options */}
      <div className="pt-4 border-t border-border-main flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          {driver.photoUrl ? (
            <img src={`${import.meta.env.VITE_API_BASE_URL_WITHOUT_API_V1}`+driver.photoUrl} alt={driver.firstName} className="w-10 h-10 rounded-full object-cover border border-border-main" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-kombi-dark-500 text-white flex items-center justify-center font-bold text-sm">
              {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-text-main">{driver.firstName}</p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="flex items-center gap-0.5 text-yellow-500 font-medium">
                <Star size={12} className="fill-yellow-500" />
                {driver.rating > 0 ? driver.rating.toFixed(1) : 'Nouveau'}
              </span>
              <span>•</span>
              <span className="truncate max-w-[80px]">{vehicule.brand}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-text-muted">
          {trip.authorizedLuggages && (
            <div className="p-1.5 bg-base rounded-lg" title="Bagages acceptés">
              <Briefcase size={16} />
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 flex items-center justify-center group-hover:bg-kombi-orange-500 group-hover:text-white transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>

      </div>
    </Link>
  );
};