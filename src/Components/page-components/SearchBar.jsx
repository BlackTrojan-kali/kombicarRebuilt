import { faCalendarDays, faLocationDot, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Importations pour DatePicker de MUI
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

// Importation du hook personnalisé pour le contexte de la carte
import useMape from '../../hooks/useMap';

const SearchBar = () => {
    const navigate = useNavigate();
    const { places, searchPlaces, loading, error } = useMape();

    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(dayjs());
    const [passengers, setPassengers] = useState(1);
    const [activeField, setActiveField] = useState(null); // 'departure' ou 'destination'

    const debounceTimeout = useRef(null);

    // Gère la saisie de l'input et la logique de debounce
    const handleSearchChange = (value, field) => {
        if (field === 'departure') {
            setDeparture(value);
        } else {
            setDestination(value);
        }
        
        setActiveField(field);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (value.length > 2) {
                // Appel à l'API de recherche
                searchPlaces(value);
            }
        }, 500);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!departure || !destination) {
            toast.error('Veuillez sélectionner un départ et une destination.');
            return;
        }

        const params = new URLSearchParams();
        params.append('departure', departure);
        params.append('destination', destination);
        params.append('date', date.toISOString());
        params.append('passengers', passengers);

        navigate(`/results?${params.toString()}`);
    };

    const handleSelectSuggestion = (place, type) => {
        if (type === 'departure') {
            setDeparture(place.description);
        } else {
            setDestination(place.description);
        }
        // Masquer les suggestions après la sélection
        setActiveField(null);
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="fr">
            <form
                onSubmit={handleSearch}
                className='absolute -bottom-14 z-10 lg:bottom-0 left-1/2 -translate-x-1/2
                           w-[95%] sm:w-[90%] md:w-[85%] lg:w-[calc(100%-4rem)] 
                           flex flex-col lg:flex-row items-stretch
                           bg-white rounded-xl shadow-lg overflow-hidden
                           text-gray-800 border border-gray-100'
            >
                <div className='flex flex-col lg:flex-row w-full lg:flex-grow'>
                    {/* Champ Départ */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
                        <input
                            type="text"
                            value={departure}
                            onChange={(e) => handleSearchChange(e.target.value, 'departure')}
                            onFocus={() => setActiveField('departure')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder='Depart'
                            className='flex-grow outline-none bg-transparent text-lg py-1'
                            aria-label="Lieu de départ"
                        />
                        {activeField === 'departure' && places.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1 z-20">
                                {loading ? (
                                    <li className="p-3 text-gray-500">Chargement...</li>
                                ) : (
                                    places.map((place) => (
                                        <li
                                            key={place.placeId}
                                            onMouseDown={() => handleSelectSuggestion(place, 'departure')}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {place.description}
                                        </li>
                                    ))
                                )}
                                {error && (
                                    <li className="p-3 text-red-500">{error}</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Champ Destination */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => handleSearchChange(e.target.value, 'destination')}
                            onFocus={() => setActiveField('destination')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder='Arrivée'
                            className='flex-grow outline-none bg-transparent text-lg py-1'
                            aria-label="Arrivée"
                        />
                        {activeField === 'destination' && places.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1 z-20">
                                {loading ? (
                                    <li className="p-3 text-gray-500">Chargement...</li>
                                ) : (
                                    places.map((place) => (
                                        <li
                                            key={place.placeId}
                                            onMouseDown={() => handleSelectSuggestion(place, 'destination')}
                                            className="p-3 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {place.description}
                                        </li>
                                    ))
                                )}
                                {error && (
                                    <li className="p-3 text-red-500">{error}</li>
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Champ Date */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            className='flex-grow w-full'
                            format="DD/MM/YYYY"
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
