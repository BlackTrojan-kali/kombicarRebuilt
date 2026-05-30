// src/components/modals/EditVehiculeModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Car, Hash, Palette, Loader2 } from 'lucide-react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { vehiculeService } from '../../services/vehiculeService';
import type{ Vehicule } from '../../types/VehiculesTypes';
import { useAuth } from '../../features/auth/AuthContext';

interface EditVehiculeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingVehicule?: Vehicule | null;
}

// Options génériques pour le type de véhicule (À adapter selon ton backend)
const vehiculeTypeOptions = [
  { value: 0, label: 'Berline (Standard)' },
  { value: 1, label: 'SUV / 4x4' },
  { value: 2, label: 'Minibus / Van' },
  { value: 3, label: 'Véhicule de luxe' },
];

export const EditVehiculeModal: React.FC<EditVehiculeModalProps> = ({ 
  isOpen, onClose, onSuccess, existingVehicule 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    color: '',
    registrationCode: '',
    numberPlaces: 4,
    vehiculeType: 0,
    airConditionned: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (existingVehicule) {
        setFormData({
          brand: existingVehicule.brand || '',
          model: existingVehicule.model || '',
          color: existingVehicule.color || '',
          registrationCode: existingVehicule.registrationCode || '',
          numberPlaces: existingVehicule.numberPlaces || 4,
          vehiculeType: existingVehicule.vehiculeType || 0,
          airConditionned: existingVehicule.airConditionned || false,
        });
      } else {
        setFormData({
          brand: '', model: '', color: '', registrationCode: '',
          numberPlaces: 4, vehiculeType: 0, airConditionned: false,
        });
      }
    }
  }, [isOpen, existingVehicule]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (existingVehicule) {
        // Mise à jour (PUT)
        await vehiculeService.updateVehicule({
          id: existingVehicule.id,
          ...formData
        });
        toast.success("Véhicule mis à jour avec succès !");
      } else {
        // Création (POST)
        await vehiculeService.addVehicule({
          userId: user.id, // Requis par ton DTO Swagger
          ...formData
        });
        toast.success("Véhicule ajouté avec succès !");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de l'enregistrement du véhicule.");
    } finally {
      setIsLoading(false);
    }
  };

  const customSelectStyles = {
    control: (base: any) => ({
      ...base, backgroundColor: 'transparent', borderColor: 'transparent',
      boxShadow: 'none', '&:hover': { borderColor: 'transparent' }
    }),
    singleValue: (base: any) => ({ ...base, color: 'inherit' }),
    menu: (base: any) => ({
      ...base, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-main)',
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base, backgroundColor: state.isFocused ? 'var(--bg-base)' : 'transparent',
      color: 'var(--text-main)', cursor: 'pointer',
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface border border-border-main rounded-2xl shadow-xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main bg-base rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-text-main mb-6">
            {existingVehicule ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Marque et Modèle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Marque</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 transition-all">
                  <Car size={18} className="text-text-muted mr-2 shrink-0" />
                  <input type="text" name="brand" required value={formData.brand} onChange={handleChange} placeholder="Ex: Toyota" className="w-full bg-transparent outline-none text-text-main" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Modèle</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 transition-all">
                  <input type="text" name="model" required value={formData.model} onChange={handleChange} placeholder="Ex: Corolla" className="w-full bg-transparent outline-none text-text-main" />
                </div>
              </div>
            </div>

            {/* Immatriculation et Couleur */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Immatriculation</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 transition-all uppercase">
                  <Hash size={18} className="text-text-muted mr-2 shrink-0" />
                  <input type="text" name="registrationCode" required value={formData.registrationCode} onChange={handleChange} placeholder="CE-123-AB" className="w-full bg-transparent outline-none text-text-main uppercase" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Couleur</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 transition-all">
                  <Palette size={18} className="text-text-muted mr-2 shrink-0" />
                  <input type="text" name="color" required value={formData.color} onChange={handleChange} placeholder="Ex: Gris" className="w-full bg-transparent outline-none text-text-main" />
                </div>
              </div>
            </div>

            {/* Type et Places */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Type de véhicule</label>
                <div className="border border-border-main rounded-xl px-1 py-1 focus-within:border-kombi-orange-500 transition-all">
                  <Select
                    options={vehiculeTypeOptions}
                    styles={customSelectStyles}
                    value={vehiculeTypeOptions.find(c => c.value === formData.vehiculeType)}
                    onChange={(selected) => setFormData(prev => ({ ...prev, vehiculeType: selected?.value || 0 }))}
                    isSearchable={false}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-muted ml-1">Nombre de places (Passagers)</label>
                <div className="flex items-center border border-border-main rounded-xl px-3 py-2 focus-within:border-kombi-orange-500 transition-all">
                  <input type="number" name="numberPlaces" min="1" max="9" required value={formData.numberPlaces} onChange={handleChange} className="w-full bg-transparent outline-none text-text-main" />
                </div>
              </div>
            </div>

            {/* Options (Climatisation) */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-border-main rounded-xl hover:bg-base transition-colors">
                <input 
                  type="checkbox" 
                  name="airConditionned" 
                  checked={formData.airConditionned} 
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-border-main text-kombi-orange-500 focus:ring-kombi-orange-500" 
                />
                <span className="font-medium text-text-main">Véhicule climatisé (A/C)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-main">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-xl font-medium text-text-main hover:bg-base border border-border-main transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-xl font-medium text-white bg-kombi-orange-500 hover:bg-kombi-orange-600 transition-colors flex items-center min-w-[140px] justify-center">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};