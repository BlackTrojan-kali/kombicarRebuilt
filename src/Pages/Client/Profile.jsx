import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faUserCircle, faCalendarAlt, faCarSide, faStar } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    // Gérer le cas où l'utilisateur n'est pas connecté
    return (
      <div className='flex items-center justify-center min-h-screen text-gray-900 dark:text-gray-100'> {/* Retiré bg-gray-50 dark:bg-gray-900 ici */}
        <p className='text-xl'>Veuillez vous connecter pour voir votre profil.</p>
      </div>
    );
  }

  return (
    // Suppression de la classe 'bg-gray-50 dark:bg-gray-900' ici
    <div className='text-gray-900 dark:text-gray-100 min-h-screen pt-20 pb-10'> {/* Padding top pour le header */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8'>
          <div className='flex flex-col items-center sm:flex-row sm:items-start sm:gap-6'>
            {/* Image de profil */}
            <div className='relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0'>
              <img
                src={user.profilePicture || "https://via.placeholder.com/150"} // Image par défaut si non présente
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
              <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2'>
                {user.username}
              </h1>
              <p className='text-lg text-gray-700 dark:text-gray-300 mb-2'>
                <FontAwesomeIcon icon={faUserCircle} className='mr-2 text-blue-500' />
                Membre depuis le {user.memberSince}
              </p>
              <div className='flex items-center justify-center sm:justify-start gap-3 text-gray-600 dark:text-gray-400'>
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
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700'>
              À propos de moi
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{user.bio}</p>
          </div>
        )}

        {/* Statistiques et Évaluation */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700'>
            Statistiques et Évaluation
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
              <FontAwesomeIcon icon={faCarSide} className='text-4xl text-green-500 mr-4 flex-shrink-0' />
              <div>
                <p className='text-xl font-semibold text-gray-800 dark:text-gray-200'>{user.tripsCompleted || 0}</p>
                <p className='text-gray-600 dark:text-gray-400'>Trajets effectués</p>
              </div>
            </div>
            <div className='flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
              <FontAwesomeIcon icon={faStar} className='text-4xl text-yellow-500 mr-4 flex-shrink-0' />
              <div>
                <p className='text-xl font-semibold text-gray-800 dark:text-gray-200'>{user.rating || 'N/A'}</p>
                <p className='text-gray-600 dark:text-gray-400'>Note moyenne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section optionnelle: Véhicules (si vous voulez ajouter des détails sur les véhicules du chauffeur) */}
        {/*
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700'>
            Mes véhicules
          </h2>
          <p className='text-gray-700 dark:text-gray-300'>[Détails des véhicules]</p>
        </div>
        */}

      </main>
    </div>
  );
};

export default Profile;