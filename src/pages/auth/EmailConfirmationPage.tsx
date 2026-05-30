// src/pages/auth/EmailConfirmationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

type ConfirmationStatus = 'loading' | 'success' | 'error';

export const EmailConfirmationPage = () => {
  // Extraction des paramètres définis dans la route
  const { userId, token } = useParams<{ userId: string; token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [emailToResend, setEmailToResend] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Exécution automatique de la confirmation au montage du composant
  useEffect(() => {
    const confirmAccount = async () => {
      if (!userId || !token) {
        setStatus('error');
        return;
      }

      try {
        await authService.confirmEmail(userId, token);
        setStatus('success');
      } catch (error: any) {
        console.error("Erreur de confirmation", error);
        setStatus('error');
      }
    };

    confirmAccount();
  }, [userId, token]);

  // Gestion de la soumission pour renvoyer un email
  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToResend) return;

    setIsResending(true);
    try {
      await authService.resendConfirmationEmail({ email: emailToResend });
      toast.success("Si cet email existe, un nouveau lien de confirmation a été envoyé.");
      setEmailToResend(''); // On vide le champ après succès
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi de l'email de confirmation.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base">
      <div className="w-full max-w-md bg-surface border border-border-main rounded-2xl shadow-sm overflow-hidden p-8 text-center">
        
        {/* ÉTAT 1 : CHARGEMENT */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 size={48} className="text-kombi-orange-500 animate-spin" />
            <h2 className="text-xl font-semibold text-text-main">Vérification en cours...</h2>
            <p className="text-sm text-text-muted">Veuillez patienter pendant que nous validons votre adresse email.</p>
          </div>
        )}

        {/* ÉTAT 2 : SUCCÈS */}
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <CheckCircle2 size={64} className="text-kombi-green-500" />
            <h2 className="text-2xl font-semibold text-text-main">Email vérifié !</h2>
            <p className="text-text-muted mb-4">
              Votre compte a été confirmé avec succès. Vous pouvez maintenant vous connecter et profiter de toutes les fonctionnalités de Kombicar.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Aller à la connexion
            </button>
          </div>
        )}

        {/* ÉTAT 3 : ERREUR & RENVOI D'EMAIL */}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <XCircle size={64} className="text-red-500" />
            <h2 className="text-xl font-semibold text-text-main">Lien invalide ou expiré</h2>
            <p className="text-sm text-text-muted mb-4">
              Le lien de confirmation que vous avez utilisé n'est plus valide. Vous pouvez demander un nouveau lien ci-dessous.
            </p>

            <form onSubmit={handleResendEmail} className="w-full space-y-4 mt-4">
              <div className="space-y-1 text-left">
                <label className="text-sm font-medium text-text-muted ml-1">Adresse Email</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <Mail size={18} className="text-text-muted mr-2" />
                  <input
                    type="email"
                    required
                    value={emailToResend}
                    onChange={(e) => setEmailToResend(e.target.value)}
                    className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                    placeholder="Votre adresse email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResending || !emailToResend}
                className="w-full bg-kombi-dark-500 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center disabled:opacity-70"
              >
                {isResending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Renvoyer l'email de confirmation"
                )}
              </button>
            </form>

            <div className="mt-6">
              <Link to="/login" className="text-sm text-kombi-blue-500 hover:underline">
                Retour à la page de connexion
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};