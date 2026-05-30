// src/pages/profil/LicenceManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, CreditCard, ShieldAlert, ShieldCheck, 
  Clock, Download, Edit3, PlusCircle, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

import { licenceService } from '../../services/licenceService';
import { fileService } from '../../services/fileService';
import {type LicenceDetails, LicenceCategory, VerificationState } from '../../types/LicenceTypes';
import { EditLicenceModal } from '../../components/modals/EditLicenceModal';

export const LicenceManagementPage = () => {
  const [licence, setLicence] = useState<LicenceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fonction pour charger les détails du permis
  const fetchLicence = async () => {
    setIsLoading(true);
    try {
      const data = await licenceService.getDetails();
      setLicence(data);
    } catch (error) {
      toast.error("Impossible de récupérer les informations du permis.");
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchLicence();
  }, []);

  // Formatage des dates
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Helpers pour l'affichage
  const getCategoryName = (category: number) => {
    const map: Record<number, string> = {
      [LicenceCategory.A]: 'Catégorie A (Motos)',
      [LicenceCategory.B]: 'Catégorie B (Véhicules légers)',
      [LicenceCategory.C]: 'Catégorie C (Poids lourds)',
      [LicenceCategory.D]: 'Catégorie D (Transport en commun)',
      [LicenceCategory.E]: 'Catégorie E (Remorques)',
    };
    return map[category] || 'Non définie';
  };

  const renderVerificationBadge = (state: number) => {
    switch (state) {
      case VerificationState.VERIFIED:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-kombi-green-600 dark:text-kombi-green-400 border border-green-200 dark:border-green-800 text-sm font-medium">
            <ShieldCheck size={16} /> Permis vérifié
          </div>
        );
      case VerificationState.REJECTED:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-medium">
            <ShieldAlert size={16} /> Rejeté (Veuillez mettre à jour)
          </div>
        );
      case VerificationState.PENDING:
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-600 dark:text-kombi-orange-400 border border-orange-200 dark:border-orange-800 text-sm font-medium">
            <Clock size={16} /> En attente de validation
          </div>
        );
    }
  };

  // Action : Télécharger le document
  const handleDownload = async () => {
    if (!licence?.url) return;
    
    setIsDownloading(true);
    try {
      await fileService.downloadFile(licence.url, `Permis_${licence.licenseNumber}.jpg`);
      toast.success("Document téléchargé avec succès !");
    } catch (error) {
      toast.error("Erreur lors du téléchargement.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex items-center gap-4">
        <Link to="/profil" className="p-2 rounded-xl border border-border-main hover:bg-base transition-colors text-text-main">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-text-main">Permis de conduire</h1>
      </div>

      {/* --- CONTENU --- */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
        </div>
      ) : licence ? (
        /* ÉTAT 1 : PERMIS EXISTANT */
        <div className="bg-surface border border-border-main rounded-2xl overflow-hidden shadow-sm">
          
          {/* Header de la carte */}
          <div className="p-6 border-b border-border-main flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text-main flex items-center gap-2">
                <CreditCard className="text-kombi-orange-500" size={20} />
                {getCategoryName(licence.category)}
              </h2>
              <p className="text-sm text-text-muted mt-1">N° {licence.licenseNumber}</p>
            </div>
            {renderVerificationBadge(licence.verificationState)}
          </div>

          {/* Corps de la carte (Détails) */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Date de naissance</p>
                <p className="font-medium text-text-main">{formatDate(licence.dateOfBirth)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Délivré le</p>
                  <p className="font-medium text-text-main">{formatDate(licence.issueDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Expire le</p>
                  <p className="font-medium text-text-main">{formatDate(licence.expirationDate)}</p>
                </div>
              </div>
            </div>

            {/* Actions & Document */}
            <div className="flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-border-main pt-6 md:pt-0 md:pl-8">
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-medium py-3 rounded-xl transition-colors shadow-sm"
              >
                <Edit3 size={18} />
                Modifier les informations
              </button>

              {licence.url && (
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 bg-base border border-border-main text-text-main hover:border-kombi-blue-500 hover:text-kombi-blue-500 font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
                >
                  {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Télécharger le document
                </button>
              )}
            </div>
          </div>
        </div>

      ) : (
        /* ÉTAT 2 : AUCUN PERMIS */
        <div className="bg-surface border border-border-main border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 text-kombi-orange-500 rounded-full flex items-center justify-center mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">Aucun permis enregistré</h2>
          <p className="text-text-muted max-w-md mx-auto mb-6">
            Pour pouvoir publier des trajets en tant que conducteur sur Kombicar, vous devez fournir un permis de conduire valide.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            Ajouter mon permis
          </button>
        </div>
      )}

      {/* --- MODALE --- */}
      <EditLicenceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLicence} // Rafraîchit les données après une sauvegarde
        existingLicence={licence}
      />
    </div>
  );
};