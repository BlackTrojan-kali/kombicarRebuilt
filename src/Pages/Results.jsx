import React, { useState, useEffect } from 'react';
import ResultCard from '../Components/Cards/ResultCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faLocationDot, faUserGroup, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useTrips from '../hooks/useTrips'; // Importez le hook useTrips
import useColorScheme from '../hooks/useColorScheme'; // Importez le hook de thème

// Petit composant pour une section de filtre réutilisable
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

// SearchBar intégrée directement dans Results (ajustée pour la pleine largeur)
const IntegratedSearchBar = ({ onSearch, initialSearchCriteria }) => {
  const [departure, setDeparture] = useState(initialSearchCriteria.departure || '');
  const [destination, setDestination] = useState(initialSearchCriteria.destination || '');
  const [date, setDate] = useState(initialSearchCriteria.date ? dayjs(initialSearchCriteria.date) : dayjs());
  const [passengers, setPassengers] = useState(initialSearchCriteria.passengers || 1);

  const { theme } = useColorScheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      departure,
      destination,
      date: date.format('YYYY-MM-DD'),
      passengers,
    });
  };

  // Couleurs dynamiques pour la SearchBar
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
          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
            <input
              type="text"
              placeholder='Départ'
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className={`flex-grow outline-none bg-transparent ${placeholderColor} text-lg py-1 ${inputTextColor}`}
              aria-label="Lieu de départ"
            />
          </div>

          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
            <input
              type="text"
              placeholder='Destination'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={`flex-grow outline-none bg-transparent ${placeholderColor} text-lg py-1 ${inputTextColor}`}
              aria-label="Lieu de destination"
            />
          </div>

          <div className={`relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${inputBorder} ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              className='flex-grow w-full'
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: {
                    disableUnderline: true,
                    className: `text-lg ${inputTextColor}`,
                  },
                  sx: {
                    '& .MuiInputBase-input': {
                      padding: '8px 0 !important',
                      color: 'inherit',
                    },
                     '& .MuiInputLabel-root': {
                        color: theme === 'dark' ? 'rgb(156 163 175) !important' : 'rgb(107 114 128) !important', // gray-400/500
                     },
                     '& .MuiInputLabel-root.Mui-focused': {
                        color: theme === 'dark' ? 'rgb(168 85 247) !important' : 'rgb(147 51 234) !important', // purple-400/500
                     },
                     '& .MuiSvgIcon-root': {
                        color: theme === 'dark' ? 'rgb(168 85 247) !important' : 'rgb(147 51 234) !important', // purple-400/500
                     },
                  },
                },
              }}
            />
          </div>

          <div className={`relative flex items-center p-3 sm:p-4 ${hoverBg} flex-grow cursor-pointer`}>
            <FontAwesomeIcon icon={faUserGroup} className='text-xl text-orange-500 mr-3' />
            <input
              type="number"
              min="1"
              max="10"
              placeholder='Nb Personnes'
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
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
  const { trips, loading, error, fetchTrips } = useTrips();
  const { theme } = useColorScheme();

  // États pour les filtres
  const [maxPrice, setMaxPrice] = useState(10000);
  const [departureTimeFilter, setDepartureTimeFilter] = useState(''); // 'matin', 'apres-midi', 'soir'
  const [isClimatise, setIsClimatise] = useState(false);
  const [isLuggageIncluded, setIsLuggageIncluded] = useState(false);
  const [isDriverRated4Plus, setIsDriverRated4Plus] = useState(false);
  const [vehicleType, setVehicleType] = useState(''); // 'sedan', 'suv', 'van'

  // État pour les critères de recherche initiaux (passés à la SearchBar)
  const [searchCriteria, setSearchCriteria] = useState({
    departure: '',
    destination: '',
    date: dayjs().format('YYYY-MM-DD'),
    passengers: 1,
  });

  // Fonction pour déclencher la recherche avec les critères et les filtres
  const handleSearchAndFilter = (criteria = searchCriteria) => {
    setSearchCriteria(criteria); // Met à jour les critères de recherche
    
    const filters = {
      ...criteria, // Inclut les critères de recherche de la SearchBar
      maxPrice,
      departureTimeFilter,
      isClimatise,
      isLuggageIncluded,
      isDriverRated4Plus,
      vehicleType,
    };
    fetchTrips(filters); // Appelle fetchTrips avec tous les filtres
  };

  // Charger les trajets au montage du composant et lors des changements de filtres
  useEffect(() => {
    handleSearchAndFilter(); // Recherche initiale
  }, [maxPrice, departureTimeFilter, isClimatise, isLuggageIncluded, isDriverRated4Plus, vehicleType, searchCriteria.departure, searchCriteria.destination, searchCriteria.date, searchCriteria.passengers]); // Dépendances des filtres et critères de recherche

  // Logique de filtrage frontend
  const filteredTrips = trips.filter(trip => {
    // Filtre par prix maximum
    if (trip.prix > maxPrice) {
      return false;
    }

    // Filtre par heure de départ
    if (departureTimeFilter) {
      const hour = parseInt(trip.heure_depart.split('h')[0]);
      if (departureTimeFilter === 'matin' && hour >= 12) return false;
      if (departureTimeFilter === 'apres-midi' && (hour < 12 || hour >= 18)) return false;
      if (departureTimeFilter === 'soir' && hour < 18) return false;
    }

    // Filtre par option climatisé
    if (isClimatise && !trip.climatise) {
      return false;
    }

    // Filtre par bagages inclus
    if (isLuggageIncluded && !trip.luggageAllowed) {
      return false;
    }

    // Filtre par chauffeur noté 4+ étoiles
    if (isDriverRated4Plus && (!trip.chauffeur || trip.chauffeur.stars < 4)) {
      return false;
    }

    // Filtre par type de véhicule
    if (vehicleType && (!trip.vehicle || trip.vehicle.type !== vehicleType)) {
      return false;
    }

    // Filtres de la barre de recherche (déjà appliqués par fetchTrips, mais ici pour la cohérence si trips n'est pas rechargé)
    // Normalement, ces filtres seraient gérés par le backend via `fetchTrips(filters)`.
    // Mais si `trips` contient toutes les données et que le filtrage se fait purement en frontend,
    // ces conditions seraient nécessaires ici. Pour cet exemple, on suppose que `fetchTrips` gère déjà la recherche initiale.
    // Si l'API ne filtre pas, décommentez et ajustez ces lignes:
    /*
    if (searchCriteria.departure && trip.depart.toLowerCase() !== searchCriteria.departure.toLowerCase()) return false;
    if (searchCriteria.destination && trip.arrive.toLowerCase() !== searchCriteria.destination.toLowerCase()) return false;
    if (searchCriteria.date && trip.date !== searchCriteria.date) return false; // Assurez-vous que trip.date est au même format
    // Pas de filtre passagers ici, car la SearchBar le gère déjà et `availableSeats` est une propriété du trajet
    */

    return true;
  });


  // Couleurs dynamiques pour la page
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const filterLabelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';


  return (
    <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300 min-h-screen`}>

      {/* La SearchBar est maintenant sans padding latéral propre */}
      <div className="mb-12">
        <IntegratedSearchBar onSearch={handleSearchAndFilter} initialSearchCriteria={searchCriteria} />
      </div>

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-10 max-w-7xl mx-auto'>
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 ${textColorPrimary}`}>
          Résultats de votre recherche
        </h1>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Sidebar de Filtres */}
          <aside className='w-full md:w-1/4 lg:w-1/5 flex-shrink-0'>
            <FilterSection title="Filtres">
              {/* Contenu des filtres */}
              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Prix Max.</h4>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                />
                <div className={`flex justify-between text-xs ${textColorSecondary} mt-1`}>
                  <span>1000 XAF</span>
                  <span>{maxPrice} XAF</span> {/* Affiche la valeur actuelle */}
                </div>
              </div>

              <div className="mb-4">
                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Heure de Départ</h4>
                <select
                  value={departureTimeFilter}
                  onChange={(e) => setDepartureTimeFilter(e.target.value)}
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
                    checked={isClimatise}
                    onChange={(e) => setIsClimatise(e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Climatisé</span>
                </label>
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={isLuggageIncluded}
                    onChange={(e) => setIsLuggageIncluded(e.target.checked)}
                    className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                  />
                  <span className={`ml-2 ${filterLabelColor}`}>Bagages inclus</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isDriverRated4Plus}
                    onChange={(e) => setIsDriverRated4Plus(e.target.checked)}
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
                      checked={vehicleType === 'sedan'}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>Berline</span>
                </label>
                <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="vehicle_type"
                      value="suv"
                      checked={vehicleType === 'suv'}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>SUV</span>
                </label>
                <label className="flex items-center">
                    <input
                      type="radio"
                      name="vehicle_type"
                      value="van"
                      checked={vehicleType === 'van'}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                    />
                    <span className={`ml-2 ${filterLabelColor}`}>Van / Minibus</span>
                </label>
            </FilterSection>
          </aside>

          {/* Section des Résultats de Recherche */}
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
