import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Assurez-vous que le chemin d'importation est correct

const SignInAdmin = () => {
  const navigate = useNavigate();
  const { user, loginAdmin, loginAdminConfirmCode, loading } = useAuth();
  
  // Console.log conservé selon votre logique originale
  console.log(user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault(); 
    setError(''); 
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password.length < 8) {
        setError('Le mot de passe doit avoir au moins 8 caractères.');
        return; 
    }

    const result = await loginAdmin({ email, password });
    
    if (result && result.twoFactorRequired) {
      setTwoFactorRequired(true);
    } else if (result && result.success) {
      navigate('/admin/dashboard');
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!confirmationCode) {
      setError('Veuillez entrer le code de confirmation.');
      return;
    }

    const success = await loginAdminConfirmCode({ email, password, code: confirmationCode });

    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Panneau de gauche - Décoratif (Caché sur mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        {/* Cercles décoratifs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Espace Administration
          </h2>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Gérez votre plateforme, consultez vos statistiques et configurez vos paramètres en toute sécurité.
          </p>
        </div>
      </div>

      {/* Panneau de droite - Formulaire */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24 bg-white shadow-2xl lg:shadow-none lg:rounded-none rounded-t-[3rem] mt-12 lg:mt-0">
        <div className="w-full max-w-md space-y-8">
          
          {/* En-tête du formulaire */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900">
              {twoFactorRequired ? 'Vérification' : 'Connexion Admin'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {twoFactorRequired 
                ? 'Saisissez le code envoyé à votre adresse email.' 
                : 'Veuillez entrer vos identifiants pour accéder au tableau de bord.'}
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50">
              <svg className="flex-shrink-0 inline w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Formulaire de connexion initial */}
          {!twoFactorRequired ? (
            <form className="space-y-6" onSubmit={handleSignIn}>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="admin@exemple.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all duration-200
                           ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : 'Se connecter'}
              </button>
            </form>
          ) : (
            /* Formulaire de confirmation de code (2FA) */
            <form className="space-y-6" onSubmit={handleConfirmCode}>
              <div className="space-y-1">
                <label htmlFor="code" className="block text-sm font-medium text-slate-700 text-center">
                  Code de sécurité
                </label>
                <div className="mt-2">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white transition-all duration-200
                           ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900'}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Valider le code'}
              </button>
              
              <button 
                type="button"
                onClick={() => setTwoFactorRequired(false)}
                className="w-full text-sm text-slate-500 hover:text-slate-700 mt-4 text-center"
              >
                ← Retour à la connexion
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInAdmin;