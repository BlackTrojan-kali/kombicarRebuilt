import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faUserCircle, faCarSide, faStar,
    faPlusCircle, faHistory, faRoute, faInfoCircle, faWallet,
    faEdit, faTimesCircle, faTrash, faIdCard, faBookmark,
    faSpinner, faCamera, faCalendarAlt, faMoneyBillWave,
    faArrowLeft, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import Swal from 'sweetalert2';

import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import EditTripModal from '../../Components/Modals/EditTripModal';
// Importation de la nouvelle modal de modification de profil
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

// Le composant de pagination est également une bonne abstraction
const Pagination = ({ page, totalPages, setPage, theme }) => {
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    return (
        <div className={`flex justify-center items-center gap-4 mt-6 text-sm ${textColorPrimary}`}>
            <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                aria-label="Page précédente"
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
                aria-label="Page suivante"
            >
                Suivant <FontAwesomeIcon icon={faArrowRight} />
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

    // ===========================================
    // NOUVEAU : État pour la modal d'édition de profil
    // ===========================================
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    
    // États existants pour les trajets
    const [publishedTrips, setPublishedTrips] = useState([]);
    const [completedTrips, setCompletedTrips] = useState([]);
    const [loadingSpecificTrips, setLoadingSpecificTrips] = useState(true);
    const [publishedPage, setPublishedPage] = useState(1);
    const [publishedTotalPages, setPublishedTotalPages] = useState(0);
    const [completedPage, setCompletedPage] = useState(1);
    const [completedTotalPages, setCompletedTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // Pour EditTripModal
    const [selectedTrip, setSelectedTrip] = useState(null);

    // Charger les trajets de l'utilisateur
    const loadUserTrips = async (page, status, setTrips, setTotalPages) => {
        if (!user || loadingUser) return;
        setLoadingSpecificTrips(true);
        const perPage = 5; // Taille de page fixe
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
        } else {
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
        // Recharger les trajets après modification/fermeture de la modal de trajet
        loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
        loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
    };

    // ===========================================
    // NOUVEAU : Fonctions pour la modal de profil
    // ===========================================
    const handleOpenEditProfileModal = () => setIsEditProfileModalOpen(true);
    const handleCloseEditProfileModal = () => setIsEditProfileModalOpen(false);

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
        });

        if (result.isConfirmed) {
            await deleteTrip(tripId);
            loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
        }
    };

    const handleViewReviews = (tripId) => {
        // Redirige vers la page des avis pour ce trajet
        navigate(`/reviews/${tripId}`);
    };

    const handleSubmitReview = (tripId) => {
        // Redirige vers un formulaire pour soumettre un avis pour ce trajet
        navigate(`/reviews/submit/${tripId}`);
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

    const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
    const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
    
    // NOTE : Le `renderTripCard` a été commenté dans votre code initial,
    // mais la logique est réintégrée directement dans le JSX pour l'exemple.
    
    if (loadingUser || loadingSpecificTrips) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${pageBgColor} ${textColorPrimary}`}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p className="ml-4 text-xl">Chargement du profil et des trajets...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
            <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <div className='flex flex-col items-center sm:flex-row sm:items-start sm:gap-6'>
                        
                        {/* Section Photo de Profil */}
                        <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 group'>
                            <img
                                src={user.pictureProfileUrl ? `${API_URL}` + user.pictureProfileUrl : generateInitialsSvg(user.firstName, user.lastName, theme)}
                                alt={`Profil de ${user.firstName} ${user.lastName}`}
                                className='w-full h-full rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md transition-opacity duration-300 group-hover:opacity-75'
                            />
                            <div
                                onClick={handleImageClick}
                                className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <FontAwesomeIcon icon={faCamera} size="2x" className="text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        {/* Section Infos Utilisateur */}
                        <div className='text-center sm:text-left mt-4 sm:mt-0 flex-1'>
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
                        
                        {/* NOUVEAU : Bouton Modifier le Profil */}
                        <div className='mt-4 sm:mt-0 flex-shrink-0'>
                            <button
                                onClick={handleOpenEditProfileModal}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <FontAwesomeIcon icon={faEdit} /> Modifier le Profil
                            </button>
                        </div>
                    </div>
                </div>

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
                            onClick={() => navigate('/profile/withdrawals')}
                            className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 text-sm md:text-base"
                        >
                            <FontAwesomeIcon icon={faWallet} className="text-2xl mb-2" />
                            Mes Retraits
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

                {user.bio && (
                    <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                        <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                            <FontAwesomeIcon icon={faInfoCircle} className='mr-2 text-gray-500' />
                            À propos de moi
                        </h2>
                        <p className={`${textColorSecondary} leading-relaxed`}>{user.bio}</p>
                    </div>
                )}

                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        Statistiques et Évaluation
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                                <p className={`text-xl font-semibold ${textColorPrimary}`}>{user?.note}</p>
                                <p className={`${textColorSecondary}`}>Note moyenne</p>
                            </div>
                        </div>
                        <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
                            <FontAwesomeIcon icon={faWallet} className='text-4xl text-purple-500 mr-4 flex-shrink-0' />
                            <div>
                                <p className={`text-xl font-semibold ${textColorPrimary}`}>{user?.balance || 0} FCFA</p>
                                <p className={`${textColorSecondary}`}>Solde du portefeuille</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        <FontAwesomeIcon icon={faRoute} className='mr-2 text-blue-500' />
                        Mes Trajets Publiés
                    </h2>
                    {publishedTrips.length > 0 ? (
                        <>
                            <div className='flex flex-col gap-6'>
                                {publishedTrips.map(tripData => {
                                    const isPublished = tripData.trip.status === 0;
                                    return (
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
                                            
                                            <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4 md:mt-0 flex-shrink-0">
                                                {isPublished && (
                                                    <>
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
                                                        <button
                                                            onClick={() => handleViewReviews(tripData.trip.id)}
                                                            className="flex items-center gap-1 px-3 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                                        >
                                                            <FontAwesomeIcon icon={faStar} /> Voir les avis
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
                        <p className={`${textColorSecondary} text-center py-4`}>Aucun trajet publié pour le moment.</p>
                    )}
                </div>

                <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
                    <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
                        <FontAwesomeIcon icon={faHistory} className='mr-2 text-purple-500' />
                        Historique des Trajets Effectués
                    </h2>
                    {completedTrips.length > 0 ? (
                        <>
                            <div className='flex flex-col gap-6'>
                                {completedTrips.map(tripData => {
                                    const isCompleted = tripData.trip.status === 2;
                                    return (
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
                                            
                                            <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-4 md:mt-0 flex-shrink-0">
                                                {isCompleted && (
                                                    <button
                                                        onClick={() => handleSubmitReview(tripData.trip.id)}
                                                        className="flex items-center gap-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faStar} /> Soumettre un avis
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Pagination page={completedPage} totalPages={completedTotalPages} setPage={setCompletedPage} theme={theme} />
                        </>
                    ) : (
                        <p className={`${textColorSecondary} text-center py-4`}>Aucun historique de trajet à afficher.</p>
                    )}
                </div>
            </main>
            
            {/* Modal pour modifier un trajet (existante) */}
            <EditTripModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                tripToEdit={selectedTrip}
            />

            {/* NOUVEAU : Modal pour modifier le profil utilisateur */}
            <EditProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={handleCloseEditProfileModal}
            />
        </div>
    );
};

export default Profile;