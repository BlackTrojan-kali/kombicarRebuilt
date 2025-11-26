import { useContext, useState } from 'react';
import { authContext } from '../../contexts/AuthContext'; // Votre contexte

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useContext(authContext);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Entrez votre email"
        required 
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
      </button>
    </form>
  );
}