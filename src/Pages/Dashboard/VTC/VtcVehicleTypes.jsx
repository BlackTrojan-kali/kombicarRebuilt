import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, faEdit, faTrash, faCar, faMoneyBillWave, 
    faUsers, faPercentage, faClock, faBan, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';// Ajustez le chemin
import { useAdminVtc } from '../../../contexts/Admin/VTCcontexts/useAdminVtc';

const VtcVehicleTypes = () => {
    const { 
        vehicleTypes, 
        loadingTypes, 
        fetchVehicleTypes, 
        createVehicleType, 
        updateVehicleType, 
        deleteVehicleType 
    } = useAdminVtc();

    // Au chargement du composant, on récupère les catégories
    useEffect(() => {
        fetchVehicleTypes();
    }, [fetchVehicleTypes]);

    // États pour le formulaire (Modale Création / Édition)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', iconUrl: '', baseFare: 0, pricePerKm: 0, 
        pricePerMinute: 0, minFare: 0, capacity: 4, 
        cancellationFee: 0, freeCancellationMinutes: 5, 
        commissionPercent: 15, isActive: true
    });

    // Ouvrir la modale pour une nouvelle catégorie
    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            name: '', iconUrl: '', baseFare: 0, pricePerKm: 0, 
            pricePerMinute: 0, minFare: 0, capacity: 4, 
            cancellationFee: 0, freeCancellationMinutes: 5, 
            commissionPercent: 15, isActive: true
        });
        setIsModalOpen(true);
    };

    // Ouvrir la modale pour modifier une catégorie existante
    const handleEdit = (type) => {
        setEditingId(type.id);
        setFormData({ ...type });
        setIsModalOpen(true);
    };

    // Soumission du formulaire (Création ou Mise à jour)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convertir les champs numériques
        const payload = {
            ...formData,
            baseFare: parseFloat(formData.baseFare),
            pricePerKm: parseFloat(formData.pricePerKm),
            pricePerMinute: parseFloat(formData.pricePerMinute),
            minFare: parseFloat(formData.minFare),
            capacity: parseInt(formData.capacity, 10),
            cancellationFee: parseFloat(formData.cancellationFee),
            freeCancellationMinutes: parseInt(formData.freeCancellationMinutes, 10),
            commissionPercent: parseFloat(formData.commissionPercent)
        };

        let success;
        if (editingId) {
            success = await updateVehicleType(editingId, payload);
        } else {
            success = await createVehicleType(payload);
        }

        if (success) setIsModalOpen(false);
    };

    // Suppression / Désactivation
    const handleDelete = async (id, linkedCount) => {
        const forceDelete = linkedCount === 0;
        const confirmMessage = forceDelete 
            ? "Voulez-vous supprimer définitivement cette catégorie ?" 
            : "Des véhicules sont liés à cette catégorie. Elle sera simplement désactivée. Continuer ?";
            
        if (window.confirm(confirmMessage)) {
            await deleteVehicleType(id, forceDelete);
        }
    };

    // Gestion des changements dans les inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-600" />
                        Tarification & Catégories VTC
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les gammes de véhicules, les prix des courses et les commissions.
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Nouvelle catégorie
                </button>
            </div>

            {/* Contenu principal : Grille de catégories */}
            {loadingTypes ? (
                <div className="flex justify-center p-12 text-gray-500">
                    <p>Chargement des catégories en cours...</p>
                </div>
            ) : vehicleTypes.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                    <FontAwesomeIcon icon={faCar} className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune catégorie VTC</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Commencez par créer une gamme (ex: Standard, Eco, Premium).</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicleTypes.map((type) => (
                        <div key={type.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all hover:shadow-md ${!type.isActive ? 'border-red-200 dark:border-red-900 opacity-80' : 'border-gray-200 dark:border-gray-700'}`}>
                            {/* Card Header */}
                            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{type.name}</h3>
                                        {!type.isActive && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
                                                Inactif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                        Commission Plateforme : {type.commissionPercent}%
                                    </p>
                                </div>
                                {type.iconUrl ? (
                                    <img src={type.iconUrl} alt={type.name} className="w-12 h-12 object-contain" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex justify-center items-center text-gray-400">
                                        <FontAwesomeIcon icon={faCar} />
                                    </div>
                                )}
                            </div>

                            {/* Card Body - Pricing stats */}
                            <div className="p-5 flex-1 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Base</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{type.baseFare} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Minimum</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{type.minFare} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Par Km</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{type.pricePerKm} FCFA</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Par Min</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{type.pricePerMinute} FCFA</p>
                                </div>
                            </div>

                            {/* Card Details (Constraints) */}
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-2">
                                <span title="Capacité" className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUsers} /> {type.capacity} places</span>
                                <span title="Frais d'annulation" className="flex items-center gap-1.5"><FontAwesomeIcon icon={faBan} /> {type.cancellationFee} FCFA</span>
                                <span title="Annulation gratuite" className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} /> {type.freeCancellationMinutes} min</span>
                            </div>

                            {/* Card Footer - Actions */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${type.linkedVehiclesCount > 0 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                    {type.linkedVehiclesCount} Véhicule(s)
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(type)} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors" title="Modifier">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(type.id, type.linkedVehiclesCount)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" title="Désactiver / Supprimer">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modale Formulaire */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl my-8">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[90vh]">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-2xl">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingId ? "Modifier la catégorie" : "Nouvelle catégorie VTC"}
                                </h3>
                                {editingId && (
                                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                        <span className={formData.isActive ? "text-green-600" : "text-gray-500"}>
                                            {formData.isActive ? "Actif" : "Inactif"}
                                        </span>
                                        <input 
                                            type="checkbox" 
                                            name="isActive" 
                                            checked={formData.isActive} 
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {/* Informations Générales */}
                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">Informations Générales</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la gamme *</label>
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="ex: Berline Premium" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacité (Passagers) *</label>
                                        <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="1" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de l'icône (Optionnel)</label>
                                        <input type="url" name="iconUrl" value={formData.iconUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="https://..." />
                                    </div>
                                </div>

                                {/* Tarification */}
                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">Tarification (Modèle)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frais de base</label>
                                        <input required type="number" step="0.01" name="baseFare" value={formData.baseFare} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix minimum de course</label>
                                        <input required type="number" step="0.01" name="minFare" value={formData.minFare} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix par Kilomètre</label>
                                        <input required type="number" step="0.01" name="pricePerKm" value={formData.pricePerKm} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix par Minute</label>
                                        <input required type="number" step="0.01" name="pricePerMinute" value={formData.pricePerMinute} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                </div>

                                {/* Règles Business */}
                                <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 border-b pb-2">Règles Métier</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commission Plateforme (%)</label>
                                        <input required type="number" step="0.1" name="commissionPercent" value={formData.commissionPercent} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" max="100" />
                                    </div>
                                    <div className="hidden md:block"></div> {/* Espacement */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frais d'annulation</label>
                                        <input required type="number" step="0.01" name="cancellationFee" value={formData.cancellationFee} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annulation gratuite (Minutes)</label>
                                        <input required type="number" name="freeCancellationMinutes" value={formData.freeCancellationMinutes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" min="0" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 justify-end bg-gray-50 dark:bg-gray-800 rounded-b-2xl sticky bottom-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
                                    {editingId ? "Enregistrer les modifications" : "Créer la catégorie"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VtcVehicleTypes;