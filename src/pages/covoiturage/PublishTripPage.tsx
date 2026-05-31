// src/pages/covoiturage/PublishTripPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, Users, 
  DollarSign, AlertTriangle, CarFront, Loader2,
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

import { vehiculeService } from '../../services/vehiculeService';
import { licenceService } from '../../services/licenceService';
import { tripService } from '../../services/tripService';
import { mapService } from '../../services/mapService';
import { LocationAutocomplete } from '../../components/ui/LocationAutocomplete';

import { type Vehicule } from '../../types/VehiculesTypes';
import { type LicenceDetails, VerificationState } from '../../types/LicenceTypes';

export const PublishTripPage = () => {
  const navigate = useNavigate();
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [licence, setLicence] = useState<LicenceDetails | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    startCity: '',
    startName: '',
    startLat: 0,
    startLng: 0,
    endCity: '',
    endName: '',
    endLat: 0,
    endLng: 0,
    date: '',
    time: '',
    placesLeft: 3,
    pricePerPlace: 4500,
    vehicleId: 0,
    isLuggageAllowed: true,
    luggageSize: 1, // 0: Petit, 1: Moyen, 2: Grand
    aditionalInfo: ''
  });

  // Chargement des prérequis (Véhicules + Permis)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiculesData, licenceData] = await Promise.all([
          vehiculeService.getAllVehicules(),
          licenceService.getDetails().catch(() => null) // On catch le 404 si pas de permis
        ]);
        
        setVehicules(vehiculesData);
        setLicence(licenceData);
        
        // Auto-sélectionner le premier véhicule vérifié si disponible
        const firstVerified = vehiculesData.find(v => v.isVerified);
        if (firstVerified) {
          setFormData(prev => ({ ...prev, vehicleId: firstVerified.id }));
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des données.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const isLicenceValid = licence?.verificationState === VerificationState.VERIFIED;

  // --- GESTIONNAIRES AUTOCOMPLETE ---
  const handleStartPlaceSelect = async (description: string, placeId: string) => {
    setFormData(prev => ({ ...prev, startCity: description, startName: description }));
    try {
      const details = await mapService.getPlaceDetails(placeId);
      setFormData(prev => ({ ...prev, startLat: details.latitude, startLng: details.longitude }));
    } catch (error) {
      toast.error("Impossible de récupérer les coordonnées du lieu de départ.");
    }
  };

  const handleEndPlaceSelect = async (description: string, placeId: string) => {
    setFormData(prev => ({ ...prev, endCity: description, endName: description }));
    try {
      const details = await mapService.getPlaceDetails(placeId);
      setFormData(prev => ({ ...prev, endLat: details.latitude, endLng: details.longitude }));
    } catch (error) {
      toast.error("Impossible de récupérer les coordonnées du lieu d'arrivée.");
    }
  };

  // Gestion des champs classiques
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion du compteur de places
  const adjustPlaces = (amount: number) => {
    setFormData(prev => {
      const newPlaces = prev.placesLeft + amount;
      // On limite entre 1 et le nombre de places du véhicule sélectionné (ou 9 par défaut)
      const selectedVehicule = vehicules.find(v => v.id === prev.vehicleId);
      const maxPlaces = selectedVehicule ? selectedVehicule.numberPlaces - 1 : 9; // -1 pour le chauffeur
      
      if (newPlaces >= 1 && newPlaces <= maxPlaces) {
        return { ...prev, placesLeft: newPlaces };
      }
      return prev;
    });
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLicenceValid) {
      toast.error("Votre permis doit être validé pour publier un trajet.");
      return;
    }
    if (formData.vehicleId === 0) {
      toast.error("Veuillez sélectionner un véhicule vérifié.");
      return;
    }
    if (formData.startLat === 0 || formData.endLat === 0) {
      toast.error("Veuillez sélectionner des lieux valides depuis les suggestions.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combinaison Date + Heure en format ISO 8601
      const departureDateIso = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      await tripService.createTrip({
        startArea: {
          homeTownName: formData.startCity,
          name: formData.startName || formData.startCity,
          latitude: formData.startLat,
          longitude: formData.startLng,
          order: 0,
          type: 0
        },
        arivalArea: {
          homeTownName: formData.endCity,
          name: formData.endName || formData.endCity,
          latitude: formData.endLat,
          longitude: formData.endLng,
          order: 1,
          type: 1
        },
        departureDate: departureDateIso,
        vehicleId: formData.vehicleId,
        placesLeft: formData.placesLeft,
        pricePerPlace: Number(formData.pricePerPlace),
        isLuggageAllowed: formData.isLuggageAllowed,
        luggageSize: Number(formData.luggageSize),
        luggageNumberPerPassenger: 1, // Fixe pour l'instant
        aditionalInfo: formData.aditionalInfo,
        stopovers: [] // Escales vides pour cette V1
      });

      toast.success("Votre trajet a été soumis et est en attente de validation !");
      navigate('/trajets');
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de la publication du trajet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto bg-surface border border-border-main rounded-3xl shadow-sm overflow-hidden relative">
        
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-border-main relative">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main absolute left-1/2 -translate-x-1/2">
            Nouveau trajet
          </h1>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Titre */}
          <div>
            <p className="text-xs font-bold text-kombi-orange-500 uppercase tracking-wider mb-2">Publier un trajet</p>
            <h2 className="text-3xl font-bold text-text-main leading-tight mb-2">
              Partagez votre <span className="text-kombi-orange-500">route</span>
            </h2>
            <p className="text-text-muted text-sm">Remplissez les détails, vos passagers vous attendent.</p>
            <div className="w-20 h-1 bg-kombi-orange-500 rounded-full mt-4"></div>
          </div>

          {/* BANNIÈRE DE SÉCURITÉ : PERMIS NON VALIDE */}
          {!isLicenceValid && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400">
              <AlertTriangle size={24} className="shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Permis de conduire requis</h4>
                <p className="text-sm mt-1 opacity-90">
                  Votre permis doit être enregistré et validé par un administrateur avant de pouvoir publier un trajet.
                </p>
                <Link to="/profil/permis" className="inline-block mt-2 text-sm font-bold underline hover:no-underline">
                  Gérer mon permis →
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* VÉHICULE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Véhicule utilisé</label>
              
              {vehicules.length === 0 ? (
                <div className="p-4 border border-border-main rounded-2xl bg-base text-center">
                  <p className="text-sm text-text-muted mb-3">Vous n'avez aucun véhicule enregistré.</p>
                  <Link to="/profil/vehicules" className="inline-block bg-kombi-blue-500 text-white text-sm font-medium px-4 py-2 rounded-xl">
                    Ajouter un véhicule
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <CarFront size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 bg-surface border border-border-main rounded-2xl text-text-main font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-kombi-orange-500 transition-all"
                  >
                    <option value={0} disabled>Sélectionnez un véhicule</option>
                    {vehicules.map(v => (
                      <option key={v.id} value={v.id} disabled={!v.isVerified}>
                        {v.brand} {v.model} - {v.registrationCode} {!v.isVerified ? '(En attente de vérification)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* DÉPART & ARRIVÉE (Intégration de LocationAutocomplete) */}
            {/* CORRECTION ICI : Retrait du "overflow-hidden" et ajout de "relative z-10" */}
            <div className="bg-surface border border-border-main rounded-3xl shadow-sm relative z-10">
              <div className="p-4 sm:p-5 border-b border-border-main">
                <LocationAutocomplete
                  label="DÉPART"
                  placeholder="Ex: Bonanjo, Douala"
                  value={formData.startCity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startCity: text }))}
                  onPlaceSelect={handleStartPlaceSelect}
                  required
                />
              </div>
              
              <div className="p-4 sm:p-5">
                <LocationAutocomplete
                  label="ARRIVÉE"
                  placeholder="Ex: Yaoundé centre"
                  value={formData.endCity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endCity: text }))}
                  onPlaceSelect={handleEndPlaceSelect}
                  required
                />
              </div>
            </div>

            {/* DATE & HEURE (Groupe de cartes) */}
            {/* Ajout d'un z-index plus faible pour s'assurer que le dropdown passe au dessus */}
            <div className="bg-surface border border-border-main rounded-3xl overflow-hidden shadow-sm relative z-0">
              <div className="p-4 sm:p-5 border-b border-border-main flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-text-muted"><Calendar size={20} /></div>
                  <div className="flex-1">
                    <label className="text-xs text-text-muted uppercase font-semibold block">Date de départ</label>
                    <input 
                      type="date" 
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-transparent text-text-main font-semibold outline-none mt-1 [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-text-muted"><Clock size={20} /></div>
                  <div className="flex-1">
                    <label className="text-xs text-text-muted uppercase font-semibold block">Heure de départ</label>
                    <input 
                      type="time" 
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-transparent text-text-main font-semibold outline-none mt-1 [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PLACES & PRIX (Groupe de cartes) */}
            <div className="bg-surface border border-border-main rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 sm:p-5 border-b border-border-main flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-text-muted"><Users size={20} /></div>
                  <span className="text-xs text-text-muted uppercase font-semibold">Places disponibles</span>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => adjustPlaces(-1)} className="w-8 h-8 rounded-full bg-base border border-border-main flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                  <span className="font-bold text-lg w-4 text-center">{formData.placesLeft}</span>
                  <button type="button" onClick={() => adjustPlaces(1)} className="w-8 h-8 rounded-full bg-base border border-border-main flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-text-muted"><DollarSign size={20} /></div>
                  <div className="flex-1">
                    <label className="text-xs text-text-muted uppercase font-semibold block">Prix par passager (FCFA)</label>
                    <input 
                      type="number" 
                      name="pricePerPlace"
                      required
                      min={500}
                      step={100}
                      value={formData.pricePerPlace}
                      onChange={handleChange}
                      className="w-full bg-transparent text-text-main font-bold text-lg outline-none mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Prix recommandé */}
           

            {/* OPTIONS (Bagages) */}
            <div className="space-y-4 pt-2">
              <label className="flex items-center justify-between p-4 border border-border-main rounded-2xl cursor-pointer hover:bg-base transition-colors">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-text-muted" />
                  <span className="font-medium text-text-main text-sm">Accepter les bagages</span>
                </div>
                <input 
                  type="checkbox" 
                  name="isLuggageAllowed"
                  checked={formData.isLuggageAllowed}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border-main text-kombi-orange-500 focus:ring-kombi-orange-500"
                />
              </label>

              {formData.isLuggageAllowed && (
                <div className="pl-4">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">Taille des bagages</label>
                  <select 
                    name="luggageSize" 
                    value={formData.luggageSize} 
                    onChange={handleChange}
                    className="w-full p-3 bg-surface border border-border-main rounded-xl text-text-main text-sm outline-none focus:border-kombi-orange-500"
                  >
                    <option value={0}>Petits (Sacs à dos, sacs à main)</option>
                    <option value={1}>Moyens (Valises cabine)</option>
                    <option value={2}>Grands (Grandes valises, soutes)</option>
                  </select>
                </div>
              )}
            </div>

            {/* BOUTON DE SOUMISSION */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !isLicenceValid || formData.vehicleId === 0}
                className="w-full bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : "Continuer"}
                {!isSubmitting && <span className="font-normal text-xl leading-none">→</span>}
              </button>
              
              <p className="text-center text-xs text-text-muted mt-4 px-4 leading-relaxed">
                <AlertTriangle size={14} className="inline-block mr-1 mb-0.5 text-kombi-orange-500" />
                Tout trajet soumis doit être validé par un administrateur avant d'être visible pour les passagers.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};