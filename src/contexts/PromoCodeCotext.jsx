import { createContext, useState } from "react";
import api from "../api/api";

export const PromoCodeContext = createContext(null);

export function PromoCodeContextProvider({ children }) {
  const [promoCode, setPromoCode] = useState(null);

  const createPromoCode = async (codeData) => {
    try {
      const response = await api.post("/api/v1/promo-code/admin/add", codeData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du code promotionnel:", error);
      throw error;
    }
  };

  const listActivePromoCodes = async (page) => {
    try {
      const response = await api.get(`/api/v1/promo-code/admin/active/${page}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des codes promotionnels actifs:", error);
      throw error;
    }
  };

  const listExpiredPromoCodes = async (page) => {
    try {
      const response = await api.get(`/api/v1/promo-code/admin/expired/${page}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des codes promotionnels expirés:", error);
      throw error;
    }
  };

  const listAllPromoCodes = async (page) => {
    try {
      const response = await api.get(`/api/v1/promo-code/admin/all/${page}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les codes promotionnels:", error);
      throw error;
    }
  };
  
  const getPromoCodeById = async (id) => {
    try {
      const response = await api.get(`/api/v1/promo-code/admin/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du code promotionnel:", error);
      throw error;
    }
  };

  const getPromoCodeByName = async (name) => {
    try {
      const response = await api.get(`/api/v1/promo-code/admin/name/${name}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du code promotionnel par nom:", error);
      throw error;
    }
  };

  const updatePromoCode = async (id, updatedData) => {
    try {
      const response = await api.put(`/api/v1/promo-code/admin/update/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du code promotionnel ID ${id}:`, error);
      throw error;
    }
  };
  
  // Nouvelle fonction pour supprimer un code promotionnel
  const deletePromoCode = async (id) => {
    try {
      const response = await api.delete(`/api/v1/promo-code/admin/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du code promotionnel ID ${id}:`, error);
      throw error;
    }
  };

  const value = {
    promoCode,
    setPromoCode,
    createPromoCode,
    listActivePromoCodes,
    listExpiredPromoCodes,
    listAllPromoCodes,
    getPromoCodeById,
    getPromoCodeByName,
    updatePromoCode,
    deletePromoCode, // Ajout de la dernière fonction
  };

  return (
    <PromoCodeContext.Provider value={value}>
      {children}
    </PromoCodeContext.Provider>
  );
}