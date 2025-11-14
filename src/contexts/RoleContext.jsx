// src/context/RoleContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from "../api/api";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null); // Rôle unique (utilisé par getRoleById)
  const [loading, setLoading] = useState(false);
  
  // Dépendances pour useCallback
  const setRolesCallback = useCallback(setRoles, []);
  const setRoleCallback = useCallback(setRole, []);
  const setLoadingCallback = useCallback(setLoading, []);

  /**
   * 🟩 Ajouter un rôle
   * POST /api/v1/roles/add
   */
  const addRole = useCallback(async (data) => {
    try {
      setLoadingCallback(true);
      const response = await api.post("/api/v1/roles/add", data);
      // NOTE: Ne pas mettre à jour roles car la liste est paginée, 
      // l'utilisateur devra naviguer vers la page 1 ou rafraîchir.
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback]);

  /**
   * 🟦 Mettre à jour un rôle
   * PUT /api/v1/roles/update
   */
  const updateRole = useCallback(async (data) => {
    try {
      setLoadingCallback(true);
      const response = await api.put("/api/v1/roles/update", data);
      
      // Mise à jour locale de l'état 'role' si c'est le rôle actuellement chargé pour l'édition
      if (role && role.id === data.id) {
        setRoleCallback(response.data);
      }
      
      // Mise à jour locale de la liste 'roles' (pour la page courante)
      setRolesCallback(prev => 
        prev.map(r => r.id === data.id ? response.data : r)
      );
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setRoleCallback, setRolesCallback, role]);

  /**
   * 🟨 Lister les rôles
   * GET /api/v1/roles/list/{page}
   */
  const getRoles = useCallback(async (page = 1) => {
    try {
      setLoadingCallback(true);
      const response = await api.get(`/api/v1/roles/list/${page}`);
      // Assurez-vous que les données sont valides
      setRolesCallback(response.data.items || []);
      return response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des rôles :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setRolesCallback]);

  /**
   * 🟧 Obtenir un rôle par ID
   * GET /api/v1/roles/{roleId}
   */
  const getRoleById = useCallback(async (roleId) => {
    try {
      setLoadingCallback(true);
      const response = await api.get(`/api/v1/roles/${roleId}`);
      // Mettre à jour le rôle unique
      setRoleCallback(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setRoleCallback]);

  /**
   * 🟥 Supprimer un rôle
   * DELETE /api/v1/roles/{roleId}
   */
  const deleteRole = useCallback(async (roleId) => {
    try {
      setLoadingCallback(true);
      const response = await api.delete(`/api/v1/roles/${roleId}`);
      
      // Mise à jour locale : filtrer le rôle supprimé de la liste
      setRolesCallback((prev) => prev.filter((r) => r.id !== roleId));
      
      // Vider l'état 'role' si le rôle supprimé est celui actuellement chargé
      if (role && role.id === roleId) {
        setRoleCallback(null);
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du rôle :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setRolesCallback, setRoleCallback, role]);


  const value = useMemo(() => ({
    roles,
    role,
    loading,
    addRole,
    updateRole,
    getRoles,
    getRoleById,
    deleteRole,
  }), [
    roles,
    role,
    loading,
    addRole,
    updateRole,
    getRoles,
    getRoleById,
    deleteRole,
  ]);


  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);