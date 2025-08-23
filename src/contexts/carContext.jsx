import { createContext, useState } from "react";
import api from '../api/api';
import toast from 'react-hot-toast';
import useAuth from "../hooks/useAuth"; 

export const carContext = createContext({});

export function CarContextProvider({ children }) {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user, loading: authLoading } = useAuth();

    const mockUserCar = {
        id: "mock-car-123",
        userId: user?.id || "dummy-user-id",
        brand: "Tesla",
        model: "Model 3",
        numberPlaces: 5,
        color: "Noir",
        isVerified: true,
        registrationCode: "AB-123-CD"
    };

    const fetchCars = async (params = {}) => {
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


    const fetchUserCars = async () => {
        if (authLoading) {
            return;
        }
        if (!user || !user.id) {
            setCars([mockUserCar]);
            toast.warn('Non connecté. Affichage du véhicule factice.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/v1/vehicules');

            if (response.data && response.data.length > 0) {
                setCars(response.data);
                toast.success('Votre véhicule a été chargé avec succès !');
            } else {
                setCars([mockUserCar]);
                toast.warn('Vous n\'avez pas encore de véhicule enregistré. Affichage du véhicule factice.');
            }
            return response.data;
        } catch (err) {
            console.error("Erreur lors de la récupération des véhicules de l'utilisateur:", err);
            setError(err);
            setCars([mockUserCar]);
            toast.error(err.response?.data?.message || 'Échec du chargement de votre véhicule. Affichage du véhicule factice.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getCarById = async (id) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour voir les détails d'un véhicule.");
            return null;
        }
        
        if (id === mockUserCar.id) {
            toast('Affichage du véhicule factice (mode développement).');
            return mockUserCar;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/${id}`);
            
            if (response.data.userId !== user.id) {
                toast.error("Vous n'êtes pas autorisé à voir ce véhicule.");
                return null;
            }

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

    const createCar = async (carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour créer un véhicule.");
            return null;
        }
        
        if (cars.length > 0 && cars.some(car => car.userId === user.id && car.id !== mockUserCar.id)) {
            toast.error("Vous avez déjà un véhicule enregistré. Veuillez le modifier.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const newCarData = { ...carData, userId: user.id, isVerified: carData.isVerified ?? false };
            const response = await api.post('/api/v1/vehicules', newCarData);
            setCars([response.data]); 
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

    const updateCar = async (id, carData) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour modifier un véhicule.");
            return null;
        }
        const targetCarId = (typeof id === 'string' && id.startsWith('mock-')) ? id : parseInt(id, 10);
        const isDummyCarUpdate = (targetCarId === mockUserCar.id) || cars.some(c => c.id === targetCarId && c.userId === user.id);

        if (!isDummyCarUpdate) {
            toast.error("Vous ne pouvez modifier que votre propre véhicule.");
            return null;
        }

        setLoading(true);
        setError(null);
        const carId = (id === mockUserCar.id) ? "dummy" : parseInt(id, 10);

        try {
            let response;
            if (carId === "dummy") {
                const updatedDummyCar = { ...mockUserCar, ...carData, userId: user.id };
                setCars([updatedDummyCar]);
                toast.success('Véhicule factice mis à jour (simulation) !');
                response = { data: updatedDummyCar };
            } else {
                response = await api.put(`/api/v1/vehicules/${carId}`, carData);
                setCars([response.data]);
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

    const deleteCar = async (id) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour supprimer votre véhicule.");
            return false;
        }
        const targetCarId = (typeof id === 'string' && id.startsWith('mock-')) ? id : parseInt(id, 10);
        const isDummyCarDelete = (targetCarId === mockUserCar.id) || cars.some(c => c.id === targetCarId && c.userId === user.id);

        if (!isDummyCarDelete) {
            toast.error("Vous ne pouvez supprimer que votre propre véhicule.");
            return false;
        }

        setLoading(true);
        setError(null);
        const carId = (id === mockUserCar.id) ? "dummy" : parseInt(id, 10);

        try {
            if (carId === "dummy") {
                setCars([]);
                toast.success('Véhicule factice supprimé (simulation) !');
            } else {
                await api.delete(`/api/v1/vehicules/${carId}`);
                setCars([]);
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
        const targetVehiculeId = (typeof vehiculeId === 'string' && vehiculeId.startsWith('mock-')) ? vehiculeId : parseInt(vehiculeId, 10);
        const isDummyCarDocUpload = (targetVehiculeId === mockUserCar.id) || cars.some(c => c.id === targetVehiculeId && c.userId === user.id);

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
                    'Content-Type': 'multipart/form-data',
                },
            };
            let response;
            if (vehiculeId === mockUserCar.id) {
                toast.success(`Document "${documentType}" téléversé avec succès (simulation) pour le véhicule factice !`);
                response = { data: { message: "Document uploaded successfully (mock)" } };
            } else {
                response = await api.post(`/api/v1/vehicules/upload/${documentType}/${vehiculeId}`, formData, config);
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
    
    const getVehicleDocuments = async (vehiculeId) => {
        if (!user || !user.id) {
            toast.error("Veuillez vous connecter pour voir les documents.");
            return null;
        }
        
        setLoading(true);
        setError(null);
        try {
            const targetCar = cars.find(car => car.id === parseInt(vehiculeId, 10));
            if (!targetCar || targetCar.userId !== user.id) {
                 toast.error("Vous ne pouvez lister les documents que pour votre propre véhicule.");
                 return null;
            }

            const response = await api.get(`/api/v1/vehicules/${vehiculeId}/documents`);
            toast.success("Documents chargés avec succès !");
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la récupération des documents du véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec du chargement des documents du véhicule ${vehiculeId}.`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Nouvelle fonction d'administration pour la vérification du véhicule
    const updateVehicleVerificationState = async (vehiculeId, isVerified) => {
        // Vérification des privilèges d'administrateur
        if (!user || !user.isAdmin) {
            toast.error("Accès refusé. Cette action est réservée aux administrateurs.");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            // Utilisation du point d'accès d'administration
            const response = await api.put(`/api/v1/vehicules/update-verify-state/${vehiculeId}/${isVerified}`);
            
            // Mise à jour de l'état du véhicule dans le contexte local après une mise à jour réussie
            setCars(prevCars => 
                prevCars.map(car => 
                    car.id === vehiculeId ? { ...car, isVerified: isVerified } : car
                )
            );
            
            toast.success(`État de vérification du véhicule ${vehiculeId} mis à jour avec succès !`);
            return response.data;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de l'état de vérification pour le véhicule ${vehiculeId}:`, err);
            setError(err);
            toast.error(err.response?.data?.message || `Échec de la mise à jour de l'état de vérification.`);
            return null;
        } finally {
            setLoading(false);
        }
    };


    const contextValue = {
        cars,
        loading,
        error,
        fetchCars,
        fetchUserCars,
        getCarById,
        createCar,
        updateCar,
        deleteCar,
        uploadVehicleDocument,
        getVehicleDocuments,
        updateVehicleVerificationState, // Ajout de la nouvelle fonction au contexte
        userId: user?.id || null,
        mockUserCar
    };

    return (
        <carContext.Provider value={contextValue}>
            {children}
        </carContext.Provider>
    );
}