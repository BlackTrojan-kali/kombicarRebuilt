import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Assurez-vous que le chemin d'importation est correct
import { Toaster } from 'react-hot-toast'; // Importez Toaster pour afficher les notifications

// Composant de page de connexion pour l'administrateur.
const SignInAdmin = () => {
  // Hook pour la navigation après connexion
  const navigate = useNavigate();

  // Utilisation du hook useAuth pour accéder aux fonctions du contexte
  const { loginAdmin, loginAdminConfirmCode, loading } = useAuth();
  
  // États pour les champs du formulaire.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  // État pour gérer les messages d'erreur du formulaire.
  const [error, setError] = useState('');
  // État pour gérer l'affichage du formulaire de code de confirmation.
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  // Gère la soumission du formulaire de connexion initiale (email/mot de passe).
  const handleSignIn = async (e) => {
    e.preventDefault(); 
    setError(''); 
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    // Appelle la fonction loginAdmin du contexte
    const result = await loginAdmin({ email, password });
    
    // Gère la réponse de l'API
    if (result && result.twoFactorRequired) {
      // Si le 2FA est requis, affiche le formulaire de code
      setTwoFactorRequired(true);
    } else if (result && result.success) {
      // Si la connexion réussit sans 2FA, navigue vers le tableau de bord
      navigate('/admin/dashboard');
    } else {
      // Gère les échecs de connexion (le toast gère déjà l'erreur)
      // On peut laisser le `setError` pour une gestion d'erreur locale si besoin
    }
  };

  // Gère la soumission du formulaire de confirmation du code.
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!confirmationCode) {
      setError('Veuillez entrer le code de confirmation.');
      return;
    }

    // Appelle la fonction loginAdminConfirmCode du contexte
    const success = await loginAdminConfirmCode({ email,password, code: confirmationCode });

    if (success) {
      // Si la confirmation réussit, navigue vers le tableau de bord
      navigate('/admin/dashboard');
    }
    // Note: Le toast du contexte gère déjà l'affichage de l'erreur en cas d'échec
  };

  return (
    // Conteneur principal avec un fond clair et centré.
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-4">
      <Toaster /> {/* Affiche les notifications de react-hot-toast */}
      {/* Carte du formulaire de connexion */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Connexion Admin
          </h1>
          <p className="mt-2 text-gray-600">
            Accédez à votre tableau de bord.
          </p>
        </div>

        {/* Message d'erreur s'il y a lieu */}
        {error && (
          <div className="bg-red-100 text-red-700 text-center p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Formulaire de connexion initial (email/mot de passe) */}
        {!twoFactorRequired ? (
          <form className="space-y-6" onSubmit={handleSignIn}>
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-colors duration-200
                           ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Se connecter'}
              </button>
            </div>
          </form>
        ) : (
          /* Formulaire de confirmation de code (si 2FA est requis) */
          <form className="space-y-6" onSubmit={handleConfirmCode}>
            <p className="text-center text-sm text-gray-600">
              Un code de confirmation a été envoyé à votre adresse e-mail. Veuillez le saisir ci-dessous.
            </p>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Code de confirmation
              </label>
              <div className="mt-1">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="XXXXXX"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-colors duration-200
                           ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Confirmer le code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInAdmin;
