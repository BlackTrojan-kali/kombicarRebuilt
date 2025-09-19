import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faCar, faIdCard, faStar,
  faEye, faEdit, faTrash, faUserPlus, faThumbsUp, faThumbsDown, faCarSide, faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { toast } from "sonner";

// Importations personnalisées
import useColorScheme from '../../hooks/useColorScheme';
import useUser from '../../hooks/useUser'; // Importez votre hook personnalisé

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';

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

  // Utilisation des données pour les conducteurs VERIFIÉS
  const { 
    verifiedConductorList,
    verifiedConductorPagination,
    isLoadingVerifiedConductors,
    listVerifiedConductors,
    verifiedConductorListError,
    deleteUser // Supposons que vous ayez une fonction de suppression
  } = useUser();

  const [perPage, setPerPage] = useState(10);

  // Charger les conducteurs vérifiés au montage
  useEffect(() => {
    listVerifiedConductors(verifiedConductorPagination.page || 1);
  }, [verifiedConductorPagination.page]);

  const handlePageChange = page => {
    listVerifiedConductors(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    listVerifiedConductors(page);
  };

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
        try {
          await deleteUser(driverId);
          toast.success(`Le chauffeur ${driverName} a été supprimé avec succès !`);
          listVerifiedConductors(verifiedConductorPagination.page);
        } catch (error) {
          toast.error("Échec de la suppression du chauffeur.");
        }
      }
    });
  };

  const handleAddDriver = () => {
    toast('Un formulaire pour ajouter un nouveau chauffeur s\'ouvrira ici.', {
      icon: '🚗',
      duration: 3000,
      position: 'top-right',
    });
  };

  const columns = useMemo(() => [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px', },
    {
      name: 'Nom du Chauffeur', selector: row => `${row.firstName} ${row.lastName}`, sortable: true, minWidth: '180px',
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          <Link to={`/admin/users/details/${row.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {row.firstName} {row.lastName}
          </Link>
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
    {
      name: 'Statut du Permis',
      selector: row => row.licenceDriving.verificationState,
      sortable: true,
      cell: row => {
        let statusClasses = '';
        let statusIcon = null;
        let statusText = '';
        switch (row.licenceDriving?.verificationState) {
          case 0:
            statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            statusIcon = faTachometerAlt;
            statusText = 'En attente';
            break;
          case 1:
            statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            statusIcon = faThumbsUp;
            statusText = 'Vérifié';
            break;
          case 2:
            statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            statusIcon = faThumbsDown;
            statusText = 'Rejeté';
            break;
          default:
            statusClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            statusIcon = faIdCard;
            statusText = 'Non soumis';
            break;
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
            <FontAwesomeIcon icon={statusIcon} />
            {statusText}
          </span>
        );
      },
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
            onClick={() => handleDeleteDriver(row.id, `${row.firstName} ${row.lastName}`)}
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
        {verifiedConductorListError ? (
          <div className="text-red-500 text-center p-4">
            Erreur lors du chargement des conducteurs: {verifiedConductorListError}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={verifiedConductorList}
            progressPending={isLoadingVerifiedConductors}
            pagination
            paginationServer
            paginationTotalRows={verifiedConductorPagination.totalCount}
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