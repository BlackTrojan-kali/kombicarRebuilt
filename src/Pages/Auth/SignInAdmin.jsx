import React, { useState } from 'react';

// Composant de page de connexion pour l'administrateur.
// Ce composant gère l'état du formulaire, les soumissions et les erreurs.
const SignInAdmin = () => {
  // États pour les champs du formulaire.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // État pour gérer l'affichage du chargement lors de la soumission.
  const [loading, setLoading] = useState(false);
  // État pour gérer les messages d'erreur.
  const [error, setError] = useState('');

  // Fonction asynchrone pour gérer la soumission du formulaire.
  const handleSignIn = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut.
    setError(''); // Réinitialise l'erreur précédente.
    setLoading(true); // Active l'état de chargement.

    // Validation simple pour s'assurer que les champs ne sont pas vides.
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'un appel API pour la connexion.
      // Remplacez cette logique par votre propre appel API de connexion.
      console.log('Tentative de connexion avec :', { email, password });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un délai réseau.

      // Une fois la connexion réussie, vous pouvez rediriger l'utilisateur
      // ou stocker les informations de session.
      console.log('Connexion réussie !');
      // Pour éviter les alertes natives dans l'iframe, utilisez un toast ou un composant modal.
      // toast.success('Connexion réussie ! Redirection vers le tableau de bord...');
      // Exemple de redirection: window.location.href = '/admin/dashboard';

    } catch (err) {
      // Gestion des erreurs de l'API.
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false); // Désactive l'état de chargement une fois le processus terminé.
    }
  };

  return (
    // Conteneur principal avec un fond clair et centré.
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-4">
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

        {/* Formulaire de connexion */}
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
      </div>
    </div>
  );
};

export default SignInAdmin;
