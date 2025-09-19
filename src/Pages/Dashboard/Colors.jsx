// Dans Colors.jsx

import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPalette, faPaintBrush,
  faEye, faEdit, faTrash, faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

import Swal from 'sweetalert2';
import { toast } from 'sonner';

// Importez votre composant renommé
import ColorFormModal from '../../Components/Modals/CreateColorModal'; // Assurez-vous que le chemin est correct


// --- Définition des Thèmes pour DataTable --- (laisser tel quel)
createTheme('lightTheme', { /* ... */ }, 'light');
createTheme('darkTheme', { /* ... */ }, 'dark');


const Colors = () => {
  const { theme } = useColorScheme();

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // État générique pour la modal de formulaire
  const [colorToEdit, setColorToEdit] = useState(null); // Nouvel état pour la couleur à modifier

  // Simulate API call to fetch colors
  const fetchColors = async (page, size) => {
    setLoading(true);
    const responseData = [
      { id: 1, name: 'Blanc', hexCode: '#FFFFFF' },
      { id: 2, name: 'Noir', hexCode: '#000000' },
      { id: 3, name: 'Gris', hexCode: '#808080' },
      { id: 4, name: 'Argent', hexCode: '#C0C0C0' },
      { id: 5, name: 'Rouge', hexCode: '#FF0000' },
      { id: 6, name: 'Bleu', hexCode: '#0000FF' },
      { id: 7, name: 'Vert', hexCode: '#008000' },
      { id: 8, name: 'Jaune', hexCode: '#FFFF00' },
      { id: 9, name: 'Orange', hexCode: '#FFA500' },
      { id: 10, name: 'Marron', hexCode: '#A52A2A' },
      { id: 11, name: 'Violet', hexCode: '#800080' },
    ];

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setColors(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchColors(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchColors(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchColors(page, newPerPage);
  };

  // --- Delete function with SweetAlert2 --- (inchangé)
  const handleDeleteColor = async (colorId, colorName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer la couleur "${colorName}". Cette action est irréversible !`,
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
              setColors(prevColors => prevColors.filter(color => color.id !== colorId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression de la couleur."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression de la couleur "${colorName}"...`,
          success: `La couleur "${colorName}" a été supprimée avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonction pour ouvrir la modal en mode CRÉATION ---
  const handleAddColor = () => {
    setColorToEdit(null); // S'assurer que la modal est en mode création
    setIsFormModalOpen(true);
  };

  // --- Fonction pour ouvrir la modal en mode MODIFICATION ---
  const handleEditColor = (color) => {
    setColorToEdit(color); // Charger les données de la couleur à modifier
    setIsFormModalOpen(true);
  };

  // --- Fonction pour fermer la modal de formulaire ---
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setColorToEdit(null); // Réinitialiser la couleur à modifier
  };

  // --- Fonction pour gérer la CRÉATION ou la MODIFICATION d'une couleur ---
  const handleSaveColor = (colorData, isEditingMode) => {
    const savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% de chance de succès simulée
        if (success) {
          if (isEditingMode) {
            // Logique de modification
            setColors(prevColors =>
              prevColors.map(color =>
                color.id === colorData.id ? colorData : color
              )
            );
            resolve(`La couleur "${colorData.name}" a été mise à jour avec succès !`);
          } else {
            // Logique de création
            const newId = colors.length > 0 ? Math.max(...colors.map(c => c.id)) + 1 : 1;
            const addedColor = { ...colorData, id: newId };
            setColors(prevColors => [...prevColors, addedColor]);
            setTotalRows(prevTotalRows => prevTotalRows + 1);
            resolve(`La couleur "${addedColor.name}" a été ajoutée avec succès !`);
          }
        } else {
          reject(new Error(`Échec de ${isEditingMode ? 'la mise à jour' : "l'ajout"} de la couleur.`));
        }
      }, 1000);
    });

    toast.promise(savePromise, {
      loading: isEditingMode ? `Mise à jour de la couleur "${colorData.name}"...` : `Ajout de la couleur "${colorData.name}"...`,
      success: (message) => message,
      error: (err) => `Erreur : ${err.message}`,
    });
  };


  // Define columns for the colors table
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom de la Couleur',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-gray-400" />
          {row.name}
        </span>
      ),
      minWidth: '180px',
    },
    {
      name: 'Code Hexadécimal',
      selector: row => row.hexCode,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faPaintBrush} className="text-gray-400" />
          <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">{row.hexCode}</code>
        </span>
      ),
      minWidth: '180px',
    },
    {
      name: 'Aperçu',
      cell: row => (
        <div
          style={{
            backgroundColor: row.hexCode,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: theme === 'dark' && (row.hexCode === '#FFFFFF' || row.hexCode === '#C0C0C0') ? '1px solid #D1D5DB' : '1px solid #E5E7EB'
          }}
          title={row.name}
        ></div>
      ),
      ignoreRowClick: true,
      button: false,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => toast(`Affichage des détails de la couleur ${row.name}`, { icon: 'ℹ️' })}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => handleEditColor(row)} // Appel pour modifier
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteColor(row.id, row.name)}
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
  ], [handleDeleteColor, handleEditColor, theme]); // Ajouter handleEditColor aux dépendances

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestion des Couleurs de Véhicules
        </h1>
        <button
          onClick={handleAddColor}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter une Couleur
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Couleurs Disponibles</h2>
        <DataTable
          columns={columns}
          data={colors}
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
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucune couleur à afficher.</div>}
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

      {/* Intégration de ColorFormModal */}
      <ColorFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSaveColor={handleSaveColor} // Nouvelle prop pour la sauvegarde
        initialColorData={colorToEdit} // Passe les données de la couleur à modifier
      />
    </div>
  );
};

export default Colors;