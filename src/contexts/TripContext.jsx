import { createContext, useState, useContext } from "react";
import api from '../api/api';
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth";

export const tripContext = createContext({});

export function TripContextProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mockApiResponse = {
        items: [
            {
                trip: {
                    id: 1,
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    vehiculeId: 1,
                    departureDate: "2024-08-08T08:00:00Z",
                    status: 4,
                    placesLeft: 3,
                    pricePerPlace: 5000,
                    authorizedLuggages: true,
                    luggageSize: 1,
                    luggageNumberPerPassenger: 1,
                    publishingDate: "2024-08-07T10:00:00Z",
                    aditionalInfos: "Trajet avec une pause de 30 minutes à mi-chemin.",
                },
                vehicule: {
                    id: 1,
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    brand: "Toyota",
                    model: "Camry",
                    numberPlaces: 4,
                    color: "Gris",
                    isVerified: true,
                    airConditionned: true,
                    registrationCode: "CM-123-ABC",
                    type: 0
                },
                departureArea: {
                    id: 1,
                    homeTownName: "Yaoundé",
                    name: "Carrefour Obili",
                    latitude: 3.866667,
                    longitude: 11.516667,
                    type: 0,
                    order: 0
                },
                arrivalArea: {
                    id: 2,
                    homeTownName: "Douala",
                    name: "Lycée de Bonabéri",
                    latitude: 4.05,
                    longitude: 9.7,
                    type: 1,
                    order: 999
                },
                stopOvers: [
                    {
                        id: 3,
                        homeTownName: "Edéa",
                        name: "Centre-ville",
                        latitude: 3.8,
                        longitude: 10.13333,
                        type: 2,
                        order: 1
                    }
                ],
                driver: {
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    firstName: "Jean",
                    lastName: "Dupont",
                    photoUrl: "https://example.com/driver1.jpg"
                }
            },
            {
                trip: {
                    id: 2,
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    vehiculeId: 2,
                    departureDate: "2024-08-09T14:30:00Z",
                    status: 4,
                    placesLeft: 1,
                    pricePerPlace: 7500,
                    authorizedLuggages: true,
                    luggageSize: 0,
                    luggageNumberPerPassenger: 0,
                    publishingDate: "2024-08-07T11:00:00Z",
                    aditionalInfos: "Départ matinal, parfait pour les lève-tôt.",
                },
                vehicule: {
                    id: 2,
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    brand: "Honda",
                    model: "CRV",
                    numberPlaces: 3,
                    color: "Blanc",
                    isVerified: true,
                    airConditionned: true,
                    registrationCode: "CM-456-DEF",
                    type: 1
                },
                departureArea: {
                    id: 4,
                    homeTownName: "Bafoussam",
                    name: "Marché Central",
                    latitude: 5.47,
                    longitude: 10.42,
                    type: 0,
                    order: 0
                },
                arrivalArea: {
                    id: 5,
                    homeTownName: "Yaoundé",
                    name: "Campus Universitaire",
                    latitude: 3.85,
                    longitude: 11.53,
                    type: 1,
                    order: 999
                },
                stopOvers: [],
                driver: {
                    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                    firstName: "Marie",
                    lastName: "Leblanc",
                    photoUrl: "https://example.com/driver2.jpg"
                }
            },
        ],
        totalCount: 2,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    };

    const fetchTrips = async (params = {}) => {
        if (authLoading) return;
        setLoading(true);
        setError(null);
        const { pageIndex, status } = params;
        console.log(params)
        let url = '/api/v1/trips';
        if (pageIndex !== undefined && status !== undefined) {
            url = `/api/v1/trips/${pageIndex}/${status}`;
        }

        try {
            const response = await api.get(url, { params });
        
            const data = response.data;
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                setTrips(data.items);
                toast.success('Trajets chargés avec succès !');
            } else {
                setTrips(mockApiResponse.items);
                toast.warn('La réponse du serveur est vide ou invalide. Utilisation de données fictives.');
            }
            return data;
        } catch (err) {
            console.error("Erreur lors de la récupération des trajets:", err);
            setError(err);
         //   setTrips(mockApiResponse.items);
            toast.error(err.response?.data?.message || 'Échec du chargement des trajets. Utilisation de données fictives.');
           // return mockApiResponse;
        } finally {
            setLoading(false);
        }
    };
    
    const listPublicTrips = async (searchCriteria) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/v1/trips/list-public', searchCriteria);
            console.log(response.data)
            const data = response.data;
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                setTrips(data);
                toast.success('Trajets publics trouvés avec succès !');
            } else {
                setTrips([]);
                toast.error('Aucun trajet public ne correspond à vos critères.');
            }
            return data;
        } catch (err) {
            console.error("Erreur lors de la recherche des trajets publics:", err);
            setError(err);
            setTrips([]);
            toast.error(err.response?.data?.message || 'Échec de la recherche des trajets publics.');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    const createTrip = async (tripData) => {
        if (authLoading) return;
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour publier un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);
        
        const newTripData = { ...tripData, userId: user.id };
        console.log("Données du trajet à envoyer:", newTripData);

        try {
            const response = await api.post('/api/v1/trips', newTripData);
            toast.success('Trajet publié avec succès!');
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création du trajet:", err);
            setError(err);
            toast.error(err.response?.data?.description || 'Échec de la publication du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTripById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/trips/${id}`);
         console.log(response)
            toast.success('Trajet trouvé !');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du trajet ${id}:`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTrip = async (id) => {
        if (authLoading) return;
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour supprimer un trajet.");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.delete(`/api/v1/trips/${id}`);
            
            toast.success('Trajet supprimé avec succès!');
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la suppression du trajet ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.description  || 'Échec de la suppression du trajet.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 🆕 Nouvelle fonction pour la suppression par un administrateur
    const deleteTripAsAdmin = async (tripId) => {
        if (authLoading) return;
        // La vérification de l'administrateur doit être gérée ici ou via l'API.
        // Pour cet exemple, nous supposons que l'authentification de l'admin est gérée par le `api` client.
        
        setLoading(true);
        setError(null);
        
        try {
            await api.delete(`/api/v1/trips/admin/${tripId}`);
            toast.success('Le trajet a été supprimé par l\'administrateur.');
            // Recharger les trajets pour mettre à jour la liste
            fetchTrips(); 
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du trajet ${tripId} par l'admin :`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression du trajet par l\'administrateur.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        trips,
        loading,
        error,
        fetchTrips,
        getTripById,
        createTrip,
        listPublicTrips, 
        deleteTrip,
        deleteTripAsAdmin, // 🆕 Ajout de la nouvelle fonction
        userId: user?.id || null
    };

    return (
        <tripContext.Provider value={contextValue}>
            {children}
        </tripContext.Provider>
    );
}