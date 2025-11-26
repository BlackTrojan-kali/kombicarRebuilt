import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom'; // Nécessite React Router
import { authContext } from '../../contexts/AuthContext'; // Votre contexte

// Supposons que la route soit /reset-password/:token
export default function ResetPasswordPage() {
  const { token } = useParams(); // Récupère le token de l'URL
  const { resetPassword, loading } = useContext(authContext);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
        await resetPassword(token, newPassword);
        // Après succès, rediriger l'utilisateur vers la page de connexion
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="password" 
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)} 
        placeholder="Nouveau mot de passe"
        required 
      />
      <button type="submit" disabled={loading || !token}>
        {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
      </button>
    </form>
  );
}