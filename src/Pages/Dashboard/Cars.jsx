import React, { useState, useEffect, useMemo, useContext } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faBuilding, faCalendarAlt, faGasPump, faCog, faListAlt,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faTimesCircle, faCarSide,
  faPalette, faUser, faIdCard
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

import CarFormModal from '../../Components/Modals/CreateCarModal';
import useCars from '../../hooks/useCar';

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


const Cars = () => {
  const { theme } = useColorScheme();
   
  const { 
    adminCars, 
    adminCarPagination,
    isLoadingAdminCars,
    adminCarListError,
    fetchAdminCars,
    deleteCar, 
    createCar, 
    updateCar,
    updateVehicleVerificationState
  } = useCars();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // L'API ne gère pas perPage pour le moment, mais on garde l'état

  // Charge les véhicules de l'admin au montage et au changement de page
  useEffect(() => {
    fetchAdminCars(currentPage);
  }, [])//currentPage, fetchAdminCars]);

  useEffect(() => {
    if (adminCarListError) {
      toast.error(adminCarListError);
    }
  }, [])//adminCarListError]);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleDeleteVehicle = (vehicleId, vehicleBrand, vehicleModel) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le véhicule "${vehicleBrand} ${vehicleModel}". Cette action est irréversible !`,
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
        const success = await deleteCar(vehicleId);
        if (success) {
          toast.success(`Le véhicule "${vehicleBrand} ${vehicleModel}" a été supprimé avec succès !`);
        } else {
          toast.error(`Échec de la suppression du véhicule "${vehicleBrand} ${vehicleModel}".`);
        }
      }
    });
  };

  const handleToggleVerification = (vehicle) => {
    const newVerificationState = !vehicle.isVerified;
    const confirmText = newVerificationState 
      ? `Êtes-vous sûr de vouloir vérifier ce véhicule ?`
      : `Êtes-vous sûr de vouloir annuler la vérification de ce véhicule ?`;

    Swal.fire({
      title: 'Confirmer la vérification',
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newVerificationState ? '#22C55E' : '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, continuer !',
      cancelButtonText: 'Annuler',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateVehicleVerificationState(vehicle.id, newVerificationState);
      }
    });
  };

  const handleAddVehicle = () => {
    setCarToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setCarToEdit(vehicle);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCarToEdit(null);
  };

  const handleSaveCar = async (carData, isEditingMode) => {
    if (isEditingMode) {
      const result = await updateCar(carData.id, carData);
      if (result) {
        toast.success(`Le véhicule "${carData.brand} ${carData.model}" a été mis à jour avec succès !`);
      } else {
        toast.error(`Échec de la mise à jour du véhicule "${carData.brand} ${carData.model}".`);
      }
    } else {
      const result = await createCar(carData);
      if (result) {
        toast.success(`Le véhicule "${result.brand} ${result.model}" a été ajouté avec succès !`);
      } else {
        toast.error(`Échec de l'ajout du véhicule "${carData.brand} ${carData.model}".`);
      }
    }
  };

  // Define columns for the vehicles table
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
        name: 'Conducteur ID',
        selector: row => row.userId,
        sortable: true,
        cell: row => (
            <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                {row.userId}
            </span>
        ),
        minWidth: '250px',
    },
    {
      name: 'Marque',
      selector: row => row.brand,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
          {row.brand}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Modèle',
      selector: row => row.model,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {row.model}
        </span>
      ),
      minWidth: '150px',
    },
    {
        name: 'Places',
        selector: row => row.numberPlaces,
        sortable: true,
        width: '100px',
        cell: row => (
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faListAlt} className="text-gray-400" />
              {row.numberPlaces}
            </span>
          ),
    },
    {
      name: 'Couleur',
      selector: row => row.color,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-gray-400" />
          {row.color}
        </span>
      ),
      minWidth: '120px',
    },
    {
        name: 'Immatriculation',
        selector: row => row.registrationCode,
        sortable: true,
        cell: row => (
            <span className="flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400">
                <FontAwesomeIcon icon={faIdCard} className="text-gray-400" />
                {row.registrationCode}
            </span>
        ),
        minWidth: '180px',
    },
    {
      name: 'Vérifié',
      selector: row => row.isVerified,
      sortable: true,
      cell: row => {
        const isVerified = row.isVerified;
        let statusClasses = '';
        let statusIcon = null;
        if (isVerified) {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = faCheckCircle;
        } else {
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = faTimesCircle;
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
            <FontAwesomeIcon icon={statusIcon} />
            {isVerified ? 'Oui' : 'Non'}
          </span>
        );
      },
      minWidth: '120px',
    },
    {
      name: 'Vérification',
      cell: row => (
        <div className="flex">
          <button
            onClick={() => handleToggleVerification(row)}
            className={`px-3 py-1 rounded-md text-white font-semibold transition-colors duration-200 ${
              row.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
            }`}
            title={row.isVerified ? 'Annuler la vérification' : 'Marquer comme vérifié'}
          >
            <FontAwesomeIcon icon={row.isVerified ? faTimesCircle : faCheckCircle} className="mr-2" />
            {row.isVerified ? 'Annuler' : 'Vérifier'}
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails de ${row.brand} ${row.model}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditVehicle(row)}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteVehicle(row.id, row.brand, row.model)}
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
  ], [handleDeleteVehicle, handleEditVehicle, handleToggleVerification, theme]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestion des Véhicules
        </h1>
        <button
          onClick={handleAddVehicle}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter un Véhicule
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Parc Automobile</h2>
        <DataTable
          columns={columns}
          data={adminCars}
          progressPending={isLoadingAdminCars}
          pagination
          paginationServer
          paginationTotalRows={adminCarPagination.totalCount}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          highlightOnHover
          pointerOnHover
          responsive
          theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun véhicule à afficher.</div>}
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

export default Cars;