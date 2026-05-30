// src/pages/auth/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/AuthContext';
import { authService } from '../../services/authService';

// Déclaration pour informer TypeScript que l'objet global "google" existe
declare global {
  interface Window {
    google?: any;
  }
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // On récupère refreshUser pour forcer la mise à jour du contexte après le login Google
  const { login, refreshUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // --- SOUMISSION CLASSIQUE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast.success('Connexion réussie !');
      
      const origin = location.state?.from?.pathname || '/vtc';
      navigate(origin, { replace: true });
    } catch (error: any) {
      const message = error.response?.data || "Email ou mot de passe incorrect.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- GESTIONNAIRE GOOGLE NATIF ---
  const handleCredentialResponse = async (response: any) => {
    setIsSocialLoading('google');
    try {
      // 1. On envoie le JWT de Google à notre backend
      await authService.loginGoogle({ token: response.credential });
      
      // 2. On met à jour l'état global de l'app (AuthContext)
      await refreshUser(); 
      
      toast.success('Connexion via Google réussie !');
      const origin = location.state?.from?.pathname || '/vtc';
      navigate(origin, { replace: true });
    } catch (error: any) {
      toast.error("Échec de la validation du token Google par le serveur.");
    } finally {
      setIsSocialLoading(null);
    }
  };

  // Initialisation du SDK Google au chargement de la page
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "246979621166-sah339sh5nge2n3epsdbj1kegv60htqb.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: "outline", size: "large", width: "100%" } // J'ajoute width pour qu'il prenne toute la place
      );
    }
  }, []);

  // --- GESTIONNAIRE APPLE (En attente d'implémentation SDK) ---
  const handleAppleLogin = async () => {
    setIsSocialLoading('apple');
    try {
      const appleToken = "JETON_APPLE_A_RECUPERER_VIA_SDK";
      await authService.loginApple({ token: appleToken });
      await refreshUser();
      
      toast.success('Connexion via Apple réussie !');
      navigate('/vtc', { replace: true });
    } catch (error: any) {
      toast.error('Échec de la connexion via Apple.');
    } finally {
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base">
      <div className="w-full max-w-md bg-surface border border-border-main rounded-2xl shadow-sm overflow-hidden">
        
        {/* En-tête (Header) */}
        <div className="flex items-center justify-between p-6 border-b border-border-main">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-border-main hover:bg-base transition-colors"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-semibold text-text-main">Connexion</h1>
          <div className="w-10"></div>
        </div>

        {/* Corps du formulaire */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Adresse Email</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <Mail size={18} className="text-text-muted mr-2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                  placeholder="jean.dupont@example.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Mot de passe</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <Lock size={18} className="text-text-muted mr-2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center justify-between mt-2 px-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border-main text-kombi-orange-500 focus:ring-kombi-orange-500"
                  />
                  <span className="text-sm text-text-muted">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-kombi-blue-500 hover:text-kombi-blue-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading || isSocialLoading !== null}
              className="w-full mt-2 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="mt-8 mb-6 flex items-center">
            <div className="flex-1 border-t border-border-main"></div>
            <span className="px-4 text-sm text-text-muted bg-surface">Ou continuer avec</span>
            <div className="flex-1 border-t border-border-main"></div>
          </div>

          {/* Boutons Social Login */}
          <div className="space-y-3 flex flex-col items-center">
            
            {/* Le conteneur du bouton natif Google */}
            <div className="w-full min-h-[44px] flex justify-center bg-surface rounded-xl overflow-hidden">
              <div id="google-btn" className="w-full flex justify-center"></div>
            </div>

            {/* Bouton Apple */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={isLoading || isSocialLoading !== null}
              className="w-full flex items-center justify-center gap-3 bg-kombi-dark-500 text-white hover:bg-gray-800 font-medium py-[10px] rounded-[4px] transition-colors disabled:opacity-70"
            >
              {isSocialLoading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  Continuer avec Apple
                </>
              )}
            </button>
          </div>

          {/* Lien d'inscription */}
          <p className="text-center text-sm text-text-muted mt-8">
            Nouveau sur Kombicar ?{' '}
            <Link to="/register" className="text-kombi-orange-500 font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};