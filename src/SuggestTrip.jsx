import React, { useState, useEffect } from 'react';
import { useSuggestTrip } from './contexts/SuggestTripContext'; // Ajustez le chemin
import useMape  from "./hooks/useMap"; // Import de votre hook Map
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMapMarkerAlt, faCalendarAlt, faPaperPlane, 
    faCheckCircle, faMapPin 
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

const SuggestTrip = () => {
    const { postSuggestion } = useSuggestTrip();
    const { places, searchPlaces, loading: loadingPlaces, error: placesError } = useMape();
    
    // État du formulaire
    const [formData, setFormData] = useState({
        departureArea: '',
        arrivalArea: '',
        departureDateTime: ''
    });

    const [loading, setLoading] = useState(false);
    const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
    const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Système de recherche avec délai (Debounce)
    const debouncedSearch = (query) => {
        clearTimeout(debounceTimeout);
        const newTimeout = setTimeout(() => {
            if (query.trim().length > 2) {
                searchPlaces(query);
            }
        }, 500);
        setDebounceTimeout(newTimeout);
    };

    // Gestion de la saisie Départ
    const handleDepartureChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, departureArea: value }));
        debouncedSearch(value);
        setShowDepartureSuggestions(true);
        setShowArrivalSuggestions(false);
    };

    // Gestion de la saisie Arrivée
    const handleArrivalChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, arrivalArea: value }));
        debouncedSearch(value);
        setShowArrivalSuggestions(true);
        setShowDepartureSuggestions(false);
    };

    // Sélection d'un lieu dans la liste
    const handleSelectPlace = (description, type) => {
        if (type === 'departure') {
            setFormData(prev => ({ ...prev, departureArea: description }));
            setShowDepartureSuggestions(false);
        } else {
            setFormData(prev => ({ ...prev, arrivalArea: description }));
            setShowArrivalSuggestions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                departureDateTime: new Date(formData.departureDateTime).toISOString()
            };

            await postSuggestion(payload);
            toast.success('Votre suggestion de trajet a été enregistrée, monsieur !');
            
            setFormData({ departureArea: '', arrivalArea: '', departureDateTime: '' });
        } catch (err) {
            toast.error("Une erreur est survenue lors de l'envoi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-700">
                
                <div className="bg-kombigreen-500 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Planifier votre voyage</h2>
                    <p className="text-sm opacity-90 mt-2">Proposez votre itinéraire si aucun trajet ne correspond.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    {/* Zone de départ avec suggestions */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-kombigreen-500" />
                            Lieu de départ
                        </label>
                        <input
                            required
                            type="text"
                            autoComplete="off"
                            value={formData.departureArea}
                            onChange={handleDepartureChange}
                            onFocus={() => setShowDepartureSuggestions(true)}
                            placeholder="Ex: Yaoundé"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-kombigreen-500 outline-none transition-all"
                        />
                        {showDepartureSuggestions && places.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                {places.map((place) => (
                                    <li
                                        key={place.placeId}
                                        className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm"
                                        onClick={() => handleSelectPlace(place.description, 'departure')}
                                    >
                                        {place.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Zone d'arrivée avec suggestions */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FontAwesomeIcon icon={faMapPin} className="mr-2 text-red-500" />
                            Lieu d'arrivée
                        </label>
                        <input
                            required
                            type="text"
                            autoComplete="off"
                            value={formData.arrivalArea}
                            onChange={handleArrivalChange}
                            onFocus={() => setShowArrivalSuggestions(true)}
                            placeholder="Ex: Douala"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-kombigreen-500 outline-none transition-all"
                        />
                        {showArrivalSuggestions && places.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                                {places.map((place) => (
                                    <li
                                        key={place.placeId}
                                        className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white text-sm"
                                        onClick={() => handleSelectPlace(place.description, 'arrival')}
                                    >
                                        {place.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Date et Heure */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
                            Date et heure souhaitées
                        </label>
                        <input
                            required
                            type="datetime-local"
                            value={formData.departureDateTime}
                            onChange={(e) => setFormData({...formData, departureDateTime: e.target.value})}
                            onFocus={() => { setShowDepartureSuggestions(false); setShowArrivalSuggestions(false); }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-kombigreen-500 outline-none transition-all"
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-kombigreen-500 hover:bg-kombigreen-600'
                        }`}
                    >
                        {loading ? (
                            <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Envoyer la suggestion
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuggestTrip;