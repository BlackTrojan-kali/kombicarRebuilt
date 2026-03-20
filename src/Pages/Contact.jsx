import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHeadset, faPhone, faMapMarkerAlt, 
    faCheckCircle, faGlobe 
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import useColorScheme from '../hooks/useColorScheme';

const Contact = () => {
    const { theme } = useColorScheme();

    // Variables de couleurs adaptables (Light / Dark mode)
    const pageBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';

    return (
        <div className={`min-h-screen ${pageBg} pt-32 pb-24 font-sans transition-colors duration-300`}>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* --- HEADER SECTION --- */}
                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-6">
                        <FontAwesomeIcon icon={faHeadset} className="text-4xl" />
                    </div>
                    <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${textPrimary}`}>
                        Assistance Kombicar
                    </h1>
                    <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${textSecondary}`}>
                        Votre support <span className="font-semibold text-orange-500">24/7</span> pour vos réservations, trajets et informations.
                    </p>
                </header>

                {/* --- */}

                {/* --- CONTACT DETAILS SECTION --- */}
                <section className="mb-20">
                    <h2 className={`text-2xl font-bold mb-8 text-center ${textPrimary}`}>
                        Coordonnées d'Assistance par Ville
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Yaoundé Card */}
                        <div className={`${cardBg} p-8 rounded-3xl border ${borderColor} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                            {/* Liseré supérieur interactif */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            
                            <div className="flex items-center mb-6">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-xl mr-3" />
                                <h3 className={`text-2xl font-bold ${textPrimary}`}>Yaoundé</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <a href="tel:+237678361119" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/link">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-4">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Appel</p>
                                        <p className={`font-semibold ${textPrimary} group-hover/link:text-blue-500 transition-colors`}>(+237) 678 361 119</p>
                                    </div>
                                </a>
                                
                                <a href="https://wa.me/237678361119" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/link">
                                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 mr-4">
                                        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                                        <p className={`font-semibold ${textPrimary} group-hover/link:text-green-500 transition-colors`}>(+237) 678 361 119</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        
                        {/* Douala Card */}
                        <div className={`${cardBg} p-8 rounded-3xl border ${borderColor} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            
                            <div className="flex items-center mb-6">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 text-xl mr-3" />
                                <h3 className={`text-2xl font-bold ${textPrimary}`}>Douala</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <a href="tel:+237655730577" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/link">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mr-4">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Appel</p>
                                        <p className={`font-semibold ${textPrimary} group-hover/link:text-blue-500 transition-colors`}>(+237) 655 730 577</p>
                                    </div>
                                </a>
                                
                                <a href="https://wa.me/237655730577" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/link">
                                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 mr-4">
                                        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                                        <p className={`font-semibold ${textPrimary} group-hover/link:text-green-500 transition-colors`}>(+237) 655 730 577</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        
                    </div>

                    {/* Call to Action Banner */}
                    <div className="mt-8 p-6 text-center bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                        <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                            Besoin d'aide immédiate ? N'hésitez pas à nous appeler !
                        </p>
                    </div>
                </section>

                {/* --- */}

                {/* --- KEY SERVICES SECTION --- */}
                <section className="mb-20">
                    <h2 className={`text-2xl font-bold mb-8 text-center ${textPrimary}`}>
                        Services de l'Assistance
                    </h2>
                    
                    <div className={`${cardBg} p-8 rounded-3xl border ${borderColor} shadow-sm`}>
                        <ul className={`space-y-6 ${textSecondary} text-[15px]`}>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-kombigreen-500 mt-1 mr-4 text-xl" />
                                <div>
                                    <strong className={`${textPrimary}`}>Réservations & support covoiturage</strong> 
                                    <p className="mt-1">Aide pour planifier vos voyages et gérer vos places.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-kombigreen-500 mt-1 mr-4 text-xl" />
                                <div>
                                    <strong className={`${textPrimary}`}>Informations trajets & véhicules</strong> 
                                    <p className="mt-1">Détails sur les itinéraires disponibles et les types de véhicules.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* --- */}

                {/* --- SOCIAL LINKS SECTION --- */}
                <section>
                    <h2 className={`text-2xl font-bold mb-8 text-center ${textPrimary}`}>
                        Restez Connecté
                    </h2>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <a 
                            href="https://www.kombicar.fr/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-500 rounded-full font-medium transition-all shadow-sm text-gray-700 dark:text-gray-300"
                        >
                            <FontAwesomeIcon icon={faGlobe} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} /> 
                            Site Web
                        </a>
                        
                        <a 
                            href="https://facebook.com/kombicar" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 rounded-full font-medium transition-all shadow-sm text-gray-700 dark:text-gray-300"
                        >
                            <FontAwesomeIcon icon={faFacebookF} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} /> 
                            Facebook
                        </a>
                        
                        <a 
                            href="https://instagram.com/kombicar_cmr" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 hover:text-pink-600 rounded-full font-medium transition-all shadow-sm text-gray-700 dark:text-gray-300"
                        >
                            <FontAwesomeIcon icon={faInstagram} className={theme === 'dark' ? 'text-pink-400' : 'text-pink-600'} /> 
                            Instagram
                        </a>
                    </div>
                </section>
                
            </div>
        </div>
    );
}

export default Contact;