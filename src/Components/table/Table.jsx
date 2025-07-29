import React, { useState, useEffect, useMemo } from 'react';
import DataTable, { createTheme } from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assurez-vous d'importer toutes les icônes que vous utilisez dans vos colonnes
import {
  faEye, faEdit, faTrash, faSort, faCalendarAlt, faMapMarkerAlt, faDollarSign,
  faCalendarCheck, faHourglassHalf, faCheckCircle, faCircleQuestion // Ajoutez toutes les icônes nécessaires ici
} from '@fortawesome/free-solid-svg-icons';
import useColorScheme from '../../hooks/useColorScheme';

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


// Composant DataTable générique
const CustomDataTable = ({
  columns,
  data,
  title = "Liste des données", // Titre par défaut
  loading = false,
  totalRows = 0,
  handlePageChange,
  handlePerRowsChange,
  pagination = true,
  paginationServer = false,
  // Ajoutez d'autres props de DataTable que vous souhaitez exposer
}) => {
  const { theme } = useColorScheme();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4'>
      <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{title}</h2>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        highlightOnHover
        pointerOnHover
        responsive
        theme={theme === 'dark' ? 'darkTheme' : 'lightTheme'}
        noDataComponent={<div className="p-4 text-gray-500 dark:text-gray-400">Aucune donnée à afficher.</div>}
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
  );
};

export default CustomDataTable; // Renommé en CustomDataTable pour plus de clarté