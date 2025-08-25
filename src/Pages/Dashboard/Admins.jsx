import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faKey, faEye, faEdit, faTrash, faUserPlus,
  faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser';
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
}, 'dark');

const Admins = () => {
  const { theme } = useColorScheme();
  
  // Importer les fonctions du contexte, y compris deleteAdmin
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

  const handleFetchAdmins = async (page) => {
    try {
        const data = await listAdmins(page);
        if (data) {
            setTotalRows(data.totalCount);
        }
    } catch (error) {
        // Le toast dans le contexte gère déjà l'erreur
    }
  };

  useEffect(() => {
    handleFetchAdmins(currentPage);
  }, [currentPage]); 

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
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

  // Mise à jour de handleDeleteAdmin pour utiliser la fonction du contexte
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
        try {
          await deleteAdmin(adminId);
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
          // Votre appel API de modification ici
          // await api.put(...)
          await new Promise(res => setTimeout(res, 1000));
          resolve(`L'administrateur "${adminData.firstName} ${adminData.lastName}" a été mis à jour avec succès !`);
        } catch (error) {
          reject(new Error(`Échec de la mise à jour de l'administrateur.`));
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
        await addAdmin(adminData);
        handleFetchAdmins(currentPage);
        handleCloseFormModal();
      } catch (error) {
        // Le toast d'erreur est géré par la fonction `addAdmin` elle-même
      }
    }
  };

  const columns = useMemo(() => [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px', },
    { name: 'Nom Complet', selector: row => `${row.firstName} ${row.lastName}`, sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {`${row.firstName} ${row.lastName}`}
        </span>
      ), minWidth: '200px',
    },
    { name: 'Email', selector: row => row.email, sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
          {row.email}
        </span>
      ), minWidth: '220px',
    },
    { name: 'Téléphone', selector: row => row.phoneNumber, sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
          {row.phoneNumber}
        </span>
      ), minWidth: '150px',
    },
    { name: 'Rôle', selector: row => row.role, sortable: true,
      cell: row => {
          const roleText = row.role === 0 ? 'Admin Régulier' : 'Super Admin';
          const roleClass = row.role === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleClass}`}>
              <FontAwesomeIcon icon={faKey} className="mr-1" />
              {roleText}
            </span>
          );
      }, minWidth: '120px',
    },
    { name: 'Statut', selector: row => row.isEmailVerified, sortable: true,
      cell: row => {
          const isActive = row.isEmailVerified;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
              <FontAwesomeIcon icon={isActive ? faCheckCircle : faTimesCircle} />
              {isActive ? 'Vérifié' : 'Non Vérifié'}
            </span>
          );
      }, width: '120px',
    },
    { name: 'Dernière Connexion', selector: row => row.lastLogin, sortable: true,
      format: row => new Date(row.lastLogin).toLocaleDateString('fr-CM'),
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          {new Date(row.lastLogin).toLocaleDateString('fr-CM')}
        </span>
      ), minWidth: '150px',
    },
    { name: 'Actions', cell: row => (
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
      ), ignoreRowClick: true, allowOverflow: true, button: true, width: '180px',
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
        {adminListError ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            {adminListError}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={adminList}
            progressPending={isLoadingAdmins}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
            responsive
            theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
            noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun administrateur à afficher.</div>}
            customStyles={{
              headCells: { style: { fontWeight: 'bold', fontSize: '14px', backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB', color: theme === 'dark' ? '#D1D5DB' : '#4B5563', }, },
              cells: { style: { paddingTop: '8px', paddingBottom: '8px', }, },
            }}
          />
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