// src/pages/profil/VehiculeManagementPage.tsx
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Car, PlusCircle, ShieldCheck, 
  ShieldAlert, Edit3, Trash2, FileText, Users, 
  Palette, Hash, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { vehiculeService } from '../../services/vehiculeService';
import {type Vehicule } from '../../types/VehiculesTypes';
import { EditVehiculeModal } from '../../components/modals/EditVehiculeModal';
import { VehiculeDocumentsModal } from '../../components/modals/VehiculeDocumentsModal';

export const VehiculeManagementPage = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // État pour la modale d'édition / création
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehiculeForEdit, setSelectedVehiculeForEdit] = useState<Vehicule | null>(null);

  // État pour la modale des documents
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedVehiculeIdForDocs, setSelectedVehiculeIdForDocs] = useState<number | null>(null);

  const fetchVehicules = async () => {
    setIsLoading(true);
    try {
      const data = await vehiculeService.getAllVehicules();
      setVehicules(data);
    } catch (error) {
      toast.error("Impossible de récupérer la liste de vos véhicules.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicules();
  }, []);

  // --- ACTIONS ---

  const handleOpenCreate = () => {
    setSelectedVehiculeForEdit(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (vehicule: Vehicule) => {
    setSelectedVehiculeForEdit(vehicule);
    setIsEditModalOpen(true);
  };

  const handleOpenDocs = (id: number) => {
    setSelectedVehiculeIdForDocs(id);
    setIsDocsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.")) return;
    
    try {
      await vehiculeService.deleteVehicule(id);
      toast.success("Véhicule supprimé avec succès.");
      fetchVehicules(); // Rafraîchir la liste
    } catch (error) {
      toast.error("Erreur lors de la suppression du véhicule.");
    }
  };

  // --- HELPERS D'AFFICHAGE ---
  const getVehiculeTypeName = (type: number) => {
    const types = ['Berline', 'SUV / 4x4', 'Minibus', 'Véhicule de luxe'];
    return types[type] || 'Standard';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/profil" className="p-2 rounded-xl border border-border-main hover:bg-base transition-colors text-text-main">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Mes Véhicules</h1>
        </div>

        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          Ajouter un véhicule
        </button>
      </div>

      {/* --- CONTENU --- */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
        </div>
      ) : vehicules.length === 0 ? (
        /* ÉTAT VIDE */
        <div className="bg-surface border border-border-main border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 text-kombi-blue-500 rounded-full flex items-center justify-center mb-4">
            <Car size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">Aucun véhicule enregistré</h2>
          <p className="text-text-muted max-w-md mx-auto mb-6">
            Ajoutez votre véhicule et fournissez les documents nécessaires pour commencer à proposer des trajets.
          </p>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            Ajouter mon premier véhicule
          </button>
        </div>
      ) : (
        /* LISTE DES VÉHICULES */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicules.map((vehicule) => (
            <div key={vehicule.id} className="bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm flex flex-col">
              
              {/* En-tête de la carte */}
              <div className="p-5 border-b border-border-main flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                    {vehicule.brand} {vehicule.model}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">{getVehiculeTypeName(vehicule.vehiculeType)}</p>
                </div>
                {vehicule.isVerified ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-kombi-green-600 dark:text-kombi-green-400 border border-green-200 dark:border-green-800 text-xs font-medium">
                    <ShieldCheck size={14} /> Vérifié
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-600 dark:text-kombi-orange-400 border border-orange-200 dark:border-orange-800 text-xs font-medium">
                    <ShieldAlert size={14} /> Non vérifié
                  </div>
                )}
              </div>

              {/* Corps de la carte (Détails) */}
              <div className="p-5 flex-1 grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="flex items-center gap-3">
                  <Hash size={18} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase">Immatriculation</p>
                    <p className="text-sm font-medium text-text-main uppercase">{vehicule.registrationCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase">Couleur</p>
                    <p className="text-sm font-medium text-text-main capitalize">{vehicule.color}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users size={18} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase">Places</p>
                    <p className="text-sm font-medium text-text-main">{vehicule.numberPlaces} passagers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Car size={18} className="text-text-muted" />
                  <div>
                    <p className="text-xs text-text-muted uppercase">Climatisation</p>
                    <p className="text-sm font-medium text-text-main">{vehicule.airConditionned ? 'Oui' : 'Non'}</p>
                  </div>
                </div>
              </div>

              {/* Actions de la carte */}
              <div className="p-4 bg-base border-t border-border-main flex items-center justify-between gap-2">
                <button 
                  onClick={() => handleOpenDocs(vehicule.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-surface border border-border-main text-text-main hover:border-kombi-blue-500 hover:text-kombi-blue-500 rounded-xl font-medium text-sm transition-colors"
                >
                  <FileText size={16} />
                  Documents
                </button>
                
                <button 
                  onClick={() => handleOpenEdit(vehicule)}
                  className="p-2 border border-border-main bg-surface text-text-muted hover:text-kombi-orange-500 hover:border-kombi-orange-500 rounded-xl transition-colors"
                  title="Modifier"
                >
                  <Edit3 size={18} />
                </button>
                
                <button 
                  onClick={() => handleDelete(vehicule.id)}
                  className="p-2 border border-border-main bg-surface text-text-muted hover:text-red-500 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 rounded-xl transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- MODALES --- */}
      <EditVehiculeModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchVehicules}
        existingVehicule={selectedVehiculeForEdit}
      />

      <VehiculeDocumentsModal 
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        vehiculeId={selectedVehiculeIdForDocs}
      />

    </div>
  );
};