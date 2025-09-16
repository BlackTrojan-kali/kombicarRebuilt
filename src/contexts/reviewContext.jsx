import { useState, createContext } from "react";
import api from "../api/api";

export const reviewContext = createContext({});

export function ReviewContextProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  // Récupère une liste paginée d'avis pour un trajet spécifique.
  const fetchReviewPerTrip = async (trip, page) => {
    try {
      const response = await api.get(`/api/v1/reviews/${trip}/${page}`);
      setReviews(response.data.items);
      console.log(response);
    } catch (err) {
      console.error("Erreur lors du chargement des revues: " + err);
    }
  };

  // Récupère une liste paginée d'avis pour un conducteur spécifique.
  const fetchReviewPerConductor = async (userId, page) => {
    try {
      const response = await api.get(`/api/v1/reviews/${userId}/${page}`);
      setReviews(response.data.items);
      console.log(response);
    } catch (err) {
      console.error("Erreur lors du chargement des revues: " + err);
    }
  };

  // Récupère les détails d'un avis spécifique.
  const fetchReviewById = async (reviewId) => {
    try {
      const response = await api.get(`/api/v1/reviews/${reviewId}`);
      setSelectedReview(response.data);
      console.log(response);
    } catch (err) {
      console.error("Erreur lors du chargement de l'avis: " + err);
    }
  };
  
  // Met à jour un avis existant par son identifiant.
  const updateReview = async (reviewId, updatedReviewData) => {
    try {
      const response = await api.put(`/api/v1/reviews/${reviewId}`, updatedReviewData);
      const updatedReview = response.data;
      
      setReviews(prevReviews => prevReviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      ));

      if (selectedReview && selectedReview.id === updatedReview.id) {
        setSelectedReview(updatedReview);
      }

      console.log("Avis mis à jour :", updatedReview);
      return updatedReview;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'avis: " + err);
      throw err; 
    }
  };
  
  // Supprime un avis existant par son identifiant.
  const deleteReview = async (reviewId) => {
    try {
      await api.delete(`/api/v1/reviews/${reviewId}`);
      
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));

      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview(null);
      }
      
      console.log("Avis supprimé avec succès.");
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de l'avis: " + err);
      throw err;
    }
  };

  // Crée et soumet un nouvel avis.
  const createReview = async (newReviewData) => {
    try {
      const response = await api.post("/api/v1/reviews", newReviewData);
      const newReview = response.data;
      
      setReviews(prevReviews => [newReview, ...prevReviews]);

      console.log("Avis créé :", newReview);
      return newReview;
    } catch (err) {
      console.error("Erreur lors de la création de l'avis: " + err);
      throw err;
    }
  };
  
  // Crée un nouvel avis en tant qu'administrateur.
  const createReviewAsAdmin = async (newReviewData) => {
    try {
      const response = await api.post("/api/v1/reviews/admin/add", newReviewData);
      const newReview = response.data;

      setReviews(prevReviews => [newReview, ...prevReviews]);

      console.log("Avis créé par l'administrateur:", newReview);
      return newReview;
    } catch (err) {
      console.error("Erreur lors de la création de l'avis par l'administrateur: " + err);
      throw err;
    }
  };

  const values = {
    reviews,
    setReviews,
    selectedReview,
    setSelectedReview,
    fetchReviewPerTrip,
    fetchReviewPerConductor,
    fetchReviewById,
    updateReview,
    deleteReview,
    createReview,
    createReviewAsAdmin,
  };

  return (
    <reviewContext.Provider value={values}>
      {children}
    </reviewContext.Provider>
  );
}