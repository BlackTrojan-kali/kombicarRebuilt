import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, faUser, faPhone, faMapMarkerAlt, 
    faClock, faMoneyBillWave, faCheckCircle, faInfoCircle, 
    faCarSide, faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { useAdminVtcSupport } from '../../../contexts/Admin/VTCcontexts/useAdminVtcSupport';

const DISPUTE_STATUS_MAP = {
    0: { label: 'Ouvert', style: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    1: { label: 'En cours', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    2: { label: 'Résolu', style: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    3: { label: 'Fermé / Rejeté', style: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
};

export default function VtcAdminDisputeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { disputeDetails, isLoadingDisputes, fetchDisputeById, resolveDispute } = useAdminVtcSupport();
    
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => {
        if (id) {
            fetchDisputeById(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleResolve = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir marquer ce litige comme résolu ?")) return;
        
        const success = await resolveDispute(id, adminNote);
        if (success) {
            setAdminNote(''); // On vide le champ après succès
        }
    };

    if (isLoadingDisputes && !disputeDetails) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    if (!disputeDetails) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Impossible de charger les détails de ce litige.
            </div>
        );
    }

    const badge = DISPUTE_STATUS_MAP[disputeDetails.status] || DISPUTE_STATUS_MAP[0];
    const isResolved = disputeDetails.status === 2 || disputeDetails.status === 3;

    return (
        <div className="p-6 max-w-6xl mx-auto min-h-full transition-colors duration-200">
            {/* --- EN-TÊTE --- */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/admin/vtc/support/disputes')}
                    className="p-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Détails du Litige
                        </h1>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${badge.style}`}>
                            {badge.label}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Signalé le {new Date(disputeDetails.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- COLONNE PRINCIPALE (Plaignant & Description) --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Infos du Plaignant */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                            <FontAwesomeIcon icon={faUser} className="text-blue-500 dark:text-blue-400" />
                            Informations du Plaignant
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nom complet</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{disputeDetails.reporterName || 'Non renseigné'}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Téléphone</span>
                                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
                                    {disputeDetails.reporterPhone || 'Non renseigné'}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ID Utilisateur</span>
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 px-2 py-1 rounded">
                                    {disputeDetails.createdByUserId}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Motif et Détails du Litige */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                            <FontAwesomeIcon icon={faFileAlt} className="text-red-500 dark:text-red-400" />
                            Description du problème
                        </h2>
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Sujet / Motif</span>
                            <div className="text-base font-bold text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                                {disputeDetails.reason}
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Explications complètes</span>
                            <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border border-gray-100 dark:border-gray-700">
                                {disputeDetails.details || <span className="italic text-gray-400">Aucun détail supplémentaire fourni.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Zone de Résolution de ticket */}
                    <div className={`p-6 rounded-xl shadow-sm border transition-colors ${isResolved ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className={isResolved ? "text-green-600" : "text-gray-400"} />
                            Action & Résolution
                        </h2>
                        
                        {isResolved ? (
                            <div className="text-sm text-green-800 dark:text-green-400 font-medium">
                                Ce litige a été traité et clôturé. Aucune action supplémentaire n'est requise.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Note interne (Optionnel - visible uniquement par les admins)
                                    </label>
                                    <textarea 
                                        rows="3"
                                        placeholder="Ex: Remboursement effectué, ou Avertissement envoyé au chauffeur..."
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        onClick={handleResolve}
                                        disabled={isLoadingDisputes}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        {isLoadingDisputes ? "Traitement..." : "Clôturer ce litige"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* --- COLONNE LATÉRALE (Résumé Course) --- */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors sticky top-24">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                            <FontAwesomeIcon icon={faCarSide} className="text-indigo-500 dark:text-indigo-400" />
                            La Course Concernée
                        </h2>
                        
                        {disputeDetails.rideSummary ? (
                            <div className="space-y-4">
                                <div>
                                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">ID de la course</span>
                                    <span className="font-mono text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 px-2 py-1 rounded break-all block cursor-pointer hover:text-blue-600" onClick={() => navigate(`/admin/vtc/rides/${disputeDetails.rideSummary.rideId}`)}>
                                        {disputeDetails.rideSummary.rideId}
                                    </span>
                                </div>
                                
                                <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                                    <div className="mb-4 relative">
                                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-800"></div>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">Départ</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight mt-0.5">
                                            {disputeDetails.rideSummary.departureAddress}
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white dark:ring-gray-800"></div>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">Arrivée</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight mt-0.5">
                                            {disputeDetails.rideSummary.arrivalAddress}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faClock} /> Heure
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {new Date(disputeDetails.rideSummary.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faMoneyBillWave} /> Prix payé
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {disputeDetails.rideSummary.price} CFA
                                        </span>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => navigate(`/admin/vtc/rides/${disputeDetails.rideSummary.rideId}`)}
                                    className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} /> Voir toute la course
                                </button>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                Détails de la course indisponibles.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}