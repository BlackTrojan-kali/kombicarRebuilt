import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarDays, 
    faLocationDot, 
    faMoneyBillWave, 
    faMagnifyingGlass 
} from '@fortawesome/free-solid-svg-icons';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import useMape from '../../hooks/useMap';

const SearchBar = () => {
    const navigate = useNavigate();
    const { places, searchPlaces, loading, error } = useMape();

    // States
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [departureTime, setDepartureTime] = useState(dayjs().hour(0).minute(0));
    const [departureDate, setDepartureDate] = useState(dayjs());
    const [maxPrice, setMaxPrice] = useState(0);

    const [activeField, setActiveField] = useState(null);
    const debounceTimeout = useRef(null);

    // Débouçage recherche
    const handleSearchChange = (value, field) => {
        if (field === 'departure') setDeparture(value);
        else setDestination(value);

        setActiveField(field);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (value.length > 2) searchPlaces(value);
        }, 500);
    };

    // Sélection des suggestions
    const handleSelectSuggestion = (place, type) => {
        if (type === 'departure') setDeparture(place.description);
        else setDestination(place.description);

        setActiveField(null);
    };

    // Format de date propre pour l'URL
    const handleSearch = (e) => {
        e.preventDefault();

        if (!departure || !destination) {
            toast.error('Veuillez sélectionner un départ et une destination.');
            return;
        }

        const params = new URLSearchParams();

        params.append('departure', departure);
        params.append('destination', destination);
        params.append('departureTime', departureTime.format('HH:mm'));
        params.append('departureDate', departureDate.format('YYYY-MM-DD'));
        params.append('maxPrice', maxPrice);

        navigate(`/results?${params.toString()}`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            {/* Conteneur principal "Pilule" élargi */}
            <form
                onSubmit={handleSearch}
                className='absolute -bottom-[180px] lg:-bottom-14 left-1/2 -translate-x-1/2 z-20
                    w-[95%] sm:w-[90%] md:w-[85%] lg:w-[90%] xl:w-[80%] max-w-[1200px]
                    flex flex-col lg:flex-row items-stretch lg:items-center
                    bg-white/95 backdrop-blur-sm rounded-3xl lg:rounded-full shadow-2xl
                    text-gray-800 p-2 lg:p-3 border border-gray-100 gap-2 lg:gap-0'
            >
                <div className='flex flex-col lg:flex-row w-full lg:flex-grow divide-y lg:divide-y-0 lg:divide-x divide-gray-200'>

                    {/* Départ */}
                    <div className='relative flex flex-1 items-center px-4 lg:px-6 py-4 hover:bg-gray-50/80 lg:rounded-l-full cursor-text transition-colors'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-gray-400 mr-3' />
                        <input
                            type="text"
                            value={departure}
                            onChange={(e) => handleSearchChange(e.target.value, 'departure')}
                            onFocus={() => setActiveField('departure')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder='Ville de départ'
                            className='flex-grow outline-none bg-transparent text-base font-medium placeholder-gray-400 w-full truncate'
                        />

                        {activeField === 'departure' && places.length > 0 && (
                            <ul className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-40 p-2">
                                {loading ? (
                                    <li className="p-3 text-gray-500 text-sm">Chargement...</li>
                                ) : (
                                    places.map((place) => (
                                        <li
                                            key={place.placeId}
                                            onMouseDown={() => handleSelectSuggestion(place, 'departure')}
                                            className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer text-sm font-medium transition-colors"
                                        >
                                            {place.description}
                                        </li>
                                    ))
                                )}
                                {error && <li className="p-3 text-red-500 text-sm">{error}</li>}
                            </ul>
                        )}
                    </div>

                    {/* Destination */}
                    <div className='relative flex flex-1 items-center px-4 lg:px-6 py-4 hover:bg-gray-50/80 cursor-text transition-colors'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-gray-400 mr-3' />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => handleSearchChange(e.target.value, 'destination')}
                            onFocus={() => setActiveField('destination')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder="Ville d'arrivée"
                            className='flex-grow outline-none bg-transparent text-base font-medium placeholder-gray-400 w-full truncate'
                        />

                        {activeField === 'destination' && places.length > 0 && (
                            <ul className="absolute top-[110%] left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-40 p-2">
                                {loading ? (
                                    <li className="p-3 text-gray-500 text-sm">Chargement...</li>
                                ) : (
                                    places.map((place) => (
                                        <li
                                            key={place.placeId}
                                            onMouseDown={() => handleSelectSuggestion(place, 'destination')}
                                            className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer text-sm font-medium transition-colors"
                                        >
                                            {place.description}
                                        </li>
                                    ))
                                )}
                                {error && <li className="p-3 text-red-500 text-sm">{error}</li>}
                            </ul>
                        )}
                    </div>

                    {/* Date de départ */}
                    <div className='relative flex flex-1 items-center px-4 lg:px-6 py-4 hover:bg-gray-50/80 cursor-pointer transition-colors'>
                        <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-gray-400 mr-3' />
                        <div className="flex-grow overflow-hidden">
                            <DatePicker
                                value={departureDate}
                                onChange={(newValue) => setDepartureDate(newValue)}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        variant: 'standard',
                                        placeholder: "Date de départ",
                                        InputProps: {
                                            disableUnderline: true,
                                            className: 'text-base font-medium text-gray-800 cursor-pointer',
                                        },
                                        sx: {
                                            width: '100%',
                                            '& .MuiInputBase-input': {
                                                padding: '0 !important',
                                                cursor: 'pointer',
                                                '&::placeholder': {
                                                    color: '#9ca3af',
                                                    opacity: 1,
                                                }
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Prix max */}
                    <div className='relative flex flex-1 items-center px-4 lg:px-6 py-4 hover:bg-gray-50/80 cursor-text transition-colors'>
                        <FontAwesomeIcon icon={faMoneyBillWave} className='text-xl text-gray-400 mr-3' />
                        <input
                            type="number"
                            min="0"
                            placeholder='Prix Max (ex: 50€)'
                            value={maxPrice === 0 ? '' : maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className='flex-grow outline-none bg-transparent placeholder-gray-400 text-base font-medium w-full'
                        />
                    </div>
                </div>

                {/* Bouton de recherche */}
                <button
                    type="submit"
                    className='w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold
                    py-4 lg:py-5 px-10 rounded-2xl lg:rounded-full
                    flex-shrink-0 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl mt-2 lg:mt-0 lg:ml-2'
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base" />
                    <span className="text-base tracking-wide">Rechercher</span>
                </button>

            </form>
        </LocalizationProvider>
    );
};

export default SearchBar;