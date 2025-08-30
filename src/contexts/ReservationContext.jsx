import { createContext, useState } from "react";

export const ReservationContext = createContext({});

export function ReservationContextProvider({ children }) {
  const [reservations, setReservations] = useState([]);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Completed function to get the price from your API
  async function getPrice(tripId, numberPlaces, promoCode) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/v1/reservations/get-price/${tripId}/${numberPlaces}/${promoCode || ''}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch price. Please try again.");
      }

      const data = await response.json();
      return data.price; // Assuming the API returns a JSON object with a 'price' key
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw the error so the calling component can handle it
    } finally {
      setIsLoading(false);
    }
  }

  async function addReservation(reservationData) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/reservations/add-reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You may also need to add an 'Authorization' header here if your API requires a token
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add reservation.");
      }

      setReservationDetails(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }
  
  // New function to fetch all reservations
  async function getAllReservations() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/reservations");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch reservations.");
      }
      
      const data = await response.json();
      setReservations(data);
    } catch (err) {
      setError(err.message);
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
    isLoading,
    error,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}