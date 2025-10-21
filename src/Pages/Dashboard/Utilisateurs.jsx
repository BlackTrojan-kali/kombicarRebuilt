import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faPhone, faArrowLeft, faArrowRight,
    faTrash, faUserPlus, faShieldHalved // faShieldHalved pour la promotion/vérification
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import { toast } from "sonner";

const Utilisateurs = () => {
    const { theme } = useColorScheme();

    const {
        standardUserList,
        standardUserPagination, 
        isLoadingStandardUsers,
        standardUserListError,
        listStandardUsers,
        updateUserRole, 
        deleteAdmin, // ✅ Assurez-vous que cette fonction est bien exportée par useUser/UserContext
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
    }, [currentPage]); // Dépendance: currentPage et listStandardUsers

    useEffect(() => {
        if (standardUserListError) {
            // Le toast s'affiche déjà dans listStandardUsers, mais peut être utile ici
            // si vous voulez une logique spécifique au composant.
            console.error("Erreur de la liste des utilisateurs standards:", standardUserListError);
        }
    }, [standardUserListError]); 

    // ===================================
    // PAGINATION
    // ===================================
    const { totalCount, page, hasNextPage, hasPreviousPage } = standardUserPagination;
    // La méthode de calcul "Math.min(totalCount, page * currentListCount)" suppose que 
    // l'API retourne le nombre d'éléments dans la page actuelle (currentListCount = standardUserList.length)
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

    /** Supprime un utilisateur standard (ROLE NONE). */
    const handleDeleteUser = (userId, userName) => { // La fonction n'est plus async ici
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
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) { // ✅ AJOUT DE LA VÉRIFICATION
                try {
                    // Utilisation de toast.promise pour le feedback utilisateur pendant l'attente
                    await toast.promise(deleteAdmin(userId), {
                        loading: `Suppression de ${userName} en cours...`,
                        success: `L'utilisateur ${userName} a été supprimé !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    // Logique de rafraîchissement: Si la dernière personne de la page est supprimée, on recule d'une page
                    const newTotalCount = totalCount - 1;
                    const newPage = (newTotalCount > 0 && standardUserList.length === 1 && currentPage > 1) 
                        ? currentPage - 1 
                        : currentPage;

                    if (newPage !== currentPage) {
                        setCurrentPage(newPage);
                    } else {
                        // Forcer le rechargement pour mettre à jour l'état local
                        await listStandardUsers(currentPage); 
                    }

                } catch (error) {
                    // Les erreurs sont gérées par toast.promise dans le contexte
                }
            }
        });
    };

    /** Proémet l'utilisateur au rôle de conducteur vérifié (DRIVER). */
    const handlePromoteToDriver = (userId, userName) => { // La fonction n'est plus async ici
        if (!updateUserRole) {
            toast.error("Fonction de mise à jour de rôle non implémentée dans le contexte.");
            return;
        }

        Swal.fire({
            title: 'Confirmer la promotion ?',
            text: `Voulez-vous vraiment promouvoir ${userName} au rôle de CONDUCTEUR VÉRIFIÉ (DRIVER) ? Il disparaîtra de cette liste.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10B981', 
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, Promouvoir !',
            cancelButtonText: 'Annuler',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const promotePromise = updateUserRole(userId, 'DRIVER'); // 'DRIVER' est le rôle cible
                    
                    // Ajout du toast.promise pour la promotion
                    await toast.promise(promotePromise, {
                        loading: `Promotion de ${userName} en conducteur...`,
                        success: `L'utilisateur ${userName} est maintenant un conducteur vérifié !`,
                        error: (err) => `Erreur: ${err.response?.data?.message || err.message || "Échec de la promotion."}`,
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
                                                            {/* Bouton pour promouvoir en conducteur vérifié */}
                                                            <button
                                                                onClick={() => handlePromoteToDriver(user.id, user.firstName)}
                                                                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                                                                title="Promouvoir au rôle de Conducteur (DRIVER)"
                                                            >
                                                                <FontAwesomeIcon icon={faShieldHalved} />
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
                        <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                            <div className="mb-2 sm:mb-0">
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