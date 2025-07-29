import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faCar, faIdCard, faStar,
  faEye, faEdit, faTrash, faUserPlus, faThumbsUp, faThumbsDown
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';


// --- Définition des Thèmes pour DataTable (ces définitions ne changent pas) ---
// Réitération: Idéalement, ces thèmes devraient être définis une seule fois globalement
// pour toute votre application, et non dans chaque composant utilisant DataTable.
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

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Simule une requête API pour récupérer les chauffeurs
  const fetchDrivers = async (page, size) => {
    setLoading(true);
    // Données fictives de chauffeurs
    const responseData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Chauffeur ${i + 1}`,
      email: `chauffeur${i + 1}@kombicar.com`,
      phone: `+237 6${(20000000 + i).toString().slice(0, 8)}`,
      vehicle: `Toyota Corolla N° ${100 + i}`,
      licenseNumber: `C${1234567 + i}`,
      rating: (Math.random() * (5 - 3) + 3).toFixed(1), // Note entre 3.0 et 5.0
      status: i % 3 === 0 ? 'Actif' : (i % 3 === 1 ? 'En pause' : 'Inactif'),
      registeredDate: `2024-01-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setDrivers(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchDrivers(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchDrivers(page, newPerPage);
  };

  // --- Fonction de suppression avec SweetAlert2 ---
  const handleDeleteDriver = async (driverId, driverName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le chauffeur ${driverName}. Cette action est irréversible !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626', // bg-red-600
      cancelButtonColor: '#6B7280', // bg-gray-500
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF', // Fond modal selon le thème
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937', // Couleur texte modal selon le thème
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Simuler l'appel API de suppression
        const deletePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% de chance de succès
            if (success) {
              setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== driverId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
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

  // --- Fonction pour ajouter un chauffeur (exemple avec hot-toast) ---
  const handleAddDriver = () => {
    toast('Un formulaire pour ajouter un nouveau chauffeur s\'ouvrira ici.', {
      icon: '🚗',
      duration: 3000,
      position: 'top-right',
    });
    // Ici, vous implémenteriez la logique pour ouvrir un formulaire d'ajout, etc.
  };

  // Définition des colonnes pour la table des chauffeurs
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom du Chauffeur',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {row.name}
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
      selector: row => row.phone,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
          {row.phone}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Véhicule',
      selector: row => row.vehicle,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {row.vehicle}
        </span>
      ),
      minWidth: '180px',
    },
    {
      name: 'Permis N°',
      selector: row => row.licenseNumber,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
          {row.licenseNumber}
        </span>
      ),
      minWidth: '140px',
    },
    {
      name: 'Note',
      selector: row => row.rating,
      sortable: true,
      right: true,
      cell: row => (
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          <FontAwesomeIcon icon={faStar} />
          {row.rating}
        </span>
      ),
      width: '100px',
    },
    {
      name: 'Statut',
      selector: row => row.status,
      sortable: true,
      cell: row => {
        let statusClasses = '';
        let statusIcon = null;
        if (row.status === 'Actif') {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = faThumbsUp;
        } else if (row.status === 'En pause') {
          statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          statusIcon = faCalendarAlt; // ou une autre icône pour "pause"
        } else { // Inactif
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = faThumbsDown;
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
            onClick={() => toast(`Affichage des détails de ${row.name}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => toast(`Modification de ${row.name}...`, { icon: '✍️' })}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteDriver(row.id, row.name)}
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
      {/* Toaster de react-hot-toast pour afficher les notifications */}
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
        <DataTable
          columns={columns}
          data={drivers}
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
      </div>
    </div>
  );
};

export default Drivers;