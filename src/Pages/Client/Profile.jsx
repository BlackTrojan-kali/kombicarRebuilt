import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faUserCircle, faCarSide, faStar,
    faPlusCircle, faHistory, faRoute, faInfoCircle, faWallet,
    faEdit, faTimesCircle, faTrash, faIdCard, faBookmark,
    faSpinner, faCamera, faCalendarAlt, faMoneyBillWave,
    faArrowLeft, faArrowRight, faUsers, faArrowRightLong, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Swal from 'sweetalert2';

import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import EditTripModal from '../../Components/Modals/EditTripModal';
import EditProfileModal from '../../Components/Modals/EditProfileModal'; 

dayjs.locale('fr');

const generateInitialsSvg = (firstName, lastName, theme) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const bgColor = theme === 'dark' ? '#374151' : '#E5E7EB';
    const textColor = theme === 'dark' ? '#F9FAFB' : '#1F2937';

    const svg = `<svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="150" rx="75" fill="${bgColor}"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="${textColor}">
            ${initials}
        </text>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const Pagination = ({ page, totalPages, setPage, theme }) => {
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    return (
        <div className={`flex justify-center items-center gap-4 mt-8 text-[15px] ${textColorPrimary}`}>
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                aria-label="Page précédente"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span className={`px-4 py-2 rounded-full font-semibold ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {page} / {totalPages || 1}
            </span>
            <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${page >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                aria-label="Page suivante"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
};

const Profile = () => {
    const { user, loading: loadingUser, uploadProfilePicture, API_URL } = useAuth();
    const { fetchTrips, cancelTrip, deleteTrip } = useTrips();
    const { theme } = useColorScheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [publishedTrips, setPublishedTrips] = useState([]);
    const [completedTrips, setCompletedTrips] = useState([]);
    const [loadingSpecificTrips, setLoadingSpecificTrips] = useState(true);
    const [publishedPage, setPublishedPage] = useState(1);
    const [publishedTotalPages, setPublishedTotalPages] = useState(0);
    const [completedPage, setCompletedPage] = useState(1);
    const [completedTotalPages, setCompletedTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [selectedTrip, setSelectedTrip] = useState(null);

    const loadUserTrips = async (page, status, setTrips, setTotalPages) => {
        if (!user || loadingUser) return;
        setLoadingSpecificTrips(true);
        const perPage = 5; 
        try {
            const response = await fetchTrips({ pageIndex: page, status: status, pageSize: perPage });
            setTrips(response.items || []);
            setTotalPages(Math.ceil(response.totalCount / perPage));
        } catch (err) {
            console.error(`Erreur lors de la récupération des trajets (statut ${status}):`, err);
        } finally {
            setLoadingSpecificTrips(false);
        }
    };

    useEffect(() => {
        if (!user && !loadingUser) {
            navigate('/auth/signin');
        } else if (user) {
            loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
            loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
        }
    }, [user, loadingUser, navigate, publishedPage, completedPage]);

    const handleEditTrip = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTrip(null);
        loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
        loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
    };

    const handleViewReservations = (tripId) => {
        navigate(`driver-reservations/${tripId}`);
    };

    const handleOpenEditProfileModal = () => setIsEditProfileModalOpen(true);
    const handleCloseEditProfileModal = () => {
        setIsEditProfileModalOpen(false);
        loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
        loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
    }

    const handleCancelTrip = async (tripId) => {
        const result = await Swal.fire({
            title: 'Annuler ce trajet ?',
            text: "Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible et les passagers seront notifiés.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, annuler !',
            cancelButtonText: 'Non, garder',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
            borderRadius: '1rem',
        });

        if (result.isConfirmed) {
            const success = await cancelTrip(tripId);
            if (success) {
                loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
            }
        }
    };

    const handleDeleteTrip = async (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Vous êtes sur le point de supprimer le trajet "${tripDescription}". Cette action est irréversible !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DC2626',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
            borderRadius: '1rem',
        });

        if (result.isConfirmed) {
            await deleteTrip(tripId);
            loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
        }
    };

    const handleViewReviews = (tripId) => {
        navigate(`/reviews/${tripId}`);
    };

    const handleSubmitReview = (tripId) => {
        navigate(`/reviews/create/${tripId}`);
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await uploadProfilePicture(file);
        }
    };

    // Design épuré
    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50/5'; // Fond grisâtre
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
    const pillBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
    
    if (loadingUser || loadingSpecificTrips) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-500">Chargement de votre espace...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-28 pb-20 transition-colors duration-300 font-sans`}>
            <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* --- HEADER PROFIL --- */}
                <div className={`${cardBg} rounded-[2rem] shadow-sm p-8 sm:p-10 mb-10 border ${borderColor} relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-blue-400 opacity-20"></div>
                    
                    <div className='flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 relative z-10 -mt-2'>
                        
                        {/* Photo de Profil */}
                        <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 group'>
                            <img
                                src={user.pictureProfileUrl ? `${API_URL}${user.pictureProfileUrl}` : generateInitialsSvg(user.firstName, user.lastName, theme)}
                                alt={`Profil de ${user.firstName} ${user.lastName}`}
                                className={`w-full h-full rounded-full object-cover border-4 ${cardBg} shadow-md transition-opacity duration-300 group-hover:opacity-80`}
                            />
                            <div
                                onClick={handleImageClick}
                                className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        {/* Infos Utilisateur */}
                        <div className='text-center md:text-left flex-1 mb-2'>
                            <h1 className={`text-3xl sm:text-4xl font-extrabold ${textColorPrimary} mb-2`}>
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className={`text-[15px] font-medium ${textColorSecondary} mb-4 flex items-center justify-center md:justify-start gap-2`}>
                                <FontAwesomeIcon icon={faUserCircle} className='text-blue-500' />
                                Membre depuis {dayjs(user.createdAt).format('MMMM YYYY')}
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {user.email && (
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${pillBg} ${textColorPrimary}`}>
                                        <FontAwesomeIcon icon={faEnvelope} className='mr-2 text-gray-400' /> {user.email}
                                    </span>
                                )}
                                {user.phoneNumber && (
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${pillBg} ${textColorPrimary}`}>
                                        <FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-400' /> {user.phoneNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Bouton Modifier */}
                        <div className='mt-6 md:mt-0 flex-shrink-0 mb-2'>
                            <button
                                onClick={handleOpenEditProfileModal}
                                className="px-6 py-3 text-[15px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors shadow-sm"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" /> Modifier le Profil
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MENU D'ACTIONS RAPIDES (Style Cartes) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    <button
                        onClick={() => navigate('/profile/car')}
                        className={`${cardBg} flex flex-col items-center justify-center p-6 rounded-3xl border ${borderColor} hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group`}
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faCarSide} className="text-2xl" />
                        </div>
                        <span className={`text-[15px] font-semibold ${textColorPrimary}`}>Véhicules</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/profile/reservations')}
                        className={`${cardBg} flex flex-col items-center justify-center p-6 rounded-3xl border ${borderColor} hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all group`}
                    >
                        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faBookmark} className="text-2xl" />
                        </div>
                        <span className={`text-[15px] font-semibold ${textColorPrimary}`}>Réservations</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/profile/withdrawals')}
                        className={`${cardBg} flex flex-col items-center justify-center p-6 rounded-3xl border ${borderColor} hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all group`}
                    >
                        <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faWallet} className="text-2xl" />
                        </div>
                        <span className={`text-[15px] font-semibold ${textColorPrimary}`}>Retraits</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/profile/licence')}
                        className={`${cardBg} flex flex-col items-center justify-center p-6 rounded-3xl border ${borderColor} hover:shadow-md hover:border-orange-300 dark:hover:border-orange-700 transition-all group`}
                    >
                        <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <FontAwesomeIcon icon={faIdCard} className="text-2xl" />
                        </div>
                        <span className={`text-[15px] font-semibold ${textColorPrimary}`}>Permis</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* --- A PROPOS --- */}
                    {user.bio && (
                        <div className={`md:col-span-1 ${cardBg} rounded-3xl shadow-sm p-8 border ${borderColor}`}>
                            <h2 className={`text-xl font-bold ${textColorPrimary} mb-4`}>
                                À propos de moi
                            </h2>
                            <p className={`text-[15px] leading-relaxed ${textColorSecondary} italic`}>"{user.bio}"</p>
                        </div>
                    )}

                    {/* --- STATISTIQUES --- */}
                    <div className={`${user.bio ? 'md:col-span-2' : 'md:col-span-3'} ${cardBg} rounded-3xl shadow-sm p-8 border ${borderColor}`}>
                        <h2 className={`text-xl font-bold ${textColorPrimary} mb-6`}>
                            Statistiques
                        </h2>
                        <div className='flex flex-wrap gap-4 sm:gap-8'>
                            <div className="flex flex-col">
                                <span className={`text-3xl font-extrabold ${textColorPrimary}`}>{user.tripsCompleted || 0}</span>
                                <span className={`text-[15px] font-medium ${textColorSecondary}`}>Trajets effectués</span>
                            </div>
                            <div className={`w-px h-12 ${borderColor} border-r hidden sm:block`}></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-extrabold text-yellow-500 flex items-center gap-2">
                                    {user?.note ? user.note.toFixed(1) : 'N/A'} <FontAwesomeIcon icon={faStar} className="text-xl" />
                                </span>
                                <span className={`text-[15px] font-medium ${textColorSecondary}`}>Note moyenne</span>
                            </div>
                            <div className={`w-px h-12 ${borderColor} border-r hidden sm:block`}></div>
                            <div className="flex flex-col">
                                <span className={`text-3xl font-extrabold ${textColorPrimary}`}>{user?.balance || 0} <span className="text-lg">XAF</span></span>
                                <span className={`text-[15px] font-medium ${textColorSecondary}`}>Solde</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MES TRAJETS PUBLIÉS --- */}
                <div className={`${cardBg} rounded-3xl shadow-sm p-6 sm:p-10 mb-10 border ${borderColor}`}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className={`text-2xl font-bold ${textColorPrimary}`}>
                            Trajets publiés
                        </h2>
                        <Link to="/publish-trip" className="hidden sm:flex items-center text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors">
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> Publier un trajet
                        </Link>
                    </div>

                    {publishedTrips.length > 0 ? (
                        <>
                            <div className='flex flex-col'>
                                {publishedTrips.map((tripData, index) => {
                                    const isPublished = tripData.trip.status === 0;
                                    const isLast = index === publishedTrips.length - 1;
                                    
                                    return (
                                        <div key={tripData.trip.id} className={`py-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6 ${!isLast ? `border-b ${borderColor}` : ''}`}>
                                            
                                            {/* Info Trajet */}
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-bold ${textColorPrimary} flex items-center gap-3 mb-2`}>
                                                    {tripData.departureArea.homeTownName}
                                                    <FontAwesomeIcon icon={faArrowRightLong} className="text-gray-300 dark:text-gray-600 text-sm" />
                                                    {tripData.arrivalArea.homeTownName}
                                                </h3>
                                                <div className={`flex flex-wrap items-center gap-4 text-[15px] font-medium ${textColorSecondary}`}>
                                                    <span className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                                        {dayjs(tripData.trip.departureDate).format('DD MMM YYYY, HH:mm')}
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400" />
                                                        {tripData.trip.pricePerPlace} XAF
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex flex-wrap lg:flex-nowrap gap-2 sm:gap-3 w-full lg:w-auto">
                                                {isPublished && (
                                                    <>
                                                        <button
                                                            onClick={() => handleViewReservations(tripData.trip.id)}
                                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faUsers} /> Réservations
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditTrip(tripData)}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelTrip(tripData.trip.id)}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40 rounded-xl transition-colors"
                                                            title="Annuler"
                                                        >
                                                            <FontAwesomeIcon icon={faTimesCircle} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTrip(tripData)}
                                                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-xl transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Pagination page={publishedPage} totalPages={publishedTotalPages} setPage={setPublishedPage} theme={theme} />
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className={`text-[15px] ${textColorSecondary} mb-4`}>Vous n'avez aucun trajet publié pour le moment.</p>
                            <Link to="/publish-trip" className="inline-block sm:hidden">
                                <button className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm">Publier un trajet</button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* --- HISTORIQUE --- */}
                <div className={`${cardBg} rounded-3xl shadow-sm p-6 sm:p-10 mb-10 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-8`}>
                        Historique
                    </h2>
                    {completedTrips.length > 0 ? (
                        <>
                            <div className='flex flex-col'>
                                {completedTrips.map((tripData, index) => {
                                    const isCompleted = tripData.trip.status === 2;
                                    const isLast = index === completedTrips.length - 1;

                                    return (
                                        <div key={tripData.trip.id} className={`py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${!isLast ? `border-b ${borderColor}` : ''}`}>
                                            <div>
                                                <h3 className={`text-[17px] font-bold ${textColorPrimary} mb-1 flex items-center gap-2`}>
                                                    {tripData.departureArea.homeTownName}
                                                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-xs" />
                                                    {tripData.arrivalArea.homeTownName}
                                                </h3>
                                                <div className={`text-sm ${textColorSecondary}`}>
                                                    {dayjs(tripData.trip.departureDate).format('DD MMM YYYY')} • {tripData.trip.pricePerPlace} XAF
                                                </div>
                                            </div>
                                            
                                            {isCompleted && (
                                                <button
                                                    onClick={() => handleSubmitReview(tripData.trip.id)}
                                                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors sm:w-auto w-full mt-2 sm:mt-0"
                                                >
                                                    <FontAwesomeIcon icon={faStar} className="text-yellow-500" /> Laisser un avis
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <Pagination page={completedPage} totalPages={completedTotalPages} setPage={setCompletedPage} theme={theme} />
                        </>
                    ) : (
                        <p className={`text-center text-[15px] ${textColorSecondary} py-10`}>Aucun trajet terminé à afficher.</p>
                    )}
                </div>
            </main>
            
            <EditTripModal isOpen={isModalOpen} onClose={handleCloseModal} tripToEdit={selectedTrip} />
            <EditProfileModal isOpen={isEditProfileModalOpen} onClose={handleCloseEditProfileModal} />
        </div>
    );
};

export default Profile;