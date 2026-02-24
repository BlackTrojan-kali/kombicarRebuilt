import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, faWallet, faPercent, 
    faEnvelope, faCogs, faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import { useAdminAppSettings } from '../../../contexts/Admin/VTCcontexts/useAdminAppSettings';

export default function CarpoolingSettings() {
    const { settings, isLoading, fetchSettings, updateSettings } = useAdminAppSettings();

    // État local pour les champs de formulaire (uniquement ce qui est modifiable)
    const [formData, setFormData] = useState({
        carpoolingCommissionFees: 0,
        penalityReservationFeesPercentage: 0,
        minimumWithdrawAmount: 0,
        emailToSendWithdrawNotifications: ""
    });

    // Chargement initial
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Pré-remplissage du formulaire à la réception des données
    useEffect(() => {
        if (settings) {
            setFormData({
                carpoolingCommissionFees: settings.carpoolingCommissionFees || 0,
                penalityReservationFeesPercentage: settings.penalityReservationFeesPercentage || 0,
                minimumWithdrawAmount: settings.minimumWithdrawAmount || 0,
                emailToSendWithdrawNotifications: settings.emailToSendWithdrawNotifications || ""
            });
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

    // Soumission (Mise à jour partielle de la configuration)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // On s'assure de parser les valeurs numériques avant l'envoi
        const payload = {
            carpoolingCommissionFees: Number(formData.carpoolingCommissionFees),
            penalityReservationFeesPercentage: Number(formData.penalityReservationFeesPercentage),
            minimumWithdrawAmount: Number(formData.minimumWithdrawAmount),
            emailToSendWithdrawNotifications: formData.emailToSendWithdrawNotifications
        };

        await updateSettings(payload);
    };

    if (isLoading && !settings) {
        return (
            <div className="flex justify-center items-center h-64 transition-colors duration-200">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto transition-colors duration-200">
            {/* --- EN-TÊTE --- */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faCogs} className="text-blue-600 dark:text-blue-400" />
                        Configuration Covoiturage
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gérez les commissions, les pénalités et les règles de retrait.
                    </p>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    <FontAwesomeIcon icon={faSave} />
                    {isLoading ? "Enregistrement..." : "Sauvegarder"}
                </button>
            </div>

            {/* --- CARTES DE SOLDES (Lecture Seule) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FontAwesomeIcon icon={faChartLine} className="text-xl" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solde Global App</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            {settings?.appBalance?.toLocaleString() || 0} <span className="text-sm font-bold text-gray-500">CFA</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-green-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faWallet} className="text-xl" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solde Covoiturage</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                            {settings?.carpoolingAppBalance?.toLocaleString() || 0} <span className="text-sm font-bold text-gray-500">CFA</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* --- FORMULAIRE DE PARAMÉTRAGE --- */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section : Finances & Pénalités */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faPercent} className="text-indigo-500 dark:text-indigo-400" />
                        Commissions & Pénalités
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frais de commission Covoiturage (CFA ou %)</label>
                            <input 
                                type="number" 
                                name="carpoolingCommissionFees" 
                                value={formData.carpoolingCommissionFees} 
                                onChange={handleChange} 
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pénalité d'annulation (%)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                name="penalityReservationFeesPercentage" 
                                value={formData.penalityReservationFeesPercentage} 
                                onChange={handleChange} 
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                    </div>
                </div>

                {/* Section : Retraits & Notifications */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-orange-500 dark:text-orange-400" />
                        Retraits & Notifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant minimum de retrait (CFA)</label>
                            <input 
                                type="number" 
                                name="minimumWithdrawAmount" 
                                value={formData.minimumWithdrawAmount} 
                                onChange={handleChange} 
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email pour alertes de retrait</label>
                            <input 
                                type="email" 
                                name="emailToSendWithdrawNotifications" 
                                value={formData.emailToSendWithdrawNotifications} 
                                onChange={handleChange} 
                                placeholder="admin@kombicar.com"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-colors" 
                            />
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}