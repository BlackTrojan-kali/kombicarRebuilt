import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ReservationSuccess = () => {
    // Styles de base
    const bgColor = 'bg-white dark:bg-gray-800';
    const textColor = 'text-gray-900 dark:text-gray-100';
    const accentColor = 'text-green-600 dark:text-green-400';
    const cardShadow = 'shadow-2xl';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className={`w-full max-w-md p-8 rounded-2xl ${bgColor} ${cardShadow} text-center`}>

                {/* Section d'En-tête (Succès) */}
                <div className="mb-6">
                    <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className={`text-8xl ${accentColor} animate-pulse`} 
                    />
                    <h1 className={`text-3xl font-bold mt-4 ${textColor}`}>
                        Opération Réussie !
                    </h1>
                </div>

                {/* Message de Succès */}
                <p className={`mt-2 text-xl text-gray-600 dark:text-gray-300 mb-8`}>
                    Votre paiement a été traité avec succès.
                </p>
                
                {/* Information sur la suite */}
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    Vous allez être redirigé vers le détail de votre réservation.
                </p>

                {/* Bouton de Redirection ou d'Attente */}
                <button
                    // Ce bouton pourrait déclencher la navigation vers la page de détails de la réservation
                    onClick={() => console.log("Redirection vers la page de détails de la réservation...")}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-full"
                >
                    Continuer <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
            </div>
        </div>
    );
}

export default ReservationSuccess;