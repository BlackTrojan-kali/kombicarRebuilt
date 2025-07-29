import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faCalendarAlt, faMapPin, faClock, faCircleQuestion, // Icônes générales
  faEye, faEdit, faTrash, faUserPlus, faCheckCircle, faBan // Icônes d'action et de statut
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';


// --- Définition des Thèmes pour DataTable ---
// Comme mentionné précédemment, il est préférable de définir ces thèmes une seule fois globalement
// dans votre application si vous les utilisez dans plusieurs tables.
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


const Utilisateurs = () => {
  const { theme } = useColorScheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Simule une requête API pour récupérer les utilisateurs
  const fetchUsers = async (page, size) => {
    setLoading(true);
    // Données fictives d'utilisateurs
    const responseData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Utilisateur ${i + 1}`,
      email: `user${i + 1}@email.com`,
      phone: `+237 6${(30000000 + i).toString().slice(0, 8)}`,
      lastActive: `2025-07-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1} ${10 + (i % 12)}:${(i % 60) < 10 ? '0' : ''}${(i % 60)}`, // Date et heure
      totalTrips: Math.floor(Math.random() * 50) + 1, // Nombre de trajets effectués
      status: i % 4 === 0 ? 'Actif' : (i % 4 === 1 ? 'Inactif' : 'Vérifié'), // Ajout de "Vérifié"
      registeredDate: `2024-03-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setUsers(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchUsers(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchUsers(page, newPerPage);
  };

  // --- Fonction de suppression avec SweetAlert2 ---
  const handleDeleteUser = async (userId, userName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer l'utilisateur ${userName}. Cette action est irréversible !`,
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
        // Simuler l'appel API de suppression
        const deletePromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% de chance de succès
            if (success) {
              setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression de l'utilisateur."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression de ${userName}...`,
          success: `L'utilisateur ${userName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonction pour ajouter un utilisateur (exemple avec hot-toast) ---
  const handleAddUser = () => {
    toast('Un formulaire pour ajouter un nouvel utilisateur s\'ouvrira ici.', {
      icon: '👨‍👩‍👧‍👦', // Icône emoji pour un utilisateur
      duration: 3000,
      position: 'top-right',
    });
    // Ici, vous implémenteriez la logique pour ouvrir un formulaire d'ajout, etc.
  };

  // Définition des colonnes pour la table des utilisateurs
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom de l\'utilisateur',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
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
      name: 'Total Trajets',
      selector: row => row.totalTrips,
      sortable: true,
      right: true,
      cell: row => (
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faMapPin} className="text-blue-500" />
          {row.totalTrips}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Dernière Activité',
      selector: row => row.lastActive,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-gray-400" />
          {new Date(row.lastActive).toLocaleString('fr-CM')}
        </span>
      ),
      minWidth: '180px',
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
          statusIcon = faCheckCircle;
        } else if (row.status === 'Inactif') {
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          statusIcon = faBan;
        } else { // Vérifié
          statusClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          statusIcon = faCheckCircle; // Ou une autre icône pour "Vérifié"
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
            onClick={() => handleDeleteUser(row.id, row.name)}
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
  ], [handleDeleteUser]);

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      {/* Toaster de react-hot-toast pour afficher les notifications */}
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Liste des Utilisateurs
        </h1>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Ajouter un Utilisateur
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Utilisateurs Enregistrés</h2>
        <DataTable
          columns={columns}
          data={users}
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
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun utilisateur à afficher.</div>}
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

export default Utilisateurs;