"use client";
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { authContext } from '../../contexts/AuthContext'; 

// Simulation des hooks et composants manquants pour l'affichage complet
// Si vous utilisez ces hooks/composants ailleurs, remplacez les lignes ci-dessous par vos imports réels.
const useColorScheme = () => ({ theme: 'light' });
const Input = (props) => <input {...props} />;
const FormButton = (props) => <button {...props}>{props.children}</button>;


export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useContext(authContext);
  const [email, setEmail] = useState('');
    const navigate = useNavigate();
    
    // Pour les styles dynamiques
    const { theme } = useColorScheme(); 

    // Styles dynamiques (tirés de votre composant Signin)
    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
    const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
    const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    
    const handleSubmit = async (e) => {
      e.preventDefault();
        
        const success = await forgotPassword(email);

        if (success) {
            // Après l'envoi réussi, l'utilisateur doit être informé de vérifier son email.
            // On peut le rediriger vers la page de connexion ou une page d'information.
            navigate('/signin'); 
            // La notification toast dans AuthContext gère déjà le message de succès.
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''} flex items-center justify-center p-6 py-20`}>
            <div className={`p-8 rounded-lg ${cardBg} shadow-xl max-w-md w-full`}>
                <h2 className={`text-3xl font-bold text-center mb-8 ${textColor}`}>
                    Mot de passe oublié
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                    Entrez l'adresse e-mail associée à votre compte pour recevoir un lien de réinitialisation.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <label htmlFor="email" className={labelColor}>Adresse E-mail</label>
                        <Input 
                            id="email"
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="votre@email.com"
                            required 
                            className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
                        />
                    </div>

                    <FormButton 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md font-semibold transition-colors duration-200 
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                    </FormButton>
                </form>
                
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => navigate('/auth/signin')}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        Annuler et retourner à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
}