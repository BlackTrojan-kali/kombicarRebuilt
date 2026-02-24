import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, faRoute, faStopwatch, 
    faMoneyBillWave, faShieldAlt, faCogs 
} from '@fortawesome/free-solid-svg-icons';
import { useAdminVtcSettings } from '../../../contexts/Admin/VTCcontexts/useAdminVtcSettings';

export default function VtcSettings() {
    const { settings, isLoading, fetchSettings, updateSettings } = useAdminVtcSettings();

    // État local du formulaire
    const [formData, setFormData] = useState({
        driverSearchRadiusMeters: 0,
        commissionFixPercent: 0,
        geoFencingMaxDistanceMeters: 0,
        averageSpeedMetersPerSecond: 0,
        defaultEtaMinutesWhenNoDriver: 0,
        rideOfferExpiryMinutes: 0,
        redisDriverInfoTtlHours: 0,
        redisDriverLocationTtlMinutes: 0,
        routingFallbackDistanceMultiplier: 0,
        paymentAmountMultiple: 0,
        webhookTrustPaywayIdempotencyCacheSeconds: 0,
        webhookCinetPayIdempotencyCacheSeconds: 0,
        emergencyContactsMaxCount: 0
    });

    // Charger les données au montage
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Pré-remplir le formulaire quand les données arrivent
    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    // Gestion de la saisie
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // On s'assure de parser toutes les valeurs en nombres avant l'envoi (API stricte)
        const payload = {
            driverSearchRadiusMeters: Number(formData.driverSearchRadiusMeters),
            commissionFixPercent: Number(formData.commissionFixPercent),
            geoFencingMaxDistanceMeters: Number(formData.geoFencingMaxDistanceMeters),
            averageSpeedMetersPerSecond: Number(formData.averageSpeedMetersPerSecond),
            defaultEtaMinutesWhenNoDriver: Number(formData.defaultEtaMinutesWhenNoDriver),
            rideOfferExpiryMinutes: Number(formData.rideOfferExpiryMinutes),
            redisDriverInfoTtlHours: Number(formData.redisDriverInfoTtlHours),
            redisDriverLocationTtlMinutes: Number(formData.redisDriverLocationTtlMinutes),
            routingFallbackDistanceMultiplier: Number(formData.routingFallbackDistanceMultiplier),
            paymentAmountMultiple: Number(formData.paymentAmountMultiple),
            webhookTrustPaywayIdempotencyCacheSeconds: Number(formData.webhookTrustPaywayIdempotencyCacheSeconds),
            webhookCinetPayIdempotencyCacheSeconds: Number(formData.webhookCinetPayIdempotencyCacheSeconds),
            emergencyContactsMaxCount: Number(formData.emergencyContactsMaxCount)
        };

        await updateSettings(payload);
    };

    if (isLoading && !settings) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faCogs} className="text-blue-600 dark:text-blue-400" />
                        Configuration Globale VTC
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Paramétrez l'algorithme, les commissions et les règles métier.</p>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faSave} />
                    {isLoading ? "Sauvegarde..." : "Enregistrer les modifications"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* --- SECTION 1 : Algorithme & Trajets --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faRoute} className="text-indigo-500 dark:text-indigo-400" />
                        Algorithme & Trajets
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rayon de recherche chauffeurs (mètres)</label>
                            <input type="number" name="driverSearchRadiusMeters" value={formData.driverSearchRadiusMeters} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Distance max GeoFencing (mètres)</label>
                            <input type="number" name="geoFencingMaxDistanceMeters" value={formData.geoFencingMaxDistanceMeters} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vitesse moyenne estimée (m/s)</label>
                            <input type="number" step="0.1" name="averageSpeedMetersPerSecond" value={formData.averageSpeedMetersPerSecond} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Multiplicateur de distance (Fallback Routage)</label>
                            <input type="number" step="0.1" name="routingFallbackDistanceMultiplier" value={formData.routingFallbackDistanceMultiplier} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2 : Temps & Cache --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faStopwatch} className="text-orange-500 dark:text-orange-400" />
                        Temps d'attente & Cache
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration d'une offre de course (minutes)</label>
                            <input type="number" name="rideOfferExpiryMinutes" value={formData.rideOfferExpiryMinutes} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ETA par défaut si aucun chauffeur (minutes)</label>
                            <input type="number" name="defaultEtaMinutesWhenNoDriver" value={formData.defaultEtaMinutesWhenNoDriver} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cache Info Chauffeur (Heures)</label>
                                <input type="number" name="redisDriverInfoTtlHours" value={formData.redisDriverInfoTtlHours} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cache Position GPS (Min)</label>
                                <input type="number" name="redisDriverLocationTtlMinutes" value={formData.redisDriverLocationTtlMinutes} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 3 : Finance --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 dark:text-green-400" />
                        Finance & Économie
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commission globale de la plateforme (%)</label>
                            <input type="number" step="0.1" name="commissionFixPercent" value={formData.commissionFixPercent} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Multiple d'arrondi des montants (ex: 50, 100)</label>
                            <input type="number" name="paymentAmountMultiple" value={formData.paymentAmountMultiple} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 4 : Sécurité & Paiements --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-red-500 dark:text-red-400" />
                        Sécurité & Webhooks
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre max. de contacts d'urgence</label>
                            <input type="number" name="emergencyContactsMaxCount" value={formData.emergencyContactsMaxCount} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anti-doublon TrustPayway (Sec)</label>
                                <input type="number" name="webhookTrustPaywayIdempotencyCacheSeconds" value={formData.webhookTrustPaywayIdempotencyCacheSeconds} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anti-doublon CinetPay (Sec)</label>
                                <input type="number" name="webhookCinetPayIdempotencyCacheSeconds" value={formData.webhookCinetPayIdempotencyCacheSeconds} onChange={handleChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}