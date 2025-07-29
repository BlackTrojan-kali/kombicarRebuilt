import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faBuilding, faCalendarAlt, faGasPump, faCog, faListAlt,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faTimesCircle, faCarSide, // Ajout de faCarSide pour la marque
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Importez votre composant CarFormModal
import CarFormModal from '../../Components/Modals/CreateCarModal'; // Assurez-vous que le chemin est correct

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

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // État pour ouvrir/fermer la modal de formulaire
  const [carToEdit, setCarToEdit] = useState(null); // Contient les données du véhicule à modifier

  // Simulate API call to fetch vehicles
  const fetchVehicles = async (page, size) => {
    setLoading(true);
    const responseData = Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      brand: ['Toyota', 'Mercedes-Benz', 'Hyundai', 'Ford', 'BMW'][i % 5],
      model: ['Camry', 'C-Class', 'Elantra', 'Focus', 'X5', 'Corolla', 'E-Class'][i % 7],
      year: 2010 + (i % 15),
      fuelType: ['Essence', 'Diesel'][i % 2],
      transmission: ['Automatique', 'Manuelle'][i % 2],
      colorId: (i % 7) + 1, // ID de couleur fictif, doit correspondre aux IDs de CarFormModal
      color: ['Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune'][i % 7], // Nom de couleur pour l'affichage
      plateNumber: `CE${1000 + i}AA`,
      chassisNumber: `VIN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      description: `Description du véhicule ${i + 1}.`,
      status: i % 3 === 0 ? 'Disponible' : (i % 3 === 1 ? 'En maintenance' : 'En service'),
      lastInspection: `2025-06-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setVehicles(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchVehicles(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchVehicles(page, newPerPage);
  };

  // --- Delete function with SweetAlert2 ---
  const handleDeleteVehicle = async (vehicleId, vehicleBrand, vehicleModel) => {
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
        const deletePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.2;
            if (success) {
              setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression du véhicule."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression du véhicule "${vehicleBrand} ${vehicleModel}"...`,
          success: `Le véhicule "${vehicleBrand} ${vehicleModel}" a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonction pour ouvrir la modal en mode CRÉATION ---
  const handleAddVehicle = () => {
    setCarToEdit(null); // S'assurer que la modal est en mode création
    setIsFormModalOpen(true);
  };

  // --- Fonction pour ouvrir la modal en mode MODIFICATION ---
  const handleEditVehicle = (vehicle) => {
    setCarToEdit(vehicle); // Charger les données du véhicule à modifier
    setIsFormModalOpen(true);
  };

  // --- Fonction pour fermer la modal de formulaire ---
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCarToEdit(null); // Réinitialiser la voiture à modifier
  };

  // --- Fonction pour gérer la CRÉATION ou la MODIFICATION d'un véhicule ---
  const handleSaveCar = (carData, isEditingMode) => {
    // C'est ici que vous feriez l'appel API réel pour créer ou mettre à jour le véhicule
    console.log("Données du véhicule à sauvegarder :", carData, "Mode édition :", isEditingMode);

    const savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% de chance de succès simulée
        if (success) {
          if (isEditingMode) {
            // Logique de modification: Mettre à jour l'état local
            setVehicles(prevVehicles =>
              prevVehicles.map(car =>
                car.id === carData.id ? { ...carData, color: car.color } : car // Garder le nom de couleur si non modifié
              )
            );
            resolve(`Le véhicule "${carData.brand} ${carData.model}" a été mis à jour avec succès !`);
          } else {
            // Logique de création: Ajouter à l'état local
            const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
            // Trouver le nom de la couleur à partir de l'ID pour l'affichage dans la table
            const selectedColor = CarFormModal.defaultProps.availableColors.find(c => c.id === carData.colorId);
            const addedCar = { ...carData, id: newId, color: selectedColor ? selectedColor.name : 'Inconnu' };
            setVehicles(prevVehicles => [...prevVehicles, addedCar]);
            setTotalRows(prevTotalRows => prevTotalRows + 1);
            resolve(`Le véhicule "${addedCar.brand} ${addedCar.model}" a été ajouté avec succès !`);
          }
        } else {
          reject(new Error(`Échec de ${isEditingMode ? 'la mise à jour' : "l'ajout"} du véhicule.`));
        }
      }, 1000);
    });

    toast.promise(savePromise, {
      loading: isEditingMode ? `Mise à jour du véhicule "${carData.brand}"...` : `Ajout du véhicule "${carData.brand}"...`,
      success: (message) => message,
      error: (err) => `Erreur : ${err.message}`,
    });
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
      name: 'Année',
      selector: row => row.year,
      sortable: true,
      width: '100px',
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
      name: 'Plaque Immat.',
      selector: row => row.plateNumber,
      sortable: true,
      cell: row => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {row.plateNumber}
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
        if (row.status === 'Disponible') {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = faCheckCircle;
        } else if (row.status === 'En maintenance') {
          statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          statusIcon = faCog;
        } else { // En service
          statusClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          statusIcon = faListAlt;
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
            <FontAwesomeIcon icon={statusIcon} />
            {row.status}
          </span>
        );
      },
      minWidth: '150px',
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
            onClick={() => handleEditVehicle(row)} // Appelle handleEditVehicle avec les données de la ligne
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
  ], [handleDeleteVehicle, handleEditVehicle, theme]); // Ajouter handleEditVehicle aux dépendances

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
          data={vehicles}
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

      {/* Intégration de CarFormModal */}
      <CarFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSaveCar={handleSaveCar}
        initialCarData={carToEdit} // Passe l'objet carToEdit à la modal
      />
    </div>
  );
};

export default Cars;