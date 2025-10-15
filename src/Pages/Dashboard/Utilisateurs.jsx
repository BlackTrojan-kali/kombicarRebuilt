import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faArrowLeft, faArrowRight,
    faEye, faEdit, faTrash, faUserPlus, faCheckCircle, faBan, faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import { toast } from "sonner";

const Utilisateurs = () => {
    const { theme } = useColorScheme();

    // NOTE IMPORTANTE: J'ai ajouté 'deleteUser' ici. 
    // Vous devez l'ajouter au UserContext pour que la suppression fonctionne pour les utilisateurs standards.
    const {
        standardUserList,
        standardUserPagination, // Contient totalCount, page, hasNextPage, hasPreviousPage
        isLoadingStandardUsers,
        standardUserListError,
        listStandardUsers,
        updateUserRole, // Ajouté pour promouvoir/rétrograder un utilisateur
        // <--- Ligne à implémenter dans votre useUser/UserContext
        deleteUser, // La fonction pour supprimer un utilisateur standard (ROLE NONE)
        // La fonction deleteAdmin est uniquement pour les administrateurs.
    } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    
    // La taille de page est gérée par le backend dans l'API, nous n'avons besoin que du numéro de page.
    // useEffect pour charger les données lorsque la page change
    useEffect(() => {
        const fetchUsers = async () => {
            // Le hook s'occupe de la gestion du chargement et de l'erreur
            await listStandardUsers(currentPage);
        };
        fetchUsers();
    }, [currentPage]); // Dépendance essentielle: listStandardUsers, currentPage

    // useEffect pour afficher l'erreur
    useEffect(() => {
        if (standardUserListError) {
            toast.error(standardUserListError);
        }
    }, [standardUserListError]); // Dépendance essentielle: standardUserListError


    // Utilisation des données de pagination du hook
    const { totalCount, page, hasNextPage, hasPreviousPage } = standardUserPagination;
    const totalPages = Math.ceil(totalCount / (standardUserList.length / (page > 0 ? page : 1))) || 1; // Approximation si perPage n'est pas connue
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
    
    // #################################################
    // # NOUVELLE FONCTION DE SUPPRESSION (À IMPLÉMENTER)
    // #################################################
    const handleDeleteUser = async (userId, userName) => {
        // Validation que la fonction existe avant de continuer
        if (!deleteUser) {
            toast.error("Fonction de suppression d'utilisateur standard non implémentée dans le contexte.");
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
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Utilisation de la nouvelle fonction deleteUser (doit être ajoutée au hook)
                    const deletePromise = deleteUser(userId); 
                
                    await toast.promise(deletePromise, {
                        loading: `Suppression de ${userName}...`,
                        success: `L'utilisateur ${userName} a été supprimé avec succès !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    // Rafraîchir la liste après la suppression (revenir à la page 1 si la page actuelle est vide)
                    const newTotalCount = totalCount - 1;
                    const newPage = (newTotalCount > 0 && standardUserList.length === 1 && currentPage > 1) 
                        ? currentPage - 1 
                        : currentPage;

                    // Mettre à jour la page si elle a changé ou forcer le rafraîchissement
                    if (newPage !== currentPage) {
                        setCurrentPage(newPage);
                    } else {
                        // Forcer le rechargement si l'utilisateur supprimé est sur la page
                        await listStandardUsers(currentPage); 
                    }

                } catch (error) {
                    // Les erreurs sont déjà gérées par toast.promise
                }
            }
        });
    };

    // #################################################
    // # FONCTION POUR PROMOUVOIR L'UTILISATEUR EN CONDUCTEUR
    // #################################################
    const handlePromoteToDriver = async (userId, userName) => {
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée dans le contexte.");
            return;
        }

        Swal.fire({
            title: 'Confirmer la promotion ?',
            text: `Voulez-vous vraiment promouvoir ${userName} au rôle de CONDUCTEUR VÉRIFIÉ (DRIVER) ?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // Vert émeraude
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, Promouvoir !',
            cancelButtonText: 'Annuler',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const promotePromise = updateUserRole(userId, 'DRIVER'); // 'DRIVER' est le rôle cible
                    
                    await toast.promise(promotePromise, {
                        loading: `Promotion de ${userName} en conducteur...`,
                        success: `L'utilisateur ${userName} est maintenant un conducteur vérifié !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la promotion."}`,
                    });

                    // Rafraîchir la liste des utilisateurs standards pour retirer l'utilisateur promu
                    await listStandardUsers(currentPage); 

                } catch (error) {
                    // Les erreurs sont gérées par toast.promise
                }
            }
        });
    };

    const handleAddUser = () => {
        toast('Le formulaire pour ajouter un utilisateur de rôle NONE s\'ouvrira ici.', {
            icon: '👨‍👩‍👧‍👦',
            duration: 3000,
            position: 'top-right',
        });
    };

    // Fonction conservée mais inutilisée dans la table actuelle, enlever les colonnes inutiles pour la clarté.
    // const getStatusInfo = (isActivated) => {
    //     if (isActivated) {
    //         return { text: 'Actif', icon: faCheckCircle, classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    //     } else {
    //         return { text: 'Bloqué', icon: faBan, classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
    //     }
    // };

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
                            <table className={`w-full table-auto ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                <thead>
                                    <tr className={`uppercase text-sm font-semibold text-left ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
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
                                            return (
                                                <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                                                    <td className="py-4 px-4">{user.id}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2 font-medium">
                                                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                                                            {user.firstName} {user.lastName}
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
                        <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                            <div className="mb-2 sm:mb-0">
                                {/* Affichage basé sur la pagination réelle du backend, si totalCount est disponible */}
                                Affichage de {totalCount === 0 ? 0 : (page - 1) * currentListCount + 1} à {Math.min(totalCount, page * currentListCount)} sur {totalCount} utilisateurs.
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
                                <span className={`px-4 py-2 rounded-md font-bold ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
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