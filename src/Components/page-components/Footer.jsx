import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
// Assurez-vous d'avoir ce hook disponible
import useUser from "../../hooks/useUser"; 
import { Link } from "react-router-dom";

// Liste des codes pays avec leurs noms
const COUNTRY_CODE_TO_NAME = {
    237: 'Cameroun', 
    225: "Côte d'Ivoire", 
    221: 'Sénégal', 
    243: 'République Démocratique du Congo', 
    223: 'Mali', 
    229: 'Bénin', 
    228: 'Togo', 
    224: 'Guinée', 
    226: 'Burkina Faso', 
    0: 'Autres / International',
};

// Composant Modale pour la saisie des informations manquantes (MIS À JOUR)
function ProfileUpdateModal({ isVisible, onClose, onSubmit, countryValue, phoneValue, setCountry, setPhone, isLoading }) {
    if (!isVisible) return null;

    // Blocage de la fermeture de la modale par clic extérieur tant que les champs sont vides
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Overlay (fond noir)
        // La classe bg-black/10 est conservée du code utilisateur, mais bg-black/50 est plus typique pour un overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleModalClick}>
            {/* Contenu de la Modale */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={handleModalClick}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Mise à jour du profil requise 🔔
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Pour accéder à toutes les fonctionnalités, veuillez compléter votre **pays** et votre **numéro de téléphone**.
                </p>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Pays
                        </label>
                        {/* Champ de sélection pour le pays */}
                        <select
                            id="country"
                            value={countryValue}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
                        >
                            <option value="" disabled>Sélectionnez un pays</option>
                            {/* Mappage de la liste des pays : la valeur est le code, le texte est le nom */}
                            {Object.entries(COUNTRY_CODE_TO_NAME).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name} (+{code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Numéro de Téléphone
                        </label>
                        {/* Champ de saisie pour le numéro de téléphone */}
                        <input
                            type="text"
                            id="phoneNumber"
                            value={phoneValue}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder="Ex: 6XXXXXXXX"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer et Continuer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Composant principal Footer
export function Footer() {
    // 1. Hooks d'état et de contexte
    const { user } = useAuth();
    const { updateProfile, isUpdatingProfile } = useUser(); 

    const [isModalVisible, setIsModalVisible] = useState(false);
    // 'country' stocke le code pays sous forme de chaîne (du <select>)
    const [country, setCountry] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState('');

    // 2. useEffect pour vérifier si le profil est incomplet
    useEffect(() => {
        // La vérification doit inclure l'état où le code pays pourrait être 0 (Autres / International) 
        // ou manquant (null, "", 0)
        const isCountryMissing = user && (user.country === null || user.country === "" || user.country === 0);
        const isPhoneMissing = user && (user.phoneNumber === null || user.phoneNumber === "");
        
        const isProfileIncomplete = user && (isCountryMissing || isPhoneMissing);
        
        if (isProfileIncomplete) {
            setIsModalVisible(true);
            
            // Pré-remplir les champs : le code pays est converti en chaîne pour le champ de sélection
            setCountry(String(user.country || '')); 
            setPhoneNumber(user.phoneNumber || '');
        } else {
            setIsModalVisible(false);
        }
    }, [user]); 

    // 3. Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!country || !phoneNumber) {
            alert("Veuillez remplir le pays et le numéro de téléphone, monsieur.");
            return;
        }

        const profileData = {
            // On s'assure de convertir le code pays en nombre entier si votre backend l'attend comme tel
            country: parseInt(country, 10), 
            phoneNumber: phoneNumber,
            // ... autres champs si nécessaire
        };

        try {
            await updateProfile(profileData); 
            setIsModalVisible(false);
        } catch (error) {
            console.error("Échec de la mise à jour du profil:", error);
        }
    };

    return (
        <>
            {/* La Modale est affichée si nécessaire */}
            <ProfileUpdateModal
                isVisible={isModalVisible}
                onClose={() => { /* Désactivé pour forcer la complétion */ }}
                onSubmit={handleSubmit}
                countryValue={country}
                phoneValue={phoneNumber}
                setCountry={setCountry}
                setPhone={setPhoneNumber}
                isLoading={isUpdatingProfile}
            />

            {/* Le contenu original du Footer */}
            <footer className="bg-white dark:bg-gray-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="/" className="flex items-center">
                                <img
                                    src="/default/logo_full.png"
                                    className="h-18 me-3"
                                    alt="Kombicar Logo"
                                />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                                    Suivez nous
                                </h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a
                                            href="https://facebook.com/kombicar"
                                            className="hover:underline "
                                        >
                                            Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://https://instagram.com/kombicar_cmr"
                                            className="hover:underline"
                                        >
                                            Instagram
                                        </a>
                                        <br />
                                        <br />
                                        <a
                                            href="/admin/signin"
                                            className="hover:underline"
                                        >
                                            admin page
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                                    Légal
                                </h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline">
                                            Politique de confidentialité
                                        </a>
                                    </li>
                                    <li>
                                        <Link to="privacy-policy" className="hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                            © 2025{" "}
                            <a href="/" className="hover:underline">
                                Kombicar™
                            </a>
                            . Tous droits réservés.
                        </span>
                        <div className="flex mt-4 sm:justify-center sm:mt-0">
                            {/* Icones des réseaux sociaux... */}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

// export default Footer;