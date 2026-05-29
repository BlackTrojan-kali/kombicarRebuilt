// src/services/authService.ts
import api from '../config/api';
import type{
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  RefreshTokenPayload,
  ResendConfirmationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleLoginPayload,
  AppleLoginPayload,
  UserInfo,
  UpdateProfilePayload
} from '../types/authTypes';

export const authService = {
  // --- ENDPOINTS EXISTANTS ---

  register: async (payload: RegisterPayload): Promise<string> => {
    const response = await api.post<string>('/v1/users/register', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/users/login', payload);
    if (response.data.token) {
      localStorage.setItem('kombicar_token', response.data.token);
      localStorage.setItem('kombicar_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  refreshToken: async (payload: RefreshTokenPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/users/refresh-token', payload);
    if (response.data.token) {
      localStorage.setItem('kombicar_token', response.data.token);
      localStorage.setItem('kombicar_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  // --- NOUVEAUX ENDPOINTS ---

  /**
   * Confirme l'adresse email d'un utilisateur.
   * Note : Les paramètres sont passés directement dans l'URL.
   */
  confirmEmail: async (userId: string, token: string): Promise<string> => {
    // Utilisation des template literals (backticks) pour injecter l'ID et le token dans l'URL
    const response = await api.post<string>(`/v1/users/confirm-email/${userId}/${token}`);
    return response.data;
  },

  /**
   * Renvoie un nouvel email de confirmation.
   */
  resendConfirmationEmail: async (payload: ResendConfirmationPayload): Promise<string> => {
    const response = await api.post<string>('/v1/users/resend-confirmation-email', payload);
    return response.data;
  },

  /**
   * Démarre le processus de réinitialisation de mot de passe (envoi du lien par email).
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<string> => {
    const response = await api.post<string>('/v1/users/forgot-password', payload);
    return response.data;
  },

  /**
   * Valide la réinitialisation avec le token reçu par email et le nouveau mot de passe.
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<string> => {
    const response = await api.post<string>('/v1/users/reset-password', payload);
    return response.data;
  },
  /**
   * Connexion ou Inscription via Google OAuth.
   */
  loginGoogle: async (payload: GoogleLoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/users/login-google', payload);
    if (response.data.token) {
      localStorage.setItem('kombicar_token', response.data.token);
      localStorage.setItem('kombicar_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Connexion ou Inscription via Apple.
   */
  loginApple: async (payload: AppleLoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/users/login-apple', payload);
    if (response.data.token) {
      localStorage.setItem('kombicar_token', response.data.token);
      localStorage.setItem('kombicar_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  // --- GESTION DU PROFIL UTILISATEUR ---

  /**
   * Récupère les informations complètes de l'utilisateur connecté.
   */
  getUserInfos: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>('/v1/users/infos');
    return response.data;
  },

  /**
   * Vérifie si l'utilisateur a configuré son pays manuellement.
   */
  hasManuallySetCountry: async (): Promise<boolean> => {
    const response = await api.get<boolean>('/v1/users/has-manually-set-country');
    return response.data;
  },

  /**
   * Charge une nouvelle photo de profil.
   * Utilise FormData pour gérer l'envoi du fichier binaire.
   */
  uploadProfilePicture: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('pictureProfile', file);

    // On surcharge le Content-Type spécifiquement pour cette requête
    await api.post('/v1/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Met à jour partiellement les informations du profil.
   */
  updateProfile: async (payload: UpdateProfilePayload): Promise<string> => {
    const response = await api.put<string>('/v1/users/update', payload);
    return response.data;
  }
};