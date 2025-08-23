import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUserCircle, faCarSide, faStar, faPlusCircle, faHistory, faRoute, faInfoCircle, faWallet, faEdit, faTimesCircle, faCalendarAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips';
import useColorScheme from '../../hooks/useColorScheme';

import EditTripModal from '../../Components/Modals/EditTripModal';

dayjs.locale('fr');

const Profile = () => {
  const { user, loading: loadingUser } = useAuth();
  const { loading: loadingTrips, error: tripsError, fetchTrips, cancelTrip } = useTrips();
  const { theme } = useColorScheme();
  const navigate = useNavigate();

  const [publishedTrips, setPublishedTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loadingSpecificTrips, setLoadingSpecificTrips] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const loadUserTrips = async () => {
    if (user && !loadingUser) {
      setLoadingSpecificTrips(true);
      try {
        const published = await fetchTrips({ pageIndex: 0, status: 4 }); 
        const completed = await fetchTrips({ pageIndex: 0, status: 3 }); 
        setPublishedTrips(published || []);
        setCompletedTrips(completed || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des trajets de l'utilisateur :", err);
      } finally {
        setLoadingSpecificTrips(false);
      }
    }
  };

  useEffect(() => {
    loadUserTrips();
  }, [])//user, loadingUser, fetchTrips]);

  const handleEditTrip = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
    loadUserTrips(); // Reload trips after update
  };

  const handleCancelTrip = async (tripId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible et les passagers seront notifiés.")) {
        const success = await cancelTrip(tripId);
        if (success) {
            loadUserTrips();
        }
    }
  };

  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

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

  const handleAddVehicleClick = () => {
    navigate('car');
  };

  const handleViewWalletClick = () => {
    navigate('wallet');
  };

  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <div className='flex flex-col items-center sm:flex-row sm:items-start sm:gap-6'>
            <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0'>
              <img
                src={user.profilePicture || "https://via.placeholder.com/150/cccccc/ffffff?text=Profil"}
                alt={`Profil de ${user.username}`}
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
          {publishedTrips.length > 0 ? (
            <div className='flex flex-col gap-6'>
              {publishedTrips.map((trip) => (
                <div key={trip.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center transition-transform transform hover:scale-[1.01] duration-200`}>
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold ${textColorPrimary}`}>
                            {trip.startAreaPointCreateDto.homeTownName} - {trip.arivalAreaPointCreateDto.homeTownName}
                        </h3>
                        <div className={`text-sm ${textColorSecondary} mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                            <div className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className='mr-2' /> Date: {dayjs(trip.departureDate).format('DD MMMM YYYY à HH:mm')}</div>
                            <div className="flex items-center"><FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' /> Prix: {trip.pricePerPlace} XAF</div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
                        <button 
                            onClick={() => handleEditTrip(trip)}
                            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faEdit} /> Modifier
                        </button>
                        <button
                            onClick={() => handleCancelTrip(trip.id)}
                            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} /> Annuler
                        </button>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`${textColorSecondary} text-center py-4`}>Aucun trajet publié pour le moment.</p>
          )}
        </div>

        {/* --- Section: Historique des Trajets Effectués --- */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
            <FontAwesomeIcon icon={faHistory} className='mr-2 text-purple-500' />
            Historique des Trajets Effectués
          </h2>
          {completedTrips.length > 0 ? (
            <div className='flex flex-col gap-6'>
              {completedTrips.map((trip) => (
                <div key={trip.id} className={`${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} flex flex-col md:flex-row justify-between items-center opacity-70`}>
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold ${textColorPrimary}`}>
                            {trip.startAreaPointCreateDto.homeTownName} - {trip.arivalAreaPointCreateDto.homeTownName}
                        </h3>
                        <div className={`text-sm ${textColorSecondary} mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2`}>
                            <div className="flex items-center"><FontAwesomeIcon icon={faCalendarAlt} className='mr-2' /> Date: {dayjs(trip.departureDate).format('DD MMMM YYYY à HH:mm')}</div>
                            <div className="flex items-center"><FontAwesomeIcon icon={faMoneyBillWave} className='mr-2' /> Prix: {trip.pricePerPlace} XAF</div>
                        </div>
                    </div>
                    {/* Le statut "terminé" ne nécessite pas de bouton d'action */}
                </div>
              ))}
            </div>
          ) : (
            <p className={`${textColorSecondary} text-center py-4`}>Aucun trajet effectué pour le moment.</p>
          )}
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