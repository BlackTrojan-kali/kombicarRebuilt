import { createContext, useState } from "react";
import api from "../api/api";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    // ===================================
    // 1. GESTION DES ADMINISTRATEURS (Admin List)
    // ===================================
    const [adminList, setAdminList] = useState([]);
    const [adminPagination, setAdminPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
    const [adminListError, setAdminListError] = useState(null);
    const { refreshUserToken} = useAuth();
    // ===================================
    // 2. GESTION DES CONDUCTEURS (Unverified Conductor List)
    // ===================================
    const [conductorList, setConductorList] = useState([]);
    const [conductorPagination, setConductorPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingConductors, setIsLoadingConductors] = useState(false);
    const [conductorListError, setConductorListError] = useState(null);

    // ===================================
    // 3. GESTION DES UTILISATEURS STANDARDS (Standard User List - Role NONE)
    // ===================================
    const [standardUserList, setStandardUserList] = useState([]);
    const [standardUserPagination, setStandardUserPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingStandardUsers, setIsLoadingStandardUsers] = useState(false);
    const [standardUserListError, setStandardUserListError] = useState(null);
    
    // ===================================
    // 4. GESTION DES CONDUCTEURS VÉRIFIÉS (Verified Conductor List - Role DRIVER)
    // ===================================
    const [verifiedConductorList, setVerifiedConductorList] = useState([]);
    const [verifiedConductorPagination, setVerifiedConductorPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingVerifiedConductors, setIsLoadingVerifiedConductors] = useState(false);
    const [verifiedConductorListError, setVerifiedConductorListError] = useState(null);

    // ===================================
    // 5. GESTION DU PROFIL UTILISATEUR CONNECTÉ (User Profile Update)
    // ===================================
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [updateProfileError, setUpdateProfileError] = useState(null);


    // ###################################
    // # FONCTIONS D'ADMINISTRATION
    // ###################################

    /** Récupère la liste des administrateurs paginée. */
    const listAdmins = async (page = 1) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            const response = await api.get(`/api/v1/users/admin/list-admin/${page}`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste d'administrateurs.");
            }

            const data = response.data;
            setAdminList(data.items);
            setAdminPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des administrateurs:", error);
            const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue est survenue.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            setAdminList([]);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    /** Ajoute un nouvel administrateur. */
    const addAdmin = async (adminData) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            const payload = {
                email: adminData.email,
                password: adminData.password,
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                phoneNumber: adminData.phoneNumber || "",
                country: adminData.country || 225,
                role: adminData.role,
            };
            const response = await api.post('/api/v1/users/admin/add-user', payload);
            toast.success("Administrateur ajouté avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'admin:", error);
            const errorMessage = error.response?.data?.message || "Échec de l'ajout de l'administrateur.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    /** Supprime un administrateur par son ID. */
    const deleteAdmin = async (userId) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            const response = await api.delete(`/api/v1/users/admin/delete/${userId}`);
            toast.success("Administrateur supprimé avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'administrateur:", error);
            const errorMessage = error.response?.data?.message || "Échec de la suppression de l'administrateur.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    /** Met à jour le rôle d'un utilisateur par un admin. */
    const updateUserRole = async (userId, newRole) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            const response = await api.put(`/api/v1/users/admin/change-role/${userId}/${newRole}`);
            toast.success("Rôle utilisateur mis à jour avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du rôle utilisateur:", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du rôle.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    /**
     * Met à jour le pays d'accès d'un administrateur.
     * PUT /api/v1/users/admin/update-access-country/{userId}/{adminCountryAccess}
     */
    const updateAdminCountryAccess = async (userId, adminCountryAccess) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            const response = await api.put(`/api/v1/users/admin/update-access-country/${userId}/${adminCountryAccess}`);
            toast.success("Pays d'accès de l'administrateur mis à jour avec succès !");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du pays d'accès de l'administrateur:", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du pays d'accès.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    // ###################################
    // # FONCTIONS DE LISTING PAGINÉ
    // ###################################

    /** Récupère la liste des conducteurs non vérifiés. */
    const listConductors = async (page = 1) => {
        setIsLoadingConductors(true);
        setConductorListError(null);
        try {
            const response = await api.get(`/api/v1/users/admin/list-conductor/${page}`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste des conducteurs.");
            }

            const data = response.data;
            setConductorList(data.items);
            setConductorPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des conducteurs:", error);
            const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue est survenue.";
            setConductorListError(errorMessage);
            toast.error(errorMessage);
            setConductorList([]);
            throw error;
        } finally {
            setIsLoadingConductors(false);
        }
    };

    /** Récupère la liste des utilisateurs standards (rôle NONE). */
    const listStandardUsers = async (page = 1) => {
        setIsLoadingStandardUsers(true);
        setStandardUserListError(null);
        try {
            const response = await api.get(`/api/v1/users/admin/list-users/${page}`);
            
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste des utilisateurs standards.");
            }

            const data = response.data;
            setStandardUserList(data.items);
            setStandardUserPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des utilisateurs standards:", error);
            const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue est survenue.";
            setStandardUserListError(errorMessage);
            toast.error(errorMessage);
            setStandardUserList([]);
            throw error;
        } finally {
            setIsLoadingStandardUsers(false);
        }
    };
    
    /** Récupère la liste des conducteurs vérifiés (rôle DRIVER). */
    const listVerifiedConductors = async (page = 1) => {
        setIsLoadingVerifiedConductors(true);
        setVerifiedConductorListError(null);
        try {
            const response = await api.get(`/api/v1/users/admin/list-drivers/${page}`);
            if (response.status !== 200) {
                throw new Error("Échec de la récupération de la liste des conducteurs vérifiés.");
            }
            const data = response.data;
            setVerifiedConductorList(data.items);
            setVerifiedConductorPagination({
                totalCount: data.totalCount,
                page: data.page,
                hasNextPage: data.hasNextPage,
                hasPreviousPage: data.hasPreviousPage,
            });
            return data;
        } catch (error) {
            console.error("Erreur lors de la liste des conducteurs vérifiés:", error);
            const errorMessage = error.response?.data?.message || error.message || "Une erreur inattendue est survenue.";
            setVerifiedConductorListError(errorMessage);
            toast.error(errorMessage);
            setVerifiedConductorList([]);
            throw error;
        } finally {
            setIsLoadingVerifiedConductors(false);
        }
    };

    // ###################################
    // # FONCTION UTILISATEUR AUTHENTIFIÉ
    // ###################################

    /** Met à jour les informations de profil de l'utilisateur authentifié. */
    const updateProfile = async (profileData) => {
        setIsUpdatingProfile(true);
        setUpdateProfileError(null);
            const refreshToken = localStorage.getItem("refreshToken");
      
        try {
            // Le payload contient firstName, lastName, phoneNumber, country, etc.
            const response = await api.put('/api/v1/users/update', profileData); 
            const res = await  refreshUserToken(refreshToken);
            
            toast.success("Votre profil a été mis à jour avec succès !");

            // Le composant d'appel devra utiliser l'AuthContext pour mettre à jour l'état 'user' localement.
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            const errorMessage = error.response?.data?.message || "Échec de la mise à jour du profil.";
            setUpdateProfileError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsUpdatingProfile(false);
        }
    };


    // ###################################
    // # VALEUR DU CONTEXTE EXPORTÉE
    // ###################################
    const value = {
        // --- ADMINS ---
        adminList, adminPagination, isLoadingAdmins, adminListError,
        listAdmins, addAdmin, deleteAdmin, updateAdminCountryAccess, // <--- AJOUTÉ ICI

        // --- CONDUCTEURS (Non Vérifiés) ---
        conductorList, conductorPagination, isLoadingConductors, conductorListError,
        listConductors,

        // --- UTILISATEURS STANDARDS ---
        standardUserList, standardUserPagination, isLoadingStandardUsers, standardUserListError,
        listStandardUsers,

        // --- CONDUCTEURS VÉRIFIÉS ---
        verifiedConductorList, verifiedConductorPagination, isLoadingVerifiedConductors, verifiedConductorListError,
        listVerifiedConductors,

        // --- OPÉRATIONS ADMINISTRATIVES GLOBALES ---
        updateUserRole,

        // --- PROFIL UTILISATEUR CONNECTÉ ---
        isUpdatingProfile, updateProfileError,
        updateProfile, 
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}