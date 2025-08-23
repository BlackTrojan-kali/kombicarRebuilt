import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoad, faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faCar,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faHourglassHalf, faBan
} from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Importation de vos hooks et du contexte
import useColorScheme from '../../hooks/useColorScheme';
import useTrips from '../../hooks/useTrips'; // Assurez-vous que le chemin est correct

// --- DataTable Theme Definitions ---
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


const Trajets = () => {
  const { theme } = useColorScheme();
  
  // Utilisation du hook useTrips pour accéder au contexte
  const { trips, loading, error, fetchTrips, deleteTrip } = useTrips();

  const [totalRows, setTotalRows] = useState(0); // Nous n'avons pas de totalRows de l'API ici, donc nous le gérons localement
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(4); // Supposons un statut par défaut pour les trajets "prévus"

  // Effet pour récupérer les trajets au chargement du composant ou lorsque la pagination/statut change
  useEffect(() => {
    fetchTrips({ pageIndex: currentPage, status: currentStatus });
  }, [])//currentPage, perPage, currentStatus, fetchTrips]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // --- Delete function with SweetAlert2 ---
  const handleDeleteTrip = (tripId, tripName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le trajet "${tripName}". Cette action est irréversible !`,
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
        // Appel de la fonction de suppression du contexte
        const success = await deleteTrip(tripId);
        if (success) {
          // Si la suppression API réussit, toast.promise est géré dans le contexte
          // Pas besoin de refaire un toast ici, le contexte s'en charge.
        }
      }
    });
  };

  // --- Function to add a trip (example with hot-toast) ---
  const handleAddTrip = () => {
    toast('Un formulaire pour ajouter un nouveau trajet s\'ouvrira ici.', {
      icon: '🗺️',
      duration: 3000,
      position: 'top-right',
    });
  };

  // Define columns for the trips table
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom du Trajet',
      selector: row => row.name,
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Départ',
      selector: row => row.departure,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
          {row.departure}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Destination',
      selector: row => row.destination,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
          {row.destination}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Date',
      selector: row => row.date,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          {new Date(row.date).toLocaleDateString('fr-CM')}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Heure',
      selector: row => row.time,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
          {row.time}
        </span>
      ),
      width: '100px',
    },
    {
      name: 'Prix',
      selector: row => row.price,
      sortable: true,
      right: true,
      cell: row => (
        <span className="flex items-center gap-1 text-green-500 font-semibold">
          <FontAwesomeIcon icon={faMoneyBillWave} />
          {row.price} FCFA
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Chauffeur',
      selector: row => row.driver,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {row.driver}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Véhicule',
      selector: row => row.vehicle,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {row.vehicle}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Statut',
      selector: row => row.status,
      sortable: true,
      cell: row => {
        let statusClasses = '';
        let statusIcon = null;
        if (row.status === 'Prévu') {
          statusClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          statusIcon = faCalendarAlt;
        } else if (row.status === 'En cours') {
          statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          statusIcon = faHourglassHalf;
        } else if (row.status === 'Terminé') {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = faCheckCircle;
        } else { // Annulé
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = faBan;
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
            <FontAwesomeIcon icon={statusIcon} />
            {row.status}
          </span>
        );
      },
      minWidth: '120px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails du trajet ${row.id}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => toast(`Modification du trajet ${row.id}...`, { icon: '✍️' })}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteTrip(row.id, row.name)}
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
  ], [handleDeleteTrip]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Trajets
        </h1>
        <button
          onClick={handleAddTrip}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter un Trajet
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Trajets Enregistrés</h2>
        <DataTable
          columns={columns}
          data={trips}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows} // Cette valeur devra être mise à jour par l'API dans une version ultérieure
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          pointerOnHover
          responsive
          theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun trajet à afficher.</div>}
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

export default Trajets;