import React, { useState, useEffect, useMemo, useContext } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faBuilding, faCalendarAlt, faGasPump, faCog, faListAlt,
  faEye, faEdit, faTrash, faPlusCircle, faCheckCircle, faTimesCircle, faCarSide,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Importez votre composant CarFormModal
import CarFormModal from '../../Components/Modals/CreateCarModal'; // Assurez-vous que le chemin est correct
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
  
  // Utilisation du contexte pour récupérer les données et les fonctions
  const { cars, loading, fetchCars, deleteCar, createCar, updateCar } = useCars();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // État pour ouvrir/fermer la modal de formulaire
  const [carToEdit, setCarToEdit] = useState(null); // Contient les données du véhicule à modifier

  // useEffect pour charger les véhicules au montage du composant
  useEffect(() => {
    fetchCars();
  }, []); // Dépendance à fetchCars pour éviter les avertissements

  // --- Delete function with SweetAlert2 ---
  const handleDeleteVehicle = (vehicleId, vehicleMarque, vehicleModele) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le véhicule "${vehicleMarque} ${vehicleModele}". Cette action est irréversible !`,
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
        const success = await deleteCar(vehicleId);
        if (success) {
          toast.success(`Le véhicule "${vehicleMarque} ${vehicleModele}" a été supprimé avec succès !`);
        } else {
          toast.error(`Échec de la suppression du véhicule "${vehicleMarque} ${vehicleModele}".`);
        }
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
  const handleSaveCar = async (carData, isEditingMode) => {
    if (isEditingMode) {
      // Appel de la fonction de mise à jour du contexte
      const result = await updateCar(carData.id, carData);
      if (result) {
        toast.success(`Le véhicule "${carData.marque} ${carData.modele}" a été mis à jour avec succès !`);
      } else {
        toast.error(`Échec de la mise à jour du véhicule "${carData.marque} ${carData.modele}".`);
      }
    } else {
      // Appel de la fonction de création du contexte
      const result = await createCar(carData);
      if (result) {
        toast.success(`Le véhicule "${result.marque} ${result.modele}" a été ajouté avec succès !`);
      } else {
        toast.error(`Échec de l'ajout du véhicule "${carData.marque} ${carData.modele}".`);
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
      name: 'Marque',
      selector: row => row.marque,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
          {row.marque}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Modèle',
      selector: row => row.modele,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCar} className="text-gray-400" />
          {row.modele}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Année',
      selector: row => row.annee,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Couleur',
      selector: row => row.couleur,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-gray-400" />
          {row.couleur}
        </span>
      ),
      minWidth: '120px',
    },
    // Remarque: La plaque d'immatriculation et les autres champs sont absents des données fictives.
    // Vous pouvez les ajouter à votre mockCars ou les commenter ici.
    // {
    //   name: 'Plaque Immat.',
    //   selector: row => row.plateNumber,
    //   sortable: true,
    //   cell: row => (
    //     <span className="font-semibold text-blue-600 dark:text-blue-400">
    //       {row.plateNumber}
    //     </span>
    //   ),
    //   minWidth: '150px',
    // },
    {
      name: 'Statut',
      selector: row => row.disponible,
      sortable: true,
      cell: row => {
        const status = row.disponible ? 'Disponible' : 'Indisponible';
        let statusClasses = '';
        let statusIcon = null;
        if (status === 'Disponible') {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          statusIcon = faCheckCircle;
        } else {
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = faTimesCircle;
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusClasses}`}>
            <FontAwesomeIcon icon={statusIcon} />
            {status}
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
            onClick={() => toast(`Affichage des détails de ${row.marque} ${row.modele}`, { icon: 'ℹ️' })}
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
            onClick={() => handleDeleteVehicle(row.id, row.marque, row.modele)}
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
  ], [handleDeleteVehicle, handleEditVehicle, theme]);

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
          data={cars} // Utilisation de l'état `cars` du contexte
          progressPending={loading}
          pagination
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
