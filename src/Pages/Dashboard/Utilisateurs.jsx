import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faArrowLeft, faArrowRight,
    faTrash, faUserPlus, faShieldHalved, faUserShield, // faUserShield pour promotion Admin
    faCrown // Icône de couronne pour Super Admin
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import { toast } from "sonner";

// Définition des rôles disponibles (utile pour l'UI et la logique)
const ROLES = {
    NONE: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2,
    DRIVER: 3, // Rôle déjà utilisé pour la promotion en conducteur
};

const Utilisateurs = () => {
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';

    const {
        standardUserList,
        standardUserPagination, 
        isLoadingStandardUsers,
        standardUserListError,
        listStandardUsers,
        updateUserRole, 
        deleteAdmin,
    } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    
    // ===================================
    // LIFECYCLE ET CHARGEMENT
    // ===================================
    useEffect(() => {
        const fetchUsers = async () => {
            // Re-appelle la liste à chaque changement de page
            await listStandardUsers(currentPage); 
        };
        fetchUsers();
    }, [currentPage]); // Ajout de listStandardUsers comme dépendance
    
    // ... (Logique de pagination handleNextPage et handlePreviousPage inchangée)
   // const { totalCount, page, hasNextPage, hasPreviousPage } = standardUserPagination;
    const currentListCount = standardUserList.length; 
    
    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    };
    // ===================================
    // GESTION DES ACTIONS
    // ===================================

    /** Supprime un utilisateur standard (ROLE NONE). (Fonction inchangée) */
    const handleDeleteUser = (userId, userName) => {
        // ... (Logique de handleDeleteUser inchangée)
        if (!deleteAdmin) {
            toast.error("Fonction de suppression d'utilisateur non disponible.");
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer l'utilisateur ${userName} (ID: ${userId}). Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await toast.promise(deleteAdmin(userId), {
                        loading: `Suppression de ${userName} en cours...`,
                        success: `L'utilisateur ${userName} a été supprimé !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    const newTotalCount = totalCount - 1;
                    const newPage = (newTotalCount > 0 && standardUserList.length === 1 && currentPage > 1) 
                        ? currentPage - 1 
                        : currentPage;

                    if (newPage !== currentPage) {
                        setCurrentPage(newPage);
                    } else {
                        await listStandardUsers(currentPage); 
                    }

                } catch (error) {
                    // Les erreurs sont gérées par toast.promise
                }
            }
        });
    };

    /** Gère la promotion au rôle de Conducteur VÉRIFIÉ (DRIVER). (Fonction légèrement simplifiée) */
    const handlePromoteToDriver = async (userId, userName) => {
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée.");
            return;
        }

        Swal.fire({
            title: 'Confirmer la promotion ?',
            text: `Voulez-vous vraiment promouvoir ${userName} au rôle de CONDUCTEUR VÉRIFIÉ (DRIVER) ?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10B981', 
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, Promouvoir DRIVER !',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await performRoleUpdate(userId, ROLES.DRIVER, userName);
            }
        });
    };
    
    /** Gère la promotion au rôle d'Admin ou Super Admin. */
    const handlePromoteToAdmin = (userId, userName) => {
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée.");
            return;
        }

        Swal.fire({
            title: `Promouvoir ${userName} à quel rôle ?`,
            input: 'select',
            inputOptions: {
                [ROLES.ADMIN]: 'Administrateur (ADMIN)',
                [ROLES.SUPER_ADMIN]: 'Super Administrateur (SUPER_ADMIN)'
            },
            inputPlaceholder: 'Sélectionnez un rôle...',
            showCancelButton: true,
            confirmButtonText: 'Confirmer la promotion',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#F59E0B', 
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
            inputValidator: (value) => {
                if (!value || (value != ROLES.ADMIN && value != ROLES.SUPER_ADMIN)) {
                    return 'Vous devez sélectionner un rôle !'
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const newRole = parseInt(result.value); // Le résultat de Swal.fire est une chaîne
                await performRoleUpdate(userId, newRole, userName);
            }
        });
    };

    /** Fonction utilitaire pour exécuter la mise à jour du rôle et le rafraîchissement. */
    const performRoleUpdate = async (userId, newRole, userName) => {
        const roleName = Object.keys(ROLES).find(key => ROLES[key] === newRole) || newRole;
        try {
            await toast.promise(updateUserRole(userId, newRole), {
                loading: `Promotion de ${userName} en ${roleName} en cours...`,
                success: `L'utilisateur ${userName} a été promu au rôle ${roleName} avec succès !`,
                error: (err) => `Erreur: ${err.response?.data?.message || err.message || "Échec de la promotion."}`,
            });

            // L'utilisateur ayant changé de rôle (de NONE à DRIVER/ADMIN/SUPER_ADMIN), il doit quitter cette liste.
            // On rafraîchit la liste des utilisateurs standards.
            await listStandardUsers(currentPage); 

        } catch (error) {
            // Les erreurs sont déjà gérées par toast.promise
            console.error("Erreur de promotion:", error);
        }
    }


    const handleAddUser = () => {
        // ... (Logique inchangée)
        toast('Le formulaire pour ajouter un utilisateur de rôle NONE s\'ouvrira ici.', {
            icon: '👨‍👩‍👧‍👦',
            duration: 3000,
            position: 'top-right',
        });
    };

    return (
        <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Liste des Utilisateurs Standards (ROLE: NONE)
                </h1>
                <button
                    onClick={handleAddUser}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Ajouter un Utilisateur
                </button>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Utilisateurs Enregistrés ({totalCount})</h2>
                
                {isLoadingStandardUsers ? (
                    <div className="p-4 text-center text-blue-500 dark:text-blue-400">Chargement des utilisateurs...</div>
                ) : standardUserListError ? (
                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                        <p>Une erreur est survenue lors du chargement des utilisateurs :</p> 
                        <p className='font-mono italic mt-1'>{standardUserListError}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg">
                            <table className={`w-full table-auto ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                <thead>
                                    <tr className={`uppercase text-sm font-semibold text-left ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        <th className="py-3 px-4 rounded-tl-lg">ID</th>
                                        <th className="py-3 px-4">Nom de l'utilisateur</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Téléphone</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standardUserList && standardUserList.length > 0 ? (
                                        standardUserList.map(user => {
                                            const userName = user.firstName + ' ' + user.lastName;
                                            return (
                                                <tr key={user.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                                                    <td className="py-4 px-4">{user.id}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2 font-medium">
                                                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                                            {userName}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                                            {user.email}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                                            {user.phoneNumber || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            {/* Bouton pour promouvoir en Conducteur VÉRIFIÉ (DRIVER) */}
                                                            <button
                                                                onClick={() => handlePromoteToDriver(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                                                title="Promouvoir au rôle de Conducteur (DRIVER)"
                                                            >
                                                                <FontAwesomeIcon icon={faShieldHalved} />
                                                            </button>
                                                            
                                                            {/* NOUVEAU: Bouton pour promouvoir en ADMINISTRATEUR / SUPER_ADMIN */}
                                                            <button
                                                                onClick={() => handlePromoteToAdmin(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
                                                                title="Promouvoir au rôle d'Administrateur"
                                                            >
                                                                <FontAwesomeIcon icon={faUserShield} />
                                                            </button>
                                                            
                                                            {/* Bouton de suppression d'utilisateur */}
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                                                title="Supprimer l'utilisateur"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faUser} className="text-4xl mb-2" />
                                                    <p>Aucun utilisateur à afficher pour le moment.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                            <div className="mb-2 sm:mb-0">
                                Affichage de {totalCount === 0 ? 0 : (page - 1) * 10 + 1} à {Math.min(totalCount, page * 10)} sur {totalCount} utilisateurs.
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={!hasPreviousPage || isLoadingStandardUsers}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasPreviousPage || isLoadingStandardUsers ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Précédent
                                </button>
                                <span className={`px-4 py-2 rounded-md font-bold ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    Page {page || 1}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage || isLoadingStandardUsers}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasNextPage || isLoadingStandardUsers ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Suivant
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Utilisateurs;