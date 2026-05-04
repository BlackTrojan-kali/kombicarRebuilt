"use client";
import { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authContext } from '../../contexts/AuthContext'; 
import { toast } from "sonner"; 

// Simulation des hooks pour le style et le contexte
const useColorScheme = () => ({ theme: 'light' }); 
const Input = (props) => <input {...props} />; 

export default function ResetPasswordPage() {
    // Lecture des paramètres de l'URL ?email=...&token=...
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email'); 
    
    // Récupération de la fonction corrigée depuis le contexte
    const { resetPassword, loading } = useContext(authContext); 
    
    const navigate = useNavigate();
    const { theme } = useColorScheme(); 
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

        // Appel de l'API avec email, token, et nouveau mot de passe (Ordre du contexte)
        const success = await resetPassword(email, token, newPassword); 
        
        if (success) {
            navigate('/auth/signin'); // Redirection après succès
        }
    };
    
    // Sécurité : Vérifie que le lien de l'email est complet
    if (!token || !email) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''} flex items-center justify-center p-6`}>
                <div className={`p-8 rounded-lg ${cardBg} shadow-xl max-w-md w-full text-center`}>
                    <h2 className={`text-2xl font-bold mb-4 ${textColor}`}>Lien Invalide</h2>
                    <p className="text-gray-500 dark:text-gray-400">Le lien de réinitialisation est incomplet. Veuillez refaire une demande.</p>
                    <button 
                        onClick={() => navigate('/auth/forgot-password')} 
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
                    <div className="text-center text-sm mb-4 text-gray-500">
                        Compte : <span className="font-semibold">{email}</span>
                    </div>

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
                        disabled={loading || newPassword !== confirmPassword}
                        className={`w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md font-semibold transition-colors duration-200 
                            ${(loading || newPassword !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </div>
        </div>
    );
}