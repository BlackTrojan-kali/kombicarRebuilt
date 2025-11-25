import { createContext, useContext, useState } from "react";
import api from "../../api/api";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";

export const UsersAdminContext = createContext({});

export function UsersAdminContextProvider({ children }) {
    // Récupération de la fonction d'authentification
    const { refreshUserToken } = useAuth(); 

    // États globaux pour la gestion des listes et opérations
    const [userList, setUserList] = useState([]);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. PUT /api/v1/users/admin/change-role/{userId}/{role}/{roleId}
    const updateUserRoleAsSuperAdmin = async (userId, role, roleId) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/change-role/${userId}/${role}/${roleId}`;
            const response = await api.put(url);
            toast.success(`Le rôle de l'utilisateur ${userId} a été mis à jour avec succès (Super Admin).`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du rôle utilisateur (Super Admin):", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du rôle utilisateur.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    // 2. POST /api/v1/users/admin/add-user
    const addAdminUser = async (adminData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/v1/users/admin/add-user', adminData);
            toast.success("Utilisateur ajouté avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur (Admin):", error);
            const errorMessage = error.response?.data?.message || "Échec de l'ajout de l'utilisateur.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 3. DELETE /api/v1/users/admin/delete/{userId}
    const deleteUserAsAdmin = async (userId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.delete(`/api/v1/users/admin/delete/${userId}`);
            toast.success(`L'utilisateur ${userId} a été supprimé avec succès.`);
            
            setUserList(prev => prev.filter(user => user.id !== userId));

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur (Admin):", error);
            const errorMessage = error.response?.data?.message || "Échec de la suppression de l'utilisateur.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 4. GET /api/v1/users/admin/list-admin/{page}
    const listAdmins = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/list-admin/${page}`;
            const response = await api.get(url);
            
            const data = response.data;
            if (data) {
                setUserList(data.items);
                setPagination({
                    totalCount: data.totalCount,
                    page: data.page,
                    hasNextPage: data.hasNextPage,
                    hasPreviousPage: data.hasPreviousPage,
                });
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des administrateurs:", error);
            const errorMessage = error.response?.data?.message || "Échec de la récupération de la liste d'administrateurs.";
            setError(errorMessage);
            toast.error(errorMessage);
            setUserList([]);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 5. GET /api/v1/users/admin/list-drivers/{page}
    const listVerifiedConductors = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/list-drivers/${page}`;
            const response = await api.get(url);
            
            const data = response.data;
            if (data) {
                setUserList(data.items);
                setPagination({
                    totalCount: data.totalCount,
                    page: data.page,
                    hasNextPage: data.hasNextPage,
                    hasPreviousPage: data.hasPreviousPage,
                });
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des conducteurs vérifiés:", error);
            const errorMessage = error.response?.data?.message || "Échec de la récupération de la liste des conducteurs vérifiés.";
            setError(errorMessage);
            toast.error(errorMessage);
            setUserList([]);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 6. GET /api/v1/users/admin/list-users/{page}
    const listStandardUsers = async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/list-users/${page}`;
            const response = await api.get(url);
            
            const data = response.data;
            if (data) {
                setUserList(data.items);
                setPagination({
                    totalCount: data.totalCount,
                    page: data.page,
                    hasNextPage: data.hasNextPage,
                    hasPreviousPage: data.hasPreviousPage,
                });
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des utilisateurs standards:", error);
            const errorMessage = error.response?.data?.message || "Échec de la récupération de la liste des utilisateurs standards.";
            setError(errorMessage);
            toast.error(errorMessage);
            setUserList([]);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    
    // 7. PUT /api/v1/users/admin/update-access-country/{userId}/{adminCountryAccess}
    const updateAdminCountryAccess = async (userId, adminCountryAccess) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/update-access-country/${userId}/${adminCountryAccess}`;
            const response = await api.put(url);
            toast.success("Pays d'accès de l'administrateur mis à jour avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du pays d'accès de l'administrateur:", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du pays d'accès.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 8. NOUVELLE FONCTION AJOUTÉE : GET /api/v1/users/admin/verify-user-email/{email}
    const verifyUserEmailAsSuperAdmin = async (email) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `/api/v1/users/admin/verify-user-email/${email}`;
            const response = await api.get(url);
            toast.success(`L'email de l'utilisateur ${email} a été vérifié avec succès.`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de l'email de l'utilisateur:", error);
            const errorMessage = error.response?.data?.message || "Échec de la vérification de l'email.";
            setError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };


    // ###################################
    // # VALEUR DU CONTEXTE EXPORTÉE
    // ###################################
    const value = {
        userList,
        setUserList,
        pagination,
        setPagination,
        isLoading,
        setIsLoading,
        error,
        setError,
        refreshUserToken,
        
        // Fonctions d'administration
        updateUserRoleAsSuperAdmin,
        addAdminUser, 
        deleteUserAsAdmin,
        listAdmins, 
        listVerifiedConductors,
        listStandardUsers,
        updateAdminCountryAccess,
        verifyUserEmailAsSuperAdmin, // <-- Ajout de la nouvelle fonction
    };

    return (
        <UsersAdminContext.Provider value={value}>
            {children}
        </UsersAdminContext.Provider>
    );
}

export const useUserAdminContext = () => useContext(UsersAdminContext);