// src/types/authTypes.ts

/**
 * Payload requis pour l'inscription d'un nouvel utilisateur
 */
export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: number; // Représente l'identifiant ou l'enum du pays
}

/**
 * Payload requis pour la connexion
 */
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Structure de la réponse en cas de succès de connexion ou de rafraîchissement de token
 */
export interface AuthResponse {
  token: string;
  refreshToken: string;
}

/**
 * Payload requis pour rafraîchrir le JWT
 */
export interface RefreshTokenPayload {
  refreshToken: string;
}

// ... (Types précédents : RegisterPayload, LoginPayload, AuthResponse, RefreshTokenPayload)

/**
 * Payload requis pour renvoyer l'email de confirmation
 */
export interface ResendConfirmationPayload {
  email: string;
}

/**
 * Payload requis pour demander la réinitialisation du mot de passe
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Payload requis pour définir un nouveau mot de passe
 */
export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}
// ... (Types précédents)

/**
 * Payload pour la connexion via Google
 */
export interface GoogleLoginPayload {
  token: string;
}

/**
 * Payload pour la connexion via Apple
 */
export interface AppleLoginPayload {
  token: string;
  firstName?: string; // Optionnel selon la doc
  lastName?: string;  // Optionnel selon la doc
}

/**
 * Structure complète des informations de l'utilisateur
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  role: number;
  country: number;
  email: string;
  phoneNumber: string;
  pictureProfileUrl: string;
  balance: number;
  createdAt: string;
  note: number;
  adminAccessCounrty: number; // NB : Faute de frappe ("Counrty") conservée depuis ta doc pour correspondre à l'API
  isVerified: boolean;
  roleId: string;
  reviewsCount: number;
}

/**
 * Payload pour la mise à jour partielle du profil
 */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: number;
}