import React, { useEffect, useState, useCallback } from 'react';
import { useSuggestTrip } from './contexts/SuggestTripContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEdit, faTrash, faMapMarkerAlt, faCalendarAlt, 
    faClock, faTimes, faSave, faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";

const SuggestedTrips = () => {
    const { getSuggestions, deleteSuggestion, updateSuggestion, getSugById } = useSuggestTrip();
    
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    
    // États pour la Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Chargement des données
    const fetchSuggestions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getSuggestions(page);
            if (data && data.items) {
                setSuggestions(data.items);
            }
        } catch (err) {
            console.error("Erreur chargement:", err);
        } finally {
            setLoading(false);
        }
    }, [getSuggestions, page]);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    // Action Supprimer
    const handleDelete = async (id) => {
        if (window.confirm("Monsieur, voulez-vous vraiment supprimer cette suggestion ?")) {
            try {
                await deleteSuggestion(id);
                setSuggestions(suggestions.filter(s => s.id !== id));
            } catch (err) {
                alert("Erreur lors de la suppression");
            }
        }
    };

    // Ouvrir Modal et charger détails
    const handleOpenEdit = async (id) => {
        try {
            const details = await getSugById(id);
            // On formate la date pour l'input datetime-local (YYYY-MM-DDThh:mm)
            const formattedDate = details.departureDateTime.split('.')[0].slice(0, 16);
            setCurrentEdit({ ...details, departureDateTime: formattedDate });
            setIsModalOpen(true);
        } catch (err) {
            alert("Impossible de charger les détails");
        }
    };

    // Sauvegarder modification
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const payload = {
                ...currentEdit,
                departureDateTime: new Date(currentEdit.departureDateTime).toISOString()
            };
            await updateSuggestion(payload);
            setIsModalOpen(false);
            fetchSuggestions(); // Rafraîchir la liste
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading && suggestions.length === 0) {
        return <div className="pt-32 text-center dark:text-white">Chargement de vos suggestions, monsieur...</div>;
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    Mes Trajets Suggérés
                </h1>

                {suggestions.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <p className="text-gray-500 dark:text-gray-400">Aucune suggestion trouvée.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggestions.map((sug) => (
                            <div key={sug.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-kombigreen-500 relative transition-transform hover:scale-[1.02]">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-kombigreen-500 w-4" />
                                        <p className="text-sm font-semibold dark:text-gray-200">De: {sug.departureArea}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 w-4" />
                                        <p className="text-sm font-semibold dark:text-gray-200">À: {sug.arrivalArea}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-xs">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <span>{new Date(sug.departureDateTime).toLocaleDateString()}</span>
                                        <FontAwesomeIcon icon={faClock} className="ml-2" />
                                        <span>{new Date(sug.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                                    <button 
                                        onClick={() => handleOpenEdit(sug.id)}
                                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faEdit} /> Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(sug.id)}
                                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- MODAL DE MODIFICATION --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                            <h3 className="text-xl font-bold dark:text-white">Modifier la suggestion</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Zone de départ</label>
                                <input 
                                    type="text" 
                                    value={currentEdit.departureArea}
                                    onChange={(e) => setCurrentEdit({...currentEdit, departureArea: e.target.value})}
                                    className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-kombigreen-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Zone d'arrivée</label>
                                <input 
                                    type="text" 
                                    value={currentEdit.arrivalArea}
                                    onChange={(e) => setCurrentEdit({...currentEdit, arrivalArea: e.target.value})}
                                    className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-kombigreen-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300 mb-1">Date et heure</label>
                                <input 
                                    type="datetime-local" 
                                    value={currentEdit.departureDateTime}
                                    onChange={(e) => setCurrentEdit({...currentEdit, departureDateTime: e.target.value})}
                                    className="w-full p-2.5 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-kombigreen-500"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border dark:border-gray-600 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 bg-kombigreen-500 text-white rounded-lg font-semibold hover:bg-kombigreen-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isUpdating ? "Mise à jour..." : <><FontAwesomeIcon icon={faSave} /> Enregistrer</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuggestedTrips;