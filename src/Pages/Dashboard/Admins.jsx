import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faKey, faEye, faEdit, faTrash, faUserPlus,
  faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// 1. IMPORT DES HOOKS ET DU CONTEXTE
import useColorScheme from '../../hooks/useColorScheme';
// ⚠️ ASSUMER QUE CE HOOK EST useUser, sinon changez le nom ici !
import useUser from '../../hooks/useUser'; 

// Importez votre composant AdminFormModal
import AdminFormModal from '../../Components/Modals/CreateAdminModal'; 

// --- Définition des Thèmes pour DataTable (inchangé) ---
createTheme('lightTheme', {
  text: { primary: '#1F2937', secondary: '#4B5563', },
  background: { default: '#FFFFFF', },
  context: { background: '#E2E8F0', text: '#1F2937', },
  divider: { default: '#D1D5DB', },
  button: { default: '#3B82F6', hover: '#2563EB', focus: '#1D4ED8', disabled: '#9CA3AF', },
  highlightOnHover: { default: '#F3F4F6', text: '#1F2937', },
}, 'light');

createTheme('darkTheme', {
  text: { primary: '#F9FAFB', secondary: '#D1D5DB', },
  background: { default: '#1F2937', },
  context: { background: '#374151', text: '#F9FAFB', },
  divider: { default: '#4B5563', },
  button: { default: '#3B82F6', hover: '#60A5FA', focus: '#2563EB', disabled: '#6B7280', },
  highlightOnHover: { default: '#374151', text: '#F9FAFB', },
}, 'dark');


const Admins = () => {
  const { theme } = useColorScheme();
  
  // 2. UTILISATION DU CONTEXTE POUR LES DONNÉES ET LES FONCTIONS
  const { 
    adminList, 
    isLoadingAdmins, 
    listAdmins, 
    adminPagination 
  } = useUser(); // Récupère les données et la fonction du contexte

  // Les états locaux persistent pour la gestion de la table et des modales
  const [perPage, setPerPage] = useState(10); // Reste local pour la logique de la table
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  const [adminToEdit, setAdminToEdit] = useState(null); 

  
  // 3. REMPLACEMENT DE fetchAdmins PAR listAdmins DU CONTEXTE
  const handleFetch = async (page, size) => {
    try {
        // Appelle la fonction du contexte pour charger les données de la page spécifiée
        // Note: L'état de chargement (isLoadingAdmins) et la liste (adminList) 
        // sont gérés à l'intérieur du UserContextProvider
        await listAdmins(page);
    } catch (error) {
        // Le toast est déjà géré par listAdmins, mais vous pouvez ajouter un log ici
        console.error("Erreur lors du chargement des administrateurs:", error);
    }
    // Note: setTotalRows n'est plus nécessaire ici car on utilise adminPagination.totalCount
  };

  useEffect(() => {
    // Le chargement initial se fait avec la taille par défaut
    handleFetch(1, perPage);
  }, [perPage]); // Dépend de perPage pour recharger la première page si la taille change

  const handlePageChange = page => {
    // La fonction listAdmins attend le numéro de page
    handleFetch(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    // On appelle handleFetch qui appellera listAdmins avec la nouvelle taille et la page actuelle
    handleFetch(page, newPerPage); 
  };
  
  // --- Fonction de suppression (inchangée, mais à adapter si l'API est nécessaire) ---
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
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deletePromise = new Promise((resolve, reject) => {
          // ⚠️ REMPLACER PAR VOTRE VRAI APPEL API DE SUPPRESSION
          setTimeout(() => {
            const success = Math.random() > 0.2;
            if (success) {
              // Après succès API : recharger la liste ou supprimer du state local
              // Ici, on recharge la page actuelle après suppression pour rafraîchir les données
              listAdmins(adminPagination.currentPage || 1); 
              resolve();
            } else {
              reject(new Error("Échec de la suppression de l'administrateur."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression de ${adminName}...`,
          success: `L'administrateur ${adminName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonctions de modal (inchangées) ---
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

  // --- Fonction pour gérer la CRÉATION ou la MODIFICATION (à adapter pour le contexte) ---
  const handleSaveAdmin = (adminData, isEditingMode) => {
    // ⚠️ C'est ici que vous feriez l'appel API réel
    console.log("Données de l'administrateur à sauvegarder :", adminData, "Mode édition :", isEditingMode);

    const savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
            // Après succès API : Recharger la page actuelle pour inclure la nouvelle donnée
            listAdmins(adminPagination.currentPage || 1); 
            resolve(`L'administrateur "${adminData.firstName} ${adminData.lastName}" a été ${isEditingMode ? 'mis à jour' : 'ajouté'} avec succès !`);
        } else {
            reject(new Error(`Échec de ${isEditingMode ? 'la mise à jour' : "l'ajout"} de l'administrateur.`));
        }
      }, 1000);
    });

    toast.promise(savePromise, {
      loading: isEditingMode ? `Mise à jour de ${adminData.firstName} ${adminData.lastName}...` : `Ajout de ${adminData.firstName} ${adminData.lastName}...`,
      success: (message) => message,
      error: (err) => `Erreur : ${err.message}`,
    });
    
    handleCloseFormModal(); // Fermer la modal après l'opération (indépendamment du succès)
  };


  // Définition des colonnes (inchangée)
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom Complet',
      // IMPORTANT: Utilisez row.firstName et row.lastName, car l'API fournit 'items' avec ces propriétés.
      selector: row => `${row.firstName} ${row.lastName}`,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {`${row.firstName} ${row.lastName}`}
        </span>
      ),
      minWidth: '200px',
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
          {row.email}
        </span>
      ),
      minWidth: '220px',
    },
    {
      name: 'Téléphone',
      selector: row => row.phoneNumber, // Utiliser phoneNumber si c'est le nom de la clé API
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
          {row.phoneNumber}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Rôle',
      selector: row => row.role,
      sortable: true,
      cell: row => {
          // Affichage basé sur la valeur 'role' (qui est 0 ou autre selon votre API)
          const roleText = row.role === 0 ? 'Admin Régulier' : 'Super Admin';
          const roleClass = row.role === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleClass}`}>
              <FontAwesomeIcon icon={faKey} className="mr-1" />
              {roleText}
            </span>
          );
      },
      minWidth: '120px',
    },
    {
      name: 'Statut', 
      selector: row => row.isEmailVerified, // Supposition: utiliser isEmailVerified comme statut actif
      sortable: true,
      cell: row => {
          const isActive = row.isEmailVerified; // Ajustez la logique si 'isActive' est une autre propriété
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
              <FontAwesomeIcon icon={isActive ? faCheckCircle : faTimesCircle} />
              {isActive ? 'Vérifié' : 'Non Vérifié'} {/* Ou 'Actif' / 'Inactif' */}
            </span>
          );
      },
      width: '120px',
    },
    {
      name: 'Dernière Connexion',
      selector: row => row.lastLogin,
      sortable: true,
      format: row => new Date(row.lastLogin).toLocaleDateString('fr-CM'),
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          {new Date(row.lastLogin).toLocaleDateString('fr-CM')}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails de ${row.firstName} ${row.lastName}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditAdmin(row)} 
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteAdmin(row.id, `${row.firstName} ${row.lastName}`)}
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            title="Supprimer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    },
  ], [handleDeleteAdmin, handleEditAdmin, theme]); 

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

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
        <DataTable
          columns={columns}
          // 4. UTILISATION DE LA LISTE DU CONTEXTE
          data={adminList}
          // 5. UTILISATION DE L'ÉTAT DE CHARGEMENT DU CONTEXTE
          progressPending={isLoadingAdmins}
          pagination
          paginationServer
          // 6. UTILISATION DU TOTAL DE LIGNES DU CONTEXTE
          paginationTotalRows={adminPagination?.totalCount}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          pointerOnHover
          responsive
          theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun administrateur à afficher.</div>}
          customStyles={{
            headCells: {
              style: {
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB',
                color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
              },
            },
            cells: {
              style: {
                paddingTop: '8px',
                paddingBottom: '8px',
              },
            },
          }}
        />
      </div>

      {/* Intégration de AdminFormModal */}
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