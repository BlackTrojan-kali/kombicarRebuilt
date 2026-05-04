import { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from '../../api/api';
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";

export const carAdminContext = createContext({});

export function CarAdminContextProvider({ children }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- ÉTATS VÉHICULES ADMIN ---
    const [adminCars, setAdminCars] = useState([]);
    const [adminCarPagination, setAdminCarPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdminCars, setIsLoadingAdminCars] = useState(false);
    const [adminCarListError, setAdminCarListError] = useState(null);
    
    const [carDetails, setCarDetails] = useState(null);
    const [isCarDetailsLoading, setIsCarDetailsLoading] = useState(false);
    const [carDocuments, setCarDocuments] = useState([]);

    // --- ÉTATS VÉHICULES D'UN CHAUFFEUR SPÉCIFIQUE ---
    const [driverCars, setDriverCars] = useState([]);
    const [isLoadingDriverCars, setIsLoadingDriverCars] = useState(false);
    const [driverCarsError, setDriverCarsError] = useState(null);

    // --- ÉTATS PERMIS ADMIN ---
    const [adminLicences, setAdminLicences] = useState([]);
    const [adminLicencePagination, setAdminLicencePagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdminLicences, setIsLoadingAdminLicences] = useState(false);
    const [adminLicenceListError, setAdminLicenceListError] = useState(null);
    
    // --- ÉTATS DOCUMENTS VÉHICULE ADMIN ---
    const [adminVehicleDocuments, setAdminVehicleDocuments] = useState([]);
    const [isLoadingAdminVehicleDocuments, setIsLoadingAdminVehicleDocuments] = useState(false);
    const [adminVehicleDocumentsError, setAdminVehicleDocumentsError] = useState(null);

    // ==========================================
    // MÉTHODES DE LISTE ET RECHERCHE (ADMIN)
    // ==========================================

    const fetchAdminCars = useCallback(async (page = 1, isVerified) => {
        setIsLoadingAdminCars(true);
        setAdminCarListError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/list/${page}/${isVerified}`);
            const data = response.data;
            setAdminCars(data.items);
            setAdminCarPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.description || "Erreur lors du chargement des véhicules.";
            setAdminCarListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdminCars(false);
        }
    }, []);

    const searchAdminCars = useCallback(async (page = 1, filters = {}) => {
        setIsLoadingAdminCars(true);
        setAdminCarListError(null);
        try {
            const response = await api.post(`/api/v1/vehicules/admin/search/${page}`, filters);
            const data = response.data;
            setAdminCars(data.items);
            setAdminCarPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.description || "Erreur lors de la recherche.";
            setAdminCarListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdminCars(false);
        }
    }, []);

    // ==========================================
    // MÉTHODES VÉHICULES D'UN CHAUFFEUR (ADMIN)
    // ==========================================

    const fetchVehiclesByDriverId = useCallback(async (userId) => {
        setIsLoadingDriverCars(true);
        setDriverCarsError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/vehicules/${userId}`);
            const data = response.data;
            setDriverCars(data);
            return data;
        } catch (error) {
            const errorMessage = error.response?.data?.description || "Erreur lors de la récupération des véhicules de ce chauffeur.";
            setDriverCarsError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingDriverCars(false);
        }
    }, []);

    // ==========================================
    // MÉTHODES DE GESTION UNITAIRE (ADMIN)
    // ==========================================

    const getCarById = useCallback(async (id) => {
        setIsCarDetailsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/${id}`);
            setCarDetails(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            toast.error(err.response?.data?.description || `Véhicule ${id} introuvable.`);
            return null;
        } finally {
            setIsCarDetailsLoading(false);
        }
    }, []);

    const updateCar = useCallback(async (id, carData) => {
        setLoading(true);
        try {
            const response = await api.put(`/api/v1/vehicules/admin/update`, carData);
            setAdminCars(prev => prev.map(car => car.id === id ? response.data : car));
            if (carDetails?.id === id) setCarDetails(response.data);
            toast.success("Véhicule mis à jour par l'admin.");
            return response.data;
        } catch (err) {
            toast.error(err.response?.data?.description || "Échec de la mise à jour.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [carDetails]); // Ajout de carDetails en dépendance car on l'utilise dans le if

    const deleteCar = useCallback(async (id) => {
        setLoading(true);
        try {
            await api.delete(`/api/v1/vehicules/admin/${id}`);
            setAdminCars(prev => prev.filter(car => car.id !== id));
            if (carDetails?.id === id) setCarDetails(null);
            toast.success("Véhicule supprimé définitivement.");
            return true;
        } catch (err) {
            toast.error(err.response?.data?.description || "Échec de la suppression.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [carDetails]); // Idem

    // ==========================================
    // GESTION DES DOCUMENTS (ADMIN)
    // ==========================================

    const fetchAdminVehicleDocuments = useCallback(async (vehiculeId) => {
        setIsLoadingAdminVehicleDocuments(true);
        setAdminVehicleDocumentsError(null);
        try {
            const response = await api.get(`/api/v1/vehicules/admin/${vehiculeId}/documents`);
            setAdminVehicleDocuments(response.data);
            setCarDocuments(response.data);
            return response.data;
        } catch (error) {
            setAdminVehicleDocumentsError(error.response?.data?.description);
            toast.error("Erreur documents admin.");
            setAdminVehicleDocuments([]);
            throw error;
        } finally {
            setIsLoadingAdminVehicleDocuments(false);
        }
    }, []);

    const uploadVehicleDocument = useCallback(async (documentType, vehiculeId, file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await api.post(`/api/v1/vehicules/admin/upload/${documentType}/${vehiculeId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Document téléversé (Admin).");
            await fetchAdminVehicleDocuments(vehiculeId);
            return response.data;
        } catch (err) {
            toast.error(err.response?.data?.description || "Échec upload.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchAdminVehicleDocuments]); // Dépendance à fetchAdminVehicleDocuments

    const downloadDocument = useCallback(async (fileName) => {
        setLoading(true);
        try {
            const response = await api.get(`${fileName}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName.split('/').pop());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Téléchargement lancé.");
        } catch (err) {
            toast.error("Erreur de téléchargement.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // VÉRIFICATION & PERMIS (ADMIN)
    // ==========================================

    const updateVehicleVerificationState = useCallback(async (vehiculeId, isVerified) => {
        setLoading(true);
        try {
            const response = await api.put(`/api/v1/vehicules/update-verify-state/${vehiculeId}/${isVerified}`);
            
            setAdminCars(prev => prev.map(car => car.id === vehiculeId ? { ...car, isVerified } : car));
            setDriverCars(prev => prev.map(car => car.id === vehiculeId ? { ...car, isVerified } : car));
            if (carDetails?.id === vehiculeId) setCarDetails(prev => ({ ...prev, isVerified }));
            
            toast.success("État de vérification mis à jour.");
            return response.data;
        } catch (err) {
            toast.error(err.response?.data?.description || "Erreur de vérification.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [carDetails]); // Dépendance à carDetails

    const fetchAdminDrivingLicences = useCallback(async (page = 1, verificationState = 0) => {
        setIsLoadingAdminLicences(true);
        setAdminLicenceListError(null);
        try {
            const response = await api.get(`/api/v1/driving-licences/admin/list/${page}/${verificationState}`);
            const data = response.data;
            setAdminLicences(data.items);
            setAdminLicencePagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            setAdminLicenceListError(error.response?.data?.description);
            throw error;
        } finally {
            setIsLoadingAdminLicences(false);
        }
    }, []);

    // OPTIMISATION MAJEURE : On enveloppe la valeur dans useMemo
    const contextValue = useMemo(() => ({
        loading, error, adminCars, adminCarPagination, isLoadingAdminCars, 
        adminCarListError, carDetails, isCarDetailsLoading, carDocuments, 
        driverCars, isLoadingDriverCars, driverCarsError, adminLicences, 
        adminLicencePagination, isLoadingAdminLicences, adminLicenceListError, 
        adminVehicleDocuments, isLoadingAdminVehicleDocuments, adminVehicleDocumentsError,
        getCarById, updateCar, deleteCar, uploadVehicleDocument, 
        updateVehicleVerificationState, fetchAdminCars, searchAdminCars, 
        downloadDocument, fetchAdminDrivingLicences, fetchAdminVehicleDocuments, fetchVehiclesByDriverId
    }), [
        loading, error, adminCars, adminCarPagination, isLoadingAdminCars, 
        adminCarListError, carDetails, isCarDetailsLoading, carDocuments, 
        driverCars, isLoadingDriverCars, driverCarsError, adminLicences, 
        adminLicencePagination, isLoadingAdminLicences, adminLicenceListError, 
        adminVehicleDocuments, isLoadingAdminVehicleDocuments, adminVehicleDocumentsError,
        getCarById, updateCar, deleteCar, uploadVehicleDocument, 
        updateVehicleVerificationState, fetchAdminCars, searchAdminCars, 
        downloadDocument, fetchAdminDrivingLicences, fetchAdminVehicleDocuments, fetchVehiclesByDriverId
    ]);

    return (
        <carAdminContext.Provider value={contextValue}>
            {children}
        </carAdminContext.Provider>
    );
}

export default CarAdminContextProvider;
export const useAdminCarContext = () => useContext(carAdminContext);