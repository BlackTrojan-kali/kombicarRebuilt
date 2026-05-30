// src/pages/covoiturage/PlannedTripsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, MapPin, 
  ArrowRight, Trash2, Loader2, BellRing, PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { LocationAutocomplete } from '../../components/ui/LocationAutocomplete';
import { tripSuggestionService } from '../../services/tripSuggestionService';
import type { TripSuggestionDto } from '../../types/tripSuggestionTypes';

export const PlannedTripsPage = () => {
  const navigate = useNavigate();

  // États pour le formulaire de création
  const [departureArea, setDepartureArea] = useState('');
  const [arrivalArea, setArrivalArea] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États pour la liste des suggestions
  const [suggestions, setSuggestions] = useState<TripSuggestionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Pagination de la liste
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ hasNext: false, hasPrev: false, total: 0 });

  // --- CHARGEMENT DES DONNÉES ---
  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await tripSuggestionService.getUserTripSuggestions(currentPage);
      setSuggestions(response.items || []);
      setPaginationMeta({
        hasNext: response.hasNextPage,
        hasPrev: response.hasPreviousPage,
        total: response.totalCount
      });
    } catch (error) {
      toast.error("Erreur lors du chargement de vos planifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // --- CRÉATION D'UNE PLANIFICATION ---
  const handleCreateSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureArea || !arrivalArea || !date || !time) {
      return toast.error("Veuillez remplir tous les champs.");
    }

    setIsSubmitting(true);
    try {
      // Combinaison de la date et l'heure pour créer un objet ISO 8601
      const dateTimeString = `${date}T${time}:00`;
      const departureDateTime = new Date(dateTimeString).toISOString();

      await tripSuggestionService.createTripSuggestion({
        departureArea,
        arrivalArea,
        departureDateTime
      });

      toast.success("Votre trajet a été planifié avec succès !");
      
      // Réinitialiser le formulaire
      setDepartureArea('');
      setArrivalArea('');
      setDate('');
      setTime('');
      
      // Recharger la liste
      setCurrentPage(1);
      fetchSuggestions();

    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erreur lors de la planification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUPPRESSION D'UNE PLANIFICATION ---
  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette planification ?")) return;

    setDeletingId(id);
    try {
      await tripSuggestionService.deleteTripSuggestion(id);
      toast.success("Planification supprimée.");
      fetchSuggestions();
    } catch (error: any) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <BellRing size={20} className="text-kombi-orange-500" /> Planifier un trajet
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-8">
        
        {/* SECTION FORMULAIRE DE CRÉATION */}
        <div className="bg-surface border border-border-main rounded-[24px] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-text-main flex items-center gap-2">
              Créer une alerte de trajet
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Vous ne trouvez pas de trajet correspondant ? Planifiez-le et nous vous préviendrons dès qu'un conducteur proposera cet itinéraire.
            </p>
          </div>

          <form onSubmit={handleCreateSuggestion} className="space-y-4">
            <div className="bg-base border border-border-main rounded-2xl p-2 space-y-2">
              {/* Utilisation de LocationAutocomplete, on sauvegarde juste le texte descriptif */}
              <LocationAutocomplete
                placeholder="D'où partez-vous ? (Ville, Quartier)"
                value={departureArea}
                onChangeText={setDepartureArea}
                onPlaceSelect={(desc) => setDepartureArea(desc)}
              />
              <LocationAutocomplete
                placeholder="Où allez-vous ? (Ville, Quartier)"
                value={arrivalArea}
                onChangeText={setArrivalArea}
                onPlaceSelect={(desc) => setArrivalArea(desc)}
              />
              
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-surface border border-border-main rounded-xl px-3 py-2.5 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <Calendar size={18} className="text-text-muted mr-2 shrink-0" />
                  <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-text-main font-medium text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div className="flex-1 flex items-center bg-surface border border-border-main rounded-xl px-3 py-2.5 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <Clock size={18} className="text-text-muted mr-2 shrink-0" />
                  <input 
                    type="time" 
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent outline-none text-text-main font-medium text-sm [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
              Enregistrer ma planification
            </button>
          </form>
        </div>

        {/* SECTION LISTE DES PLANIFICATIONS */}
        <div>
          <h3 className="text-lg font-bold text-text-main mb-4">Mes planifications actives</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((item) => {
                const depDate = new Date(item.departureDateTime);
                const dateStr = depDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                const timeStr = depDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const isDeleting = deletingId === item.id;

                return (
                  <div key={item.id} className="bg-surface border border-border-main rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
                        <Calendar size={14} />
                        <span className="capitalize">{dateStr} à {timeStr}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-base text-text-main font-bold">
                        <p className="truncate">{item.departureArea}</p>
                        <ArrowRight size={16} className="text-kombi-orange-500 shrink-0" />
                        <p className="truncate">{item.arrivalArea}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      title="Supprimer cette alerte"
                      className="p-2.5 border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>

                  </div>
                );
              })}

              {/* PAGINATION */}
              {(paginationMeta.hasNext || paginationMeta.hasPrev) && (
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={!paginationMeta.hasPrev}
                    className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-base"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={!paginationMeta.hasNext}
                    className="px-4 py-2 bg-surface border border-border-main rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-base"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border-main rounded-[20px] p-8 text-center">
              <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 text-kombi-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Aucune planification</h3>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                Vous n'avez actuellement aucune alerte de trajet active.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};