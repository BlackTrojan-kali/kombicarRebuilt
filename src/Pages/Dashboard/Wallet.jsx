import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet, faMoneyBillTransfer, faPlusCircle, faMinusCircle, faUser, faCalendarAlt, faClock,
  faEye, faInfoCircle // Icônes pour le portefeuille et les transactions
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme'; // Assurez-vous que le chemin est correct

// Importations de SweetAlert2 et React Hot Toast
import Swal from 'sweetalert2';
import { toast } from 'sonner';


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


const Wallet = () => {
  const { theme } = useColorScheme();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Simulate API call to fetch transactions
  const fetchTransactions = async (page, size) => {
    setLoading(true);
    // Fictitious transactions data
    const responseData = Array.from({ length: 60 }, (_, i) => ({
      id: i + 1,
      userId: Math.floor(Math.random() * 20) + 1,
      userName: `Utilisateur ${Math.floor(Math.random() * 20) + 1}`,
      type: i % 3 === 0 ? 'Dépôt' : (i % 3 === 1 ? 'Retrait' : 'Paiement Trajet'),
      amount: (Math.random() * 50000 + 1000).toFixed(2), // Montant entre 1000 et 51000
      currency: 'XAF',
      status: i % 4 === 0 ? 'Terminé' : (i % 4 === 1 ? 'En attente' : 'Annulé'),
      transactionDate: `2025-07-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
      transactionTime: `${10 + (i % 12)}:${(i % 60) < 10 ? '0' : ''}${(i % 60)}`,
      description: i % 3 === 0 ? 'Recharge de solde' : (i % 3 === 1 ? 'Retrait via Mobile Money' : 'Paiement pour trajet Urbain'),
    }));

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;

    setTransactions(responseData.slice(startIndex, endIndex));
    setTotalRows(responseData.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchTransactions(page, perPage);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchTransactions(page, newPerPage);
  };

  // --- Handle view details (example with SweetAlert for details) ---
  const handleViewDetails = (transaction) => {
    Swal.fire({
      title: `Détails de la Transaction #${transaction.id}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Utilisateur:</strong> ${transaction.userName}</p>
          <p><strong>Type:</strong> ${transaction.type}</p>
          <p><strong>Montant:</strong> ${parseFloat(transaction.amount).toLocaleString('fr-CM')} ${transaction.currency}</p>
          <p><strong>Statut:</strong> ${transaction.status}</p>
          <p><strong>Date:</strong> ${new Date(transaction.transactionDate).toLocaleDateString('fr-CM')} à ${transaction.transactionTime}</p>
          <p><strong>Description:</strong> ${transaction.description}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fermer',
      background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
      color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
    });
  };

  // --- Function for generic action (example with hot-toast) ---
  const handleGenericAction = (actionName) => {
    toast(`Fonctionnalité pour "${actionName}" sera bientôt disponible.`, {
      icon: '⚙️',
      duration: 3000,
      position: 'top-right',
    });
  };

  // Define columns for the transactions table
  const columns = useMemo(() => [
    {
      name: 'ID Transaction',
      selector: row => row.id,
      sortable: true,
      width: '130px',
    },
    {
      name: 'Utilisateur',
      selector: row => row.userName,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-gray-400" />
          {row.userName}
        </span>
      ),
      minWidth: '180px',
    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
      cell: row => {
        let typeClasses = '';
        let typeIcon = faMoneyBillTransfer; // Default
        if (row.type === 'Dépôt') {
          typeClasses = 'text-green-600';
          typeIcon = faPlusCircle;
        } else if (row.type === 'Retrait') {
          typeClasses = 'text-red-600';
          typeIcon = faMinusCircle;
        } else { // Paiement Trajet
          typeClasses = 'text-blue-600';
          typeIcon = faMoneyBillTransfer;
        }
        return (
          <span className={`flex items-center gap-2 font-medium ${typeClasses}`}>
            <FontAwesomeIcon icon={typeIcon} />
            {row.type}
          </span>
        );
      },
      minWidth: '150px',
    },
    {
      name: 'Montant',
      selector: row => parseFloat(row.amount), // Sort by numerical value
      sortable: true,
      right: true,
      cell: row => (
        <span className="font-semibold text-lg">
          {parseFloat(row.amount).toLocaleString('fr-CM')} {row.currency}
        </span>
      ),
      minWidth: '150px',
    },
    {
      name: 'Date & Heure',
      selector: row => `${row.transactionDate} ${row.transactionTime}`,
      sortable: true,
      cell: row => (
        <span className="flex flex-col text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1"><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(row.transactionDate).toLocaleDateString('fr-CM')}</span>
          <span className="flex items-center gap-1"><FontAwesomeIcon icon={faClock} /> {row.transactionTime}</span>
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
        if (row.status === 'Terminé') {
          statusClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        } else if (row.status === 'En attente') {
          statusClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        } else { // Annulé
          statusClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
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
            onClick={() => handleViewDetails(row)}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            title="Voir les détails de la transaction"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px',
    },
  ], [handleViewDetails]); // Add handleViewDetails to dependencies

  return (
    <div className='pl-12  pt-6 pb-40 bg-gray-50 dark:bg-gray-900 min-h-full'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Gestion des Portefeuilles
        </h1>
        <button
          onClick={() => handleGenericAction('Ajouter une Transaction')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          Ajouter une Transaction
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>Historique des Transactions</h2>
        <DataTable
          columns={columns}
          data={transactions}
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
          noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucune transaction à afficher.</div>}
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

export default Wallet;