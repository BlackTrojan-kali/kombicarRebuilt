"use client";
import React, { useState, useEffect } from "react";
import Input from "../../Components/form/Input";
import FormButton from "../../Components/form/FormButton";
import useAuth from "../../hooks/useAuth";
import useColorScheme from "../../hooks/useColorScheme";
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
// Import the GoogleLoginButton component
import GoogleLoginButton from "../../Components/ui/GoogleLoginButton";

export default function Signin() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Destructure 'user', 'login', and 'loading' from the custom hook
  const { user, login, loading } = useAuth();
  const { theme } = useColorScheme();
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Conditional colors for dark mode
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

    const loginPromise = login({ email: emailOrPhone, password });

    toast.promise(loginPromise, {
      loading: 'Connexion en cours...',
      error: (err) => `Erreur: ${err.message || 'Identifiants invalides.'}`,
    });
  };

  // Render conditionally to avoid a momentary page display
  if (user === undefined) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : ''} text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center py-20`}>
      <Toaster />

      <div className="w-[90vw] md:w-[500px] ">
        <div className="flex items-center justify-center mb-6">
          {/* Use the new GoogleLoginButton component here */}
          <GoogleLoginButton />
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
              type="password"
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
              id="rememberMe"
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
            disabled={loading}
            className="w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </FormButton>
        </form>
      </div>
    </div>
  );
}
