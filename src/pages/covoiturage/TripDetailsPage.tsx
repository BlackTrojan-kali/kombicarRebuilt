// src/pages/covoiturage/TripDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, MapPin, Star, 
  Wind, Briefcase, ShieldCheck, CarFront, Info, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { tripService } from '../../services/tripService';
import { ReservationModal } from '../../components/trips/ReservationModal';
import { type TripListItem } from '../../types/TripTypes';

export const TripDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState<TripListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction de récupération des détails du trajet
  const fetchTripDetails = async () => {
    if (!id) return;
    try {
      const data = await tripService.getTripById(Number(id));
      setTripData(data);
    } catch (error) {
      toast.error("Impossible de récupérer les détails de ce trajet.");
      navigate(-1); // Retour en arrière en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
      </div>
    );
  }

  if (!tripData) return null;

  const { trip, departureArea, arrivalArea, stopOvers, driver, vehicule } = tripData;

  // Formater la date et les heures
  const departureDate = new Date(trip.departureDate);
  const timeString = departureDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateString = departureDate.toLocaleDateString('fr-FR', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });

  // Libellé de la taille des bagages
  const getLuggageSizeLabel = (size: number) => {
    if (size === 0) return 'Petits (Sacs à dos)';
    if (size === 1) return 'Moyens (Valises cabine)';
    return 'Grands (Grosses valises)';
  };

  return (
    <div className="min-h-screen bg-base pb-24 px-4 sm:px-6 py-8">
      <div className="max-w-xl mx-auto bg-surface border border-border-main rounded-3xl shadow-sm overflow-hidden relative">
        
        {/* EN-TÊTE DE PAGE */}
        <div className="flex items-center justify-between p-6 border-b border-border-main relative bg-base/30">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main absolute left-1/2 -translate-x-1/2">
            Détails du voyage
          </h1>
        </div>

        {/* CORPS DES DÉTAILS */}
        <div className="p-6 space-y-8">
          
          {/* DATE & HEURE GÉNÉRALE */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-kombi-orange-500 uppercase tracking-widest mb-1">{dateString}</p>
            <div className="text-3xl font-extrabold text-text-main flex items-center justify-center sm:justify-start gap-2">
              <Clock size={24} className="text-text-muted" />
              <span>Départ à {timeString}</span>
            </div>
          </div>

          {/* TIMELINE DE L'ITINÉRAIRE */}
          <div className="bg-base/50 border border-border-main rounded-2xl p-5 relative">
            <div className="absolute left-[29px] top-9 bottom-9 w-0.5 bg-border-main"></div>
            
            {/* Départ */}
            <div className="flex gap-4 relative items-start mb-6">
              <div className="w-5 h-5 rounded-full border-4 border-kombi-orange-500 bg-surface shrink-0 mt-0.5 z-10"></div>
              <div>
                <p className="font-extrabold text-text-main text-base">{departureArea.homeTownName}</p>
                <p className="text-xs text-text-muted font-medium">{departureArea.name}</p>
              </div>
            </div>

            {/* Escales (si existantes) */}
            {stopOvers && stopOvers.map((stop, idx) => (
              <div key={stop.id || idx} className="flex gap-4 relative items-start mb-6">
                <div className="w-5 h-5 rounded-full border-4 border-text-muted bg-surface shrink-0 mt-0.5 z-10"></div>
                <div>
                  <p className="font-bold text-text-main text-sm">{stop.homeTownName}</p>
                  <p className="text-xs text-text-muted font-medium">{stop.name}</p>
                </div>
              </div>
            ))}

            {/* Arrivée */}
            <div className="flex gap-4 relative items-start">
              <div className="w-5 h-5 rounded-full border-4 border-kombi-blue-500 bg-kombi-blue-500 shrink-0 mt-0.5 z-10"></div>
              <div>
                <p className="font-extrabold text-text-main text-base">{arrivalArea.homeTownName}</p>
                <p className="text-xs text-text-muted font-medium">{arrivalArea.name}</p>
              </div>
            </div>
          </div>

          {/* LE CONDUCTEUR */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Votre conducteur</h3>
            <div className="flex items-center gap-4 bg-surface border border-border-main rounded-2xl p-4">
              {driver.photoUrl ? (
                <img src={driver.photoUrl} alt={driver.firstName} className="w-14 h-14 rounded-full object-cover border border-border-main" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-kombi-orange-500 text-white flex items-center justify-center font-bold text-lg">
                  {driver.firstName.charAt(0)}{driver.lastName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-text-main text-base truncate">{driver.firstName} {driver.lastName}</p>
                <div className="flex items-center gap-2 mt-0.5 text-sm">
                  <span className="flex items-center text-yellow-500 font-bold gap-0.5">
                    <Star size={14} className="fill-yellow-500" />
                    {driver.rating > 0 ? driver.rating.toFixed(1) : 'Nouveau'}
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted font-medium">Profil vérifié</span>
                </div>
              </div>
            </div>
          </div>

          {/* LE VÉHICULE */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Le véhicule</h3>
            <div className="bg-surface border border-border-main rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CarFront className="text-text-muted" size={20} />
                  <div>
                    <p className="font-bold text-text-main text-sm">{vehicule.brand} {vehicule.model}</p>
                    <p className="text-xs text-text-muted capitalize">Couleur : {vehicule.color}</p>
                  </div>
                </div>
                {vehicule.isVerified && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/10 text-kombi-green-600 dark:text-kombi-green-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} /> Vérifié
                  </span>
                )}
              </div>

              {/* Commodités du véhicule */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border-main">
                {vehicule.airConditionned && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base rounded-xl text-xs font-medium text-text-main">
                    <Wind size={14} className="text-kombi-blue-500" /> Véhicule climatisé
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-base rounded-xl text-xs font-medium text-text-main">
                  <Briefcase size={14} className="text-kombi-orange-500" /> {trip.authorizedLuggages ? 'Bagages autorisés' : 'Pas de gros bagages'}
                </div>
              </div>
            </div>
          </div>

          {/* CONDITIONS RELATIVES AUX BAGAGES */}
          {trip.authorizedLuggages && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Politique de bagages</h3>
              <div className="bg-base/30 border border-border-main rounded-2xl p-4 flex items-start gap-3 text-sm text-text-main">
                <Info size={18} className="text-kombi-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Taille maximale autorisée :</p>
                  <p className="text-text-muted mt-0.5">{getLuggageSizeLabel(trip.luggageSize)}</p>
                  <p className="text-xs text-text-muted mt-1">Nombre max par passager : {trip.luggageNumberPerPassenger}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BARRE FIXED / FLOATING DU BAS DE PAGE POUR LE CTA ACTION */}
        <div className="border-t border-border-main p-4 bg-surface flex items-center justify-between sticky bottom-0 left-0 right-0 z-20">
          <div>
            <p className="text-2xl font-black text-kombi-orange-500">
              {trip.pricePerPlace.toLocaleString('fr-FR')} <span className="text-xs font-bold text-text-muted uppercase">XAF / place</span>
            </p>
            <p className="text-xs font-medium text-text-muted mt-0.5">
              {trip.placesLeft > 0 ? `${trip.placesLeft} place(s) restante(s)` : 'Complet'}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            disabled={trip.placesLeft === 0}
            className="px-8 py-3.5 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-extrabold text-base rounded-2xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {trip.placesLeft > 0 ? 'Réserver ce trajet' : 'Complet'}
          </button>
        </div>

      </div>

      {/* MODAL DE RÉSERVATION */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripId={trip.id}
        pricePerPlace={trip.pricePerPlace}
        maxPlaces={trip.placesLeft}
        onSuccess={fetchTripDetails}
      />
    </div>
  );
};