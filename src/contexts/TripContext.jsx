import { createContext, useState, useContext } from "react";
import api from '../api/api'; // Importez l'instance Axios configurée
import toast from 'react-hot-toast'; // Pour les notifications
import useAuth from "../hooks/useAuth"; // Importation de votre hook d'authentification

// Crée le contexte.
export const tripContext = createContext({});

// Le fournisseur de contexte
export function TripContextProvider({ children }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, loading: authLoading } = useAuth();

    // Données de trajets fictives
    const mockTrips = [
        {
            id: 1,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 1,
            departureDate: "2024-08-08T08:00:00Z",
            status: 4,
            placesLeft: 3,
            pricePerPlace: 5000,
            pusblishingDate: "2024-08-07T10:00:00Z",
            aditionalInfos: "Trajet avec une pause de 30 minutes à mi-chemin.",
            startAreaPointCreateDto: {
                homeTownName: "Yaoundé",
                name: "Carrefour Obili",
                latitude: 3.866667,
                longitude: 11.516667,
                order: 0,
                type: 0 // PointType.Departure
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Douala",
                name: "Lycée de Bonabéri",
                latitude: 4.05,
                longitude: 9.7,
                order: 999,
                type: 1 // PointType.Arrival
            },
            stopovers: [
                {
                    homeTownName: "Edéa",
                    name: "Centre-ville",
                    latitude: 3.8,
                    longitude: 10.13333,
                    order: 1,
                    type: 2 // PointType.Stopover
                }
            ]
        },
        {
            id: 2,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 2,
            departureDate: "2024-08-09T14:30:00Z",
            status: 4,
            placesLeft: 1,
            pricePerPlace: 7500,
            pusblishingDate: "2024-08-07T11:00:00Z",
            aditionalInfos: "Départ matinal, parfait pour les lève-tôt.",
            startAreaPointCreateDto: {
                homeTownName: "Bafoussam",
                name: "Marché Central",
                latitude: 5.47,
                longitude: 10.42,
                order: 0,
                type: 0
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Yaoundé",
                name: "Campus Universitaire",
                latitude: 3.85,
                longitude: 11.53,
                order: 999,
                type: 1
            },
            stopovers: []
        },
        {
            id: 3,
            userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            vehiculeId: 3,
            departureDate: "2024-08-10T18:00:00Z",
            status: 4,
            placesLeft: 5,
            pricePerPlace: 6000,
            pusblishingDate: "2024-08-07T12:00:00Z",
            aditionalInfos: "Trajet sans escale, arrivée prévue à l'heure.",
            startAreaPointCreateDto: {
                homeTownName: "Douala",
                name: "Aéroport International",
                latitude: 4.01,
                longitude: 9.77,
                order: 0,
                type: 0
            },
            arivalAreaPointCreateDto: {
                homeTownName: "Kribi",
                name: "Plage",
                latitude: 2.95,
                longitude: 9.9,
                order: 999,
                type: 1
            },
            stopovers: []
        }
    ];

    // Fonction pour récupérer tous les trajets d'un utilisateur
    const fetchTrips = async (params = {}) => {
        if (authLoading) return;

        setLoading(true);
        setError(null);

        const { pageIndex, status } = params;
        let url = '/api/trips';

        if (pageIndex !== undefined && status !== undefined) {
            url = `/api/v1/trips/${pageIndex}/${status}`;
        }

        try {
            const response = await api.get(url, { params });
            console.log(response)
            // --- DÉBUT : Logique pour les données fictives en cas de réponse vide ---
            if (response.data && response.data.length > 0) {
                setTrips(response.data);
                toast.success('Trajets chargés avec succès !');
                // En production, vous pouvez commenter la ligne ci-dessous
                // return response.data;
            } else {
                setTrips(mockTrips);
                toast.warn('La réponse du serveur est vide. Utilisation de données fictives.');
                // En production, vous pouvez décommenter la ligne ci-dessous et commenter la ligne ci-dessus
                // return response.data;
            }
            // --- FIN : Logique pour les données fictives ---
            return response.data;

        } catch (err) {
        
            console.error("Erreur lors de la récupération des trajets:", err);
            setError(err);
            // --- DÉBUT : Logique pour les données fictives en cas d'erreur ---
            setTrips(mockTrips);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets. Utilisation de données fictives.');
            // En production, vous pouvez commenter la ligne ci-dessus et décommenter la ligne ci-dessous
            // toast.error(err.response?.data?.message || 'Échec du chargement des trajets.');
            // --- FIN : Logique pour les données fictives ---
            return mockTrips;

        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer les trajets publics
    const fetchPublicTrips = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/v1/trips/list-public', filters);
            if (response.data && response.data.length > 0) {
                setTrips(response.data);
                toast.success('Trajets publics chargés avec succès !');
            } else {
                setTrips([]);
                toast.warn('Aucun trajet public trouvé.');
            }
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération des trajets publics:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets publics.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer un trajet spécifique par son ID
    const getTripById = async (id) => {

        if (authLoading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/trips/${id}`);
            toast.success('Trajet trouvé !');
            return response.data;
        } catch (err) {
        
            console.error(`Erreur lors de la récupération du trajet ${id}:`, err);
            setError(err);
            // --- DÉBUT : Logique pour les données fictives en cas d'erreur ---
            const trip = mockTrips.find(t => t.id === parseInt(id));
              return trip;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouveau trajet.
    const createTrip = async (tripData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour créer un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const newTripData = { ...tripData, userId: user.id };
            const response = await api.post('/api/v1/trips', newTripData);
            setTrips(prevTrips => [...prevTrips, response.data]);
            toast.success('Trajet créé avec succès !');
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création du trajet:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la création du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour un trajet existant
    const updateTrip = async (id, tripData) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour modifier un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/api/v1/trips`, { ...tripData, id });
            setTrips(prevTrips => prevTrips.map(trip =>
                trip.id === id ? response.data : trip
            ));
            toast.success('Trajet mis à jour avec succès !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du trajet.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour annuler un trajet
    const cancelTrip = async (id) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour annuler un trajet.");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            // Utilisation du nouveau endpoint pour annuler le trajet
            await api.put(`/api/v1/trips/cancel/${id}`);
            // Met à jour l'état local pour marquer le trajet comme annulé (status: 5)
            setTrips(prevTrips => prevTrips.map(trip =>
                trip.id === id ? { ...trip, status: 5 } : trip
            ));
            toast.success('Trajet annulé avec succès !');
            return true;
        } catch (err) {
            console.error(`Erreur lors de l'annulation du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de l\'annulation du trajet.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer un trajet
    const deleteTrip = async (id) => {
        if (!user) {
            toast.error("Veuillez vous connecter pour supprimer un trajet.");
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            await api.delete(`/api/v1/trips/${id}`);
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
            toast.success('Trajet supprimé avec succès !');
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Les valeurs fournies par le contexte
    const contextValue = {
        trips,
        loading,
        error,
        fetchTrips,
        fetchPublicTrips,
        getTripById,
        createTrip,
        updateTrip,
        cancelTrip,
        deleteTrip,
        userId: user?.id || null
    };

    return (
        <tripContext.Provider value={contextValue}>
            {children}
        </tripContext.Provider>
    );
}