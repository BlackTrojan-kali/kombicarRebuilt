import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoad, faCalendarDay, faMoneyBillWave, faChartLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
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
import useStats from '../../hooks/useStats'; 
import useColorScheme from '../../hooks/useColorScheme';
import useAuth from '../../hooks/useAuth';

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
  // ✅ Utilisation des hooks pour accéder au contexte
  const { carpoolingStats, getCarpoolingMonthlyStats, loading } = useStats();
  const { theme } = useColorScheme();
  // ✅ Déclenchement de la récupération des données au chargement du composant
  useEffect(() => {
    getCarpoolingMonthlyStats();
  }, [])//getCarpoolingMonthlyStats]);
  // Configuration dynamique du graphique en fonction du thème
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)',
        },
      },
      title: {
        display: true,
        text: 'Revenus des 12 derniers mois',
        color: theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)',
      },
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(209, 213, 219, 0.1)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)',
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(209, 213, 219, 0.1)' : 'rgba(209, 213, 219, 0.2)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)',
          callback: function(value) {
            return value.toLocaleString('fr-CM') + ' FCFA';
          }
        }
      }
    },
  };

  // Données du graphique fictives. Ces données devraient provenir de votre API.
  const revenueLast12Months = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus Mensuels (FCFA)',
        data: [
          500000, 650000, 700000, 600000, 800000, 950000, 880000, 720000, 900000, 1000000, 1100000, 1200000
        ],
        fill: true,
        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.3,
      },
    ],
  };
  
  // ✅ Affichage d'un écran de chargement si les données sont en cours de récupération
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-900 dark:text-gray-100">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mr-4" />
        <p className="text-xl">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className='pl-12  pt-6 pb-40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full transition-colors duration-300'>

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
            {/* ✅ Utilisation des données de l'API */}
            <p className='text-3xl font-bold'>{carpoolingStats.totalsTripsCount}</p>
          </div>
        </div>

        {/* Voyages du jour */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4'>
          <div className='p-4 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'>
            <FontAwesomeIcon icon={faCalendarDay} className='text-3xl' />
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Voyages du jour</p>
            {/* ✅ Utilisation des données de l'API */}
            <p className='text-3xl font-bold'>{carpoolingStats.todayTripsCount}</p>
          </div>
        </div>

        {/* Total des revenus */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4'>
          <div className='p-4 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'>
            <FontAwesomeIcon icon={faMoneyBillWave} className='text-3xl' />
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>Revenu Total</p>
            {/* ✅ Utilisation des données de l'API */}
            <p className='text-3xl font-bold'>
              {carpoolingStats.totalRevenues.toLocaleString('fr-CM')} FCFA
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
        <div className='h-80'>
          <Line data={revenueLast12Months} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;