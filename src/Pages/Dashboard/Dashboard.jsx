import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad, faCalendarDay, faMoneyBillWave, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2'; // Pour le graphique des revenus
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Enregistrer les composants de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // --- Données fictives (à remplacer par des données réelles de votre API) ---

  const stats = {
    publishedTrips: 1250,
    todayTrips: 45,
    totalRevenue: 7500000, // En FCFA par exemple
  };

  const revenueLast12Months = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus Mensuels (FCFA)',
        data: [
          500000, 650000, 700000, 600000, 800000, 950000, 880000, 720000, 900000, 1000000, 1100000, 1200000
        ],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // bleu-500 avec 20% d'opacité
        borderColor: 'rgb(59, 130, 246)', // bleu-500
        tension: 0.3, // Rend la ligne un peu courbée
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenus des 12 derniers mois',
        color: 'rgb(75, 85, 99)', // gray-700
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(209, 213, 219, 0.2)', // gray-300 avec opacité
        },
        ticks: {
          color: 'rgb(75, 85, 99)', // gray-700
        }
      },
      y: {
        grid: {
          color: 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: 'rgb(75, 85, 99)',
          callback: function(value) {
            return value.toLocaleString('fr-CM') + ' FCFA'; // Format monétaire
          }
        }
      }
    },
    // Styles pour le mode sombre
    // Les couleurs des textes et grilles doivent être ajustées dynamiquement en fonction du thème
    // ou spécifiées via des variables CSS si vous avez un setup de thème plus avancé.
    // Pour cet exemple, les couleurs sont fixes mais peuvent être rendues dynamiques.
  };
  // --- Fin des données fictives ---


  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full'>
      <h2 className='text-3xl font-extrabold mb-8 text-center'>Aperçu du Tableau de Bord</h2>

      {/* Cartes des indicateurs clés */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
        {/* Trajets publiés */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4'>
          <div className='p-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'>
            <FontAwesomeIcon icon={faRoad} className='text-3xl' />
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Trajets publiés</p>
            <p className='text-3xl font-bold'>{stats.publishedTrips}</p>
          </div>
        </div>

        {/* Voyages du jour */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4'>
          <div className='p-4 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'>
            <FontAwesomeIcon icon={faCalendarDay} className='text-3xl' />
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Voyages du jour</p>
            <p className='text-3xl font-bold'>{stats.todayTrips}</p>
          </div>
        </div>

        {/* Total des revenus */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4'>
          <div className='p-4 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'>
            <FontAwesomeIcon icon={faMoneyBillWave} className='text-3xl' />
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Revenu Total</p>
            <p className='text-3xl font-bold'>
              {stats.totalRevenue.toLocaleString('fr-CM')} FCFA
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques des revenus des 12 derniers mois */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
        <h3 className='text-2xl font-bold mb-6 flex items-center gap-3'>
          <FontAwesomeIcon icon={faChartLine} className='text-blue-500 dark:text-blue-400' />
          Statistiques des Revenus
        </h3>
        <div className='h-80'> {/* Hauteur fixe pour le graphique */}
          <Line data={revenueLast12Months} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;