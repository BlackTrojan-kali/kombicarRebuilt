import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
// Assurez-vous d'avoir ce hook disponible
import useUser from "../../hooks/useUser"; 

// Composant Modale pour la saisie des informations manquantes
function ProfileUpdateModal({ isVisible, onClose, onSubmit, countryValue, phoneValue, setCountry, setPhone, isLoading }) {
    if (!isVisible) return null;

    // Blocage de la fermeture de la modale par clic extérieur tant que les champs sont vides
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        // Overlay (fond noir)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleModalClick}>
            {/* Contenu de la Modale */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={handleModalClick}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Mise à jour du profil requise 🔔
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Pour accéder à toutes les fonctionnalités, veuillez compléter votre pays et votre numéro de téléphone.
                </p>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Code Pays (Ex: 225)
                        </label>
                        <input
                            type="number"
                            id="country"
                            value={countryValue}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            placeholder="Ex: 225"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Numéro de Téléphone
                        </label>
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
    // Utiliser le hook useUser pour accéder à la fonction updateProfile et l'état de chargement
    const { updateProfile, isUpdatingProfile } = useUser(); 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // 2. useEffect pour vérifier si le profil est incomplet
    useEffect(() => {
        // La modale ne doit s'afficher que si l'utilisateur est connecté ET que les champs sont vides.
        // On vérifie si l'utilisateur est authentifié et si country OU phoneNumber sont manquants.
        const isProfileIncomplete = user && (user.country === null || user.phoneNumber === null || user.country === "" || user.phoneNumber === "");
        
        if (isProfileIncomplete) {
            setIsModalVisible(true);
            // Pré-remplir les champs si une valeur existe (par exemple, si seul le téléphone manque)
            setCountry(user.country || '');
            setPhoneNumber(user.phoneNumber || '');
        } else {
            setIsModalVisible(false);
        }
    }, [user]); // Re-vérifie à chaque fois que l'objet 'user' change

    // 3. Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!country || !phoneNumber) {
            alert("Veuillez remplir le pays et le numéro de téléphone, monsieur.");
            return;
        }

        const profileData = {
            country: country,
            phoneNumber: phoneNumber,
            // Incluez les autres champs obligatoires pour l'endpoint updateProfile 
            // si nécessaire, même s'ils ne sont pas modifiés ici.
            // Ex: firstName: user.firstName, lastName: user.lastName, etc.
        };

        try {
            // Appel de la fonction du hook useUser
            await updateProfile(profileData); 
            
            // Si l'appel réussit (la toast de succès est gérée dans useUser), on ferme la modale
            setIsModalVisible(false);
        } catch (error) {
            // La toast d'erreur est gérée dans useUser.
            console.error("Échec de la mise à jour du profil:", error);
        }
    };

    // La modale est rendue ici (elle se superposera au reste du contenu)
    // Elle doit être placée en dehors du composant Footer pour s'afficher correctement 
    // ou tout en haut du Footer si elle doit techniquement être dans ce composant.
    // Pour un meilleur placement, elle devrait être dans le Layout/App, mais on la laisse ici.

    return (
        <>
            {/* La Modale s'affiche si l'état est vrai */}
            <ProfileUpdateModal
                isVisible={isModalVisible}
                onClose={() => { /* On désactive la fermeture pour forcer la complétion */ }}
                onSubmit={handleSubmit}
                countryValue={country}
                phoneValue={phoneNumber}
                setCountry={setCountry}
                setPhone={setPhoneNumber}
                isLoading={isUpdatingProfile}
            />

            {/* Le contenu original du Footer */}
            <footer className="bg-white dark:bg-gray-900">
                {/* ... (Reste de votre code JSX pour le Footer) ... */}
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
                                            href="https://web.facebook.com/Kombicarcm"
                                            className="hover:underline "
                                        >
                                            Facebook
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.instagram.com/kombi.car/"
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
                                        <a href="#" className="hover:underline">
                                            Conditions d'utilisations
                                        </a>
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

// Remplacez les chemins d'importation par les vôtres
// export default Footer;