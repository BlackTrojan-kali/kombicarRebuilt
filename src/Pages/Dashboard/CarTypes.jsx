import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCarSide, faList, faInfoCircle, // Icônes pour le type
  faEye, faEdit, faTrash, faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';


// --- Définition des Thèmes pour DataTable ---
// Idéalement à définir une seule fois globalement.
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


const CarTypes = () => {
  const { theme } = useColorScheme();

  const [carTypes, setCarTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Simulate API call to fetch car types
  const fetchCarTypes = async (page, size) => {
    setLoading(true);
    // Fictitious car types data
    const responseData = [
      { id: 1, name: 'Berline', description: 'Voiture à trois volumes avec un compartiment moteur, un habitacle et un coffre séparés.', seats: 5, exampleCars: 'Toyota Camry, Mercedes C-Class' },
      { id: 2, name: 'SUV', description: 'Sport Utility Vehicle, un véhicule utilitaire sport, mélange d\'une voiture de tourisme et d\'un véhicule tout-terrain.', seats: 5, exampleCars: 'Hyundai Tucson, BMW X5' },
      { id: 3, name: 'Monospace', description: 'Véhicule dont le compartiment moteur, l\'habitacle et le coffre sont intégrés dans un seul volume.', seats: 7, exampleCars: 'Renault Espace, Chrysler Pacifica' },
      { id: 4, name: 'Citadine', description: 'Petite voiture conçue principalement pour la conduite en milieu urbain.', seats: 4, exampleCars: 'Peugeot 208, Volkswagen Polo' },
      { id: 5, name: 'Fourgonnette', description: 'Petit véhicule utilitaire léger souvent utilisé pour la livraison ou le transport de marchandises.', seats: 2, exampleCars: 'Renault Kangoo, Citroën Berlingo' },
      { id: 6, name: 'Coupé', description: 'Voiture avec une carrosserie fermée, généralement à deux portes, avec un profil arrière en pente.', seats: 2, exampleCars: 'Mercedes-AMG GT, BMW Z4' },
      { id: 7, name: 'Cabriolet', description: 'Voiture avec un toit rétractable, permettant une conduite à ciel ouvert.', seats: 2, exampleCars: 'Audi A3 Cabriolet, Mazda MX-5' },
    ];

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setCarTypes(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchCarTypes(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchCarTypes(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchCarTypes(page, newPerPage);
  };

  // --- Delete function with SweetAlert2 ---
  const handleDeleteCarType = async (typeId, typeName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer le type de véhicule "${typeName}". Cette action est irréversible !`,
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
              setCarTypes(prevCarTypes => prevCarTypes.filter(type => type.id !== typeId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression du type de véhicule."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression du type "${typeName}"...`,
          success: `Le type "${typeName}" a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Function to add a car type (example with hot-toast) ---
  const handleAddCarType = () => {
    toast('Un formulaire pour ajouter un nouveau type de véhicule s\'ouvrira ici.', {
      icon: '📝', // Emoji icon for adding
      duration: 3000,
      position: 'top-right',
    });
    // Here, you would implement the logic to open an add form, etc.
  };

  // Define columns for the car types table
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom du Type',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCarSide} className="text-gray-400" />
          {row.name}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: false, // Descriptions can be long, not always ideal for sorting
      wrap: true,
      minWidth: '250px',
      maxWidth: '400px',
      cell: row => (
        <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400" />
          {row.description}
        </span>
      ),
    },
    {
      name: 'Sièges',
      selector: row => row.seats,
      sortable: true,
      right: true,
      width: '100px',
    },
    {
      name: 'Exemples',
      selector: row => row.exampleCars,
      sortable: false,
      wrap: true,
      minWidth: '200px',
      cell: row => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.exampleCars}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails du type ${row.name}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => toast(`Modification du type ${row.name}...`, { icon: '✍️' })}
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteCarType(row.id, row.name)}
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
  ], [handleDeleteCarType]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      {/* React Hot Toast Toaster component for notifications */}
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestion des Types de Véhicules
        </h1>
        <button
          onClick={handleAddCarType}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter un Type
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Types de Véhicules Enregistrés</h2>
        <DataTable
          columns={columns}
          data={carTypes}
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
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun type de véhicule à afficher.</div>}
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

export default CarTypes;