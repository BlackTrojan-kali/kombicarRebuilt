import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUserCircle, faCalendarAlt, faCarSide, faStar, faPlusCircle, faCheckCircle, faHistory, faRoute, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Ajout de faRoute et faHistory
import useAuth from '../../hooks/useAuth';
import useTrips from '../../hooks/useTrips'; // Importez le hook useTrips
import useColorScheme from '../../hooks/useColorScheme'; // Importez le hook de thème
import ResultCard from '../../Components/Cards/ResultCard'; // Importez ResultCard

const Profile = () => {
  const { user, loading: loadingUser } = useAuth(); // Récupère l'utilisateur et l'état de chargement de l'authentification
  const { trips, loading: loadingTrips, error: tripsError, fetchTrips } = useTrips(); // Récupère tous les trajets
  const { theme } = useColorScheme(); // Récupère le thème

  useEffect(() => {
    // Charge tous les trajets si l'utilisateur est disponible
    if (user && !loadingUser) {
      fetchTrips();
    }
  }, []); // Déclenche le rechargement si l'utilisateur change

  // Couleurs conditionnelles pour le dark mode
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  if (loadingUser || loadingTrips) {
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

  // Filtrer les trajets publiés et effectués par l'utilisateur actuel
  const publishedTrips = trips.filter(trip => trip.publisherId === user.id && trip.status === 'upcoming');
  const completedTrips = trips.filter(trip =>
    (trip.publisherId === user.id && trip.status === 'completed') ||
    (trip.participants && trip.participants.includes(user.id) && trip.status === 'completed')
  );

  return (
    <div className={`${pageBgColor} ${textColorPrimary} min-h-screen pt-20 pb-10 transition-colors duration-300`}>
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <div className='flex flex-col items-center sm:flex-row sm:items-start sm:gap-6'>
            {/* Image de profil */}
            <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0'>
              <img
                src={user.profilePicture || "https://via.placeholder.com/150/cccccc/ffffff?text=Profil"} // Image par défaut si non présente
                alt={`Profil de ${user.username}`}
                className='w-full h-full rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md'
              />
              {/* Optionnel: Ajouter un indicateur de vérification si pertinent */}
              {/* <span className='absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2 text-xs'>
                <FontAwesomeIcon icon={faCheckCircle} /> Vérifié
              </span> */}
            </div>

            {/* Informations de base de l'utilisateur */}
            <div className='text-center sm:text-left mt-4 sm:mt-0'>
              <h1 className={`text-3xl sm:text-4xl font-extrabold ${textColorPrimary} mb-2`}>
                {user.firstName} {user.lastName} {/* Utilisation de firstName et lastName */}
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
            </div>
          </div>
        </div>

        {/* Section À Propos */}
        {user.bio && (
          <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
            <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
              <FontAwesomeIcon icon={faInfoCircle} className='mr-2 text-gray-500' />
              À propos de moi
            </h2>
            <p className={`${textColorSecondary} leading-relaxed`}>{user.bio}</p>
          </div>
        )}

        {/* Statistiques et Évaluation */}
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

        {/* --- Section: Trajets Publiés --- */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-bold ${textColorPrimary} mb-4 pb-3 border-b ${borderColor}`}>
            <FontAwesomeIcon icon={faRoute} className='mr-2 text-blue-500' />
            Mes Trajets Publiés
          </h2>
          {publishedTrips.length > 0 ? (
            <div className='flex flex-col gap-6'>
              {publishedTrips.map((trip) => (
                <ResultCard key={trip.id} trip={trip} />
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
                <ResultCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <p className={`${textColorSecondary} text-center py-4`}>Aucun trajet effectué pour le moment.</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default Profile;
