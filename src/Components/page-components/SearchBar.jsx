import { faCalendarDays, faLocationDot, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import useMape from '../../hooks/useMap';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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

    // 🔥 Correction : format date propre
    const handleSearch = (e) => {
        e.preventDefault();

        if (!departure || !destination) {
            toast.error('Veuillez sélectionner un départ et une destination.');
            return;
        }

        const params = new URLSearchParams();

        params.append('departure', departure);
        params.append('destination', destination);

        // Heure formatée
        params.append('departureTime', departureTime.format('HH:mm'));

        // 🟢 Correction ici (ancien format incorrect)
        params.append('departureDate', departureDate.format('YYYY-MM-DD'));

        params.append('maxPrice', maxPrice);

        navigate(`/results?${params.toString()}`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <form
                onSubmit={handleSearch}
                className='absolute -bottom-[160px] z-10 lg:bottom-0 left-1/2 -translate-x-1/2
                    w-[95%] sm:w-[90%] md:w-[85%] lg:w-[calc(100%-4rem)]
                    flex flex-col lg:flex-row items-stretch
                    bg-white rounded-xl shadow-lg
                    text-gray-800 border border-gray-100'
            >

                <div className='flex flex-col lg:flex-row w-full lg:flex-grow'>

                    {/* Départ */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r 
                        border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-blue-500 mr-3' />
                        <input
                            type="text"
                            value={departure}
                            onChange={(e) => handleSearchChange(e.target.value, 'departure')}
                            onFocus={() => setActiveField('departure')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder='Départ'
                            className='flex-grow outline-none bg-transparent text-lg py-1'
                        />

                        {activeField === 'departure' && places.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg 
                                shadow-lg max-h-60 overflow-y-auto mt-1 z-40">
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
                                {error && <li className="p-3 text-red-500">{error}</li>}
                            </ul>
                        )}
                    </div>

                    {/* Destination */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r 
                        border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faLocationDot} className='text-xl text-green-500 mr-3' />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => handleSearchChange(e.target.value, 'destination')}
                            onFocus={() => setActiveField('destination')}
                            onBlur={() => setTimeout(() => setActiveField(null), 200)}
                            placeholder='Arrivée'
                            className='flex-grow outline-none bg-transparent text-lg py-1'
                        />

                        {activeField === 'destination' && places.length > 0 && (
                            <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg 
                                shadow-lg max-h-60 overflow-y-auto mt-1 z-20">
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
                                {error && <li className="p-3 text-red-500">{error}</li>}
                            </ul>
                        )}
                    </div>

                    {/* Date de départ */}
                    <div className='relative flex items-center p-3 sm:p-4 border-b lg:border-b-0 lg:border-r 
                        border-gray-200 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faCalendarDays} className='text-xl text-purple-500 mr-3' />

                        <DatePicker
                            label="Date de Départ"
                            value={departureDate}
                            onChange={(newValue) => setDepartureDate(newValue)}
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

                    {/* Prix max */}
                    <div className='relative flex items-center p-3 sm:p-4 hover:bg-gray-50 flex-grow cursor-pointer'>
                        <FontAwesomeIcon icon={faMoneyBillWave} className='text-xl text-orange-500 mr-3' />
                        <input
                            type="number"
                            min="0"
                            placeholder='Prix Max (ex: 50€)'
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className='flex-grow outline-none bg-transparent placeholder-gray-500 text-lg py-1'
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className='w-full lg:w-32 bg-green-500 hover:bg-green-600 text-white font-bold
                    py-4 lg:py-0 px-6 rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl
                    flex-shrink-0 transition-colors duration-200 flex items-center justify-center'
                >
                    Rechercher
                </button>

            </form>
        </LocalizationProvider>
    );
};

export default SearchBar;
