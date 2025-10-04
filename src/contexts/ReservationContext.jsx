import { createContext, useState, useContext } from "react";
import api from "../api/api";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";


// ===================================
// CONTEXTE DE RÉSERVATION
// ===================================

export const ReservationContext = createContext({});

export function ReservationContextProvider({ children }) {
    const [reservations, setReservations] = useState([]);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Récupération des informations de l'utilisateur/pays
    const { user, defaultCountry } = useAuth(); 

    // ID du Cameroun pour la logique de paiement (à adapter si 237 n'est pas le bon ID)
    const CAMEROON_ID = 237; 

    /**
     * Détermine l'ID du pays actif pour la réservation.
     * Priorité : 1. Pays de l'utilisateur connecté, 2. Pays détecté par défaut.
     */
    const getActiveCountryId = () => {
        // Utilisateur connecté ? On utilise son pays.
        if (user && user.country) {
            return user.country;
        }
        // Utilisateur non connecté ? On utilise le pays par défaut.
        if (defaultCountry && defaultCountry.countryCode) {
            return defaultCountry.countryCode;
        }
        // Fallback par défaut (ex: Cameroun)
        return CAMEROON_ID; 
    };

    async function getPrice(tripId, numberPlaces, promoCode) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(
                `/api/v1/reservations/get-price/${tripId}/${numberPlaces}/${promoCode || ''}`
            );
            return response.data.price;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch price. Please try again.");
            toast.error(err.response?.data?.message || err.message || "Échec de la récupération du prix.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function addReservation(reservationData) {
        setIsLoading(true);
        setError(null);
        try {
            const activeCountryId = getActiveCountryId(); 
            
            let endpoint = "/api/v1/reservations/add-reservation"; // Trustpayway (Cameroun)
            let isCinetPayFlow = false;

            // Logique de choix du endpoint basée sur le pays
            if (activeCountryId && activeCountryId !== CAMEROON_ID) {
                endpoint = "/api/v1/reservations/add-reservation-v2"; // Cinetpay (Autres pays)
                isCinetPayFlow = true;
            }

            const response = await api.post(endpoint, reservationData);
            const data = response.data;
            
            if (isCinetPayFlow) {
                 // Gère le cas de Cinetpay (redirection)
                 if (data.redirectUrl) {
                    toast.success("Réservation initiée. Redirection vers le paiement...");
                    // Retourne l'objet avec l'URL de redirection pour être géré par le composant appelant
                    return { ...data, isRedirect: true }; 
                 } else {
                     throw new Error("Lien de redirection Cinetpay manquant.");
                 }
            }
            
            // Gère le cas standard (Trustpayway)
            setReservationDetails(data);
            toast.success("Réservation ajoutée avec succès !");
            return data;

        } catch (err) {
            const errorMessage = err.response?.data?.description || err.message || "Échec de la réservation.";
            setError(errorMessage);
            console.error("Erreur lors de l'ajout de la réservation:", err);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function getAllReservations() {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/v1/reservations");
            setReservations(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch reservations.");
            toast.error(err.response?.data?.message || err.message || "Échec de la récupération des réservations.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function getReservationStatus(reservationId) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/v1/reservations/${reservationId}/status`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Impossible de vérifier le statut de la réservation.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de la vérification du statut.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function confirmReservationAsDriver(reservationId) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(`/api/v1/reservations/confirm/${reservationId}`);
            toast.success("Réservation confirmée avec succès !");
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Échec de la confirmation de la réservation.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de la confirmation de la réservation.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function cancelReservation(reservationId, phoneNumberRefund, operatorFai) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.put(
                `/api/v1/reservations/cancel-reservation/${reservationId}/${phoneNumberRefund}/${operatorFai}`
            );
            toast.success("Réservation annulée et remboursement initié.");
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Échec de l'annulation de la réservation.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de l'annulation de la réservation.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function cancelReservationByDriver(reservationId) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.delete(
                `/api/v1/reservations/cancel-by-driver/${reservationId}`
            );
            toast.success("Réservation annulée par le chauffeur avec succès. Remboursement en cours.");
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Échec de l'annulation de la réservation.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de l'annulation de la réservation.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function confirmAllReservations(tripId) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(`/api/v1/reservations/confirm-all-reservations/${tripId}`);
            toast.success("Toutes les réservations de ce trajet ont été confirmées.");
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Échec de la confirmation des réservations.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de la confirmation des réservations.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function getReservationsWithStatus(pageIndex, reservationStatus) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(
                `/api/v1/reservations/list/${pageIndex}/${reservationStatus}`
            );
            // Assurez-vous que le state est adapté pour une réponse paginée
            setReservations(response.data.items || response.data); 
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Échec de la récupération des réservations.");
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Échec de la récupération des réservations.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        reservations,
        setReservations,
        reservationDetails,
        setReservationDetails,
        getPrice,
        addReservation, // <--- Logique de pays mise à jour ici
        getAllReservations,
        getReservationStatus,
        confirmReservationAsDriver,
        cancelReservation,
        cancelReservationByDriver,
        confirmAllReservations,
        getReservationsWithStatus,
        isLoading,
        error,
        // Ajout du pays actif pour le debug ou l'affichage
        getActiveCountryId, 
    };

    return (
        <ReservationContext.Provider value={value}>
            {children}
        </ReservationContext.Provider>
    );
}
