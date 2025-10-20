import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button'; // Assurez-vous d'avoir un composant Button
import useUser from '../../hooks/useUser'; // Importez le hook useUser
import useAuth from '../../hooks/useAuth'; // Importez le hook useAuth pour les données de l'utilisateur

// ====================================================================
// CONVERSION DES RÉFÉRENCES C# EN JS
// ====================================================================
// Liste des pays basée sur votre énumération C# (format [code_iso, code_tel, nom_complet])
const COUNTRY_REFERENCES = [
    { code: 'OTHERS', value: 0, name: "Autre / International" },
    { code: 'CM', value: 237, name: "Cameroun" },
    { code: 'CI', value: 225, name: "Côte d'Ivoire" },
    { code: 'SN', value: 221, name: "Sénégal" },
    { code: 'CD', value: 243, name: "R.D. Congo" },
    { code: 'ML', value: 223, name: "Mali" },
    { code: 'BJ', value: 229, name: "Bénin" },
    { code: 'TG', value: 228, name: "Togo" },
    { code: 'GN', value: 224, name: "Guinée" },
    { code: 'BF', value: 226, name: "Burkina Faso" },
    { code: 'FR', value: 33, name: "France" },
];

const EditProfileModal = ({ isOpen, onClose }) => {
    // 1. Récupération des données et fonctions du contexte
    // NOTE : Le setUser est exporté par useAuth, mais il n'est plus nécessaire ici 
    // si fetchUserInfo a été intégré à updateProfile dans UserContext.
    const { user, defaultCountry, loading: authLoading } = useAuth(); 
    const { updateProfile, isUpdatingProfile, updateProfileError } = useUser();
    // 2. Initialisation de l'état local du formulaire
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: COUNTRY_REFERENCES[0].value, // '0' par défaut (OTHERS)
    });
    
    // 3. Charger les données de l'utilisateur dans le formulaire à l'ouverture de la modal
    useEffect(() => {
        if (isOpen && user) {
            // Déterminer la valeur du pays : utilisateur > pays par défaut > 0 (OTHERS)
            // L'API renvoie le code numérique, qui correspond à la valeur des options.
            const initialCountryValue = user.country || (defaultCountry ? defaultCountry.countryCode : COUNTRY_REFERENCES[0].value);

            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                country: initialCountryValue, 
            });
        }
    }, [isOpen, user, defaultCountry]);

    // 4. Gestion des changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // C'EST ICI QUE NOUS CONVERTISSONS LA CHAÎNE ENTIER VERS L'ID NUMÉRIQUE ATTENDU PAR L'API
            [name]: name === 'country' ? parseInt(value, 10) : value, 
        }));
    };

    // 5. Gestion de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            country: formData.country, // C'est le code numérique (ex: 237)
        };

        try {
            // updateProfile met à jour les infos et rafraîchit l'état 'user' via AuthContext (comme discuté précédemment)
            await updateProfile(payload);
            
            // Le rafraîchissement de l'état 'user' est maintenant géré par updateProfile dans UserContext.
            
            onClose(); // Fermer la modal après succès
        } catch (error) {
            // L'erreur est gérée et affichée par la fonction updateProfile
        }
    };
    
    if (!isOpen) return null;

    return (
        // Overlay (arrière-plan sombre)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
            {/* Contenu de la Modal */}
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* En-tête de la Modal */}
                <div className="flex justify-between items-center border-b pb-4 mb-6 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier mon Profil</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                    </button>
                </div>

                {/* Message d'erreur global */}
                {updateProfileError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-300" role="alert">
                        <span className="block sm:inline">{updateProfileError}</span>
                    </div>
                )}

                {/* Formulaire de Profil */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Prénom */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Nom de famille */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de famille</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Numéro de téléphone */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    {/* Pays */}
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                        <select
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {COUNTRY_REFERENCES.map((country) => (
                            
                                <option key={country.code} value={country.value}>
                                    {country.name} ({country.code === 'OTHERS' ? '0' : `+${country.value}`})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                                isUpdatingProfile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isUpdatingProfile ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                    Mise à jour...
                                </>
                            ) : (
                                "Enregistrer les modifications"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;