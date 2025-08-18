import { createContext, useState } from "react";
import api from '../api/api';
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth"; // Assurez-vous du chemin correct

export const carContext = createContext({});

export function CarContextProvider({ children }) {
    const [cars, setCars] = useState([]); // Gardons-le comme un tableau
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, loading: authLoading } = useAuth();

    // Mock car data for user-specific fallback
    // Note: If you truly want only ONE vehicle per user,
    // ensure your backend enforces this. This mock is for frontend display.
    const mockUserCar = {
        id: "mock-car-123", // Use a string ID for mock to avoid collision with real numeric IDs
        userId: user?.id || "dummy-user-id", // Lie le mock userId à l'utilisateur actuel si disponible
        brand: "Tesla",
        model: "Model 3",
        numberPlaces: 5,
        color: "Noir",
        isVerified: true,
        registrationCode: "AB-123-CD"
    };

    // Keep fetchCars for general use if needed, but fetchUserCars is for the current user's car(s)
    const fetchCars = async (params = {}) => {
        // ... existing logic ... (unchanged in this specific request)
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/vehicules', { params });
            setCars(response.data);
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération de tous les véhicules:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec du chargement des véhicules.');
            return null;
        } finally {
            setLoading(false);
        }
    };


    // Fonction pour rechercher les véhicules appartenant à l'utilisateur connecté.
    const fetchUserCars = async () => {
        if (authLoading) {
            // Optionnel: vous pouvez retourner une promesse en attente ou un état particulier
            return;
        }
        if (!user || !user.id) {
            // Si pas d'utilisateur connecté, mettez le dummy car pour le développement
            setCars([mockUserCar]); // Place le dummy car si personne n'est connecté
            toast.warn('Non connecté. Affichage du véhicule factice.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Idéalement, votre API devrait avoir un endpoint comme /api/users/${user.id}/vehicules
            const response = await api.get('/api/vehicules', { params: { userId: user.id } });

            let userSpecificCars = [];
            if (response.data && Array.isArray(response.data)) {
                userSpecificCars = response.data.filter(car => car.userId === user.id);
            }

            if (userSpecificCars.length > 0) {
                setCars(userSpecificCars);
                toast.success('Votre véhicule a été chargé avec succès !');
            } else {
                // Si l'API retourne vide pour l'utilisateur, on met le dummy car
                setCars([mockUserCar]); // Utilisation du dummy car si l'utilisateur n'a pas de véhicule réel
                toast.warn('Vous n\'avez pas encore de véhicule enregistré. Affichage du véhicule factice.');
            }
            return userSpecificCars;
        } catch (err) {
            console.error("Erreur lors de la récupération des véhicules de l'utilisateur:", err);
            setError(err);
            // En cas d'échec de la requête API, insérer le dummy car
            setCars([mockUserCar]);
            toast.error(err.response?.data?.message || 'Échec du chargement de votre véhicule. Affichage du véhicule factice.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getCarById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/vehicules/${id}`);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération du véhicule ${id}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec du chargement du véhicule ${id}.`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouveau véhicule
    const createCar = async (carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour créer un véhicule.");
            return null;
        }
        // Si l'utilisateur a déjà un véhicule dans l'état local, ne pas permettre la création
        if (cars.length > 0 && cars[0].userId === user.id && cars[0].id !== mockUserCar.id) { // Permettre la création si le véhicule actuel est le dummy
             toast.error("Vous avez déjà un véhicule enregistré. Veuillez le modifier.");
             return null;
        }

        setLoading(true);
        setError(null);
        try {
            const newCarData = { ...carData, userId: user.id, isVerified: carData.isVerified ?? false };
            const response = await api.post('/api/vehicules', newCarData);
            setCars([response.data]); // Remplace l'état par le seul nouveau véhicule de l'utilisateur
            toast.success('Véhicule créé avec succès !');
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la création du véhicule:", err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la création du véhicule.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour LE véhicule existant de l'utilisateur
    const updateCar = async (id, carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour modifier un véhicule.");
            return null;
        }
        // Vérifier que le véhicule à modifier est bien celui de l'utilisateur ou est le dummy car
        const targetCarId = parseInt(id, 10);
        const isDummyCarUpdate = (id === mockUserCar.id && !userCar) || cars.some(c => c.id === targetCarId && c.userId === user.id);

        if (!isDummyCarUpdate) {
            toast.error("Vous ne pouvez modifier que votre propre véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        const carId = (id === mockUserCar.id) ? "dummy" : parseInt(id, 10); // Utilisez "dummy" comme ID pour le mock si nécessaire

        try {
            let response;
            if (carId === "dummy") {
                // Simulez une mise à jour pour le dummy car
                const updatedDummyCar = { ...mockUserCar, ...carData, userId: user.id };
                setCars([updatedDummyCar]);
                toast.success('Véhicule factice mis à jour (simulation) !');
                response = { data: updatedDummyCar }; // Retournez une réponse simulée
            } else {
                response = await api.put(`/api/vehicules/${carId}`, carData);
                setCars([response.data]); // Met à jour le véhicule unique de l'utilisateur
                toast.success('Véhicule mis à jour avec succès !');
            }
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour du véhicule ${carId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la mise à jour du véhicule.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer LE véhicule de l'utilisateur
    const deleteCar = async (id) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour supprimer votre véhicule.");
            return false;
        }
        // Permettre la suppression du dummy car aussi
        const targetCarId = parseInt(id, 10);
        const isDummyCarDelete = (id === mockUserCar.id) || cars.some(c => c.id === targetCarId && c.userId === user.id);

        if (!isDummyCarDelete) {
             toast.error("Vous ne pouvez supprimer que votre propre véhicule.");
             return false;
        }

        setLoading(true);
        setError(null);
        const carId = (id === mockUserCar.id) ? "dummy" : parseInt(id, 10);

        try {
            if (carId === "dummy") {
                setCars([]); // Supprime le dummy car
                toast.success('Véhicule factice supprimé (simulation) !');
            } else {
                await api.delete(`/api/vehicules/${carId}`);
                setCars([]); // Le véhicule est supprimé, l'état devient vide
                toast.success('Votre véhicule a été supprimé avec succès !');
            }
            return true;
        } catch (err) {
            console.error(`Erreur lors de la suppression du véhicule ${carId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || 'Échec de la suppression de votre véhicule.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadVehicleDocument = async (documentType, vehiculeId, file) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour téléverser un document.");
            return null;
        }
        // Vérifiez que le vehiculeId correspond au véhicule de l'utilisateur actuel si nécessaire, ou si c'est le dummy car
        const targetVehiculeId = parseInt(vehiculeId, 10);
        const isDummyCarDocUpload = (vehiculeId === mockUserCar.id) || cars.some(c => c.id === targetVehiculeId && c.userId === user.id);

        if (!isDummyCarDocUpload) {
            toast.error("Vous ne pouvez téléverser des documents que pour votre propre véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-type',
                },
            };
            let response;
            if (vehiculeId === mockUserCar.id) {
                // Simulez l'upload pour le dummy car
                toast.success(`Document "${documentType}" téléversé avec succès (simulation) pour le véhicule factice !`);
                response = { data: { message: "Document uploaded successfully (mock)" } };
            } else {
                response = await api.post(`/api/vehicules/upload/${documentType}/${vehiculeId}`, formData, config);
                toast.success(response.data.message || `Document "${documentType}" téléversé avec succès pour le véhicule ${vehiculeId} !`);
            }
            return response.data;
        } catch (err) {
            console.error(`Erreur lors du téléversement du document pour le véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec du téléversement du document "${documentType}".`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        cars, // Reste un tableau, contient le véhicule réel ou le dummy car
        loading,
        error,
        fetchCars,
        fetchUserCars,
        getCarById,
        createCar,
        updateCar,
        deleteCar,
        uploadVehicleDocument,
        userId: user?.id || null,
        mockUserCar // Exposez le mockUserCar pour des tests ou des logiques spécifiques si besoin
    };

    return (
        <carContext.Provider value={contextValue}>
            {children}
        </carContext.Provider>
    );
}