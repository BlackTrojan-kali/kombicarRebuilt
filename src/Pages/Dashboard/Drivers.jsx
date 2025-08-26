import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faCar, faIdCard, faStar,
  faEye, faEdit, faTrash, faUserPlus, faThumbsUp, faThumbsDown
} from '@fortawesome/free-solid-svg-icons';

// Importations personnalisées
import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser'; // Importez votre hook personnalisé

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Définitions des Thèmes pour DataTable
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

const Drivers = () => {
  const { theme } = useColorScheme();

  // Utilisez votre hook personnalisé pour accéder au contexte
  const { 
    conductorList, 
    conductorPagination, 
    isLoadingConductors, 
    listConductors, 
    conductorListError 
  } = useUser();

  const [perPage, setPerPage] = useState(10);

  // Charger les conducteurs au montage et à chaque changement de page/nombre par page
  useEffect(() => {
    // La fonction listConductors gère déjà la pagination, on l'appelle avec le bon numéro de page
    listConductors(conductorPagination.page);
  }, [])//listConductors, conductorPagination.page, perPage]);

  const handlePageChange = page => {
    // La fonction de pagination du contexte s'occupera de la logique
    listConductors(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    listConductors(page);
  };

  // --- Fonction de suppression avec SweetAlert2 (inchangée) ---
  const handleDeleteDriver = async (driverId, driverName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le chauffeur ${driverName}. Cette action est irréversible !`,
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
        // Logique de suppression ici (à implémenter en utilisant le contexte si disponible)
        // Note: Vous devrez ajouter une fonction `deleteConductor` à votre UserContext pour cela.
        // Pour l'instant, la simulation reste en place.
        const deletePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.2;
            if (success) {
              // Recharger la liste des conducteurs après la suppression
              listConductors(conductorPagination.page);
              resolve();
            } else {
              reject(new Error("Échec de la suppression du chauffeur."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression de ${driverName}...`,
          success: `Le chauffeur ${driverName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonction pour ajouter un chauffeur (inchangée) ---
  const handleAddDriver = () => {
    toast('Un formulaire pour ajouter un nouveau chauffeur s\'ouvrira ici.', {
      icon: '🚗',
      duration: 3000,
      position: 'top-right',
    });
  };

  // Définition des colonnes pour la table des chauffeurs
  const columns = useMemo(() => [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px', },
    {
      name: 'Nom du Chauffeur', selector: row => `${row.firstName} ${row.lastName}`, sortable: true, minWidth: '180px',
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      name: 'Email', selector: row => row.email, sortable: true, minWidth: '220px',
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
          {row.email}
        </span>
      ),
    },
    {
      name: 'Téléphone', selector: row => row.phoneNumber, sortable: true, minWidth: '150px',
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
          {row.phoneNumber}
        </span>
      ),
    },
    { name: 'Note', selector: row => row.note, sortable: true, right: true, width: '100px',
      cell: row => (
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          <FontAwesomeIcon icon={faStar} />
          {row.note}
        </span>
      ),
    },
    { name: 'Véhicule', selector: row => "À implémenter", sortable: false, minWidth: '180px',
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {/* L'API ne renvoie pas d'infos sur le véhicule, ce sera à implémenter */}
          N/A
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails de ${row.firstName}`, { icon: 'ℹ️' })}
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
            onClick={() => handleDeleteDriver(row.id, row.firstName)}
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
  ], [handleDeleteDriver]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Chauffeurs
        </h1>
        <button
          onClick={handleAddDriver}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Ajouter un Chauffeur
        </button>
      </div>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Chauffeurs Enregistrés</h2>
        {conductorListError ? (
          <div className="text-red-500 text-center p-4">
            Erreur lors du chargement des conducteurs: {conductorListError}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={conductorList}
            progressPending={isLoadingConductors}
            pagination
            paginationServer
            paginationTotalRows={conductorPagination.totalCount}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
            responsive
            theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
            noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun chauffeur à afficher.</div>}
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
        )}
      </div>
    </div>
  );
};

export default Drivers;