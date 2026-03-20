import React, { useEffect } from 'react';
import HeroSection from '../Components/page-components/HeroSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight, faCircleQuestion, } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/ui/Button';
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Covoiturage = () => {
    const truncateLocationName = (name) => {
        const maxLength = 7; 
        if (name && name.length > maxLength) {
            return `${name.substring(0, maxLength)}...`;
        }
        return name;
    };

    const { trips, loading, error, listPublicTrips } = useTrips();
    const { theme } = useColorScheme();
    const { user, defaultCountry, loading: authLoading } = useAuth(); 

    useEffect(() => {
        let countryCodeToSend = null;

        if (user && user.country) {
            countryCodeToSend = user.country; 
        } 
        else if (defaultCountry && defaultCountry.countryCode !== undefined) {
            countryCodeToSend = defaultCountry.countryCode;
        }
        
        if (countryCodeToSend !== null) {
            const searchCriteria = {
                page: 1,
                tripStatus: 0, 
                country: countryCodeToSend, 
            };

            listPublicTrips(searchCriteria);
        }
    }, [user, defaultCountry]);

    // Variables de style épurées (Design OnTheGo)
    const textColorPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const textColorSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    const sectionBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
    const lightBgColor = theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50';
    const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-100';
    const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white/5'} transition-colors duration-300 font-sans`}>
            <HeroSection url='/default/jeunes.jpg' label="Covoiturage : Votre trajet partagé, facile et économique" showLogo={false} />

            <main className='pt-32 pb-16'>
                
                {/* ==================================== */}
                {/* Section: Covoiturage pour les Conducteurs */}
                {/* ==================================== */}
                <section className='flex flex-col md:flex-row gap-12 lg:gap-20 items-center mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12'>
                    <img
                        src="/default/carsharing-4.jpg"
                        alt="Personne utilisant une application de covoiturage"
                        className='w-full md:w-1/2 rounded-3xl shadow-lg object-cover h-auto'
                    />
                    <div className='w-full md:w-1/2'>
                        <h2 className={`font-bold text-3xl sm:text-4xl mb-6 ${textColorPrimary} leading-tight`}>
                            Conducteurs : Partagez vos trajets, réduisez vos coûts !
                        </h2>
                        <p className={`${textColorSecondary} leading-relaxed text-[17px] mb-8`}>
                            Vous avez des places libres dans votre véhicule ? Proposez-les sur Kombicar ! C'est l'occasion idéale de partager vos frais de carburant et d'entretien avec des passagers allant dans la même direction que vous. Une solution simple, économique et écologique pour tous vos déplacements.
                        </p>
                        <div>
                            <Link to="/publish-trip">
                                <Button className='px-8 py-4 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-md'>
                                    Proposer un trajet
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ==================================== */}
                {/* Section: Trajets de Covoiturage Disponibles (Épurée) */}
                {/* ==================================== */}
                <section className={`w-full text-left py-24 mb-32 ${lightBgColor} border-y ${borderColor}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                        <h3 className={`font-bold text-3xl sm:text-4xl mb-12 ${textColorPrimary}`}>
                            Découvrez les itinéraires de covoiturage populaires
                        </h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            { loading ? (
                                <p className={`${textColorSecondary}`}>Chargement des itinéraires...</p>
                            ) : trips?.length === 0 ? (
                                <p className={`${textColorSecondary}`}>Aucun itinéraire fréquent trouvé.</p>
                            ) : (
                                trips?.slice(0, 8).map((tripData) => (
                                    <Link 
                                        to={`/trip-detail/${tripData.trip.id}`} 
                                        key={tripData.trip.id} 
                                        className={`${cardBgColor} border ${borderColor} p-6 rounded-2xl flex justify-between items-center group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer`}
                                    >
                                        <div className={`flex items-center gap-3 ${textColorPrimary}`}>
                                            <p className='font-semibold text-[15px]'>{truncateLocationName(tripData.departureArea?.homeTownName || 'N/A')}</p>
                                            <FontAwesomeIcon icon={faArrowRight} className={`text-sm text-gray-400 group-hover:text-blue-500 transition-colors`} />
                                            <p className='font-semibold text-[15px]'>{truncateLocationName(tripData.arrivalArea?.homeTownName || 'N/A')}</p>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} className={`text-lg text-gray-300 group-hover:text-blue-500 transition-colors`} />
                                    </Link>
                                ))
                            )}
                        </div>
                        
                        {/* Bouton "Afficher plus" */}
                        {!loading && !error && trips.length > 8 && (
                            <div className="text-center mt-12">
                                <Link to="/results">
                                    <Button className='px-8 py-4 rounded-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all'>
                                        Afficher plus de trajets
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* ==================================== */}
                {/* Section: Covoiturage pour les Passagers */}
                {/* ==================================== */}
                <section className='flex flex-col md:flex-row-reverse gap-12 lg:gap-20 items-center mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12'>
                    <img
                        src="/default/carsharing-6.jpg"
                        alt="Personnes heureuses dans une voiture"
                        className='w-full md:w-1/2 rounded-3xl shadow-lg object-cover h-auto'
                    />
                    <div className='w-full md:w-1/2'>
                        <h2 className={`font-bold text-3xl sm:text-4xl mb-6 ${textColorPrimary} leading-tight`}>
                            Passagers : Trouvez votre trajet idéal en un clin d'œil !
                        </h2>
                        <p className={`${textColorSecondary} leading-relaxed text-[17px] mb-8`}>
                            Vous cherchez un moyen de transport flexible, abordable et convivial ? Avec Kombicar, trouvez facilement des covoitureurs pour vos déplacements quotidiens ou occasionnels. Dites adieu aux transports en commun bondés et voyagez confortablement.
                        </p>
                        <div>
                            <Link to="/results">
                                <Button className='px-8 py-4 rounded-full bg-kombigreen-500 text-white font-semibold hover:bg-kombigreen-600 transition-all shadow-md'>
                                    Rechercher un trajet
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ==================================== */}
                {/* Section: FAQ */}
                {/* ==================================== */}
                <section className={`py-20 px-6 sm:px-10 lg:px-16 rounded-3xl max-w-6xl mx-auto mb-24 ${lightBgColor}`}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 mb-6">
                            <FontAwesomeIcon icon={faCircleQuestion} className='text-3xl' />
                        </div>
                        <h2 className={`font-bold text-3xl sm:text-4xl ${textColorPrimary}`}>
                            Questions fréquentes sur le covoiturage
                        </h2>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className={`${cardBgColor} border ${borderColor} p-8 rounded-3xl hover:shadow-md transition-shadow`}>
                            <h4 className={`font-bold text-[19px] ${textColorPrimary} mb-3`}>Comment fonctionne le covoiturage sur Kombicar ?</h4>
                            <p className={`${textColorSecondary} text-[15px] leading-relaxed`}>
                                Que vous soyez conducteur ou passager, le principe est simple : les conducteurs proposent leurs trajets avec leurs places disponibles, et les passagers peuvent les réserver. Le partage des frais se fait directement via l'application, en toute transparence.
                            </p>
                        </div>
                        <div className={`${cardBgColor} border ${borderColor} p-8 rounded-3xl hover:shadow-md transition-shadow`}>
                            <h4 className={`font-bold text-[19px] ${textColorPrimary} mb-3`}>Est-ce que le covoiturage est sûr ?</h4>
                            <p className={`${textColorSecondary} text-[15px] leading-relaxed`}>
                                La sécurité est notre priorité absolue. Nous encourageons nos utilisateurs à vérifier les profils, les avis et les évaluations des autres membres avant de voyager. Vous pouvez également communiquer avec eux avant le départ pour plus de sérénité.
                            </p>
                        </div>
                        <div className={`${cardBgColor} border ${borderColor} p-8 rounded-3xl hover:shadow-md transition-shadow`}>
                            <h4 className={`font-bold text-[19px] ${textColorPrimary} mb-3`}>Comment sont fixés les prix ?</h4>
                            <p className={`${textColorSecondary} text-[15px] leading-relaxed`}>
                                Les prix sont suggérés par Kombicar en fonction de la distance et des frais habituels (carburant, péages), mais le conducteur peut ajuster ce montant dans une certaine limite. L'objectif est de partager les frais de manière équitable, pas de faire du profit.
                            </p>
                        </div>
                        <div className={`${cardBgColor} border ${borderColor} p-8 rounded-3xl hover:shadow-md transition-shadow`}>
                            <h4 className={`font-bold text-[19px] ${textColorPrimary} mb-3`}>Que faire en cas de problème ou d'annulation ?</h4>
                            <p className={`${textColorSecondary} text-[15px] leading-relaxed`}>
                                En cas d'imprévu, nous avons mis en place des politiques d'annulation claires et flexibles. Notre support client est également disponible pour vous aider à résoudre rapidement tout problème ou question que vous pourriez avoir.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* ==================================== */}
            {/* Section: Mobile App Presentation */}
            {/* ==================================== */}
            <div className="px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
                <section className="py-16 sm:py-20 px-6 sm:px-12 bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white rounded-[3rem] shadow-lg relative overflow-hidden">
                    
                    {/* Éléments de fond décoratifs optionnels pour faire "App" */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-300 dark:bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-yellow-500 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto">
                        
                        <div className='flex flex-col items-center md:items-start text-center md:text-left md:w-1/2'>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                Simplifiez votre expérience, <br />
                                <span className="text-white dark:text-gray-900">téléchargez l'app !</span>
                            </h2>
                            <p className="text-[17px] mb-10 font-medium opacity-90">
                                Réservez vos trajets et gérez vos covoiturages directement depuis votre poche, où que vous soyez.
                            </p>
                            
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <a href="https://apps.apple.com/us/app/kombicar/id6468362045" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur l'App Store">
                                    <button type="button" className="flex items-center justify-center w-[210px] py-3.5 text-gray-900 bg-white rounded-2xl hover:bg-gray-50 shadow-md transition-all">
                                        <div className="mr-3">
                                            <svg viewBox="0 0 384 512" width="24" fill="currentColor">
                                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-medium leading-none mb-1">Télécharger sur</div>
                                            <div className="text-lg font-bold leading-none">App Store</div>
                                        </div>
                                    </button>
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.kombicar.app" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur Google Play">
                                    <button type="button" className="flex items-center justify-center w-[210px] py-3.5 text-white bg-gray-900 rounded-2xl hover:bg-gray-800 shadow-md transition-all dark:bg-gray-900 dark:hover:bg-black">
                                        <div className="mr-3">
                                            <svg viewBox="30 336.7 120.9 129.2" width="24" fill="currentColor">
                                                <path d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7 c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"></path>
                                                <path d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3 c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"></path>
                                                <path d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1 c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"></path>
                                                <path d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6 c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"></path>
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-medium leading-none mb-1 text-gray-300">DISPONIBLE SUR</div>
                                            <div className="text-lg font-bold leading-none">Google Play</div>
                                        </div>
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="/default/app-kombicar.png"
                                alt="Application mobile Kombicar"
                                className="w-[250px] md:w-[300px] drop-shadow-2xl transition-transform duration-500 hover:-translate-y-2"
                            />
                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default Covoiturage;