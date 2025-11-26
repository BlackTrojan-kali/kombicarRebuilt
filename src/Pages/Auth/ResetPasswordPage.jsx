"use client";
import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import de useNavigate
import { authContext } from '../../contexts/AuthContext'; 

// Simulation des hooks pour le style et le contexte (à remplacer par vos imports réels)
// Note: Assurez-vous d'importer useColorScheme si vous l'utilisez pour le thème.
const useColorScheme = () => ({ theme: 'light' }); // Simulé
// const Input = ({ id, type, placeholder, required, className, value, onChange }) => <input {...{ id, type, placeholder, required, className, value, onChange }} />;
const Input = (props) => <input {...props} />; // Utilisation de Input comme dans Signin

export default function ResetPasswordPage() {
    const { token } = useParams(); 
    // Assurez-vous que votre fonction resetPassword est bien: resetPassword(email, token, newPassword)
    const { resetPassword, loading } = useContext(authContext); 
    
    const navigate = useNavigate();
    const { theme } = useColorScheme(); // Hook pour le thème
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState(''); // Ajout du champ email

    // Styles dynamiques (tirés de votre composant Signin)
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
             toast.error("Les mots de passe ne correspondent pas.");
             return;
        }

        // Vérifiez si votre API nécessite l'email. Si oui, décommentez la ligne:
        // const success = await resetPassword(email, token, newPassword); 
        
        // Si votre API n'a besoin que du token et du mot de passe (moins sécurisé):
        const success = await resetPassword(token, newPassword); 
        
        if (success) {
            // Redirection vers la page de connexion après succès
            navigate('/signin'); 
        }
    };
    
    // Si le token est absent de l'URL, on affiche un message d'erreur ou on redirige
    if (!token) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''} flex items-center justify-center p-6`}>
                <div className={`p-8 rounded-lg ${cardBg} shadow-xl max-w-md w-full text-center`}>
                    <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Lien Invalide</h2>
                    <p className="text-gray-500 dark:text-gray-400">Le lien de réinitialisation de mot de passe est manquant ou invalide. Veuillez refaire une demande.</p>
                    <button 
                        onClick={() => navigate('/forgot-password')}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold"
                    >
                        Nouvelle demande
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''} flex items-center justify-center p-6`}>
            <div className={`p-8 rounded-lg ${cardBg} shadow-xl max-w-md w-full`}>
                <h2 className={`text-3xl font-bold text-center mb-8 ${textColor}`}>
                    Réinitialiser le Mot de Passe
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* // ** Optionnel: Si votre API nécessite l'email **
                    <div className="grid gap-2">
                        <label htmlFor="email" className={labelColor}>Email</label>
                        <Input
                            id="email"
                            placeholder="votre@email.com"
                            type="email"
                            required={true}
                            className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    // ** Fin Optionnel ** */}

                    <div className="grid gap-2">
                        <label htmlFor="newPassword" className={labelColor}>Nouveau mot de passe</label>
                        <Input
                            id="newPassword"
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Entrez votre nouveau mot de passe"
                            required 
                            className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                        />
                         <div className="text-muted-foreground text-sm text-gray-500 dark:text-gray-400">
                             Min. 8 caractères.
                         </div>
                    </div>
                    
                    <div className="grid gap-2">
                        <label htmlFor="confirmPassword" className={labelColor}>Confirmer le mot de passe</label>
                        <Input
                            id="confirmPassword"
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirmez le nouveau mot de passe"
                            required 
                            className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !token || newPassword !== confirmPassword}
                        className={`w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md font-semibold transition-colors duration-200 
                            ${(loading || !token || newPassword !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}