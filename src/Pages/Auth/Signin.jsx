"use client";
import React, { useState } from "react"; // Importez React et useState
import Input from "../../Components/form/Input";
import FormButton from "../../Components/form/FormButton";
import  useAuth  from "../../hooks/useAuth"; // Importez le hook d'authentification
import useColorScheme from "../../hooks/useColorScheme"; // Importez le hook de thème
import { Toaster, toast } from 'react-hot-toast'; // Pour les notifications

export default function Signin() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // État pour "se souvenir de moi"

  const { login, externalLoginGoogle, loading } = useAuth(); // Récupérez les fonctions et l'état de chargement du contexte
  const { theme } = useColorScheme(); // Récupérez le thème

  // Couleurs conditionnelles pour le dark mode
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const shadow = theme === 'dark' ? 'shadow-lg' : 'shadow-md';


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrPhone || !password) {
      toast.error('Veuillez entrer votre email/numéro de téléphone et votre mot de passe.', { position: 'top-right' });
      return;
    }

    // Assurez-vous que votre fonction 'login' dans AuthContext accepte 'email' et 'password'
    // Si elle gère aussi les numéros de téléphone, vous devrez adapter la logique de validation ici.
    const loginPromise = login({ email: emailOrPhone, password });

    toast.promise(loginPromise, {
      loading: 'Connexion en cours...',
      success: 'Connexion réussie !',
      error: (err) => `Erreur: ${err.message || 'Identifiants invalides.'}`,
    });

    // La navigation après la connexion réussie sera gérée par votre logique de routage
    // (par exemple, un useEffect dans App.jsx qui réagit à 'user' du AuthContext).
  };

  const handleGoogleLogin = async () => {
    // Appel à la fonction externalLoginGoogle du contexte
    const googleLoginPromise = externalLoginGoogle();

    toast.promise(googleLoginPromise, {
      loading: 'Redirection vers Google...',
      success: 'Redirection réussie !',
      error: (err) => `Erreur: ${err.message || 'Échec de la connexion Google.'}`,
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center py-12`}>
      <Toaster /> {/* Composant Toaster pour afficher les notifications */}
      
      <div className="w-[90vw] md:w-[500px] ">
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading} // Désactive le bouton pendant le chargement
            className={`flex items-center w-full justify-center ${cardBg} border ${inputBorder} rounded-lg shadow-md px-6 py-3 text-sm font-medium ${textColor} hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200`}
          >
            <svg
              className="h-6 w-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="800px"
              height="800px"
              viewBox="-0.5 0 48 48"
              version="1.1"
            >
              {" "}
              <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
              <defs> </defs>{" "}
              <g
                id="Icons"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                {" "}
                <g
                  id="Color-"
                  transform="translate(-401.000000, -860.000000)"
                >
                  {" "}
                  <g
                    id="Google"
                    transform="translate(401.000000, 860.000000)"
                  >
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </svg>
            <span>Connexion avec Google</span>
          </button>
        </div>
        <div className={`py-4 text-center font-bold ${textColor}`}>Ou</div>

        <div className="flex justify-center mb-6">
          <picture>
            <img
              src="/default/logo.png"
              alt="Logo Kombicar"
              className="w-[80px] h-[80px]"
            />
          </picture>
        </div>
        <h2 className={`text-3xl font-bold text-center mb-8 ${textColor}`}>Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-8 max-w-3xl mx-auto">
          <div className="grid gap-2">
            <label htmlFor="emailOrPhone" className={labelColor}>Email ou numéro de téléphone</label>
            <Input
              id="emailOrPhone"
              placeholder="699888777"
              type="text"
              required={true}
              className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <div className="text-muted-foreground text-sm text-gray-500 dark:text-gray-400">
              Le numéro de téléphone sur lequel vous êtes facilement joignable{" "}
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className={labelColor}>Mot de passe</label>
            <Input
              id="password"
              placeholder="*******"
              type="password" // Changer en type "password" pour masquer l'entrée
              required={true}
              className={`formInput w-full p-3 rounded-md border ${inputBorder} ${inputBg} ${textColor} focus:ring-blue-500 focus:border-blue-500`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-muted-foreground text-sm text-gray-500 dark:text-gray-400">
              Votre mot de passe doit contenir au moins 8 caractères.
            </div>
          </div>

          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <input
              id="rememberMe" // Changer l'ID pour la clarté
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              type="checkbox"
              className={`mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500
                  ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}`}
            />
            <div className="space-y-1 leading-none">
              <label htmlFor="rememberMe" className={labelColor}>
                Se souvenir de moi
              </label>
            </div>
          </div>
          <FormButton
            type="submit"
            disabled={loading} // Désactive le bouton pendant le chargement
            className="w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md"
          >
            {loading ? 'Connexion...' : 'Se connecter'} {/* Texte du bouton dynamique */}
          </FormButton>
        </form>
      </div>
    </div>
  );
}
