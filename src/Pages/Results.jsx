import React, { useState, useEffect, useMemo } from 'react';
import ResultCard from '../Components/Cards/ResultCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import Button from '../Components/ui/Button';

// Composant pour les sections de filtres
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

// Barre de recherche intégrée mise à jour pour l'API
const IntegratedSearchBar = ({ onSearch, initialSearchCriteria }) => {
  const [searchForm, setSearchForm] = useState({
    startAreaCity: initialSearchCriteria.startAreaCity || '',
    endAreaCity: initialSearchCriteria.endAreaCity || '',
    date: initialSearchCriteria.date ? dayjs(initialSearchCriteria.date) : dayjs(),
    passengers: initialSearchCriteria.passengers || 1,
  });
  const { theme } = useColorScheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setSearchForm(prev => ({ ...prev, date: newValue }));
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
              name="startAreaCity"
              placeholder='Départ'
              value={searchForm.startAreaCity}
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
              name="endAreaCity"
              placeholder='Destination'
              value={searchForm.endAreaCity}
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
              onChange={handleDateChange}
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


const Results = () => {
  const { trips, loading, error, listPublicTrips } = useTrips();
  const { theme } = useColorScheme();

  // État local pour les critères de recherche et les filtres, tous unifiés
  const [searchCriteria, setSearchCriteria] = useState({
    page: 1,
    tripStatus: 3, // Par défaut, "Published"
    maxPrice: 10000,
    tripDepartureHour: {
      acceptAllHour: true,
      startHour: 0,
      endHour: 0
    },
    airConditionned: false,
    luggageAllowed: false,
    vehiculeType: 0,
    notationOfCondutor: 0,
    startAreaCity: "",
    endAreaCity: ""
  });

  // Utilisation de useMemo pour la valeur des champs de recherche
  const initialSearchCriteria = useMemo(() => ({
    startAreaCity: searchCriteria.startAreaCity,
    endAreaCity: searchCriteria.endAreaCity,
    date: dayjs(),
    passengers: 1, // Le nombre de passagers n'est pas dans le modèle de l'API, donc on le gère localement si nécessaire.
  }), []);

  // Effect pour le premier chargement et chaque fois que les critères changent
  useEffect(() => {
    // La fonction listPublicTrips est déjà déja prête à utiliser le modèle de données que vous avez fourni
    listPublicTrips({page:1,tripStatus:3});
  }, []);

  // Gère la soumission d'une nouvelle recherche depuis la barre de recherche
  const handleNewSearch = (newSearchData) => {
    setSearchCriteria(prev => ({
      ...prev,
      startAreaCity: newSearchData.startAreaCity,
      endAreaCity: newSearchData.endAreaCity,
      // Le back-end gère la date, si la recherche se fait par date, il faudra adapter l'API
    }));
  };

  // Gère le changement des filtres de la barre latérale
  const handleFilterChange = (filterName, value) => {
    // Mettre à jour l'état de manière unifiée
    if (filterName === 'maxPrice') {
      setSearchCriteria(prev => ({ ...prev, maxPrice: value }));
    } else if (filterName === 'departureTimeFilter') {
      let start = 0, end = 0;
      if (value === 'matin') { start = 6; end = 12; }
      if (value === 'apres-midi') { start = 12; end = 18; }
      if (value === 'soir') { start = 18; end = 24; }
      setSearchCriteria(prev => ({
        ...prev,
        tripDepartureHour: {
          acceptAllHour: value === '',
          startHour: start,
          endHour: end
        }
      }));
    } else if (filterName === 'isClimatise') {
      setSearchCriteria(prev => ({ ...prev, airConditionned: value }));
    } else if (filterName === 'isLuggageIncluded') {
      setSearchCriteria(prev => ({ ...prev, luggageAllowed: value }));
    } else if (filterName === 'isDriverRated4Plus') {
      setSearchCriteria(prev => ({ ...prev, notationOfCondutor: value ? 4 : 0 }));
    } else if (filterName === 'vehicleType') {
      let vehiculeTypeValue = 0;
      if (value === 'sedan') vehiculeTypeValue = 1;
      if (value === 'suv') vehiculeTypeValue = 2;
      if (value === 'van') vehiculeTypeValue = 3;
      setSearchCriteria(prev => ({ ...prev, vehiculeType: vehiculeTypeValue }));
    }
  };

  // Couleurs dynamiques pour la page
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const filterLabelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const buttonColor = theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600';

  return (
    <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300 min-h-screen`}>
      <div className="mb-12">
        <IntegratedSearchBar onSearch={handleNewSearch} initialSearchCriteria={initialSearchCriteria} />
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
                  min="0"
                  max="50000" // Plage de prix élargie pour plus de flexibilité
                  step="500"
                  value={searchCriteria.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
                <div className={`flex justify-between text-xs ${textColorSecondary} mt-1`}>
                  <span>0 XAF</span>
                  <span>{searchCriteria.maxPrice} XAF</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Heure de Départ</h4>
                <select
                  value={searchCriteria.tripDepartureHour.acceptAllHour ? '' : (searchCriteria.tripDepartureHour.startHour === 6 ? 'matin' : searchCriteria.tripDepartureHour.startHour === 12 ? 'apres-midi' : 'soir')}
                  onChange={(e) => handleFilterChange('departureTimeFilter', e.target.value)}
                  className={`w-full p-2 border ${inputBorder} rounded-md ${inputBg} ${textColorPrimary}`}
                >
                  <option value="">Toutes</option>
                  <option value="matin">Matin (6h-12h)</option>
                  <option value="apres-midi">Après-midi (12h-18h)</option>
                  <option value="soir">Soir (18h-24h)</option>
                </select>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Options du Trajet</h4>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={searchCriteria.airConditionned}
                    onChange={(e) => handleFilterChange('isClimatise', e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Climatisé</span>
                </label>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={searchCriteria.luggageAllowed}
                    onChange={(e) => handleFilterChange('isLuggageIncluded', e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Bagages inclus</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchCriteria.notationOfCondutor >= 4}
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
                  value="1" // Correspond à la valeur 1 dans l'API pour Berline
                  checked={searchCriteria.vehiculeType === 1}
                  onChange={(e) => handleFilterChange('vehicleType', 'sedan')}
                  className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                />
                <span className={`ml-2 ${filterLabelColor}`}>Berline</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  name="vehicle_type"
                  value="2" // Correspond à 2 pour SUV
                  checked={searchCriteria.vehiculeType === 2}
                  onChange={(e) => handleFilterChange('vehicleType', 'suv')}
                  className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                />
                <span className={`ml-2 ${filterLabelColor}`}>SUV</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vehicle_type"
                  value="3" // Correspond à 3 pour Van
                  checked={searchCriteria.vehiculeType === 3}
                  onChange={(e) => handleFilterChange('vehicleType', 'van')}
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
            ) : trips? (
              <div className='flex flex-col gap-6'>
                {trips.map((trip) => (
                  <ResultCard key={trip.trip.id} trip={trip} />
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