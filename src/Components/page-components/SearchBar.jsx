import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTrips from '../../hooks/useTrips';
import toast from 'react-hot-toast';

// Importations pour DatePicker de MUI
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SearchBar = () => {
  // 🔄 Utilisation de listPublicTrips au lieu de fetchTrips
  const { loading, error, listPublicTrips, setSearchResults } = useTrips();
  const navigate = useNavigate();

  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(dayjs());
  const [passengers, setPassengers] = useState(1);
  const [availableDepartures, setAvailableDepartures] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);

  // Fonction pour extraire et trier les villes uniques à partir de la nouvelle structure de données
  const getUniqueCities = (tripsData, type) => {
    const cities = new Set();
    tripsData.forEach(tripData => {
      // 🔄 Correction: Utilisation des nouvelles propriétés
      if (type === 'departure') {
        cities.add(tripData.departureArea.homeTownName);
      } else {
        cities.add(tripData.arrivalArea.homeTownName);
      }
    });
    return Array.from(cities).sort();
  };

  // 🔄 Chargement de la liste complète pour les dropdowns une seule fois
 /* useEffect(() => {
    const loadAllTrips = async () => {
      try {
        const { data } = await listPublicTrips({});
        if (data && data.trips) {
          setAvailableDepartures(getUniqueCities(data.trips, 'departure'));
          setAvailableDestinations(getUniqueCities(data.trips, 'destination'));
        }
      } catch (err) {
        console.error("Failed to load all trips for dropdowns:", err);
        // Le toast est déjà géré par le contexte en cas d'erreur
      }
    };
    loadAllTrips();
  }, [])*///listPublicTrips]);


  // Fonction de recherche mise à jour pour utiliser l'API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!departure || !destination) {
      toast.error('Veuillez sélectionner un départ et une destination.');
      return;
    }
    
    // 🔄 Construction des critères de recherche pour l'API
    const searchCriteria = {
      departureTown: departure,
      arrivalTown: destination,
      // Le format de la date peut varier, ici on prend le début de la journée
      departureDate: date.startOf('day').toISOString(), 
      availableSeats: passengers
    };

    try {
      const { data } = await listPublicTrips(searchCriteria);
      
      if (data && data.trips && data.trips.length > 0) {
        setSearchResults(data.trips); // Stocke les résultats dans le contexte
        toast.success(`${data.trips.length} trajet(s) trouvé(s) !`);
        navigate('/results'); // Redirige vers la page de résultats
      } else {
        setSearchResults([]); // Efface les anciens résultats
        toast.error("Aucun trajet ne correspond à votre recherche.");
      }
    } catch (err) {
      setSearchResults([]); // Efface les anciens résultats en cas d'échec
      // L'erreur est gérée par le toast dans le contexte
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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