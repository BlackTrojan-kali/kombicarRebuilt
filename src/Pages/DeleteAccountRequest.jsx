import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faExclamationTriangle, faUserSlash, faArrowLeft, 
    faFileAlt, faCar, faCheckCircle, faEnvelope
} from '@fortawesome/free-solid-svg-icons';

const DeleteAccountRequest = () => {
    const [formData, setFormData] = useState({
        email: '',
        reason: '',
        confirmText: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Sécurité : on exige que l'utilisateur tape "SUPPRIMER"
        if (formData.confirmText !== 'SUPPRIMER') return;
        
        setIsSubmitting(true);
        
        // Simulation de l'appel API vers votre backend
        // Ici, vous traiterez la demande pour le UserID correspondant
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Demande envoyée</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Votre demande de suppression a bien été transmise à nos équipes. Un e-mail de confirmation vous sera envoyé, et vos données seront définitivement effacées sous 30 jours.
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Retourner à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                
                {/* En-tête (Thème Danger) */}
                <div className="bg-red-600 dark:bg-red-800 px-8 py-8 text-white relative">
                    <button 
                        onClick={() => window.history.back()}
                        className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors"
                        aria-label="Retour"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                    </button>
                    <div className="text-center mt-4">
                        <FontAwesomeIcon icon={faUserSlash} className="text-5xl mb-4 opacity-90" />
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Suppression de compte</h1>
                        <p className="text-red-100 text-sm">
                            Formulaire de demande d'effacement définitif des données.
                        </p>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="p-8 md:p-10 text-gray-700 dark:text-gray-300">
                    
                    {/* Avertissements */}
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-5 rounded-r-lg mb-8">
                        <div className="flex">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mt-1 mr-4" />
                            <div>
                                <h3 className="text-red-800 dark:text-red-400 font-bold text-lg mb-1">Attention, action irréversible</h3>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Une fois traitée, cette demande entraînera la perte définitive de votre accès à la plateforme.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Données qui seront supprimées :</h3>
                    <ul className="space-y-4 mb-8 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 text-gray-400 dark:text-gray-500 mt-0.5">
                                <FontAwesomeIcon icon={faCar} />
                            </div>
                            <div>
                                <strong className="block text-gray-900 dark:text-gray-200">Véhicules enregistrés</strong>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Toutes les caractéristiques de vos véhicules (marque, modèle, couleur, code d'immatriculation, nombre de places, type de véhicule et présence de climatisation) seront effacées de la base de données.
                                </span>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 w-8 text-gray-400 dark:text-gray-500 mt-0.5">
                                <FontAwesomeIcon icon={faFileAlt} />
                            </div>
                            <div>
                                <strong className="block text-gray-900 dark:text-gray-200">Documents et Justificatifs</strong>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Les métadonnées de vos documents (noms, types, dates de création) ainsi que les URL menant à vos fichiers stockés seront définitivement révoquées et supprimées.
                                </span>
                            </div>
                        </li>
                    </ul>

                    <hr className="border-gray-200 dark:border-gray-700 mb-8" />

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Adresse e-mail du compte <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                </div>
                                <input 
                                    type="email" 
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre.email@exemple.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Raison de la suppression (Optionnel)
                            </label>
                            <select 
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                            >
                                <option value="">Sélectionnez une raison</option>
                                <option value="privacy">Préoccupations liées à la vie privée</option>
                                <option value="not_using">Je n'utilise plus le service</option>
                                <option value="vehicle_sold">J'ai vendu mon véhicule / Je ne suis plus chauffeur</option>
                                <option value="app_issues">Problèmes techniques récurrents</option>
                                <option value="other">Autre raison</option>
                            </select>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pour confirmer, veuillez taper <strong>SUPPRIMER</strong> ci-dessous : <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="confirmText"
                                name="confirmText"
                                required
                                value={formData.confirmText}
                                onChange={handleChange}
                                placeholder="SUPPRIMER"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors font-mono uppercase tracking-widest"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={formData.confirmText !== 'SUPPRIMER' || isSubmitting}
                            className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all duration-200 
                                ${formData.confirmText === 'SUPPRIMER' && !isSubmitting
                                    ? 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                                    : 'bg-red-400 dark:bg-red-900 cursor-not-allowed opacity-70'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Traitement en cours...
                                </span>
                            ) : (
                                "Confirmer la suppression"
                            )}
                        </button>
                    </form>
                    
                    <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
                        Conformément à nos CGU, certaines données financières peuvent être conservées à des fins d'obligations légales et comptables.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default DeleteAccountRequest;