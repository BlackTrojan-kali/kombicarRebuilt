import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, faEye, faArrowLeft, faArrowRight, 
    faEdit, faDownload, faIdCard, faCheckCircle, 
    faTimesCircle, faHourglassHalf 
} from '@fortawesome/free-solid-svg-icons';
import LicenceUpdateModal from '../../Components/Modals/LicenceUpdateModal';
import { useAdminDLicenceContext } from '../../contexts/Admin/AdminDlicenceContext';

const DrivingLicences = () => {
    const { verificationState = 0, page = 1 } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLicence, setSelectedLicence] = useState(null);

    const { 
        licenceList, 
        loading, 
        error, 
        getLicencesList,
        downloadLicenceDocument
    } = useAdminDLicenceContext();

    useEffect(() => {
        getLicencesList(page, verificationState);
    }, [page, verificationState, ]);

    const handleUpdateClick = (licence) => {
        setSelectedLicence(licence);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedLicence(null);
        getLicencesList(page, verificationState);
    };

    const handleDownloadClick = (licenceUrl) => {
        if (licenceUrl) {
            downloadLicenceDocument(licenceUrl);
        } else {
            console.error("URL du document non disponible.");
        }
    };

    const getStateConfig = (state) => {
        switch (parseInt(state)) {
            case 1:
                return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200', text: 'Vérifié', icon: faCheckCircle };
            case 2:
                return { color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200', text: 'Rejeté', icon: faTimesCircle };
            case 0:
            default:
                return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200', text: 'En attente', icon: faHourglassHalf };
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FontAwesomeIcon icon={faClock} spin className="text-4xl text-blue-600 dark:text-blue-500 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Synchronisation des données...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-800 max-w-md text-center">
                    <p className="font-semibold text-lg mb-2">Erreur système</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const currentTab = parseInt(verificationState);

    return (
        <div className='p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen'>
            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FontAwesomeIcon icon={faIdCard} className="text-blue-600" />
                    Gestion des Permis de Conduire
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Consultez, vérifiez et gérez les licences des chauffeurs de la plateforme.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                
                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 px-4 pt-2">
                    {[
                        { id: 0, label: 'En Attente', count: null },
                        { id: 1, label: 'Vérifiés', count: null },
                        { id: 2, label: 'Rejetés', count: null }
                    ].map((tab) => (
                        <Link 
                            key={tab.id}
                            to={`/admin/licences/${tab.id}/1`}
                            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors relative ${
                                currentTab === tab.id 
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="p-0">
                    {licenceList?.items?.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faIdCard} className="text-3xl text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucun permis trouvé</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Il n'y a actuellement aucun permis de conduire dans cette catégorie.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                                        <th className="px-6 py-4">Chauffeur</th>
                                        <th className="px-6 py-4">N° de Permis</th>
                                        <th className="px-6 py-4">Expiration</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {licenceList?.items?.map((item) => {
                                        const status = getStateConfig(item.licenceDriving?.verificationState);
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {item.firstName} {item.lastName}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {item.licenceDriving?.licenseNumber || '---'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {item.licenceDriving?.expirationDate ? new Date(item.licenceDriving.expirationDate).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${status.color}`}>
                                                        <FontAwesomeIcon icon={status.icon} className="w-3 h-3" />
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/admin/licences/details/${item.licenceDriving?.id}`}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                            title="Voir les détails"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>

                                                        <button
                                                            onClick={() => handleUpdateClick(item.licenceDriving)}
                                                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                                            title="Modifier le statut"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>

                                                        {item.licenceDriving?.url && (
                                                            <button
                                                                onClick={() => handleDownloadClick(item.licenceDriving.url)}
                                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                                                title="Télécharger le document"
                                                            >
                                                                <FontAwesomeIcon icon={faDownload} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                
                {/* Pagination Footer */}
                {licenceList?.items?.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Affichage de la page <span className="font-semibold text-gray-900 dark:text-white">{licenceList.page}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{licenceList.totalCount > 0 ? Math.ceil(licenceList.totalCount / 10) : 1}</span>
                        </span>
                        
                        <div className="flex gap-2">
                            <Link
                                to={`/admin/licences/${verificationState}/${parseInt(licenceList.page) - 1}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    licenceList.hasPreviousPage 
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700' 
                                        : 'bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-600'
                                }`}
                                aria-disabled={!licenceList.hasPreviousPage}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Précédent
                            </Link>
                            
                            <Link
                                to={`/admin/licences/${verificationState}/${parseInt(licenceList.page) + 1}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    licenceList.hasNextPage 
                                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700' 
                                        : 'bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-600'
                                }`}
                                aria-disabled={!licenceList.hasNextPage}
                            >
                                Suivant <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {selectedLicence && (
                <LicenceUpdateModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    licence={selectedLicence}
                />
            )}
        </div>
    );
};

export default DrivingLicences;