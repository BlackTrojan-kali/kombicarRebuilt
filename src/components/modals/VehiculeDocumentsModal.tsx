// src/components/modals/VehiculeDocumentsModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Download, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { vehiculeService } from '../../services/vehiculeService';
import { fileService } from '../../services/fileService';
import { type VehiculeDocument, VehiculeDocumentType } from '../../types/VehiculesTypes';

interface VehiculeDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculeId: number | null;
}

// Configuration des documents requis
const REQUIRED_DOCUMENTS = [
  { type: VehiculeDocumentType.REGISTRATION_CARD, label: "Carte grise (Certificat d'immatriculation)" },
  { type: VehiculeDocumentType.INSURANCE, label: "Attestation d'assurance valide" },
  { type: VehiculeDocumentType.PHOTO, label: "Photo du véhicule (Extérieur)" },
  { type: VehiculeDocumentType.REGISTRATION_PHOTO, label: "Photo de la plaque d'immatriculation" },
];

export const VehiculeDocumentsModal: React.FC<VehiculeDocumentsModalProps> = ({ 
  isOpen, onClose, vehiculeId 
}) => {
  const [documents, setDocuments] = useState<VehiculeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<VehiculeDocumentType | null>(null);
  
  // Référance pour l'input file caché
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<VehiculeDocumentType | null>(null);

  const fetchDocuments = async () => {
    if (!vehiculeId) return;
    setIsLoading(true);
    try {
      const docs = await vehiculeService.getVehiculeDocuments(vehiculeId);
      setDocuments(docs);
    } catch (error) {
      toast.error("Impossible de charger les documents du véhicule.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vehiculeId) {
      fetchDocuments();
    }
  }, [isOpen, vehiculeId]);

  if (!isOpen || !vehiculeId) return null;

  // Déclencher le clic sur l'input file caché pour un type spécifique
  const triggerFileUpload = (type: VehiculeDocumentType) => {
    setActiveUploadType(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Gérer la sélection du fichier et l'upload immédiat
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || activeUploadType === null) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (Max 5 Mo).");
      return;
    }

    setUploadingType(activeUploadType);
    try {
      await vehiculeService.uploadDocument(vehiculeId, activeUploadType, file);
      toast.success("Document téléversé avec succès !");
      await fetchDocuments(); // Rafraîchir la liste
    } catch (error) {
      toast.error("Échec du téléversement du document.");
    } finally {
      setUploadingType(null);
      setActiveUploadType(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  // Télécharger un fichier existant
  const handleDownload = async (doc: VehiculeDocument) => {
    try {
      // On génère un nom stylisé "Marque_Immatriculation_CarteGrise.jpg"
      const ext = doc.url.split('.').pop() || 'jpg';
      await fileService.downloadFile(doc.url, `Vehicule_${vehiculeId}_Document_${doc.type}.${ext}`);
    } catch (error) {
      toast.error("Erreur lors du téléchargement.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface border border-border-main rounded-2xl shadow-xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main bg-base rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-text-main mb-2">Documents du véhicule</h2>
          <p className="text-sm text-text-muted mb-6">Fournissez les documents obligatoires pour valider ce véhicule.</p>

          {/* Input file caché unique gérant tous les uploads */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, application/pdf" 
            className="hidden" 
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 size={32} className="text-kombi-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {REQUIRED_DOCUMENTS.map((reqDoc) => {
                // Vérifier si le document existe déjà dans la liste renvoyée par le serveur
                const existingDoc = documents.find(d => d.type === reqDoc.type);
                const isUploadingThis = uploadingType === reqDoc.type;

                return (
                  <div key={reqDoc.type} className={`p-4 border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    existingDoc ? 'border-kombi-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-border-main bg-base'
                  }`}>
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${existingDoc ? 'text-kombi-green-500 bg-green-100 dark:bg-green-900/30' : 'text-text-muted bg-surface border border-border-main'}`}>
                        {existingDoc ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                      </div>
                      <div>
                        <p className="font-medium text-text-main">{reqDoc.label}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                          {existingDoc ? (
                            <>Envoyé le {new Date(existingDoc.createdAt).toLocaleDateString('fr-FR')}</>
                          ) : (
                            <><AlertCircle size={12} className="text-red-500" /> Document manquant</>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {existingDoc ? (
                        <>
                          <button 
                            onClick={() => triggerFileUpload(reqDoc.type)}
                            disabled={uploadingType !== null}
                            className="flex-1 sm:flex-none px-3 py-1.5 text-sm font-medium border border-border-main bg-surface hover:bg-base text-text-main rounded-lg transition-colors"
                          >
                            Remplacer
                          </button>
                          <button 
                            onClick={() => handleDownload(existingDoc)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-kombi-blue-500 hover:bg-kombi-blue-600 text-white rounded-lg transition-colors"
                          >
                            <Download size={16} /> Voir
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => triggerFileUpload(reqDoc.type)}
                          disabled={uploadingType !== null}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 font-medium bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white rounded-xl transition-colors disabled:opacity-70"
                        >
                          {isUploadingThis ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                          {isUploadingThis ? 'Envoi...' : 'Téléverser'}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-border-main flex justify-end">
            <button onClick={onClose} className="px-5 py-2 bg-base border border-border-main text-text-main hover:bg-surface rounded-xl font-medium transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};