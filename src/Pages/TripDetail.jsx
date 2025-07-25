import { faCalendar, faStar, faClock, faRoad, faInfoCircle, faCar, faCircle } from '@fortawesome/free-solid-svg-icons'; // Ajout d'icônes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from '../Components/ui/Button'; // Assurez-vous que le chemin est correct pour votre composant Button
// Importez dayjs si vous l'utilisez pour formater la date
// import dayjs from 'dayjs';

const TripDetail = () => {
    const trip =
    {
      thumbnail: "/default/city-2.jpg",
      depart: "Douala",
      arrive: "Yaoundé",
      prix: 4500,
      heure_depart: "08h30",
      heure_arrive: "12h00",
      date_depart: "2025-08-10", // Exemple de date de départ
      desc: "Wifi à bord, chargeurs disponibles, ambiance conviviale. Respect des règles de sécurité.",
      chauffeur: {
        nom: "Fatima",
        trajets_effectues: 15,
        profile: "/default/person-2.jpg",
        stars: 4.8
      },
      distance: 240,
      options: ["Climatisation", "Sièges confortables", "Musique (au choix)", "Espace bagages"]
    }

  return (
    // Suppression de la classe 'bg-gray-50 dark:bg-gray-900' ici
    <div className='text-gray-900 dark:text-gray-100 min-h-screen pt-20 pb-10'> {/* Padding top pour le header fixe, padding bottom */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Titre du trajet */}
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-100'>
                Trajet {trip.depart} - {trip.arrive}
            </h1>

            <div className='flex flex-col lg:flex-row gap-8 items-start'>
                {/* Colonne Principale des Détails du Trajet */}
                <div className='w-full lg:w-2/3 flex flex-col gap-6'>
                    {/* Carte des Détails du Trajet et Heures */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <div className='flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700'>
                            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Détails du trajet</h2>
                            <p className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                                <FontAwesomeIcon icon={faCalendar} className='mr-2 text-blue-500' />
                                {/* Utilisez dayjs si importé, sinon laissez tel quel */}
                                {/* {dayjs(trip.date_depart).format('DD MMMM YYYY')} */}
                                {trip.date_depart}
                            </p>
                        </div>
                        <div className='flex items-center space-x-4'>
                            <div className='flex flex-col items-center'>
                                <p className='font-semibold text-xl text-gray-800 dark:text-gray-100'>{trip.heure_depart}</p>
                                <p className='text-gray-600 dark:text-gray-400'>{trip.depart}</p>
                            </div>
                            <div className='relative flex-1 h-px bg-gray-300 dark:bg-gray-600 mx-4'>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className='absolute -left-2 top-1/2 -translate-y-1/2 text-base text-blue-500'
                                />
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    className='absolute -right-2 top-1/2 -translate-y-1/2 text-base text-green-500'
                                />
                            </div>
                            <div className='flex flex-col items-center'>
                                <p className='font-semibold text-xl text-gray-800 dark:text-gray-100'>{trip.heure_arrive}</p>
                                <p className='text-gray-600 dark:text-gray-400'>{trip.arrive}</p>
                            </div>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-4'>
                            <FontAwesomeIcon icon={faRoad} className='mr-1' /> Distance estimée: {trip.distance} km
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                            <FontAwesomeIcon icon={faClock} className='mr-1' /> Durée estimée: {trip.heure_arrive} {trip.heure_depart} heures
                            {/* Note: Pour un calcul de durée précis, vous devriez parser et calculer la différence entre heure_depart et heure_arrive. */}
                        </p>
                    </div>

                    {/* Carte du Chauffeur */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700'>
                            À propos du chauffeur
                        </h2>
                        <div className='flex items-center gap-4'>
                            <img
                                src={trip.chauffeur.profile}
                                className='w-20 h-20 rounded-full object-cover border-4 border-yellow-500 dark:border-yellow-400 flex-shrink-0'
                                alt={`Profil de ${trip.chauffeur.nom}`}
                            />
                            <div>
                                <p className='font-bold text-xl text-gray-900 dark:text-gray-100'>{trip.chauffeur.nom}</p>
                                <p className='text-yellow-500 dark:text-yellow-400 mt-1'>
                                    <FontAwesomeIcon icon={faStar} className='mr-1 text-base' />
                                    {trip.chauffeur.stars} sur 5
                                </p>
                                <p className='text-gray-600 dark:text-gray-400 text-sm mt-1'>
                                    {trip.chauffeur.trajets_effectues} trajets effectués
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* À propos du trajet / Description */}
                    {trip.desc && (
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700'>
                                <FontAwesomeIcon icon={faInfoCircle} className='mr-2 text-gray-500' />
                                À propos du trajet
                            </h2>
                            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{trip.desc}</p>
                        </div>
                    )}

                    {/* Options du véhicule (si présentes) */}
                    {trip.options && trip.options.length > 0 && (
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700'>
                                <FontAwesomeIcon icon={faCar} className='mr-2 text-gray-500' />
                                Options du véhicule
                            </h2>
                            <ul className='list-disc list-inside text-gray-700 dark:text-gray-300'>
                                {trip.options.map((option, index) => (
                                    <li key={index} className='mb-1'>{option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Colonne Latérale (Récapitulatif et Réservation) */}
                <div className='w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24'> {/* Ajout de sticky et top-24 pour flotter */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4'>Récapitulatif</h2>
                        <div className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'>
                            <p className='text-lg text-gray-700 dark:text-gray-300'>Prix par passager</p>
                            <p className='text-xl font-bold text-green-600 dark:text-green-400'>{trip.prix} XAF</p>
                        </div>
                        <div className='flex justify-between items-center py-2'>
                            <p className='text-lg text-gray-700 dark:text-gray-300'>Nombre de places</p>
                            <p className='text-xl font-bold text-gray-800 dark:text-gray-100'>1</p>
                        </div>
                    </div>

                    {/* Bouton de réservation */}
                    <Button className="w-full py-4 text-xl font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                        <FontAwesomeIcon icon={faCalendar} className='mr-2' /> Demander à réserver
                    </Button>
                     <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Vous ne serez débité qu'après confirmation par le chauffeur.
                    </p>
                </div>
            </div>
        </main>
    </div>
  )
}

export default TripDetail;