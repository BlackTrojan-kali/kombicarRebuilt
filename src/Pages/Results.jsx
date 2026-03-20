import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ResultCard from '../Components/Cards/ResultCard';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faFilter, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import SearchBar from '../Components/page-components/SearchBar';
import { useSearchParams } from 'react-router-dom';

// Composant pour les sections de filtres (Style BlaBlaCar : Épuré, séparé par des lignes)
const FilterSection = ({ title, children, isLast = false }) => {
    const { theme } = useColorScheme();
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    const titleColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';

    return (
        <div className={`py-6 ${!isLast ? `border-b ${borderColor}` : ''}`}>
            <h3 className={`font-bold text-lg mb-5 ${titleColor}`}>{title}</h3>
            <div className="space-y-3">
                {children}
            </div>
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
    }, []);

    useEffect(() => {
        handleSearch(initialCriteria);
    }, [initialCriteria, handleSearch]); // <-- handleSearch ajouté aux deps

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

    // Variables de style
    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'; // Fond gris clair typique BlaBlaCar
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const filterLabelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
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
        <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300 min-h-screen font-sans`}>
            
            {/* Conteneur SearchBar ajusté pour ne pas casser le layout */}
            <div className='pt-[180px] lg:pt-[100px] relative z-20 max-w-7xl mx-auto'>
                <SearchBar />
            </div>

            <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-10 max-w-6xl mx-auto mt-20 lg:mt-8'>
                
                {/* En-tête de recherche dynamique type BlaBlaCar */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className={`text-2xl sm:text-4xl font-extrabold mb-2 ${textColorPrimary} flex flex-col md:flex-row items-center justify-center md:justify-start gap-3`}>
                        <span>{initialCriteria.departureTown || 'Départ indéfini'}</span>
                        <FontAwesomeIcon icon={faArrowRightLong} className="text-blue-500 hidden md:inline-block" />
                        <span>{initialCriteria.arrivalTown || 'Arrivée indéfinie'}</span>
                    </h1>
                    <p className={`text-[17px] ${textColorSecondary}`}>
                        {initialCriteria.date.format('dddd D MMMM YYYY')} • {initialCriteria.passengers} passager{initialCriteria.passengers > 1 ? 's' : ''}
                    </p>
                </div>

                <div className='flex flex-col md:flex-row gap-10'>
                    
                    {/* --- SIDEBAR FILTRES --- */}
                    <aside className='w-full md:w-1/3 lg:w-1/4 flex-shrink-0'>
                        <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faFilter} className="text-blue-500" />
                            <h2 className={`font-bold text-xl ${textColorPrimary}`}>Trier et filtrer</h2>
                        </div>

                        <FilterSection title="Prix Max.">
                            <input
                                type="range"
                                min="0"
                                max="50000"
                                step="500"
                                value={initialCriteria.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                            />
                            <div className={`flex justify-between text-sm font-medium ${textColorSecondary} mt-2`}>
                                <span>0 XAF</span>
                                <span className="text-blue-500">{initialCriteria.maxPrice > 0 ? `${initialCriteria.maxPrice} XAF` : "Illimité"}</span>
                            </div>
                        </FilterSection>

                        <FilterSection title="Heure de Départ">
                            <select
                                value={selectedTimeRange}
                                onChange={(e) => handleFilterChange('departureTimeFilter', e.target.value)}
                                className={`w-full p-3 border ${inputBorder} rounded-xl ${inputBg} ${textColorPrimary} shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow`}
                            >
                                <option value="all">Peu importe</option>
                                <option value="6-12">Matin (06:00 - 12:00)</option>
                                <option value="12-18">Après-midi (12:00 - 18:00)</option>
                                <option value="18-24">Soir (18:00 - 00:00)</option>
                            </select>
                        </FilterSection>

                        <FilterSection title="Options du Trajet">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={initialCriteria.airConditionned}
                                    onChange={(e) => handleFilterChange('isClimatise', e.target.checked)}
                                    className={`w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer ${inputBg}`}
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Climatisé</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={initialCriteria.luggageAllowed}
                                    onChange={(e) => handleFilterChange('isLuggageIncluded', e.target.checked)}
                                    className={`w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer ${inputBg}`}
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Bagages inclus</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={initialCriteria.notationOfCondutor > 0}
                                    onChange={(e) => handleFilterChange('isDriverRated4Plus', e.target.checked)}
                                    className={`w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer ${inputBg}`}
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Chauffeur noté 4+ étoiles</span>
                            </label>
                        </FilterSection>

                        <FilterSection title="Type de Véhicule" isLast={true}>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 0}
                                    onChange={() => handleFilterChange('vehicleType', '0')}
                                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Tous les véhicules</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 1}
                                    onChange={() => handleFilterChange('vehicleType', '1')}
                                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Berline</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 2}
                                    onChange={() => handleFilterChange('vehicleType', '2')}
                                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>SUV</span>
                            </label>
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="vehicle_type"
                                    checked={initialCriteria.vehiculeType === 3}
                                    onChange={() => handleFilterChange('vehicleType', '3')}
                                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                />
                                <span className={`ml-3 text-[15px] ${filterLabelColor} group-hover:text-blue-500 transition-colors`}>Van / Minibus</span>
                            </label>
                        </FilterSection>
                    </aside>

                    {/* --- LISTE DES RÉSULTATS --- */}
                    <section className='w-full md:w-2/3 lg:w-3/4'>
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-20">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                <p className={`text-lg font-medium ${textColorSecondary}`}>Recherche des meilleurs trajets...</p>
                            </div>
                        ) : trips && trips.length > 0 ? (
                            <>
                                <div className='flex flex-col gap-4'>
                                    {/* Vos ResultCards s'afficheront ici. Idéalement, assurez-vous que ResultCard a un fond blanc et des coins arrondis (rounded-2xl) */}
                                    {trips.map((tripData) => (
                                        <ResultCard key={tripData.trip.id} trip={tripData} />
                                    ))}
                                </div>
                                
                                {/* Pagination - Style épuré */}
                                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center text-[15px]">
                                    <div className={`mb-4 sm:mb-0 ${textColorSecondary}`}>
                                        Affichage de {Math.min(totalRows, (initialCriteria.page - 1) * initialCriteria.perPage + 1)} à {Math.min(totalRows, initialCriteria.page * initialCriteria.perPage)} sur {totalRows} trajets
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={!hasPrevious || loading}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${!hasPrevious || loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                                            aria-label="Page précédente"
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft} />
                                        </button>
                                        
                                        <span className={`px-4 py-2 font-semibold ${textColorPrimary}`}>
                                            {initialCriteria.page} / {totalPages || 1}
                                        </span>
                                        
                                        <button
                                            onClick={handleNextPage}
                                            disabled={!hasNext || loading}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${!hasNext || loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                                            aria-label="Page suivante"
                                        >
                                            <FontAwesomeIcon icon={faArrowRight} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faFilter} className="text-3xl text-gray-400" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${textColorPrimary}`}>Aucun trajet trouvé</h3>
                                <p className={`text-[17px] ${textColorSecondary} max-w-md mx-auto`}>
                                    Nous n'avons pas trouvé de trajets correspondant exactement à vos critères. Essayez d'élargir votre recherche.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Results;