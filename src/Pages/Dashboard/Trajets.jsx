import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoad, faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faCar,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faHourglassHalf, faBan
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Make sure the path is correct

// Imports for SweetAlert2 and React Hot Toast
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';


// --- DataTable Theme Definitions ---
// As mentioned before, ideally these themes should be defined once globally
// in your application if you use them in multiple tables.
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

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Simulate API call to fetch trips
  const fetchTrips = async (page, size) => {
    setLoading(true);
    // Fictitious trip data
    const responseData = Array.from({ length: 150 }, (_, i) => ({
      id: i + 1,
      name: `Trajet ${i + 1}: Ville ${String.fromCharCode(65 + (i % 5))} - Ville ${String.fromCharCode(65 + ((i + 3) % 5))}`,
      departure: `Ville ${String.fromCharCode(65 + (i % 5))}`,
      destination: `Ville ${String.fromCharCode(65 + ((i + 3) % 5))}`,
      date: `2025-07-${(i % 30) + 1 < 10 ? '0' : ''}${(i % 30) + 1}`,
      time: `${9 + (i % 12)}:${(i % 60) < 10 ? '0' : ''}${(i % 60)}`,
      price: (5000 + (i * 50)).toLocaleString('fr-CM'), // Format as FCFA here for simplicity in data
      driver: `Chauffeur ${Math.floor(Math.random() * 10) + 1}`,
      vehicle: `Véhicule ${Math.floor(Math.random() * 20) + 1}`,
      status: i % 4 === 0 ? 'Prévu' : (i % 4 === 1 ? 'En cours' : (i % 4 === 2 ? 'Terminé' : 'Annulé')),
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setTrips(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchTrips(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchTrips(page, newPerPage);
  };

  // --- Delete function with SweetAlert2 ---
  const handleDeleteTrip = async (tripId, tripName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le trajet "${tripName}". Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626', // bg-red-600
      cancelButtonColor: '#6B7280', // bg-gray-500
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Simulate API call for deletion
        const deletePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% chance of success
            if (success) {
              setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression du trajet."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression du trajet "${tripName}"...`,
          success: `Le trajet "${tripName}" a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Function to add a trip (example with hot-toast) ---
  const handleAddTrip = () => {
    toast('Un formulaire pour ajouter un nouveau trajet s\'ouvrira ici.', {
      icon: '🗺️', // Emoji icon for a trip
      duration: 3000,
      position: 'top-right',
    });
    // Here, you would implement the logic to open an add form, etc.
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
      {/* React Hot Toast Toaster component for notifications */}
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
          paginationTotalRows={totalRows}
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