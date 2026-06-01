// src/components/trips/ResultTripCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, Wind, Users, ArrowRight } from 'lucide-react';
import { type TripListItem } from '../../types/TripTypes';

interface ResultTripCardProps {
  tripData: TripListItem;
}

export const ResultTripCard: React.FC<ResultTripCardProps> = ({ tripData }) => {
  const { trip, vehicule, departureArea, arrivalArea, driver, stopOvers } = tripData;

  // Formatage de l'heure de départ
  const departureDate = new Date(trip.departureDate);
  const departureTime = departureDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Pour la démo : On simule une durée moyenne de 3h30 pour calculer l'heure d'arrivée 
  // (À adapter si ton backend renvoie l'heure exacte d'arrivée ou la durée)
  const arrivalDate = new Date(departureDate.getTime() + 3.5 * 60 * 60 * 1000);
  const arrivalTime = arrivalDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const durationStr = "3h30"; // Simulé pour l'UI
  const stopsStr = stopOvers && stopOvers.length > 0 
    ? `${stopOvers.length} arrêt${stopOvers.length > 1 ? 's' : ''}` 
    : "Direct";

  return (
    <Link 
      to={`/trajets/${trip.id}`}
      className="block bg-surface border border-border-main rounded-[20px] p-5 hover:border-kombi-orange-500 hover:shadow-md transition-all group"
    >
      {/* En-tête : Heures, Durée et Prix */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 text-lg font-extrabold text-text-main">
            <span>{departureTime}</span>
            <ArrowRight size={16} className="text-text-muted" />
            <span>{arrivalTime}</span>
          </div>
          <p className="text-xs text-text-muted mt-1 font-medium">
            {durationStr} <span className="mx-1">•</span> {stopsStr}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-kombi-orange-500">
            {trip.pricePerPlace.toLocaleString('fr-FR')}
          </p>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">XAF / pers.</p>
        </div>
      </div>

      {/* Itinéraire géographique */}
      <div className="flex items-center gap-2 mb-5 text-sm text-text-main font-medium">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-text-muted bg-surface shrink-0"></div>
        <p className="truncate">{departureArea.homeTownName}</p>
        <ArrowRight size={14} className="text-text-muted shrink-0 mx-1" />
        <p className="truncate">{arrivalArea.homeTownName}</p>
      </div>

      {/* Profil Chauffeur & Véhicule */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        {driver.photoUrl ? (
          <img src={`${import.meta.env.VITE_API_BASE_URL_WITHOUT_API_V1}`+driver.photoUrl} alt={driver.firstName} className="w-10 h-10 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-kombi-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
          </div>
        )}
        
        {/* Infos Chauffeur */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-main text-sm truncate">{driver.firstName} {driver.lastName.charAt(0)}.</p>
          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
            <span className="flex items-center text-text-main font-medium">
              <Star size={12} className="fill-text-main mr-1" />
              {driver.rating > 0 ? driver.rating.toFixed(1) : 'Nouveau'}
            </span>
            <span>•</span>
            <span className="truncate">{vehicule.brand} {vehicule.model}</span>
          </div>
        </div>
      </div>

      {/* Badges de confort */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-main">
        {vehicule.isVerified && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/10 text-kombi-green-600 dark:text-kombi-green-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} />
            Vérifié
          </div>
        )}
        {vehicule.airConditionned && (
          <div className="flex items-center gap-1 px-2 py-1 bg-base text-text-muted rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Wind size={12} />
            Climatisé
          </div>
        )}
        <div className="flex items-center gap-1 px-2 py-1 bg-base text-text-muted rounded-md text-[10px] font-bold uppercase tracking-wider ml-auto">
          <Users size={12} />
          {trip.placesLeft} places
        </div>
      </div>
    </Link>
  );
};