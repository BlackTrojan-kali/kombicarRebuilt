// Dans votre UserContextProvider.js
import { createContext, useState, useContext } from "react";
import api from "../api/api";
import toast from 'react-hot-toast';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    // ... (vos états existants)
    const [adminList, setAdminList] = useState([]);
    const [adminPagination, setAdminPagination] = useState({
        totalCount: 0,
        page: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
    const [adminListError, setAdminListError] = useState(null);

    // Fonction pour lister les administrateurs (inchangée)
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
            const errorMessage = error.message || "Une erreur inattendue est survenue.";
            setAdminListError(errorMessage);
            toast.error(errorMessage);
            setAdminList([]);
            throw error;
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    // Fonction pour ajouter un nouvel administrateur (inchangée)
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

    // 🆕 Nouvelle fonction pour supprimer un administrateur
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

    const value = {
        adminList,
        adminPagination,
        isLoadingAdmins,
        adminListError,
        listAdmins,
        addAdmin,
        deleteAdmin, // Exposer la nouvelle fonction
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}