import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ResultCard from '../Components/Cards/ResultCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import SearchBar from '../Components/page-components/SearchBar';
import { useSearchParams } from 'react-router-dom';

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

// Composant principal Results
const Results = () => {
    const { trips, loading, error, listPublicTrips } = useTrips();
    const { theme } = useColorScheme();
    const [searchParams, setSearchParams] = useSearchParams();

    const initialCriteria = useMemo(() => {
        const params = Object.fromEntries(searchParams.entries());
        return {
            page: Number(params.page) || 1,
            perPage: Number(params.perPage) || 6,
            tripStatus: Number(params.tripStatus) || 0,
            maxPrice: Number(params.maxPrice) || 0,
            tripDepartureHour: {
                acceptAllHour: params.acceptAllHour === 'false' ? false : true,
                startHour: Number(params.startHour) || 0,
                endHour: Number(params.endHour) || 0,
            },
            airConditionned: params.airConditionned === 'true',
            luggageAllowed: params.luggageAllowed === 'true',
            vehiculeType: Number(params.vehiculeType) || 0,
            notationOfCondutor: Number(params.notationOfCondutor) || 0,
            departureTown: params.departure || '',
            arrivalTown: params.destination || '',
            date: params.date ? dayjs(params.date) : dayjs(),
            passengers: Number(params.passengers) || 1,
        };
    }, [searchParams]);

    const [totalRows, setTotalRows] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    // Fonction pour déclencher la recherche avec les critères de l'URL
    const handleSearch = useCallback(async (criteria) => {
        try {
            const payload = {
                page: criteria.page,
                perPage: criteria.perPage,
                tripStatus: criteria.tripStatus,
                ...(criteria.departureTown && { startAreaCity: criteria.departureTown }),
                ...(criteria.arrivalTown && { endAreaCity: criteria.arrivalTown }),
                ...(criteria.maxPrice > 0 && { maxPrice: criteria.maxPrice }),
                ...(criteria.airConditionned && { airConditionned: criteria.airConditionned }),
                ...(criteria.luggageAllowed && { luggageAllowed: criteria.luggageAllowed }),
                ...(criteria.vehiculeType > 0 && { vehiculeType: criteria.vehiculeType }),
                ...(criteria.notationOfCondutor > 0 && { notationOfCondutor: criteria.notationOfCondutor }),
                ...(criteria.tripDepartureHour.acceptAllHour === false && { tripDepartureHour: criteria.tripDepartureHour }),
                ...(criteria.date && { date: criteria.date.format('YYYY-MM-DD') }),
                ...(criteria.passengers > 0 && { availableSeats: criteria.passengers }),
            };
            
            const data = await listPublicTrips(payload);
           
            if (data) {
                setTotalRows(data.totalCount);
                setHasNext(data.hasNextPage);
                setHasPrevious(data.hasPreviousPage);
            }
        } catch (err) {
            console.error("Erreur lors de la recherche des trajets :", err);
        }
    }, [listPublicTrips]);

    useEffect(() => {
        handleSearch(initialCriteria);
    }, [initialCriteria]);

    // Fonction générique pour mettre à jour un filtre
    const handleFilterChange = (filterName, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1'); // Réinitialise à la page 1

        if (filterName === 'maxPrice') {
            newSearchParams.set('maxPrice', value);
        } else if (filterName === 'departureTimeFilter') {
            if (value === 'all') {
                newSearchParams.set('acceptAllHour', true);
                newSearchParams.delete('startHour');
                newSearchParams.delete('endHour');
            } else {
                newSearchParams.set('acceptAllHour', false);
                const [start, end] = value.split('-');
                newSearchParams.set('startHour', start);
                newSearchParams.set('endHour', end);
            }
        } else if (filterName === 'isClimatise') {
            newSearchParams.set('airConditionned', value);
        } else if (filterName === 'isLuggageIncluded') {
            newSearchParams.set('luggageAllowed', value);
        } else if (filterName === 'isDriverRated4Plus') {
            newSearchParams.set('notationOfCondutor', value ? '4' : '0');
        } else if (filterName === 'vehicleType') {
            newSearchParams.set('vehiculeType', value);
        }

        setSearchParams(newSearchParams);
    };

    const totalPages = Math.ceil(totalRows / initialCriteria.perPage);
    
    const handleNextPage = () => {
        if (hasNext) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', initialCriteria.page + 1);
            setSearchParams(newSearchParams);
        }
    };
    
    const handlePreviousPage = () => {
        if (hasPrevious) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('page', initialCriteria.page - 1);
            setSearchParams(newSearchParams);
        }
    };

    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const filterLabelColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
    const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    
    // Pour la valeur du select des heures
    const selectedTimeRange = useMemo(() => {
        if (initialCriteria.tripDepartureHour.acceptAllHour) return 'all';
        const start = initialCriteria.tripDepartureHour.startHour;
        const end = initialCriteria.tripDepartureHour.endHour;
        if (start === 6 && end === 12) return '6-12';
        if (start === 12 && end === 18) return '12-18';
        if (start === 18 && end === 24) return '18-24';
        return 'all';
    }, [initialCriteria.tripDepartureHour]);

    return (
        <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300 min-h-screen`}>
            <div className='mt-[350px] lg:mt-[150px] relative'>
                <SearchBar />
            </div>
            <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-14 max-w-7xl mx-auto'>
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-12 ${textColorPrimary}`}>
                    Résultats de votre recherche
                </h1>
                <div className='flex flex-col md:flex-row gap-8'>
                    <aside className='w-full md:w-1/4 lg:w-1/5 flex-shrink-0'>
                        <FilterSection title="Filtres">
                            <div className="mb-4">
                                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Prix Max.</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="500"
                                    value={initialCriteria.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-green-500"
                                />
                                <div className={`flex justify-between text-xs ${textColorSecondary} mt-1`}>
                                    <span>0 XAF</span>
                                    <span>{initialCriteria.maxPrice > 0 ? `${initialCriteria.maxPrice} XAF` : "Illimité"}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Heure de Départ</h4>
                                <select
                                    value={selectedTimeRange}
                                    onChange={(e) => handleFilterChange('departureTimeFilter', e.target.value)}
                                    className={`w-full p-2 border ${inputBorder} rounded-md ${inputBg} ${textColorPrimary}`}
                                >
                                    <option value="all">Toutes</option>
                                    <option value="6-12">Matin (6h-12h)</option>
                                    <option value="12-18">Après-midi (12h-18h)</option>
                                    <option value="18-24">Soir (18h-24h)</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <h4 className={`font-semibold ${filterLabelColor} mb-2`}>Options du Trajet</h4>
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={initialCriteria.airConditionned}
                                        onChange={(e) => handleFilterChange('isClimatise', e.target.checked)}
                                        className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                                    />
                                    <span className={`ml-2 ${filterLabelColor}`}>Climatisé</span>
                                </label>
                                <label className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={initialCriteria.luggageAllowed}
                                        onChange={(e) => handleFilterChange('isLuggageIncluded', e.target.checked)}
                                        className={`form-checkbox text-green-500 rounded ${inputBg} ${inputBorder}`}
                                    />
                                    <span className={`ml-2 ${filterLabelColor}`}>Bagages inclus</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={initialCriteria.notationOfCondutor > 0}
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
                                    checked={initialCriteria.vehiculeType === 1}
                                    onChange={() => handleFilterChange('vehicleType', '1')}
                                    className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                                />
                                <span className={`ml-2 ${filterLabelColor}`}>Berline</span>
                            </label>
                            <label className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 2}
                                    onChange={() => handleFilterChange('vehicleType', '2')}
                                    className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                                />
                                <span className={`ml-2 ${filterLabelColor}`}>SUV</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 3}
                                    onChange={() => handleFilterChange('vehicleType', '3')}
                                    className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                                />
                                <span className={`ml-2 ${filterLabelColor}`}>Van / Minibus</span>
                            </label>
                            <label className="flex items-center mt-2">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 0}
                                    onChange={() => handleFilterChange('vehicleType', '0')}
                                    className={`form-radio text-blue-500 ${inputBg} ${inputBorder}`}
                                />
                                <span className={`ml-2 ${filterLabelColor}`}>Tous les véhicules</span>
                            </label>
                        </FilterSection>
                    </aside>
                    <section className='w-full md:w-3/4 lg:w-4/5'>
                        {loading ? (
                            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <p className={`${textColorSecondary}`}>Chargement des trajets...</p>
                            </div>
                        ) : trips && trips.length > 0 ? (
                            <>
                                <div className='flex flex-col gap-6'>
                                    {trips.map((tripData) => (
                                        <ResultCard key={tripData.trip.id} trip={tripData} />
                                    ))}
                                </div>
                                <div className={`mt-8 flex flex-col sm:flex-row justify-between items-center text-sm p-4 rounded-md shadow ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                                    <div className="mb-2 sm:mb-0">
                                        Affichage de {Math.min(totalRows, (initialCriteria.page - 1) * initialCriteria.perPage + 1)} à {Math.min(totalRows, initialCriteria.page * initialCriteria.perPage)} sur {totalRows} trajets.
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={!hasPrevious || loading}
                                            className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasPrevious || loading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                            Précédent
                                        </button>
                                        <span className={`px-4 py-2 rounded-md font-bold ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                            Page {initialCriteria.page} sur {totalPages || 1}
                                        </span>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={!hasNext || loading}
                                            className={`px-4 py-2 rounded-md transition-colors duration-200 ${!hasNext || loading ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            Suivant
                                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </>
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