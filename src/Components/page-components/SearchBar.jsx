import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

// Importations pour DatePicker de MUI
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SearchBar = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(dayjs()); // Initialise avec la date actuelle
  const [passengers, setPassengers] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      departure,
      destination,
      date: date.format('YYYY-MM-DD'), // Format the date for submission
      passengers,
    });
    // Ici, vous feriez votre logique de recherche (appel API, redirection, etc.)
    // Exemple de redirection (décommenter pour tester) :
    // window.location.href = `/search?departure=${departure}&destination=${destination}&date=${date.format('YYYY-MM-DD')}&passengers=${passengers}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Conteneur principal du formulaire */}
      <form
        onSubmit={handleSubmit}
        className='absolute -bottom-14 z-10 lg:bottom-0 left-1/2 -translate-x-1/2
                   w-[95%] sm:w-[90%] md:w-[85%] lg:w-[calc(100%-4rem)] 
                   flex flex-col lg:flex-row items-stretch
                   bg-white rounded-xl shadow-lg overflow-hidden
                   text-gray-800 border border-gray-100'
      >
        {/* Champs de recherche */}
        <div className='flex flex-col lg:flex-row w-full lg:flex-grow'> {/* Changed to lg:flex-grow for better distribution */}
          {/* Champ Départ */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'> {/* Added cursor-pointer */}
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
            <input
              type="text"
              placeholder='Départ'
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1' // Added py-1 for consistent height
              aria-label="Lieu de départ"
            />
          </div>

          {/* Champ Destination */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
            <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
            <input
              type="text"
              placeholder='Destination'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1' // Added py-1
              aria-label="Lieu de destination"
            />
          </div>

          {/* Champ Date */}
          <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
            <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              className='flex-grow w-full' // Added w-full to ensure it takes available space
              slotProps={{
                textField: {
                  variant: 'standard',
                  InputProps: {
                    disableUnderline: true,
                    className: 'text-lg',
                  },
                  sx: { // Use sx for custom styling on MUI components
                    '& .MuiInputBase-input': { // Target the actual input element
                      padding: '8px 0 !important', // Ensure consistent vertical padding
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
              className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1' // Added py-1
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
                     flex items-center justify-center' // Added flexbox for vertical centering of text if py-0 is used
        >
          Rechercher
        </button>
      </form>
    </LocalizationProvider>
  );
};

export default SearchBar;