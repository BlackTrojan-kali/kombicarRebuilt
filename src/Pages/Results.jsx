import React, { useState, useEffect, useMemo } from 'react';
import ResultCard from '../Components/Cards/ResultCard'; // Vérifiez le chemin d'accès si nécessaire
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import useTrips from '../hooks/useTrips'; // Utilise le hook pour le contexte de trajets
import useColorScheme from '../hooks/useColorScheme'; // Utilise le hook pour le thème


const FilterSection = ({ title, children }) => {
  const { theme } = useColorScheme();
  const sectionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`mb-6 p-4 ${sectionBg} rounded-lg shadow-sm border ${borderColor}`}>
      <h3 className={`font-bold text-lg mb-4 ${titleColor}`}>{title}</h3>
      {children}
    </div>
  );
};

const IntegratedSearchBar = ({ onSearch, initialSearchCriteria }) => {
  const [searchForm, setSearchForm] = useState({
    departure: initialSearchCriteria.departure || '',
    destination: initialSearchCriteria.destination || '',
    date: initialSearchCriteria.date ? dayjs(initialSearchCriteria.date) : dayjs(),
    passengers: initialSearchCriteria.passengers || 1,
  });
  const { theme } = useColorScheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...searchForm,
      date: searchForm.date.format('YYYY-MM-DD'),
    });
  };

  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const inputTextColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const placeholderColor = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form
        onSubmit={handleSubmit}
        className={`w-full mt-10
                   flex flex-col lg:flex-row items-stretch
                   ${inputBg} rounded-none shadow-md overflow-hidden
                   ${inputTextColor} border-y ${inputBorder}`}
      >
        <div className='flex flex-col lg:flex-row w-full lg:flex-grow'>
          {/* Champ de départ */}
          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
            <input
              type="text"
              name="departure"
              placeholder='Départ'
              value={searchForm.departure}
              onChange={handleInputChange}
              className={`flex-grow outline-none bg-transparent ${placeholderColor} text-lg py-1 ${inputTextColor}`}
              aria-label="Lieu de départ"
            />
          </div>

          {/* Champ de destination */}
          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
            <input
              type="text"
              name="destination"
              placeholder='Destination'
              value={searchForm.destination}
              onChange={handleInputChange}
              className={`flex-grow outline-none bg-transparent ${placeholderColor} text-lg py-1 ${inputTextColor}`}
              aria-label="Lieu de destination"
            />
          </div>

          {/* Sélecteur de date */}
          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />
            <DatePicker
              label="Date"
              value={searchForm.date}
              onChange={(newValue) => setSearchForm(prev => ({ ...prev, date: newValue }))}
              className='flex-grow w-full'
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: {
                    disableUnderline: true,
                    className: `text-lg ${inputTextColor}`,
                  },
                  sx: {
                    '& .MuiInputBase-input': { padding: '8px 0 !important', color: 'inherit' },
                    '& .MuiInputLabel-root': { color: theme === 'dark' ? 'rgb(156 163 175) !important' : 'rgb(107 114 128) !important' },
                    '& .MuiInputLabel-root.Mui-focused': { color: theme === 'dark' ? 'rgb(168 85 247) !important' : 'rgb(147 51 234) !important' },
                    '& .MuiSvgIcon-root': { color: theme === 'dark' ? 'rgb(168 85 247) !important' : 'rgb(147 51 234) !important' },
                  },
                },
              }}
            />
          </div>

          {/* Champ du nombre de passagers */}
          <div className={`relative flex items-center p-3 sm:p-4 ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faUserGroup} className='text-xl text-orange-500 mr-3' />
            <input
              type="number"
              name="passengers"
              min="1"
              max="10"
              placeholder='Nb Personnes'
              value={searchForm.passengers}
              onChange={handleInputChange}
              className={`flex-grow outline-none bg-transparent ${placeholderColor} text-lg py-1 ${inputTextColor}`}
              aria-label="Nombre de personnes"
            />
          </div>
        </div>

        {/* Bouton de recherche */}
        <button
          type="submit"
          className='w-full lg:w-32 bg-green-500 hover:bg-green-600 text-white font-bold
                     py-4 lg:py-0 px-6 rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl
                     flex-shrink-0 transition-colors duration-200
                     flex items-center justify-center'
        >
          Rechercher
        </button>
      </form>
    </LocalizationProvider>
  );
};


/**
 * Composant principal de la page de résultats.
 * Récupère les données de trajets via le hook useTrips et gère le filtrage côté client.
 */
const Results = () => {
  // Consomme le contexte de trajets pour obtenir les données et l'état
  const { trips, loading, error, fetchTrips } = useTrips();
  // Consomme le contexte de thème pour le style dynamique
  const { theme } = useColorScheme();

  // État local pour les filtres et les critères de recherche
  const [filterState, setFilterState] = useState({
    departure: '',
    destination: '',
    date: dayjs().format('YYYY-MM-DD'),
    passengers: 1,
    maxPrice: 10000,
    departureTimeFilter: '',
    isClimatise: false,
    isLuggageIncluded: false,
    isDriverRated4Plus: false,
    vehicleType: '',
  });

  // Effet pour déclencher la récupération des données au premier chargement du composant
  useEffect(() => {
    // Appelle la fonction de contexte pour charger les trajets avec les critères initiaux
    fetchTrips({
      departure: filterState.departure,
      destination: filterState.destination,
      date: filterState.date,
      passengers: filterState.passengers
    });
  }, []); // Dépend de fetchTrips pour s'assurer qu'il est bien disponible

  // Gère la soumission d'une nouvelle recherche depuis la barre de recherche
  const handleNewSearch = (newSearchCriteria) => {
    // Met à jour l'état et déclenche une nouvelle récupération des données via le contexte
    setFilterState(prev => ({
      ...prev,
      ...newSearchCriteria,
    }));
    fetchTrips(newSearchCriteria);
  };

  // Gère le changement des filtres de la barre latérale
  const handleFilterChange = (filterName, value) => {
    setFilterState(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Filtre les trajets en mémoire en fonction des filtres de la barre latérale
  // useMemo est utilisé pour optimiser le re-filtrage uniquement si les trajets ou les filtres changent
  const filteredTrips = useMemo(() => {
    if (!trips) {
      return [];
    }

    return trips.filter(trip => {
      if (trip.pricePerPlace > filterState.maxPrice) {
        return false;
      }
      if (filterState.departureTimeFilter) {
        const departureHour = new Date(trip.departureDate).getHours();
        if (filterState.departureTimeFilter === 'matin' && departureHour >= 12) return false;
        if (filterState.departureTimeFilter === 'apres-midi' && (departureHour < 12 || departureHour >= 18)) return false;
        if (filterState.departureTimeFilter === 'soir' && departureHour < 18) return false;
      }
      if (filterState.isClimatise && !trip.climatise) {
        return false;
      }
      if (filterState.isLuggageIncluded && !trip.luggageAllowed) {
        return false;
      }
      if (filterState.isDriverRated4Plus && (!trip.chauffeur || trip.chauffeur.stars < 4)) {
        return false;
      }
      if (filterState.vehicleType && (!trip.vehicle || trip.vehicle.type !== filterState.vehicleType)) {
        return false;
      }
      return true;
    });
  }, [trips, filterState]);

  // Couleurs dynamiques pour la page
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const filterLabelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300 min-h-screen`}>

      <div className="mb-12">
        <IntegratedSearchBar
          onSearch={handleNewSearch}
          initialSearchCriteria={filterState}
        />
      </div>

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-10 max-w-7xl mx-auto'>
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 ${textColorPrimary}`}>
          Résultats de votre recherche
        </h1>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Barre latérale des filtres */}
          <aside className='w-full md:w-1/4 lg:w-1/5 flex-shrink-0'>
            <FilterSection title="Filtres">
              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Prix Max.</h4>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value={filterState.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
                <div className={`flex justify-between text-xs ${textColorSecondary} mt-1`}>
                  <span>1000 XAF</span>
                  <span>{filterState.maxPrice} XAF</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Heure de Départ</h4>
                <select
                  value={filterState.departureTimeFilter}
                  onChange={(e) => handleFilterChange('departureTimeFilter', e.target.value)}
                  className={`w-full p-2 border ${inputBorder} rounded-md ${inputBg} ${textColorPrimary}`}
                >
                  <option value="">Toutes</option>
                  <option value="matin">Matin (avant 12h)</option>
                  <option value="apres-midi">Après-midi (12h-18h)</option>
                  <option value="soir">Soir (après 18h)</option>
                </select>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Options du Trajet</h4>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filterState.isClimatise}
                    onChange={(e) => handleFilterChange('isClimatise', e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Climatisé</span>
                </label>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={filterState.isLuggageIncluded}
                    onChange={(e) => handleFilterChange('isLuggageIncluded', e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Bagages inclus</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterState.isDriverRated4Plus}
                    onChange={(e) => handleFilterChange('isDriverRated4Plus', e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Chauffeur noté 4+ étoiles</span>
                </label>
              </div>
            </FilterSection>

            <FilterSection title="Type de Véhicule">
                <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="vehicle_type"
                      value="sedan"
                      checked={filterState.vehicleType === 'sedan'}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>Berline</span>
                </label>
                <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="vehicle_type"
                      value="suv"
                      checked={filterState.vehicleType === 'suv'}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>SUV</span>
                </label>
                <label className="flex items-center">
                    <input
                      type="radio"
                      name="vehicle_type"
                      value="van"
                      checked={filterState.vehicleType === 'van'}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>Van / Minibus</span>
                </label>
            </FilterSection>
          </aside>

          {/* Section des résultats de recherche */}
          <section className='w-full md:w-3/4 lg:w-4/5'>
            {loading ? (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className={`${textColorSecondary}`}>Chargement des trajets...</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className='flex flex-col gap-6'>
                {filteredTrips.map((trip) => (
                  <ResultCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-xl text-gray-700 dark:text-gray-300">Aucun résultat trouvé pour votre recherche.</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Essayez d'ajuster vos filtres ou de modifier votre recherche.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Results;
