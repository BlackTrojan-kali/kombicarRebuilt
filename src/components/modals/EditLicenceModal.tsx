// src/components/modals/EditLicenceModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, FileText, Calendar, Hash, Loader2 } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { licenceService } from '../../services/licenceService';
import { LicenceCategory,type LicenceDetails } from '../../types/LicenceTypes';

interface EditLicenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Fonction pour rafraîchir la page parente
  existingLicence?: LicenceDetails | null; // Null si création, rempli si modification
}

// Options pour la catégorie du permis
const categoryOptions = [
  { value: LicenceCategory.A, label: 'Catégorie A (Motos)' },
  { value: LicenceCategory.B, label: 'Catégorie B (Véhicules légers)' },
  { value: LicenceCategory.C, label: 'Catégorie C (Poids lourds)' },
  { value: LicenceCategory.D, label: 'Catégorie D (Transport en commun)' },
  { value: LicenceCategory.E, label: 'Catégorie E (Remorques)' },
];

// Helpers pour formater les dates entre le format HTML <input type="date"> et ISO 8601 (Backend)
const toInputDate = (isoString?: string) => {
  if (!isoString) return '';
  return new Date(isoString).toISOString().split('T')[0]; // Retourne 'YYYY-MM-DD'
};

const toIsoDate = (dateString: string) => {
  if (!dateString) return new Date().toISOString();
  return new Date(dateString).toISOString();
};

export const EditLicenceModal: React.FC<EditLicenceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  existingLicence 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    licenseNumber: '',
    dateOfBirth: '',
    issueDate: '',
    expirationDate: '',
    category: LicenceCategory.B,
  });

  // État du fichier
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Pré-remplissage à l'ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      if (existingLicence) {
        setFormData({
          licenseNumber: existingLicence.licenseNumber || '',
          dateOfBirth: toInputDate(existingLicence.dateOfBirth),
          issueDate: toInputDate(existingLicence.issueDate),
          expirationDate: toInputDate(existingLicence.expirationDate),
          category: existingLicence.category as LicenceCategory,
        });
        setFilePreview(existingLicence.url || null);
      } else {
        // Reset si c'est une création
        setFormData({
          licenseNumber: '',
          dateOfBirth: '',
          issueDate: '',
          expirationDate: '',
          category: LicenceCategory.B,
        });
        setFilePreview(null);
      }
      setSelectedFile(null);
    }
  }, [isOpen, existingLicence]);

  if (!isOpen) return null;

  // --- GESTION DES CHAMPS TEXTES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GESTION DU FICHIER ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (Maximum 5 Mo).");
        return;
      }

      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // --- SOUMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Mise à jour des informations textes
      await licenceService.updateInfos({
        licenseNumber: formData.licenseNumber,
        dateOfBirth: toIsoDate(formData.dateOfBirth),
        issueDate: toIsoDate(formData.issueDate),
        expirationDate: toIsoDate(formData.expirationDate),
        category: formData.category,
      });

      // 2. Upload du fichier (s'il y en a un nouveau)
      if (selectedFile) {
        await licenceService.uploadFile(selectedFile);
      }

      toast.success(existingLicence ? 'Permis mis à jour !' : 'Permis ajouté avec succès !');
      onSuccess(); // Rafraîchit la page parente
      onClose();   // Ferme la modale
    } catch (error: any) {
      const message = error.response?.data?.description || error.response?.data || "Erreur lors de l'enregistrement du permis.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Styles pour react-select
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
      <div 
        className="w-full max-w-2xl bg-surface border border-border-main rounded-2xl shadow-xl relative flex flex-col max-h-[90vh]"
        role="dialog"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main bg-base rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-text-main mb-6">
            {existingLicence ? 'Modifier mon permis' : 'Ajouter un permis de conduire'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- UPLOAD DU DOCUMENT --- */}
            <div>
              <label className="text-sm font-medium text-text-muted ml-1 mb-2 block">Photo ou scan du permis</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  filePreview ? 'border-kombi-green-500 bg-green-50 dark:bg-green-900/10' : 'border-border-main hover:border-kombi-orange-500 bg-base'
                }`}
              >
                {filePreview ? (
                  <div className="space-y-3 text-center">
                    <img src={filePreview} alt="Aperçu document" className="max-h-32 mx-auto rounded object-contain" />
                    <p className="text-sm font-medium text-kombi-green-600 dark:text-kombi-green-400">Document sélectionné. Cliquez pour modifier.</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto shadow-sm text-kombi-orange-500">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-text-main">Cliquez pour uploader votre permis</p>
                    <p className="text-xs text-text-muted">JPG, PNG ou WEBP (Max 5 Mo)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </div>
            </div>

            {/* --- NUMÉRO ET CATÉGORIE --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Numéro du permis</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all bg-transparent">
                  <Hash size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Ex: 123456789"
                    className="w-full bg-transparent outline-none text-text-main"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Catégorie</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-1 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all bg-transparent">
                  <FileText size={18} className="text-text-muted ml-1 mr-1 shrink-0" />
                  <div className="flex-1">
                    <Select
                      options={categoryOptions}
                      styles={customSelectStyles}
                      value={categoryOptions.find(c => c.value === formData.category)}
                      onChange={(selected) => setFormData({ ...formData, category: selected?.value ?? LicenceCategory.B })}
                      isSearchable={false}
                      menuPortalTarget={document.body}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- DATES --- */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Date de naissance</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all bg-transparent">
                  <Calendar size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-text-main [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Date de délivrance</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all bg-transparent">
                  <Calendar size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="date"
                    name="issueDate"
                    required
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-text-main [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Date d'expiration</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all bg-transparent">
                  <Calendar size={18} className="text-text-muted mr-2 shrink-0" />
                  <input
                    type="date"
                    name="expirationDate"
                    required
                    value={formData.expirationDate}
                    onChange={handleChange}
                    className="w-full bg-transparent outline-none text-text-main [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* --- BOUTONS --- */}
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
                disabled={isLoading || (!existingLicence && !selectedFile)} // Bloque si création sans fichier
                className="px-5 py-2.5 rounded-xl font-medium text-white bg-kombi-orange-500 hover:bg-kombi-orange-600 transition-colors flex items-center justify-center min-w-[140px] disabled:opacity-70"
                title={(!existingLicence && !selectedFile) ? "Veuillez uploader un document" : ""}
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