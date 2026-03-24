import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faExclamationTriangle, faUserSlash, faArrowLeft, 
    faFileAlt, faCar, faCheckCircle, faEnvelope,
    faIdCard, faCloudUploadAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const DeleteAccountRequest = () => {
    const [formData, setFormData] = useState({
        email: '',
        reason: '',
        confirmText: '',
        identityDoc: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, identityDoc: file });
        }
    };

    const removeFile = () => {
        setFormData({ ...formData, identityDoc: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.confirmText !== 'SUPPRIMER' || !formData.identityDoc) return;
        
        setIsSubmitting(true);
        
        // Création du FormData pour l'envoi de fichier + texte
        const submitData = new FormData();
        submitData.append('email', formData.email);
        submitData.append('reason', formData.reason);
        submitData.append('identityDoc', formData.identityDoc); // Sera traité comme un Document côté serveur
        
        // Simulation de l'appel API
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Demande envoyée</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Votre demande de suppression a bien été transmise. Notre équipe va vérifier votre pièce d'identité. Un e-mail de confirmation vous sera envoyé, et vos données seront définitivement effacées sous 30 jours.
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
                                    Toutes les caractéristiques de vos véhicules (marque, modèle, couleur, immatriculation, configuration) seront effacées.
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
                                    Vos fichiers stockés et leurs métadonnées associées seront définitivement révoqués et supprimés.
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

                        {/* Zone d'upload du document d'identité */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pièce d'identité (Vérification) <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                Pour des raisons de sécurité, veuillez fournir une copie de la pièce d'identité associée à ce compte (CNI, Passeport, Permis). Ce document sera supprimé immédiatement après la vérification.
                            </p>
                            
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800/50">
                                <div className="space-y-1 text-center w-full">
                                    {!formData.identityDoc ? (
                                        <>
                                            <FontAwesomeIcon icon={faIdCard} className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                                                <label htmlFor="identityDoc" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-3 py-1 shadow-sm border border-gray-200 dark:border-gray-600">
                                                    <span>Sélectionner un fichier</span>
                                                    <input 
                                                        id="identityDoc" 
                                                        name="identityDoc" 
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept="image/jpeg, image/png, application/pdf"
                                                        onChange={handleFileChange}
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, PDF jusqu'à 5MB</p>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center overflow-hidden">
                                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 text-xl mr-3 flex-shrink-0" />
                                                <div className="truncate text-left">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{formData.identityDoc.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{(formData.identityDoc.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={removeFile}
                                                className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
                                                aria-label="Supprimer le fichier"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                            disabled={formData.confirmText !== 'SUPPRIMER' || !formData.identityDoc || isSubmitting}
                            className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all duration-200 
                                ${formData.confirmText === 'SUPPRIMER' && formData.identityDoc && !isSubmitting
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
                                    Envoi en cours...
                                </span>
                            ) : (
                                "Envoyer la demande de suppression"
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