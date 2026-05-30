// src/pages/covoiturage/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, SlidersHorizontal, Loader2, MapPin, 
  Search, Calendar, User, Wind, Briefcase, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

import { ResultTripCard } from '../../components/trips/ResultTripCard';
import { LocationAutocomplete } from '../../components/ui/LocationAutocomplete';
import { tripService } from '../../services/tripService';
import { type TripListItem, TripStatus } from '../../types/TripTypes';

export const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialisation des paramètres de recherche depuis la navigation
  const initialParams = location.state || {};
  
  // États de la recherche principale
  const [searchParams, setSearchParams] = useState({
    startCity: initialParams.startCity || '',
    startPlaceId: initialParams.startPlaceId || '',
    endCity: initialParams.endCity || '',
    endPlaceId: initialParams.endPlaceId || '',
    date: initialParams.date || '',
    passengers: initialParams.passengers || 1,
  });

  // États des filtres rapides
  const [filters, setFilters] = useState({
    airConditionned: false,
    luggageAllowed: false,
  });

  // États de Pagination et UI
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trips, setTrips] = useState<TripListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Fonction pour appeler l'API
  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await tripService.listPublicTrips({
        page: currentPage,
        tripStatus: TripStatus.PUBLISHED,
        startAreaCity: searchParams.startCity || null,
        endAreaCity: searchParams.endCity || null,
        departureDate: searchParams.date || null,
        airConditionned: filters.airConditionned ? true : null, 
        luggageAllowed: filters.luggageAllowed ? true : null,
      });
      
      setTrips(response.items);
      setTotalCount(response.totalCount);
      setPaginationMeta({
        hasNextPage: response.hasNextPage,
        hasPreviousPage: response.hasPreviousPage
      });
    } catch (error) {
      toast.error("Erreur lors de la recherche des trajets.");
    } finally {
      setIsLoading(false);
    }
  };

  // Se déclenche à chaque changement de page ou de filtres rapides
  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.airConditionned, filters.luggageAllowed]);

  // Gestionnaire pour le formulaire de recherche rétractable
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    
    // Si on est déjà sur la page 1, on force le rechargement.
    // Sinon, setCurrentPage(1) va déclencher le useEffect automatiquement.
    if (currentPage === 1) {
      fetchTrips();
    } else {
      setCurrentPage(1);
    }
  };

  // Gestion des changements de filtres (remise à la page 1)
  const toggleFilter = (filterName: 'airConditionned' | 'luggageAllowed') => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    setCurrentPage(1);
  };

  // Navigation dans la pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de la liste fluide
  };

  // Formatage pour l'affichage dans le Header
  const headerDate = searchParams.date 
    ? new Date(searchParams.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' }) 
    : "Aujourd'hui";
  
  const startLocationDisplay = searchParams.startCity?.split(',')[0] || "Départ";
  const endLocationDisplay = searchParams.endCity?.split(',')[0] || "Arrivée";

  return (
    <div className="min-h-screen bg-base pb-10">
      
      {/* HEADER FIXE */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex-1 text-center px-4 overflow-hidden group cursor-pointer hover:opacity-80 transition-opacity"
          >
            <p className="text-xs font-medium text-text-muted capitalize flex items-center justify-center gap-1">
              {headerDate} • {searchParams.passengers} passager{searchParams.passengers > 1 ? 's' : ''}
              {isSearchOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </p>
            <h1 className="text-base font-bold text-text-main truncate flex items-center justify-center gap-2 mt-0.5">
              <span>{startLocationDisplay}</span>
              <ArrowRight size={14} className="text-kombi-orange-500 shrink-0" />
              <span>{endLocationDisplay}</span>
            </h1>
          </button>

          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors text-text-main shrink-0"
          >
            <Search size={18} />
          </button>
        </div>

        {/* FORMULAIRE DE RECHERCHE DÉROULANT */}
        {isSearchOpen && (
          <div className="max-w-2xl mx-auto px-4 pb-6 pt-2 border-t border-border-main animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="bg-base rounded-2xl p-2 border border-border-main space-y-2">
                <LocationAutocomplete
                  placeholder="Ville de départ"
                  value={searchParams.startCity}
                  onChangeText={(val) => setSearchParams(prev => ({...prev, startCity: val}))}
                  onPlaceSelect={(desc, id) => setSearchParams(prev => ({...prev, startCity: desc, startPlaceId: id}))}
                />
                <LocationAutocomplete
                  placeholder="Ville d'arrivée"
                  value={searchParams.endCity}
                  onChangeText={(val) => setSearchParams(prev => ({...prev, endCity: val}))}
                  onPlaceSelect={(desc, id) => setSearchParams(prev => ({...prev, endCity: desc, endPlaceId: id}))}
                />
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-surface border border-border-main rounded-xl px-3 py-2">
                    <Calendar size={18} className="text-text-muted mr-2" />
                    <input 
                      type="date" 
                      value={searchParams.date}
                      onChange={(e) => setSearchParams(prev => ({...prev, date: e.target.value}))}
                      className="w-full bg-transparent outline-none text-text-main font-medium text-sm [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                  <div className="flex items-center bg-surface border border-border-main rounded-xl px-3 py-2 w-32">
                    <User size={18} className="text-text-muted mr-2" />
                    <input 
                      type="number" 
                      min="1" max="8"
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams(prev => ({...prev, passengers: parseInt(e.target.value) || 1}))}
                      className="w-full bg-transparent outline-none text-text-main font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                Mettre à jour la recherche
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        
        {/* TITRE ET COMPTEUR */}
        <div>
          <h2 className="text-2xl font-bold text-text-main">
            {isLoading ? "Recherche en cours..." : `${totalCount} trajet${totalCount > 1 ? 's' : ''} disponible${totalCount > 1 ? 's' : ''}`}
          </h2>
          <p className="text-sm text-text-muted mt-1">Trié par : départ le plus tôt</p>
        </div>

        {/* BARRE DE FILTRES RAPIDES */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-kombi-dark-500 text-white rounded-full text-sm font-medium shrink-0 shadow-sm pointer-events-none">
            <SlidersHorizontal size={14} />
            Filtres
          </div>
          
          <button 
            onClick={() => toggleFilter('airConditionned')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-colors border ${
              filters.airConditionned 
                ? 'bg-kombi-orange-50 dark:bg-kombi-orange-900/20 border-kombi-orange-500 text-kombi-orange-600' 
                : 'bg-surface border-border-main text-text-main hover:bg-base'
            }`}
          >
            <Wind size={14} /> Climatisé
          </button>

          <button 
            onClick={() => toggleFilter('luggageAllowed')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 transition-colors border ${
              filters.luggageAllowed 
                ? 'bg-kombi-orange-50 dark:bg-kombi-orange-900/20 border-kombi-orange-500 text-kombi-orange-600' 
                : 'bg-surface border-border-main text-text-main hover:bg-base'
            }`}
          >
            <Briefcase size={14} /> Bagages acceptés
          </button>
        </div>

        {/* LISTE DES RÉSULTATS */}
        <div className="space-y-4 pt-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 size={40} className="text-kombi-orange-500 animate-spin mb-4" />
              <p className="text-text-muted font-medium">Recherche des meilleurs trajets...</p>
            </div>
          ) : trips.length > 0 ? (
            <>
              {trips.map(trip => (
                <ResultTripCard key={trip.trip.id} tripData={trip} />
              ))}

              {/* CONTRÔLES DE PAGINATION */}
              {(paginationMeta.hasNextPage || paginationMeta.hasPreviousPage) && (
                <div className="flex items-center justify-center gap-4 pt-6 pb-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!paginationMeta.hasPreviousPage}
                    className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base transition-colors"
                  >
                    Précédent
                  </button>
                  <span className="text-sm font-medium text-text-muted">
                    Page {currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!paginationMeta.hasNextPage}
                    className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-surface border border-border-main rounded-[20px] p-8 text-center mt-8">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 text-kombi-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Aucun trajet trouvé</h3>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                Essayez de modifier vos critères de recherche (date, ville) ou d'enlever certains filtres.
              </p>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="mt-6 text-kombi-orange-500 font-bold hover:underline"
              >
                Modifier la recherche
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Composant interne pour l'icône ArrowRight
const ArrowRight = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);