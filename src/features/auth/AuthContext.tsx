// src/features/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect,type ReactNode } from 'react';
import { authService } from '../../services/authService';
import type { UserInfo, LoginPayload } from '../../types/authTypes';

// 1. Définition des types pour le Contexte
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Vrai pendant qu'on vérifie le token au démarrage
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>; // Pour forcer la mise à jour du profil (ex: après un upload d'image)
}

// 2. Création du Contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Création du Provider (qui va envelopper l'application)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fonction pour récupérer les infos de l'utilisateur
  const fetchUserInfos = async () => {
    try {
      const userInfo = await authService.getUserInfos();
      setUser(userInfo);
    } catch (error) {
      console.error("Impossible de récupérer les infos utilisateur. Token expiré ou invalide.");
      logout(); // Nettoie le state si le token est mort
    } finally {
      setIsLoading(false);
    }
  };

  // Au démarrage de l'application, on vérifie si un token est présent
  useEffect(() => {
    const token = localStorage.getItem('kombicar_token');
    if (token) {
      fetchUserInfos();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Méthode de connexion simplifiée pour les composants
  const login = async (payload: LoginPayload) => {
    // Le service gère l'appel API et le stockage du token dans le localStorage
    await authService.login(payload);
    // Une fois connecté, on va chercher le profil pour mettre à jour l'interface
    await fetchUserInfos();
  };

  // Méthode de déconnexion
  const logout = () => {
    localStorage.removeItem('kombicar_token');
    localStorage.removeItem('kombicar_refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser: fetchUserInfos,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. Création du Custom Hook !
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};