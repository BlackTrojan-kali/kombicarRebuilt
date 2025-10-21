import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserTie, faEnvelope, faPhone, faCalendarAlt, faKey, faEye, faEdit, faTrash, faUserPlus,
    faCheckCircle, faTimesCircle, faArrowLeft, faArrowRight, faCrown // Ajout de la couronne
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser';
import AdminFormModal from '../../Components/Modals/CreateAdminModal';

// --- MAPPING DES RÔLES ADMINISTRATIFS ---
// Basé sur la règle : 1 (admin) et 2 (super_admin)
const ROLE_MAPPING = {
    1: { name: 'Administrateur', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: faKey },
    2: { name: 'Super Administrateur', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: faCrown },
    default: { name: 'Rôle Inconnu', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400', icon: faKey }
};

const Admins = () => {
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';
    
    const { 
        adminList, 
        isLoadingAdmins, 
        listAdmins, 
        adminListError,
        addAdmin,
        deleteAdmin 
    } = useUser(); 

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
    const [adminToEdit, setAdminToEdit] = useState(null); 

    /**
     * Mappe la valeur numérique du rôle à l'objet de configuration défini dans ROLE_MAPPING.
     * @param {number} roleValue 
     * @returns {object}
     */
    const getRoleInfo = (roleValue) => {
        return ROLE_MAPPING[roleValue] || ROLE_MAPPING.default;
    };

    const handleFetchAdmins = async (page) => {
        try {
            const data = await listAdmins(page);
            if (data) {
                // S'assure de l'extraction correcte des données de pagination.
                // Si votre API utilise `totalElements`, utilisez-le. Sinon, `totalCount`.
                setTotalRows(data.totalCount || data.totalElements || adminList.length);
            }
        } catch (error) {
            // Le toast dans le contexte gère déjà l'erreur
        }
    };

    useEffect(() => {
        handleFetchAdmins(currentPage);
    }, [currentPage]); // Ajout de listAdmins dans les dépendances
    
    // ... (Logique de pagination et gestion des Modals inchangées)

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalRows / perPage)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    
    const handleAddAdmin = () => {
        setAdminToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleEditAdmin = (admin) => {
        setAdminToEdit(admin);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setAdminToEdit(null);
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer l'administrateur ${adminName}. Cette action est irréversible !`,
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
                    await toast.promise(deleteAdmin(adminId), {
                        loading: `Suppression de ${adminName} en cours...`,
                        success: `${adminName} a été supprimé !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    // Rafraîchir après la suppression
                    handleFetchAdmins(currentPage);
                } catch (error) {
                    // L'erreur est gérée par le toast dans la fonction `deleteAdmin` elle-même
                }
            }
        });
    };

    const handleSaveAdmin = async (adminData, isEditingMode) => {
        if (isEditingMode) {
            // Logique de modification
            const updatePromise = new Promise(async (resolve, reject) => {
                try {
                    // ATTENTION: Remplacez cette simulation par votre véritable appel API de modification
                    // await api.put(`/api/v1/users/admin/${adminData.id}`, adminData)
                    await new Promise(res => setTimeout(res, 1000)); 
                    resolve(`L'administrateur "${adminData.firstName} ${adminData.lastName}" a été mis à jour avec succès !`);
                } catch (error) {
                    reject(new Error(`Échec de la mise à jour de l'administrateur: ${error.message}`));
                }
            });
        
            toast.promise(updatePromise, {
                loading: `Mise à jour de ${adminData.firstName} ${adminData.lastName}...`,
                success: (message) => message,
                error: (err) => `Erreur : ${err.message}`,
            }).then(() => {
                handleFetchAdmins(currentPage);
            }).finally(() => {
                handleCloseFormModal();
            });

        } else {
            // Logique d'ajout, en utilisant la fonction du contexte
            try {
                // La fonction addAdmin doit retourner une promesse gérée par un toast interne ou ici
                await addAdmin(adminData);
                // Si l'ajout est réussi, rafraîchir la liste
                handleFetchAdmins(currentPage);
                handleCloseFormModal();
            } catch (error) {
                // L'erreur est gérée par la fonction `addAdmin` elle-même
            }
        }
    };

    const totalPages = Math.ceil(totalRows / perPage);
    
    // Pour l'affichage de la plage (par exemple, "1 à 10 sur 35")
    const startRange = Math.min(totalRows, (currentPage - 1) * perPage + 1);
    const endRange = Math.min(totalRows, currentPage * perPage);

    return (
        <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
            {/* Header et bouton d'ajout */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Gestion des Administrateurs
                </h1>
                <button
                    onClick={handleAddAdmin}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Ajouter un Admin
                </button>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Administrateurs du Système</h2>
                
                {/* Gestion de l'état (Chargement/Erreur) */}
                {isLoadingAdmins ? (
                    <div className="p-4 text-center text-blue-500 dark:text-blue-400">
                        Chargement des administrateurs...
                    </div>
                ) : adminListError ? (
                    <div className="p-4 text-center text-red-500 dark:text-red-400">
                        Une erreur est survenue lors du chargement des administrateurs : {adminListError}
                    </div>
                ) : (
                    <>
                        {/* Tableau des administrateurs */}
                        <div className="overflow-x-auto rounded-lg">
                            <table className={`w-full table-auto ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                <thead>
                                    <tr className={`uppercase text-sm font-semibold text-left ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        <th className="py-3 px-4 rounded-tl-lg">ID</th>
                                        <th className="py-3 px-4">Nom Complet</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Téléphone</th>
                                        <th className="py-3 px-4">Rôle</th> {/* CLÉ DE LA MISE À JOUR */}
                                        <th className="py-3 px-4">Statut</th>
                                        <th className="py-3 px-4">Dernière Connexion</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminList && adminList.length > 0 ? (
                                        adminList.map(admin => {
                                            const roleInfo = getRoleInfo(admin.role); // Utilisation du MAPPING
                                            const isActive = admin.isVerified;

                                            return (
                                                <tr key={admin.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} last:border-b-0`}>
                                                    <td className="py-4 px-4">{admin.id}</td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
                                                            {`${admin.firstName} ${admin.lastName}`}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                                            {admin.email}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                                            {admin.phoneNumber}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {/* Affichage du rôle basé sur le MAPPING */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleInfo.class}`}>
                                                            <FontAwesomeIcon icon={roleInfo.icon} className="mr-1" />
                                                            {roleInfo.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {/* Affichage du statut (inchangé) */}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                            <FontAwesomeIcon icon={isActive ? faCheckCircle : faTimesCircle} />
                                                            {isActive ? 'Vérifié' : 'Non Vérifié'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                                            {new Date(admin.lastLogin).toLocaleDateString('fr-CM')}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => toast(`Affichage des détails de ${admin.firstName} ${admin.lastName}`, { icon: 'ℹ️' })}
                                                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                                                title="Voir les détails"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditAdmin(admin)}
                                                                className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
                                                                title="Modifier"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAdmin(admin.id, `${admin.firstName} ${admin.lastName}`)}
                                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                                                                title="Supprimer"
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
                                            <td colSpan="8" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <FontAwesomeIcon icon={faUserTie} className="text-4xl mb-2" />
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
                                Affichage de {totalRows === 0 ? 0 : startRange} à {endRange} sur {totalRows} administrateurs.
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || isLoadingAdmins}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage === 1 || isLoadingAdmins ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Précédent
                                </button>
                                <span className={`px-4 py-2 rounded-md font-bold ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    Page {currentPage} sur {totalPages || 1}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages || isLoadingAdmins}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentPage >= totalPages || isLoadingAdmins ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    Suivant
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <AdminFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSaveAdmin={handleSaveAdmin}
                initialAdminData={adminToEdit} 
            />
        </div>
    );
};

export default Admins;