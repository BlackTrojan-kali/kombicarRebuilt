import { createContext, useState, useContext } from "react";
import api from '../../api/api'; // Votre instance Axios configurée
import { toast } from "sonner";

const AdminSuggestionContext = createContext({});

export const AdminSuggestionProvider = ({ children }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * GET /api/v1/trip-suggestions/admin/list/{page}
   * Récupère la liste globale des suggestions
   */
  const fetchAllSuggestionsAsAdmin = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/trip-suggestions/admin/list/${page}`);
      setSuggestions(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      toast.error("Erreur lors du chargement de la liste.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * GET /api/v1/trip-suggestions/admin/details/{tripSuggestionId}
   * Récupère les détails complets d'une suggestion
   */
  const fetchSuggestionDetailsAsAdmin = async (tripSuggestionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/v1/trip-suggestions/admin/details/${tripSuggestionId}`);
      setCurrentSuggestion(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      toast.error("Impossible de récupérer les détails.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE /api/v1/trip-suggestions/admin/{tripSuggestionId}
   * Supprime définitivement une suggestion
   */
  const deleteSuggestionAsAdmin = async (tripSuggestionId) => {
    setLoading(true);
    try {
      await api.delete(`/api/v1/trip-suggestions/admin/${tripSuggestionId}`);
      
      // Mise à jour de l'état local pour retirer la suggestion supprimée
      setSuggestions((prev) => prev.filter(s => s.id !== tripSuggestionId));
      
      if (currentSuggestion?.id === tripSuggestionId) {
        setCurrentSuggestion(null);
      }

      toast.success("La suggestion a été supprimée avec succès.");
    } catch (err) {
      setError(err);
      toast.error("Erreur lors de la suppression de la suggestion.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSuggestionContext.Provider 
      value={{ 
        suggestions, 
        currentSuggestion,
        loading, 
        error, 
        fetchAllSuggestionsAsAdmin,
        fetchSuggestionDetailsAsAdmin,
        deleteSuggestionAsAdmin
      }}
    >
      {children}
    </AdminSuggestionContext.Provider>
  );
};

export const useAdminSuggestions = () => {
  const context = useContext(AdminSuggestionContext);
  if (!context) {
    throw new Error("useAdminSuggestions doit être utilisé au sein d'un AdminSuggestionProvider");
  }
  return context;
};