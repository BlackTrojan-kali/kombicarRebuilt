import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useNavigate
import useTrips from '../../hooks/useTrips';
import toast from 'react-hot-toast'; // Pour les notifications

// Importations pour DatePicker de MUI
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SearchBar = () => {
  // Utilisez le contexte pour accéder aux trajets et à l'état de chargement
  const { trips, loading, error, fetchTrips, setSearchResults } = useTrips();
  const navigate = useNavigate(); // Hook pour la navigation

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(dayjs()); // Initialise avec la date actuelle
  const [passengers, setPassengers] = useState(1);
  const [availableDepartures, setAvailableDepartures] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);

  // Fonction pour extraire et trier les villes uniques
  const getUniqueCities = (trips, type) => {
    const cities = new Set();
    trips.forEach(trip => {
      if (type === 'departure') {
        cities.add(trip.depart);
      } else {
        cities.add(trip.arrive);
      }
    });
    return Array.from(cities).sort();
  };

  // Charge les trajets au premier rendu et met à jour les listes de villes
  useEffect(() => {
    // Si les trajets ne sont pas encore chargés, on les récupère.
    if (trips.length === 0 && !loading && !error) {
        fetchTrips();
    }
  }, [fetchTrips, trips, loading, error]);

  useEffect(() => {
    if (trips.length > 0) {
      setAvailableDepartures(getUniqueCities(trips, 'departure'));
      setAvailableDestinations(getUniqueCities(trips, 'destination'));
    }
  }, [trips]);


  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (!departure || !destination) {
      toast.error('Veuillez sélectionner un départ et une destination.');
      return;
    }
    
    // Filtre les trajets déjà chargés en mémoire
    const filteredTrips = trips.filter(trip => {
      const tripDate = dayjs(trip.date_depart);
      const isSameDate = tripDate.isSame(date, 'day');
      // Pour les passagers, on suppose une propriété `seats` sur le trajet
      const hasEnoughSeats = (trip.seats || 4) >= passengers;
      
      return (
        trip.depart.toLowerCase() === departure.toLowerCase() &&
        trip.arrive.toLowerCase() === destination.toLowerCase() &&
        isSameDate &&
        hasEnoughSeats
      );
    });

    if (filteredTrips.length > 0) {
      setSearchResults(filteredTrips); // Stocke les résultats dans le contexte
      toast.success(`${filteredTrips.length} trajet(s) trouvé(s) !`);
      navigate('/results'); // Redirige vers la page de résultats
    } else {
      setSearchResults([]); // Efface les anciens résultats
      toast.error("Aucun trajet ne correspond à votre recherche.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Conteneur principal du formulaire */}
      <form
        onSubmit={handleSearch}
        className='absolute -bottom-14 z-10 lg:bottom-0 left-1/2 -translate-x-1/2
                   w-[95%] sm:w-[90%] md:w-[85%] lg:w-[calc(100%-4rem)] 
                   flex flex-col lg:flex-row items-stretch
                   bg-white rounded-xl shadow-lg overflow-hidden
                   text-gray-800 border border-gray-100'
      >
        {/* Champs de recherche */}
        <div className='flex flex-col lg:flex-row w-full lg:flex-grow'>
          {/* Champ Départ */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
            <select
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className='flex-grow outline-none bg-transparent text-lg py-1'
              aria-label="Lieu de départ"
            >
              <option value="" disabled>Départ</option>
              {availableDepartures.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Champ Destination */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='flex-grow outline-none bg-transparent text-lg py-1'
              aria-label="Lieu de destination"
            >
              <option value="" disabled>Destination</option>
              {availableDestinations.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Champ Date */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
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
                    className: 'text-lg',
                  },
                  sx: {
                    '& .MuiInputBase-input': {
                      padding: '8px 0 !important',
                    },
                  },
                },
              }}
            />
          </div>

          {/* Champ Nombre de personnes */}
          <div className='relative flex items-center p-3 sm:p-4 hover:bg-gray-50 flex-grow cursor-pointer'>
            <FontAwesomeIcon icon={faUserGroup} className='text-xl text-orange-500 mr-3' />
            <input
              type="number"
              min="1"
              max="10"
              placeholder='Nb Personnes'
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1'
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

export default SearchBar;
