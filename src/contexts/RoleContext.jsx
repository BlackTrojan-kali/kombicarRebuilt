// src/context/RoleContext.jsx
import React, { createContext, useContext, useState } from "react";
import api from "../api/api";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * 🟩 Ajouter un rôle
   * POST /api/v1/roles/add
   */
  const addRole = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/roles/add", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟦 Mettre à jour un rôle
   * PUT /api/v1/roles/update
   */
  const updateRole = async (data) => {
    try {
      setLoading(true);
      const response = await api.put("/api/v1/roles/update", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟨 Lister les rôles
   * GET /api/v1/roles/list/{page}
   */
  const getRoles = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/roles/list/${page}`);
      setRoles(response.data.items || []);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des rôles :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟧 Obtenir un rôle par ID
   * GET /api/v1/roles/{roleId}
   */
  const getRoleById = async (roleId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/roles/${roleId}`);
      setRole(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🟥 Supprimer un rôle
   * DELETE /api/v1/roles/{roleId}
   */
  const deleteRole = async (roleId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/api/v1/roles/${roleId}`);
      // mise à jour locale
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du rôle :", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleContext.Provider
      value={{
        roles,
        role,
        loading,
        addRole,
        updateRole,
        getRoles,
        getRoleById,
        deleteRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
