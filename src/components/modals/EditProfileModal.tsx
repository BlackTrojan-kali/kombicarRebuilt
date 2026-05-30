// src/components/modals/EditProfileModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, User, Phone, Globe, Loader2 } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/AuthContext';
import { authService } from '../../services/authService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Liste complète des pays avec indicatifs et drapeaux
const countryOptions = [
  { value: 0, label: '🌍 Non défini' },
  { value: 33, label: '🇫🇷 France (+33)' },
  { value: 221, label: '🇸🇳 Sénégal (+221)' },
  { value: 223, label: '🇲🇱 Mali (+223)' },
  { value: 224, label: '🇬🇳 Guinée (+224)' },
  { value: 225, label: '🇨🇮 Côte d\'Ivoire (+225)' },
  { value: 226, label: '🇧🇫 Burkina Faso (+226)' },
  { value: 228, label: '🇹🇬 Togo (+228)' },
  { value: 229, label: '🇧🇯 Bénin (+229)' },
  { value: 237, label: '🇨🇲 Cameroun (+237)' },
  { value: 241, label: '🇬🇦 Gabon (+241)' },
  { value: 243, label: '🇨🇩 RDC (+243)' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 1, // Sera écrasé par le useEffect
  });

  // Gestion de l'image
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Pré-remplir le formulaire avec les données de l'utilisateur quand la modale s'ouvre
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || 0,
      });
      setImagePreview(user.pictureProfileUrl || null);
      setSelectedImageFile(null); // On réinitialise le fichier sélectionné
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // --- GESTION DES CHAMPS TEXTES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GESTION DE LA SÉLECTION D'IMAGE ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validation basique (Taille < 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (Maximum 5 Mo).");
        return;
      }

      setSelectedImageFile(file);
      // Créer une URL temporaire pour la prévisualisation
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Si une nouvelle image a été sélectionnée, on l'upload d'abord
      if (selectedImageFile) {
        await authService.uploadProfilePicture(selectedImageFile);
      }

      // 2. On met à jour les informations textuelles
      await authService.updateProfile(formData);

      // 3. On rafraîchit le contexte global pour que le header et la page profil soient à jour
      await refreshUser();

      toast.success('Profil mis à jour avec succès !');
      onClose(); // Fermer la modale
    } catch (error: any) {
      const message = error.response?.data || "Une erreur est survenue lors de la mise à jour.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STYLES REACT-SELECT ---
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover': { borderColor: 'transparent' }
    }),
    singleValue: (base: any) => ({ ...base, color: 'inherit' }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-main)',
    }),
    // On s'assure que le menu qui "sort" de la modale a un z-index extrêmement élevé
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--bg-base)' : 'transparent',
      color: 'var(--text-main)',
      cursor: 'pointer',
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Conteneur de la modale : max-h-[90vh] et flex-col pour permettre le scroll interne si l'écran est petit */}
      <div 
        className="w-full max-w-lg bg-surface border border-border-main rounded-2xl shadow-xl relative flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Bouton Fermer */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main bg-base rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Zone de contenu défilable (overflow-y-auto) pour ne rien cacher */}
        <div className="p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-text-main mb-6">Modifier le profil</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- SECTION PHOTO DE PROFIL --- */}
            <div className="flex flex-col items-center">
              <div 
                className="relative w-28 h-28 rounded-full border-4 border-base overflow-hidden bg-base group cursor-pointer shadow-sm flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu du profil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-kombi-orange-500 font-bold text-3xl">
                    {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
                  </div>
                )}
                
                {/* Overlay au survol pour indiquer le clic */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={28} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">Cliquez pour modifier (Max 5 Mo)</p>
              
              {/* Input fichier caché */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>

            {/* --- SECTION CHAMPS TEXTES --- */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Prénom</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <User size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-text-main"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Nom</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-text-main"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Numéro de téléphone</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <Phone size={18} className="text-text-muted mr-2 shrink-0" />
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-text-main"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted ml-1">Pays</label>
              <div className="flex items-center border border-border-main rounded-xl px-3 py-1 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
                <Globe size={18} className="text-text-muted ml-1 mr-1 shrink-0" />
                <div className="flex-1">
                  <Select
                    options={countryOptions}
                    styles={customSelectStyles}
                    value={countryOptions.find(c => c.value === formData.country) || countryOptions[0]}
                    onChange={(selected) => setFormData({ ...formData, country: selected?.value || 0 })}
                    isSearchable={true} // Activé pour trouver rapidement le pays dans la liste
                    menuPlacement="auto"
                    menuPortalTarget={document.body} // LE SECRET EST ICI : Le menu sort de la modale
                  />
                </div>
              </div>
            </div>

            {/* --- BOUTONS D'ACTION --- */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-main">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl font-medium text-text-main hover:bg-base border border-border-main transition-colors disabled:opacity-70"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-kombi-orange-500 hover:bg-kombi-orange-600 transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};