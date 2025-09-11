import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faUserCircle, faCarSide, faStar,
    faPlusCircle, faHistory, faRoute, faInfoCircle, faWallet,
    faEdit, faTimesCircle, faCalendarAlt, faMoneyBillWave,
    faArrowLeft, faArrowRight, faTrash, faIdCard, faBookmark, faCheckDouble,
    faSpinner, faCamera, faComments // 🎯 Ajout de l'icône de commentaires
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Swal from 'sweetalert2';

import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import EditTripModal from '../../Components/Modals/EditTripModal';

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

const Profile = () => {
    // --- Hooks et états ---
    // Ajout de la fonction uploadProfilePicture depuis le hook useAuth
    const { user, loading: loadingUser, uploadProfilePicture,API_URL } = useAuth();
    const { trips, loading: loadingTrips, error: tripsError, fetchTrips, cancelTrip, deleteTrip } = useTrips();
    const { theme } = useColorScheme();
    const navigate = useNavigate();

    // Référence pour l'input de fichier caché
    const fileInputRef = useRef(null);

    // États pour les trajets et la pagination
    const [publishedTrips, setPublishedTrips] = useState([]);
    const [completedTrips, setCompletedTrips] = useState([]);
    const [loadingSpecificTrips, setLoadingSpecificTrips] = useState(true);

    const [publishedPage, setPublishedPage] = useState(1);
    const [publishedTotalPages, setPublishedTotalPages] = useState(0);

    const [completedPage, setCompletedPage] = useState(1);
    const [completedTotalPages, setCompletedTotalPages] = useState(0);

    // États pour la modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    // --- Fonctions d'appel API et de gestion des états ---
    const loadUserTrips = async (page, status, setTrips, setTotalPages) => {
        if (user && !loadingUser) {
            setLoadingSpecificTrips(true);
            try {
                const response = await fetchTrips({ pageIndex: page, status: status });
                setTrips(response.items || []);
                const perPage = response?.items?.length || 1;
                setTotalPages(Math.ceil(response.totalCount / perPage));
            } catch (err) {
                console.error(`Erreur lors de la récupération des trajets (statut ${status}):`, err);
            } finally {
                setLoadingSpecificTrips(false);
            }
        }
    };
    useEffect(() => {
        // Redirige si l'utilisateur n'est pas connecté une fois le chargement terminé
        if (!user && !loadingUser) {
            navigate('/auth/signin');
        }
    }, [user, loadingUser, navigate]);
    // --- Effets de bord pour le chargement des données ---
    useEffect(() => {
        loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
    }, [user, loadingUser, publishedPage]);

    useEffect(() => {
        loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
    }, [user, loadingUser, completedPage]);

    // --- Fonctions de gestion des actions de l'utilisateur ---
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
        });

        if (result.isConfirmed) {
            const success = await cancelTrip(tripId);
            if (success) {
                loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
            }
        }
    };

    const handleDeleteTrip = (trip) => {
        const tripId = trip.trip.id;
        const tripDescription = `${trip.departureArea.homeTownName} → ${trip.arrivalArea.homeTownName} le ${new Date(trip.trip.departureDate).toLocaleDateString('fr-CM')}`;

        Swal.fire({
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteTrip(tripId);
                loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
            }
        });
    };

    // --- NOUVELLES FONCTIONS DE GESTION DE L'IMAGE DE PROFIL ---
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


    // --- Styles dynamiques ---
    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

    // --- Rendu conditionnel et composants de rendu ---
    if (loadingUser || loadingSpecificTrips) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p className="ml-4 text-xl">Chargement du profil et des trajets...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
                <p className='text-xl'>Veuillez vous connecter pour voir votre profil.</p>
            </div>
        );
    }

    const renderTripList = (trips, page, totalPages, setPage) => (
        <>
            {trips.length > 0 ? (
                <div className='flex flex-col gap-6'>
                    {trips.map((tripData) => (
                        <div key={tripData.trip.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center transition-transform transform hover:scale-[1.01] duration-200`}>
                            <div className="flex-1">
                                <h3 className={`text-lg font-bold ${textColorPrimary}`}>
                                    {tripData.departureArea.homeTownName} - {tripData.arrivalArea.homeTownName}
                                </h3>
                                <div className={`text-sm ${textColorSecondary} mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                                    <div className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className='mr-2' /> Date: {dayjs(tripData.trip.departureDate).format('DD MMMM YYYY à HH:mm')}</div>
                                    <div className="flex items-center"><FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' /> Prix: {tripData.trip.pricePerPlace} XAF</div>
                                </div>
                            </div>
                            {tripData.trip.status === 0 && (
                                <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
                                    <button
                                        onClick={() => handleEditTrip(tripData)}
                                        className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faEdit} /> Modifier
                                    </button>
                                    <button
                                        onClick={() => handleCancelTrip(tripData.trip.id)}
                                        className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} /> Annuler
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTrip(tripData)}
                                        className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className={`${textColorSecondary} text-center py-4`}>Aucun trajet à afficher pour le moment.</p>
            )}
            {totalPages > 1 && (
                <div className={`flex justify-center items-center gap-4 mt-6 text-sm`}>
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} /> Précédent
                    </button>
                    <span className={`px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        Page {page} sur {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                        className={`px-4 py-2 rounded-lg ${page >= totalPages ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Suivant <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}
        </>
    );

    // --- Rendu final du composant ---
    return (
        <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
            <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>

                {/* --- Section Profil de l'utilisateur --- */}
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <div className='flex flex-col items-center sm:flex-row sm:items-start sm:gap-6'>
                        
                        {/* 🎯 Conteneur de l'image de profil avec la fonctionnalité de mise à jour */}
                        <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 group'>
                            <img
                                src={user.pictureProfileUrl
                                    ? `${API_URL}`+user.pictureProfileUrl
                                    : generateInitialsSvg(user.firstName, user.lastName, theme)
                                }
                                alt={`Profil de ${user.firstName} ${user.lastName}`}
                                className='w-full h-full rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md transition-opacity duration-300 group-hover:opacity-75'
                            />
                            {/* Overlay de la caméra */}
                            <div
                                onClick={handleImageClick}
                                className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <FontAwesomeIcon icon={faCamera} size="2x" className="text-white" />
                            </div>
                            {/* Input de fichier caché */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {/* Fin du conteneur d'image */}

                        <div className='text-center sm:text-left mt-4 sm:mt-0'>
                            <h1 className={`text-3xl sm:text-4xl font-extrabold ${textColorPrimary} mb-2`}>
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className={`text-lg ${textColorSecondary} mb-2`}>
                                <FontAwesomeIcon icon={faUserCircle} className='mr-2 text-blue-500' />
                                Membre depuis le {dayjs(user.createdAt).format('DD MMMM YYYY') || 'N/A'}
                            </p>
                            <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-3 ${textColorSecondary}`}>
                                {user.email && (
                                    <p className='flex items-center'>
                                        <FontAwesomeIcon icon={faEnvelope} className='mr-2 text-gray-500' /> {user.email}
                                    </p>
                                )}
                                {user.phoneNumber && (
                                    <p className='flex items-center'>
                                        <FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-500' /> {user.phoneNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section de Navigation Rapide (Mini Header) --- */}
                <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8 border ${borderColor}`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/profile/car')}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 text-sm md:text-base"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="text-2xl mb-2" />
                            Ajouter Un Vehicule
                        </button>
                        <button
                            onClick={() => navigate('/profile/reservations')}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 text-sm md:text-base"
                        >
                            <FontAwesomeIcon icon={faBookmark} className="text-2xl mb-2" />
                            Mes Réservations
                        </button>
                        <button
                            onClick={() => navigate('/profile/wallet')}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 text-sm md:text-base"
                        >
                            <FontAwesomeIcon icon={faWallet} className="text-2xl mb-2" />
                            Mon Portefeuille
                        </button>
                        <button
                            onClick={() => navigate('/profile/licence')}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200 text-sm md:text-base"
                        >
                            <FontAwesomeIcon icon={faIdCard} className="text-2xl mb-2" />
                            Gérer mon Permis
                        </button>
                    </div>
                </div>

                {/* --- Section: À propos de moi --- */}
                {user.bio && (
                    <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                        <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                            <FontAwesomeIcon icon={faInfoCircle} className='mr-2 text-gray-500' />
                            À propos de moi
                        </h2>
                        <p className={`${textColorSecondary} leading-relaxed`}>{user.bio}</p>
                    </div>
                )}

                {/* --- Section: Statistiques et Évaluation --- */}
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        Statistiques et Évaluation
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                            <FontAwesomeIcon icon={faCarSide} className='text-4xl text-green-500 mr-4 flex-shrink-0' />
                            <div>
                                <p className={`text-xl font-semibold ${textColorPrimary}`}>{user.tripsCompleted || 0}</p>
                                <p className={`${textColorSecondary}`}>Trajets effectués</p>
                            </div>
                        </div>
                        <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                            <FontAwesomeIcon icon={faStar} className='text-4xl text-yellow-500 mr-4 flex-shrink-0' />
                            <div>
                                <p className={`text-xl font-semibold ${textColorPrimary}`}>{user.rating || 'N/A'}</p>
                                <p className={`${textColorSecondary}`}>Note moyenne</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section: Mes Trajets Publiés --- */}
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        <FontAwesomeIcon icon={faRoute} className='mr-2 text-blue-500' />
                        Mes Trajets Publiés
                    </h2>
                    {renderTripList(publishedTrips, publishedPage, publishedTotalPages, setPublishedPage)}
                </div>

                {/* --- Section: Historique des Trajets Effectués (pour le conducteur) --- */}
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        <FontAwesomeIcon icon={faHistory} className='mr-2 text-purple-500' />
                        Historique des Trajets Effectués
                    </h2>
                    {renderTripList(completedTrips, completedPage, completedTotalPages, setCompletedPage)}
                </div>

            </main>

            <EditTripModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                tripToEdit={selectedTrip}
            />
        </div>
    );
};

export default Profile;