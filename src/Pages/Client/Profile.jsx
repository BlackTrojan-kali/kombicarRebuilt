import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faPhone, faUserCircle, faCarSide, faStar,
  faPlusCircle, faHistory, faRoute, faInfoCircle, faWallet,
  faEdit, faTimesCircle, faCalendarAlt, faMoneyBillWave,
  faArrowLeft, faArrowRight, faTrash, faIdCard, faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';
import EditTripModal from '../../Components/Modals/EditTripModal';
import Swal from 'sweetalert2';

dayjs.locale('fr');

// Fonction pour générer une image SVG d'initiales
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
  const { user, loading: loadingUser } = useAuth();
  const { trips, loading: loadingTrips, error: tripsError, fetchTrips, listReservedTrips, cancelTrip, deleteTrip } = useTrips();
  const { theme } = useColorScheme();
  const navigate = useNavigate();

  // États pour les trajets et la pagination
  const [publishedTrips, setPublishedTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [reservedTrips, setReservedTrips] = useState([]);
  const [loadingSpecificTrips, setLoadingSpecificTrips] = useState(true);

  const [publishedPage, setPublishedPage] = useState(1);
  const [publishedTotalPages, setPublishedTotalPages] = useState(0);

  const [completedPage, setCompletedPage] = useState(1);
  const [completedTotalPages, setCompletedTotalPages] = useState(0);

  const [reservedPage, setReservedPage] = useState(1);
  const [reservedTotalPages, setReservedTotalPages] = useState(0);
  const [reservedStatusFilter, setReservedStatusFilter] = useState(4); // Statut par défaut : 4 = Complété

  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // --- Fonctions d'appel API et de gestion des états ---

  const loadUserTrips = async (page, status, setTrips, setTotalPages) => {
    if (user && !loadingUser) {
      setLoadingSpecificTrips(true);
      try {
        const response = await fetchTrips({ pageIndex: page, status: status });
        console.log(response)
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

  const loadUserReservations = async (page, reservationStatus) => {
    if (user && !loadingUser) {
      setLoadingSpecificTrips(true);
      try {
        const response = await listReservedTrips({ pageIndex: page, status: 0, reservationStatus: reservationStatus });
      
        setReservedTrips(response.items || []);
        console.log(response.items)
        const perPage = response?.items?.length || 1;
        setReservedTotalPages(Math.ceil(response.totalCount / perPage));
      } catch (err) {
        console.error(`Erreur lors de la récupération des réservations:`, err);
      } finally {
        setLoadingSpecificTrips(false);
      }
    }
  };


  // --- Effets de bord pour le chargement des données ---
  useEffect(() => {
    loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
  }, [user, loadingUser, publishedPage]);

  useEffect(() => {
    loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
  }, [user, loadingUser, completedPage]);

  useEffect(() => {
    loadUserReservations(reservedPage, reservedStatusFilter);
  }, [user, loadingUser, reservedPage, reservedStatusFilter]);


  // --- Fonctions de gestion des actions de l'utilisateur ---
  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
    // Recharge les listes après une modification
    loadUserTrips(publishedPage, 0, setPublishedTrips, setPublishedTotalPages);
    loadUserTrips(completedPage, 2, setCompletedTrips, setCompletedTotalPages);
    loadUserReservations(reservedPage, reservedStatusFilter);
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

  // --- Navigation ---
  const handleAddVehicleClick = () => navigate('car');
  const handleViewWalletClick = () => navigate('wallet');
  const handleManageLicenseClick = () => navigate('licence');
  const handleManageReservationsClick = () => navigate('reservations');

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
        <p className="text-xl">Chargement du profil et des trajets...</p>
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

  const renderReservationList = (reservations, page, totalPages, setPage) => (
    <>
      {reservations.length > 0 ? (
        <div className='flex flex-col gap-6'>
          {reservations?.map((reservationData) => (
            <div key={reservationData.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center transition-transform transform hover:scale-[1.01] duration-200`}>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${textColorPrimary}`}>
                  {reservationData.departureArea.homeTownName} - {reservationData.arrivalArea.homeTownName}
                </h3>
                <div className={`text-sm ${textColorSecondary} mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                  <div className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className='mr-2' /> Date: {dayjs(reservationData.trip.departureDate).format('DD MMMM YYYY à HH:mm')}</div>
                  <div className="flex items-center"><FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' /> Prix: {reservationData.totalPrice} XAF</div>
                  <div className="flex items-center"><FontAwesomeIcon icon={faUserCircle} className='mr-2' /> Places réservées: {reservationData.numberReservedPlaces}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${textColorSecondary} text-center py-4`}>Aucune réservation à afficher pour le moment.</p>
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
            <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0'>
              <img
                src={user.profilePicture
                  ? user.profilePicture
                  : generateInitialsSvg(user.firstName, user.lastName, theme)
                }
                alt={`Profil de ${user.firstName} ${user.lastName}`}
                className='w-full h-full rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md'
              />
            </div>
            <div className='text-center sm:text-left mt-4 sm:mt-0'>
              <h1 className={`text-3xl sm:text-4xl font-extrabold ${textColorPrimary} mb-2`}>
                {user.firstName} {user.lastName}
              </h1>
              <p className={`text-lg ${textColorSecondary} mb-2`}>
                <FontAwesomeIcon icon={faUserCircle} className='mr-2 text-blue-500' />
                Membre depuis le {user.memberSince || 'N/A'}
              </p>
              <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-3 ${textColorSecondary}`}>
                {user.email && (
                  <p className='flex items-center'>
                    <FontAwesomeIcon icon={faEnvelope} className='mr-2 text-gray-500' /> {user.email}
                  </p>
                )}
                {user.phone && (
                  <p className='flex items-center'>
                    <FontAwesomeIcon icon={faPhone} className='mr-2 text-gray-500' /> {user.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleAddVehicleClick}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                  Ajouter un Véhicule
                </button>
                <button
                  onClick={handleViewWalletClick}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Voir mon Portefeuille
                </button>
                <button
                  onClick={handleManageLicenseClick}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                  Gérer mon Permis
                </button>
              </div>
            </div>
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

        {/* --- Section: Historique des Réservations (pour le passager) avec bouton et filtre) --- */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <div className='flex justify-between items-center mb-4 pb-3 border-b'>
            <h2 className={`text-2xl font-bold ${textColorPrimary}`}>
              <FontAwesomeIcon icon={faBookmark} className='mr-2 text-green-500' />
              Historique des Réservations
            </h2>
            <div className='flex gap-2 items-center'>
              <label htmlFor="reservation-status-filter" className={`text-sm font-medium ${textColorSecondary}`}>Statut:</label>
              <select
                id="reservation-status-filter"
                value={reservedStatusFilter}
                onChange={(e) => {
                  setReservedStatusFilter(e.target.value);
                  setReservedPage(1); // Réinitialiser la page à 1 lors du changement de filtre
                }}
                className={`py-1 px-2 text-sm rounded-md border ${borderColor} ${cardBg} ${textColorPrimary}`}
              >
                <option value="4">Complété</option>
                <option value="1">Confirmé</option>
                <option value="0">En attente</option>
                <option value="2">Refusé</option>
                <option value="3">Annulé</option>
              </select>
              <button
                onClick={handleManageReservationsClick}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                Gérer
              </button>
            </div>
          </div>
          {renderReservationList(reservedTrips, reservedPage, reservedTotalPages, setReservedPage)}
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