import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoad, faMapMarkerAlt, faCalendarAlt, faClock, faMoneyBillWave, faUserTie, faCar,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faHourglassHalf, faBan
} from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

import useColorScheme from '../../hooks/useColorScheme';
import useTrips from '../../hooks/useTrips';

// --- DataTable Theme Definitions (inchangé) ---
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
  const { trips, loading, error, fetchTrips, deleteTrip } = useTrips();

  const [totalRows, setTotalRows] = useState(0); 
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(4); // 4 = Scheduled (Prévu)

  // Fonction pour récupérer les trajets avec les paramètres de pagination
  const handleFetchTrips = async (page, status) => {
    try {
      const data = await fetchTrips({ pageIndex: page, status: status });
      if (data && data.totalCount !== undefined) {
        setTotalRows(data.totalCount);
      }
    } catch (error) {
      // L'erreur est déjà gérée par le contexte
    }
  };

  useEffect(() => {
    handleFetchTrips(currentPage, currentStatus);
  }, [currentPage, currentStatus]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };
   
  // Fonction de suppression mise à jour pour utiliser la bonne structure de données
  const handleDeleteTrip = (trip) => {
    const tripId = trip.trip.id;
    // Créez une "description" du trajet pour l'affichage dans la SweetAlert
    const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;

    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le trajet "${tripDescription}". Cette action est irréversible !`,
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
          await deleteTrip(tripId);
          // Recharger les trajets après la suppression
          handleFetchTrips(currentPage, currentStatus);
        } catch (error) {
          // L'erreur est gérée par le toast dans le contexte
        }
      }
    });
  };

  // --- Fonction pour ajouter un trajet (inchangée) ---
  const handleAddTrip = () => {
    toast('Un formulaire pour ajouter un nouveau trajet s\'ouvrira ici.', {
      icon: '🗺️',
      duration: 3000,
      position: 'top-right',
    });
  };

  // Les fonctions de modification et de vue détaillée peuvent être ajoutées ici de la même manière

  // Définition des colonnes mise à jour pour utiliser la nouvelle structure de données
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.trip.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Départ',
      selector: row => row.departureArea.homeTownName,
      sortable: true,
      wrap: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
          {row.departureArea.homeTownName}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Destination',
      selector: row => row.arrivalArea.homeTownName,
      sortable: true,
      wrap: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
          {row.arrivalArea.homeTownName}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Date',
      selector: row => row.trip.departureDate,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          {new Date(row.trip.departureDate).toLocaleDateString('fr-CM')}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Heure',
      selector: row => row.trip.departureDate,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
          {new Date(row.trip.departureDate).toLocaleTimeString('fr-CM', { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
      width: '100px',
    },
    {
      name: 'Prix',
      selector: row => row.trip.pricePerPlace,
      sortable: true,
      right: true,
      cell: row => (
        <span className="flex items-center gap-1 text-green-500 font-semibold">
          <FontAwesomeIcon icon={faMoneyBillWave} />
          {row.trip.pricePerPlace.toLocaleString('fr-CM')} FCFA
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Chauffeur',
      selector: row => `${row.driver.firstName} ${row.driver.lastName}`,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {`${row.driver.firstName} ${row.driver.lastName}`}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Véhicule',
      selector: row => `${row.vehicule.brand} ${row.vehicule.model}`,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {`${row.vehicule.brand} ${row.vehicule.model} (${row.vehicule.color})`}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Statut',
      selector: row => row.trip.status,
      sortable: true,
      cell: row => {
        const statusMap = {
          0: { text: 'Annulé', icon: faBan, classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
          1: { text: 'En attente', icon: faHourglassHalf, classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
          2: { text: 'En cours', icon: faHourglassHalf, classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
          3: { text: 'Terminé', icon: faCheckCircle, classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
          4: { text: 'Prévu', icon: faCalendarAlt, classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
        };
        const statusInfo = statusMap[row.trip.status] || { text: 'Inconnu', icon: faBan, classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.classes}`}>
            <FontAwesomeIcon icon={statusInfo.icon} />
            {statusInfo.text}
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
            onClick={() => toast(`Affichage des détails du trajet ${row.trip.id}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => toast(`Modification du trajet ${row.trip.id}...`, { icon: '✍️' })}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteTrip(row)}
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
  ], [handleDeleteTrip, theme]);

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
        {error ? (
          <div className="p-4 text-center text-red-500 dark:text-red-400">
            Une erreur est survenue lors du chargement des trajets : {error.message || 'Vérifiez la console pour plus de détails.'}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Trajets;