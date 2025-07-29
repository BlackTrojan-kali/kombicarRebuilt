import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie, faEnvelope, faPhone, faCalendarAlt, faKey, faEye, faEdit, faTrash, faUserPlus,
  faCheckCircle, faTimesCircle // Ajout des icônes pour le statut actif/inactif
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Importez votre composant AdminFormModal
import AdminFormModal from '../../Components/Modals/CreateAdminModal'; // Assurez-vous que le chemin est correct

// --- Définition des Thèmes pour DataTable (ces définitions ne changent pas) ---
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


const Admins = () => {
  const { theme } = useColorScheme();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // État pour ouvrir/fermer la modal de formulaire
  const [adminToEdit, setAdminToEdit] = useState(null); // Contient les données de l'administrateur à modifier

  // Simule une requête API pour récupérer les administrateurs
  const fetchAdmins = async (page, size) => {
    setLoading(true);
    // Données fictives d'administrateurs
    const responseData = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      firstName: `Admin${i + 1}P`,
      lastName: `Admin${i + 1}N`,
      email: `admin${i + 1}@kombicar.com`,
      phone: `+237 6${(10000000 + i).toString().slice(0, 8)}`,
      role: i % 2 === 0 ? 'super-admin' : 'admin', // Utilisez les rôles de AdminFormModal
      isActive: i % 3 !== 0, // Certains seront inactifs
      lastLogin: `2025-07-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setAdmins(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchAdmins(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchAdmins(page, newPerPage);
  };

  // --- Fonction de suppression avec SweetAlert2 ---
  const handleDeleteAdmin = async (adminId, adminName) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Vous êtes sur le point de supprimer l'administrateur ${adminName}. Cette action est irréversible !`,
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
              setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
              setTotalRows(prevTotalRows => prevTotalRows - 1);
              resolve();
            } else {
              reject(new Error("Échec de la suppression de l'administrateur."));
            }
          }, 1000);
        });

        toast.promise(deletePromise, {
          loading: `Suppression de ${adminName}...`,
          success: `L'administrateur ${adminName} a été supprimé avec succès !`,
          error: (err) => `Erreur : ${err.message}`,
        });
      }
    });
  };

  // --- Fonction pour ouvrir la modal en mode CRÉATION ---
  const handleAddAdmin = () => {
    setAdminToEdit(null); // S'assurer que la modal est en mode création
    setIsFormModalOpen(true);
  };

  // --- Fonction pour ouvrir la modal en mode MODIFICATION ---
  const handleEditAdmin = (admin) => {
    setAdminToEdit(admin); // Charger les données de l'administrateur à modifier
    setIsFormModalOpen(true);
  };

  // --- Fonction pour fermer la modal de formulaire ---
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setAdminToEdit(null); // Réinitialiser l'administrateur à modifier
  };

  // --- Fonction pour gérer la CRÉATION ou la MODIFICATION d'un administrateur ---
  const handleSaveAdmin = (adminData, isEditingMode) => {
    // C'est ici que vous feriez l'appel API réel pour créer ou mettre à jour l'administrateur
    console.log("Données de l'administrateur à sauvegarder :", adminData, "Mode édition :", isEditingMode);

    const savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% de chance de succès simulée
        if (success) {
          if (isEditingMode) {
            // Logique de modification: Mettre à jour l'état local
            setAdmins(prevAdmins =>
              prevAdmins.map(admin =>
                admin.id === adminData.id ? { ...adminData, name: `${adminData.firstName} ${adminData.lastName}` } : admin // Met à jour le nom complet pour l'affichage
              )
            );
            resolve(`L'administrateur "${adminData.firstName} ${adminData.lastName}" a été mis à jour avec succès !`);
          } else {
            // Logique de création: Ajouter à l'état local
            const newId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
            const addedAdmin = {
              ...adminData,
              id: newId,
              name: `${adminData.firstName} ${adminData.lastName}`, // Créer le nom complet
              lastLogin: new Date().toISOString().split('T')[0], // Date de création/dernière connexion simulée
              phone: `+237 6${(10000000 + newId).toString().slice(0, 8)}` // Numéro de téléphone simulé
            };
            setAdmins(prevAdmins => [...prevAdmins, addedAdmin]);
            setTotalRows(prevTotalRows => prevTotalRows + 1);
            resolve(`L'administrateur "${addedAdmin.firstName} ${addedAdmin.lastName}" a été ajouté avec succès !`);
          }
        } else {
          reject(new Error(`Échec de ${isEditingMode ? 'la mise à jour' : "l'ajout"} de l'administrateur.`));
        }
      }, 1000);
    });

    toast.promise(savePromise, {
      loading: isEditingMode ? `Mise à jour de ${adminData.firstName} ${adminData.lastName}...` : `Ajout de ${adminData.firstName} ${adminData.lastName}...`,
      success: (message) => message,
      error: (err) => `Erreur : ${err.message}`,
    });
  };


  // Définition des colonnes pour la table des administrateurs
  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px',
    },
    {
      name: 'Nom Complet',
      selector: row => row.name, // Utilisez directement row.name qui est pré-calculé ou ajusté
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-gray-400" />
          {row.name}
        </span>
      ),
      minWidth: '200px',
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
      name: 'Rôle',
      selector: row => row.role,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            row.role === 'super-admin'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          }`}
        >
          <FontAwesomeIcon icon={faKey} className="mr-1" />
          {row.role === 'super-admin' ? 'Super Admin' : 'Admin Régulier'} {/* Afficher le rôle de manière plus lisible */}
        </span>
      ),
      minWidth: '120px',
    },
    {
      name: 'Statut', // Ajout de la colonne Statut
      selector: row => row.isActive,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${row.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
          <FontAwesomeIcon icon={row.isActive ? faCheckCircle : faTimesCircle} />
          {row.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
      width: '120px',
    },
    {
      name: 'Dernière Connexion',
      selector: row => row.lastLogin,
      sortable: true,
      format: row => new Date(row.lastLogin).toLocaleDateString('fr-CM'),
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
          {new Date(row.lastLogin).toLocaleDateString('fr-CM')}
        </span>
      ),
      minWidth: '150px',
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
            onClick={() => handleEditAdmin(row)} // Appel de handleEditAdmin
            className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDeleteAdmin(row.id, row.name)}
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
  ], [handleDeleteAdmin, handleEditAdmin, theme]); // Ajouter handleEditAdmin et theme aux dépendances

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestion des Administrateurs
        </h1>
        <button
          onClick={handleAddAdmin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Ajouter un Admin
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Administrateurs du Système</h2>
        <DataTable
          columns={columns}
          data={admins}
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
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucun administrateur à afficher.</div>}
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

      {/* Intégration de AdminFormModal */}
      <AdminFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSaveAdmin={handleSaveAdmin}
        initialAdminData={adminToEdit} // Passe l'objet adminToEdit à la modal
      />
    </div>
  );
};

export default Admins;