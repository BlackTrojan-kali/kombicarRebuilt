// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, User, Phone, Globe } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import type { RegisterPayload } from '../../types/authTypes';

// Options pour react-select (Le backend attend un nombre pour le pays)
const countryOptions = [
  { value: 1, label: 'Cameroun (+237)' },
  { value: 2, label: 'Côte d\'Ivoire (+225)' },
  { value: 3, label: 'Sénégal (+221)' },
  { value: 4, label: 'France (+33)' },
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // État du formulaire typé avec l'interface de notre service
  const [formData, setFormData] = useState<RegisterPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    country: 1, // ID du Cameroun par défaut
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register(formData);
      
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data || "Une erreur est survenue lors de l'inscription.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles personnalisés pour react-select (support Dark Mode)
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover': { borderColor: 'transparent' }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'inherit',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-main)',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--bg-base)' : 'transparent',
      color: 'var(--text-main)',
      cursor: 'pointer',
    }),
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
          <h1 className="text-lg font-semibold text-text-main">Inscription</h1>
          <div className="w-10"></div>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex gap-4">
            {/* Prénom */}
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Prénom</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <User size={18} className="text-text-muted mr-2" />
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                  placeholder="Jean"
                />
              </div>
            </div>

            {/* Nom */}
            <div className="flex-1 space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Nom</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                  placeholder="Dupont"
                />
              </div>
            </div>
          </div>

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

          {/* Pays (React-Select) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-muted ml-1">Pays</label>
            <div className="flex items-center border border-border-main rounded-xl px-3 py-1 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
              <Globe size={18} className="text-text-muted ml-1 mr-1" />
              <div className="flex-1">
                <Select
                  options={countryOptions}
                  styles={customSelectStyles}
                  value={countryOptions.find(c => c.value === formData.country)}
                  onChange={(selected) => setFormData({ ...formData, country: selected?.value || 1 })}
                  isSearchable={false}
                  placeholder="Sélectionnez un pays"
                />
              </div>
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-muted ml-1">Numéro de téléphone</label>
            <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
              <Phone size={18} className="text-text-muted mr-2" />
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                placeholder="6XX XX XX XX"
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
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-text-main placeholder-text-muted"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Créer mon compte"
            )}
          </button>

          {/* Lien de connexion */}
          <p className="text-center text-sm text-text-muted mt-4">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-kombi-blue-500 font-medium hover:underline">
              Connectez-vous
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};