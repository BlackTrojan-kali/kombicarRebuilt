import React, { useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRoad, 
  faCalendarDay, 
  faMoneyBillWave, 
  faChartLine, 
  faSpinner, 
  faWallet, 
  faLock 
} from '@fortawesome/free-solid-svg-icons';
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

// Enregistrement des éléments nécessaires pour Chart.js
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
  const { carpoolingStats, getCarpoolingMonthlyStats, loading } = useStats();
  const { theme } = useColorScheme();

  // Déclenchement de la récupération des données au montage
  useEffect(() => {
    // La fonction est passée ici pour éviter un avertissement linter. Elle est stable via useCallback.
    getCarpoolingMonthlyStats();
  }, []); 

  // Options du graphique (optimisées avec useMemo et dépendantes du thème)
  const chartOptions = useMemo(() => ({
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
            return value+ ' FCFA';
          }
        }
      }
    },
  }), [theme]);

  // Données du graphique (utilisant carpoolingStats.monthlyRevenueData)
  const revenueLast12Months = useMemo(() => {
    // Extraction des labels (mois) et des données (revenus) des statistiques
    // Utilise des valeurs par défaut si monthlyRevenueData n'existe pas encore
    const defaultLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const defaultData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // Adaptez cette logique si la structure de monthlyRevenueData est différente
    const labels = carpoolingStats.monthlyRevenueData?.map(d => d.month) || defaultLabels;
    const data = carpoolingStats.monthlyRevenueData?.map(d => d.revenue) || defaultData;
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Revenus Mensuels (FCFA)',
          data: data,
          fill: true,
          backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.3,
        },
      ],
    };
  }, [carpoolingStats.monthlyRevenueData, theme]);
  
  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-900 dark:text-gray-100">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mr-4 text-blue-500" />
        <p className="text-xl">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className='pl-12 pt-6 pb-40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-full transition-colors duration-300'>

      <h2 className='text-3xl font-extrabold mb-8 text-center'>Aperçu du Tableau de Bord</h2>

      {/* Cartes des indicateurs clés */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        
        {/* Trajets publiés */}
        <StatCard 
          icon={faRoad} 
          title="Trajets publiés" 
          value={carpoolingStats.totalsTripsCount} 
          color="blue" 
          isCurrency={false} 
        />

        {/* Voyages du jour */}
        <StatCard 
          icon={faCalendarDay} 
          title="Voyages du jour" 
          value={carpoolingStats.todayTripsCount} 
          color="green" 
          isCurrency={false} 
        />

        {/* Total des revenus */}
        <StatCard 
          icon={faMoneyBillWave} 
          title="Revenu Total" 
          value={carpoolingStats.totalRevenues} 
          color="purple" 
          isCurrency={true} 
        />

        {/* Solde Total du Covoiturage */}
        <StatCard 
          icon={faWallet} 
          title="Solde App Covoiturage" 
          value={carpoolingStats.appCarpoolingBalance} 
          color="yellow" 
          isCurrency={true} 
        />
      </div>

      {/* Carte Solde Bloqué (Séparée pour un alignement) */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {/* Solde Bloqué */}
        <StatCard 
          icon={faLock} 
          title="Solde Bloqué" 
          value={carpoolingStats.appCarpoolingBalanceBlocked} 
          color="red" 
          isCurrency={true} 
        />
        {/* Les trois autres colonnes sont vides ici pour garder une structure d'alignement */}
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

// Composant réutilisable pour les cartes d'indicateurs
const StatCard = ({ icon, title, value, color, isCurrency }) => {
  const colorMap = {
    blue: { iconBg: 'bg-blue-100 dark:bg-blue-900', iconText: 'text-blue-600 dark:text-blue-300' },
    green: { iconBg: 'bg-green-100 dark:bg-green-900', iconText: 'text-green-600 dark:text-green-300' },
    purple: { iconBg: 'bg-purple-100 dark:bg-purple-900', iconText: 'text-purple-600 dark:text-purple-300' },
    yellow: { iconBg: 'bg-yellow-100 dark:bg-yellow-900', iconText: 'text-yellow-600 dark:text-yellow-300' },
    red: { iconBg: 'bg-red-100 dark:bg-red-900', iconText: 'text-red-600 dark:text-red-300' },
  };

  const { iconBg, iconText } = colorMap[color] || colorMap.blue;

  const formattedValue = isCurrency 
    ? `${value} FCFA` 
    : value;

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center gap-4 transition-transform duration-200 hover:scale-[1.02]'>
      <div className={`p-4 rounded-full ${iconBg} ${iconText}`}>
        <FontAwesomeIcon icon={icon} className='text-3xl' />
      </div>
      <div>
        <p className='text-gray-500 dark:text-gray-400 text-sm'>{title}</p>
        <p className='text-3xl font-bold'>{formattedValue}</p>
      </div>
    </div>
  );
};

export default Dashboard;