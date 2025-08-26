import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapPin, faClock,
  faEye, faEdit, faTrash, faUserPlus, faCheckCircle, faBan
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import useUser from '../../hooks/useUser'; // Importation du hook useUser

// --- Définition des Thèmes pour DataTable ---
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

const Utilisateurs = () => {
  const { theme } = useColorScheme();
  
  // Utilisation du hook useUser pour accéder au contexte
  const {
    standardUserList,
    standardUserPagination,
    isLoadingStandardUsers,
    standardUserListError,
    listStandardUsers,
    deleteAdmin
  } = useUser();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Effet pour charger les utilisateurs
  useEffect(() => {
    listStandardUsers(currentPage);
  }, [])//currentPage, listStandardUsers]);

  // Effet pour afficher les erreurs
  useEffect(() => {
    if (standardUserListError) {
      toast.error(standardUserListError);
    }
  }, [standardUserListError]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // --- Fonction de suppression avec SweetAlert2 ---
  const handleDeleteUser = async (userId, userName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer l'utilisateur ${userName}. Cette action est irréversible !`,
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
        // Appelez la fonction de suppression appropriée du contexte
        const deletePromise = deleteAdmin(userId);
        
        toast.promise(deletePromise, {
          loading: `Suppression de ${userName}...`,
          success: `L'utilisateur ${userName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
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

  // Définition des colonnes pour la table des utilisateurs
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom de l\'utilisateur',
      selector: row => `${row.firstName} ${row.lastName}`,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
          {row.firstName} {row.lastName}
        </span>
      ),
      minWidth: '180px',
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
      selector: row => row.phoneNumber,
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
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails de ${row.firstName}...`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => toast(`Modification de ${row.firstName}...`, { icon: '✍️' })}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id, row.firstName)}
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
  ], [handleDeleteUser]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Utilisateurs
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
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Utilisateurs Enregistrés</h2>
        <DataTable
          columns={columns}
          data={standardUserList}
          progressPending={isLoadingStandardUsers}
          pagination
          paginationServer
          paginationTotalRows={standardUserPagination.totalCount}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          pointerOnHover
          responsive
          theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun utilisateur à afficher.</div>}
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
    </div>
  );
};

export default Utilisateurs;