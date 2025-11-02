import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faArrowLeft, faArrowRight,
    faTrash, faUserPlus, 
    faUserMinus, // Utilisé pour Rétrograder
    faUserShield, // Utilisé pour la gestion des rôles Admin / Super Admin
    faCrown // Icône de couronne pour Super Admin
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import { toast } from "sonner";

// Définition des rôles disponibles
const ROLES = {
    NONE: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2,
    DRIVER: 3, 
};

/** Renvoie le nom lisible du rôle */
const getRoleName = (roleId) => {
    switch(roleId) {
        case ROLES.ADMIN: return <span className="text-yellow-500 font-bold flex items-center gap-2"><FontAwesomeIcon icon={faUserShield} /> ADMIN</span>;
        case ROLES.SUPER_ADMIN: return <span className="text-purple-500 font-bold flex items-center gap-2"><FontAwesomeIcon icon={faCrown} /> SUPER_ADMIN</span>;
        case ROLES.DRIVER: return <span className="text-green-500 font-bold">DRIVER</span>;
        case ROLES.NONE: default: return <span className="text-gray-400">NONE</span>;
    }
}

const Utilisateurs = () => {
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';

    const {
        // NOTE: On suppose que ces hooks retournent désormais la liste des ADMINISTRATEURS.
        standardUserList: adminList, 
        standardUserPagination: adminPagination, 
        isLoadingStandardUsers: isLoadingAdmins,
        standardUserListError: adminListError, 
        listStandardUsers: listAdmins, // On suppose que cette fonction est maintenant listAdmins
        updateUserRole, 
        deleteAdmin, // On suppose que cette fonction peut supprimer un ADMIN
    } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    
    // Destructuration des données de pagination
    const { totalCount, page, hasNextPage, hasPreviousPage } = adminPagination || {};
    
    // ===================================
    // LIFECYCLE ET CHARGEMENT
    // ===================================
    useEffect(() => {
        const fetchAdmins = async () => {
            // Re-appelle la liste des Administrateurs à chaque changement de page
            await listAdmins(currentPage); 
        };
        fetchAdmins();
    }, [currentPage,]);
    
    // Logique de pagination
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
    // GESTION DES ACTIONS ADMINISTRATIVES
    // ===================================

    /** Fonction utilitaire pour exécuter la mise à jour du rôle et le rafraîchissement. */
    const performRoleUpdate = async (userId, newRole, userName) => {
        const roleName = Object.keys(ROLES).find(key => ROLES[key] === newRole) || newRole;
        try {
            await toast.promise(updateUserRole(userId, newRole), {
                loading: `Mise à jour de ${userName} en ${roleName} en cours...`,
                success: `L'utilisateur ${userName} est maintenant ${roleName} avec succès !`,
                error: (err) => `Erreur: ${err.response?.data?.message || err.message || "Échec de la mise à jour du rôle."}`,
            });

            // L'utilisateur ayant changé de rôle (ex: démote à NONE), il doit quitter cette liste ou son rôle doit être mis à jour.
            // On rafraîchit la liste des administrateurs.
            await listAdmins(currentPage); 

        } catch (error) {
            console.error("Erreur de mise à jour de rôle:", error);
        }
    }


    /** Gère la RÉTROGRADATION d'un Admin/Super Admin en utilisateur Standard (ROLE NONE). */
    const handleDemoteAdmin = async (userId, userName) => {
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée.");
            return;
        }

        Swal.fire({
            title: 'Confirmer la rétrogradation ?',
            text: `Voulez-vous vraiment rétrograder l'administrateur ${userName} au rôle d'utilisateur STANDARD (ROLE: NONE) ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F472B6', // Rose pour la rétrogradation
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, Rétrograder !',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await performRoleUpdate(userId, ROLES.NONE, userName);
            }
        });
    };
    
    /** Gère le CHANGEMENT DE RÔLE entre ADMIN et SUPER_ADMIN. */
    const handlePromoteOrChangeRole = (userId, userName, currentRole) => {
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée.");
            return;
        }

        const options = {};
        if (currentRole === ROLES.ADMIN) {
            options[ROLES.SUPER_ADMIN] = 'Promouvoir en Super Administrateur (SUPER_ADMIN)';
        } else if (currentRole === ROLES.SUPER_ADMIN) {
            options[ROLES.ADMIN] = 'Rétrograder en Administrateur (ADMIN)';
        }

        if (Object.keys(options).length === 0) {
            toast.info(`L'utilisateur ${userName} ne peut pas changer de rôle admin/super_admin via cette interface (rôle actuel non géré : ${currentRole}).`);
            return;
        }

        Swal.fire({
            title: `Modifier le rôle de ${userName}`,
            input: 'select',
            inputOptions: options,
            inputPlaceholder: 'Sélectionnez le nouveau rôle...',
            showCancelButton: true,
            confirmButtonText: 'Confirmer le changement',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#1D4ED8', 
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vous devez sélectionner un rôle !'
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const newRole = parseInt(result.value); 
                await performRoleUpdate(userId, newRole, userName);
            }
        });
    };

    /** Supprime un administrateur. */
    const handleDeleteAdmin = (userId, userName) => {
        if (!deleteAdmin) {
            toast.error("Fonction de suppression d'administrateur non disponible.");
            return;
        }

        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de SUPPRIMER L'ADMINISTRATEUR ${userName} (ID: ${userId}). Cette action est irréversible et supprime le compte.`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, SUPPRIMER !',
            cancelButtonText: 'Annuler',
            background: isDark ? '#1F2937' : '#FFFFFF',
            color: isDark ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await toast.promise(deleteAdmin(userId), {
                        loading: `Suppression de l'administrateur ${userName} en cours...`,
                        success: `L'administrateur ${userName} a été supprimé !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    // Logique de rafraîchissement ou de changement de page après suppression
                    const newTotalCount = (totalCount || 0) - 1;
                    const newPage = (newTotalCount > 0 && adminList.length === 1 && currentPage > 1) 
                        ? currentPage - 1 
                        : currentPage;

                    if (newPage !== currentPage) {
                        setCurrentPage(newPage);
                    } else {
                        await listAdmins(currentPage); 
                    }

                } catch (error) {
                    // Les erreurs sont gérées par toast.promise
                }
            }
        });
    };

    const handleAddUser = () => {
        toast('Le formulaire pour ajouter un nouvel administrateur s\'ouvrira ici.', {
            icon: '👑',
            duration: 3000,
            position: 'top-right',
        });
    };

    return (
        <div className='pl-12  pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Gestion des Utilisateurs
                </h1>
                <button
                    onClick={handleAddUser}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Ajouter un Administrateur
                </button>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Administrateurs Enregistrés ({totalCount || 0})</h2>
                
                {isLoadingAdmins ? (
                    <div className="p-4 text-center text-blue-500 dark:text-blue-400">Chargement des administrateurs...</div>
                ) : adminListError ? (
                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                        <p>Une erreur est survenue lors du chargement des administrateurs :</p> 
                        <p className='font-mono italic mt-1'>{adminListError}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg">
                            <table className={`w-full table-auto ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                <thead>
                                    <tr className={`uppercase text-sm font-semibold text-left ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        <th className="py-3 px-4 rounded-tl-lg">ID</th>
                                        <th className="py-3 px-4">Nom de l'administrateur</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Téléphone</th>
                                        <th className="py-3 px-4">Rôle</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminList && adminList.length > 0 ? (
                                        adminList.map(user => {
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
                                                        {getRoleName(user.role)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            {/* Bouton pour GÉRER les rôles ADMIN/SUPER_ADMIN */}
                                                            <button
                                                                onClick={() => handlePromoteOrChangeRole(user.id, user.firstName, user.role)}
                                                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                                                title="Gérer le rôle Administrateur/Super Administrateur"
                                                            >
                                                                <FontAwesomeIcon icon={faUserShield} />
                                                            </button>
                                                            
                                                            {/* Bouton pour RÉTROGRADER en Utilisateur Standard (NONE) */}
                                                            <button
                                                                onClick={() => handleDemoteAdmin(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors duration-200"
                                                                title="Rétrograder au rôle Standard (NONE)"
                                                            >
                                                                <FontAwesomeIcon icon={faUserMinus} />
                                                            </button>
                                                            
                                                            {/* Bouton de suppression d'administrateur */}
                                                            <button
                                                                onClick={() => handleDeleteAdmin(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                                                title="Supprimer l'administrateur (suppression de compte)"
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
                                            <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faCrown} className="text-4xl mb-2" />
                                                    <p>Aucun administrateur à afficher pour le moment.</p>
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
                                Affichage de {totalCount === 0 ? 0 : (page - 1) * 10 + 1} à {Math.min(totalCount || 0, (page || 1) * 10)} sur {totalCount || 0} administrateurs.
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={!hasPreviousPage || isLoadingAdmins}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasPreviousPage || isLoadingAdmins ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Précédent
                                </button>
                                <span className={`px-4 py-2 rounded-md font-bold ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    Page {page || 1}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!hasNextPage || isLoadingAdmins}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasNextPage || isLoadingAdmins ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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