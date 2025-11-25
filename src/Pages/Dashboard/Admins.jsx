import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserTie, faEnvelope, faPhone, faCalendarAlt, faKey, faEye, faTrash, faUserPlus,
    faCheckCircle, faTimesCircle, faArrowLeft, faArrowRight, faCrown, faUserShield
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

// Importations des Hooks et Contextes
import useColorScheme from '../../hooks/useColorScheme';
import { useUserAdminContext } from '../../contexts/Admin/UsersAdminContext'; // Utilisation du hook exporté du contexte
import { useRole } from '../../contexts/Admin/RoleContext';
import AdminFormModal from '../../Components/Modals/CreateAdminModal';


// --- MAPPING DES RÔLES ADMINISTRATIFS ---
const ROLE_MAPPING = {
    1: { name: 'Administrateur', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: faKey },
    2: { name: 'Super Administrateur', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: faCrown },
    default: { name: 'Rôle Inconnu', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400', icon: faKey }
};

const ROLES = {
    NONE: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2,
    DRIVER: 3,
};

const Admins = () => {
    const { theme } = useColorScheme();
    const isDark = theme === 'dark';
    
    // Rôles context (inchangé)
    const { roles, getRoles } = useRole();

    // Récupération des données et fonctions du contexte `UsersAdminContext`
    const { 
        userList: adminList, // Renommé `userList` en `adminList` pour la clarté locale
        isLoading, 
        listAdmins, 
        error: adminListError,
        pagination, // Récupération de l'objet de pagination
        updateUserRoleAsSuperAdmin, // Fonction de mise à jour du rôle
        addAdminUser: addAdmin, // Fonction d'ajout d'administrateur
        deleteUserAsAdmin: deleteAdmin // Fonction de suppression d'utilisateur
    } = useUserAdminContext(); 
    
    // États locaux
    const [currentPage, setCurrentPage] = useState(1);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
    const [adminToEdit, setAdminToEdit] = useState(null); 

    // ATTENTION: La taille par page (perPage) est souvent gérée par l'API. 
    // Ici, nous la laissons à 10 pour l'affichage de la plage, mais l'API devrait la fournir.
    const perPage = 10; 

    // Mappe la valeur numérique du rôle
    const getRoleInfo = (roleValue) => {
        return ROLE_MAPPING[roleValue] || ROLE_MAPPING.default;
    };

    /**
     * Charge les administrateurs pour la page spécifiée.
     * Utilise listAdmins du contexte qui met à jour l'état global.
     */
    const handleFetchAdmins = async (page) => {
        try {
            // listAdmins met à jour les états 'userList' et 'pagination' dans le contexte
            await listAdmins(page);
        } catch (error) {
            // L'erreur est déjà gérée par le toast dans le contexte.
            // On peut logger ici si besoin.
            console.log("Échec du fetch admin dans le composant", error);
        }
    };

    // Charger les administrateurs au montage et au changement de page
    useEffect(() => {
        handleFetchAdmins(currentPage);
    }, [currentPage]); 

    // Charger la liste des rôles pour le modal
    useEffect(() => {
        getRoles(1); // Page 1 ou autre paramètre de pagination si nécessaire
    }, []); // Dépendances ajustées : `roles` n'est pas nécessaire si on ne veut pas relancer le fetch quand les rôles changent

    // Logique de navigation
    const totalRows = pagination.totalCount || 0;
    const totalPages = Math.ceil(totalRows / perPage);

    const handleNextPage = () => {
        // La condition est basée sur l'objet pagination du contexte
        if (pagination.hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        // La condition est basée sur l'objet pagination du contexte
        if (pagination.hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    };
    
    const handleAddAdmin = () => {
        setAdminToEdit(null);
        setIsFormModalOpen(true);
    };

    // ATTENTION: L'édition n'est pas implémentée dans votre contexte API actuel (seulement `addAdminUser` et `updateUserRoleAsSuperAdmin`)
    const handleEditAdmin = (admin) => {
        // Pour l'instant, on n'ouvre que le formulaire avec les données
        setAdminToEdit(admin);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setAdminToEdit(null);
    };

    // Changer le rôle avec 2 selects (Utilise updateUserRoleAsSuperAdmin du contexte)
    const handleChangeRole = (userId, userName, currentRole) => {
        if (!roles || roles.length === 0) {
            toast.error("La liste des rôles n'est pas chargée.");
            return;
        }
    
        const html = `
            <div class="flex flex-col gap-2">
                <label>Rôle interne (Numérique) :</label>
                <select id="internalRole" class="swal2-input">
                ${Object.entries(ROLES)
                    .map(
                        ([key, value]) =>
                            `<option value="${value}" ${
                            currentRole === value ? "selected" : ""
                            }>${key}</option>`
                    )
                    .join("")}
                </select>
        
                <label>Rôle enregistré (ID) :</label>
                <select id="externalRole" class="swal2-input">
                ${roles
                    .map((r) => `<option value="${r.id}">${r.name.toUpperCase()}</option>`)
                    .join("")}
                </select>
            </div>
        `;
    
        Swal.fire({
            title: `Modifier le rôle de ${userName}`,
            html,
            showCancelButton: true,
            confirmButtonText: "Confirmer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#2563EB",
            background: isDark ? "#1F2937" : "#FFFFFF",
            color: isDark ? "#F9FAFB" : "#1F2937",
            preConfirm: () => {
                const internal = parseInt(
                    Swal.getPopup().querySelector("#internalRole").value
                );
                const external =
                    Swal.getPopup().querySelector("#externalRole").value
                ;
                if (internal === null || external === null) {
                    Swal.showValidationMessage("Vous devez choisir les deux rôles.");
                }
                return { internal, external };
            },
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const { internal, external } = result.value;
                try {
                    // Utilisation de updateUserRoleAsSuperAdmin du contexte
                    await toast.promise(updateUserRoleAsSuperAdmin(userId, internal, external), {
                        loading: `Mise à jour du rôle de ${userName}...`,
                        success: `Le rôle de ${userName} a été changé.`,
                        error: (err) => `Échec de la mise à jour du rôle : ${err.message}`,
                    });
                    // Rafraîchir la liste des administrateurs après la mise à jour
                    await handleFetchAdmins(currentPage); 
                } catch (err) {
                    console.error("Erreur lors du changement de rôle :", err);
                }
            }
        });
    };
    
    // Supprimer l'administrateur (utilise deleteUserAsAdmin du contexte)
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
                    // Utilisation de deleteUserAsAdmin du contexte
                    await toast.promise(deleteAdmin(adminId), {
                        loading: `Suppression de ${adminName} en cours...`,
                        success: `${adminName} a été supprimé !`,
                        error: (err) => `Erreur: ${err.message || "Échec de la suppression."}`,
                    });
                    
                    // Rafraîchir après la suppression
                    // Note: Le contexte filtre déjà localement après la suppression réussie,
                    // mais un rafraîchissement complet est plus sûr pour la pagination.
                    handleFetchAdmins(currentPage);
                } catch (error) {
                    // L'erreur est gérée par le toast du contexte/promise
                }
            }
        });
    };

    // Gérer l'ajout/modification
    const handleSaveAdmin = async (adminData, isEditingMode) => {
        if (isEditingMode) {
            // Logique de MODIFICATION (si vous avez un endpoint UPDATE spécifique pour l'admin)
            // *** NOTE: Votre contexte actuel ne contient pas de fonction de MODIFICATION complète, 
            // *** je garde donc votre simulation, mais utilisez la fonction API réelle ici.
            const updatePromise = new Promise(async (resolve, reject) => {
                 try {
                     // Remplacer par votre fonction API de mise à jour complète
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
            // Logique d'AJOUT, en utilisant la fonction addAdminUser du contexte
            try {
                await addAdmin(adminData); // Le toast est géré dans le contexte
                handleFetchAdmins(currentPage); // Rafraîchir
                handleCloseFormModal();
            } catch (error) {
                // L'erreur est déjà gérée par la fonction `addAdmin`
            }
        }
    };
    
    // Pour l'affichage de la plage (par exemple, "1 à 10 sur 35")
    const startRange = Math.min(totalRows, (currentPage - 1) * perPage + 1);
    const endRange = Math.min(totalRows, currentPage * perPage);

    return (
        <div className='pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full'>
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
                {isLoading ? ( // Utilisation de l'état `isLoading` du contexte
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
                                        <th className="py-3 px-4">Rôle</th>
                                        <th className="py-3 px-4">Statut</th>
                                        <th className="py-3 px-4">Dernière Connexion</th>
                                        <th className="py-3 px-4 text-center rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminList && adminList.length > 0 ? (
                                        adminList.map(admin => {
                                            const roleInfo = getRoleInfo(admin.role);
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
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleInfo.class}`}>
                                                            <FontAwesomeIcon icon={roleInfo.icon} className="mr-1" />
                                                            {roleInfo.name}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
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
                                                                onClick={() =>
                                                                    handleChangeRole(admin.id, `${admin.firstName} ${admin.lastName}`, admin.role)
                                                                }
                                                                className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors" // Changé au jaune pour le rôle
                                                                title="Changer le rôle"
                                                            >
                                                                <FontAwesomeIcon icon={faUserShield} />
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
                                    disabled={!pagination.hasPreviousPage || isLoading}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!pagination.hasPreviousPage || isLoading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                    Précédent
                                </button>
                                <span className={`px-4 py-2 rounded-md font-bold ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    Page {currentPage} sur {totalPages || 1}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!pagination.hasNextPage || isLoading}
                                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${!pagination.hasNextPage || isLoading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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