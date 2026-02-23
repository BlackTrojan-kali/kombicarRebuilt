// src/context/RoleContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import api from "../../api/api";
import useAuth from "../../hooks/useAuth"; // <-- N'oubliez pas d'ajuster ce chemin vers votre hook d'authentification

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // On récupère la fonction de rafraîchissement depuis le contexte d'auth
  const { refreshAdminToken } = useAuth(); 

  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState(null); 
  const [permissions, setPermissions] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const setRolesCallback = useCallback(setRoles, []);
  const setRoleCallback = useCallback(setRole, []);
  const setPermissionsCallback = useCallback(setPermissions, []);
  const setLoadingCallback = useCallback(setLoading, []);

  /**
   * 🟩 Ajouter un rôle
   * POST /api/v1/roles/add
   */
  const addRole = useCallback(async (data) => {
    try {
      setLoadingCallback(true);
      const response = await api.post("/api/v1/roles/add", data);
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
      
      // 1. Mise à jour locale des états
      if (role && role.id === data.id) {
        setRoleCallback(response.data);
      }
      
      setRolesCallback(prev => 
        prev.map(r => r.id === data.id ? response.data : r)
      );

      // 2. Rafraîchissement automatique du Token Admin
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (currentRefreshToken) {
          await refreshAdminToken(currentRefreshToken);
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setRoleCallback, setRolesCallback, role, refreshAdminToken]); // <-- Ajout de refreshAdminToken aux dépendances

  /**
   * 🟨 Lister les rôles
   * GET /api/v1/roles/list/{page}
   */
  const getRoles = useCallback(async (page = 1) => {
    try {
      setLoadingCallback(true);
      const response = await api.get(`/api/v1/roles/list/${page}`);
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
   * 🟪 Lister toutes les permissions disponibles
   * GET /api/v1/roles/list-all-permissions
   */
  const getAllPermissions = useCallback(async () => {
    try {
      setLoadingCallback(true);
      const response = await api.get("/api/v1/roles/list-all-permissions");
      setPermissionsCallback(response.data || []);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des permissions :", error);
      throw error;
    } finally {
      setLoadingCallback(false);
    }
  }, [setLoadingCallback, setPermissionsCallback]);

  /**
   * 🟥 Supprimer un rôle
   * DELETE /api/v1/roles/{roleId}
   */
  const deleteRole = useCallback(async (roleId) => {
    try {
      setLoadingCallback(true);
      const response = await api.delete(`/api/v1/roles/${roleId}`);
      
      setRolesCallback((prev) => prev.filter((r) => r.id !== roleId));
      
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
    permissions,
    loading,
    addRole,
    updateRole,
    getRoles,
    getRoleById,
    getAllPermissions,
    deleteRole,
  }), [
    roles,
    role,
    permissions,
    loading,
    addRole,
    updateRole,
    getRoles,
    getRoleById,
    getAllPermissions,
    deleteRole,
  ]);

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);