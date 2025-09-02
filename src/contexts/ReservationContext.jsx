import { createContext, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export const ReservationContext = createContext({});

export function ReservationContextProvider({ children }) {
    const [reservations, setReservations] = useState([]);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    async function addReservation(reservationData) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post(
                "/api/v1/reservations/add-reservation",
                reservationData
            );
            setReservationDetails(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.description || err.message || "Failed to add reservation.");
            console.error(err);
            toast.error(err.response?.data?.description || err.message || "Échec de la réservation.");
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

    const value = {
        reservations,
        setReservations,
        reservationDetails,
        setReservationDetails,
        getPrice,
        addReservation,
        getAllReservations,
        getReservationStatus,
        confirmReservationAsDriver,
        isLoading,
        error,
    };

    return (
        <ReservationContext.Provider value={value}>
            {children}
        </ReservationContext.Provider>
    );
}