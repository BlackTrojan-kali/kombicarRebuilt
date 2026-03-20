import React, { useEffect, useState, useMemo } from 'react'; 
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import dayjs from 'dayjs';
import { toast } from "sonner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowRight, faBoltLightning, faCoins, faNewspaper, 
    faChevronLeft, faChevronRight, faSearch, faTicket, faCar, 
    faClock, faUserTag, faCheckCircle, faSpinner
} from '@fortawesome/free-solid-svg-icons';

// Styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import HeroSection from '../Components/page-components/HeroSection';
import Button from '../Components/ui/Button';
import TripCard from '../Components/Cards/TripCard';

// Hooks
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import useAuth from '../hooks/useAuth'; 
import useReservation from '../hooks/useReservation';

// --- CONSTANTES & UTILITAIRES ---
const SECTION_PADDING = "px-4 sm:px-6 lg:px-12 xl:px-24";
const MAX_LOCATION_LENGTH = 12;

const truncateLocationName = (name) => {
    if (name && name.length > MAX_LOCATION_LENGTH) {
        return `${name.substring(0, MAX_LOCATION_LENGTH)}...`;
    }
    return name;
};

// --- SOUS-COMPOSANTS UI (Style OnTheGo - Épuré) ---

const ArrowButton = ({ onClick, direction, theme }) => {
    const isDark = theme === 'dark';
    const classes = `absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-md cursor-pointer transition-colors duration-200 hidden lg:flex items-center justify-center 
        ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-100'}`;
    
    return (
        <div 
            className={`${classes} ${direction === 'left' ? '-left-6' : '-right-6'}`} 
            onClick={onClick}
        >
            <FontAwesomeIcon icon={direction === 'left' ? faChevronLeft : faChevronRight} className="text-lg" />
        </div>
    );
};

// Fusion de FeatureCard et StepCard avec le nouveau design
const CleanCard = ({ icon, title, description, color, theme }) => {
    // Mapping des couleurs pour le design épuré
    const colorStyles = {
        blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
        yellow: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        green: "text-green-500 bg-green-50 dark:bg-green-900/20",
    };
    
    const selectedStyle = colorStyles[color] || colorStyles.blue;

    return (
        <div className="flex flex-col items-center text-center p-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${selectedStyle}`}>
                <FontAwesomeIcon icon={icon} className="text-3xl" />
            </div>
            <h4 className={`font-bold text-xl mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{title}</h4>
            <p className={`text-[15px] leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
            </p>
        </div>
    );
};

const InfoSection = ({ title, text, imageSrc, imageAlt, btnText, btnLink, theme, reverse = false }) => (
    <section className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-20 items-center max-w-7xl mx-auto mb-32`}>
        <img
            src={imageSrc}
            alt={imageAlt}
            className='w-full md:w-1/2 rounded-3xl shadow-lg object-cover h-auto'
        />
        <div className='w-full md:w-1/2'>
            <h2 className={`font-bold text-3xl sm:text-4xl mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {title}
            </h2>
            <p className={`leading-relaxed text-[17px] mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {text}
            </p>
            {btnText && (
                <div>
                    {btnLink ? (
                         <Link to={btnLink}>
                            <Button className='px-8 py-4 rounded-full bg-kombigreen-500 text-white font-semibold hover:bg-kombigreen-600 shadow-md transition-all'>
                                {btnText}
                            </Button>
                         </Link>
                    ) : (
                        <Button className='px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition-all'>
                            {btnText}
                        </Button>
                    )}
                </div>
            )}
        </div>
    </section>
);

// --- COMPOSANT PRINCIPAL ---

const Home = () => {
    // 1. Hooks & State
    const { trips, loading: loadingTrips, listPublicTrips } = useTrips();
    const { user, defaultCountry, loading: authLoading } = useAuth();
    const { theme } = useColorScheme();
    const { getReservationsWithStatus } = useReservation();
    
    const [pendingReservations, setPendingReservations] = useState([]); 
    const [loadingReservations, setLoadingReservations] = useState(false); 

    // 2. Computed Values
    const currentCountry = user?.country || defaultCountry?.countryName;
    const tripItems = trips || [];
    
    const colors = useMemo(() => ({
        pageBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white/5',
        sectionBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        lightBg: theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50',
        text: theme === 'dark' ? 'text-white' : 'text-gray-900',
        paragraph: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        border: theme === 'dark' ? 'border-gray-800' : 'border-gray-100',
    }), [theme]);

    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Adapté pour un affichage plus aéré
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <ArrowButton direction="right" theme={theme} />,
        prevArrow: <ArrowButton direction="left" theme={theme} />,
        autoplay: false,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true, centerPadding: '20px' } }
        ]
    }), [theme]);

    // 3. Effects
    useEffect(() => {
        if (authLoading) return;
        
        const countryCode = user?.country || defaultCountry?.countryCode;
        
        if (countryCode) {
            listPublicTrips({
                page: 1,
                tripStatus: 0,
                country: countryCode,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, user, defaultCountry]); 

    useEffect(() => {
        const loadPendingReservations = async () => {
            if (!user || authLoading) return;

            setLoadingReservations(true);
            try {
                const STATUS_FILTER = 0; 
                const response = await getReservationsWithStatus(1, STATUS_FILTER);
                
                if (response && response.items) {
                    const latest = response.items.slice(0, 4).map(item => ({
                        ...item,
                        totalPrice: item.trip.pricePerPlace * item.reservation.numberReservedPlaces,
                    }));
                    setPendingReservations(latest);
                }
            } catch (err) {
                console.error("Erreur réservations:", err);
                toast.error("Impossible de charger vos réservations.");
            } finally {
                setLoadingReservations(false);
            }
        };

        loadPendingReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading]); 

    // 4. Render
    return (
        <div className={`${colors.pageBg} transition-colors duration-300 min-h-screen font-sans`}>
            <HeroSection 
                label="BIENVENUE SUR KOMBICAR"
                showCountrySelect={!user && !authLoading && !!defaultCountry} 
                currentCountry={currentCountry}
            />

            <main className={`${SECTION_PADDING} pt-40 lg:pt-32 pb-16`}>
                
                {/* --- SECTION: Réservations Actives --- */}
                {user && (
                    <section className='mb-32 max-w-7xl mx-auto'>
                        <h2 className={`font-bold text-2xl sm:text-3xl mb-8 ${colors.text}`}>
                            <FontAwesomeIcon icon={faClock} className="mr-3 text-kombigreen-500" />
                            Vos Trajets et Réservations Actives
                        </h2>
                        
                        {loadingReservations ? (
                            <div className="flex justify-center py-10">
                                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-gray-400" />
                            </div>
                        ) : pendingReservations.length === 0 ? (
                            <div className={`${colors.sectionBg} border ${colors.border} p-10 rounded-3xl shadow-sm text-center`}>
                                <p className={`${colors.paragraph} text-[15px] mb-6`}>
                                    Vous n'avez aucune réservation ou aucun trajet confirmé en cours.
                                </p>
                                <Link to="/results">
                                    <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3 font-semibold shadow-md'>
                                        Rechercher un trajet
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {pendingReservations.map((r) => (
                                    <div key={r.reservation.id} className={`${colors.sectionBg} border ${colors.border} p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                                        <h4 className={`font-bold text-lg mb-3 ${colors.text}`}>
                                            {r.departureArea.homeTownName} <FontAwesomeIcon icon={faArrowRight} className="text-gray-300 mx-2 text-sm" /> {r.arrivalArea.homeTownName}
                                        </h4>
                                        <div className={`space-y-2 mb-5 ${colors.paragraph} text-sm`}>
                                            <p><FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" /> Départ : {dayjs(r.trip.departureDate).format('DD MMM YYYY à HH:mm')}</p>
                                            <p><FontAwesomeIcon icon={faUserTag} className="mr-2 text-gray-400" /> {r.reservation.numberReservedPlaces} place(s) réservée(s)</p>
                                        </div>
                                        <Link to={`/profile/reservations`}>
                                            <Button className='w-full text-sm px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-medium'>
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-green-500" />
                                                Détails & Actions
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* --- SECTION: Comment ça marche --- */}
                <section className='mb-32 max-w-6xl mx-auto'>
                    <h2 className={`text-center font-bold text-3xl sm:text-4xl mb-16 ${colors.text}`}>Comment ça marche ?</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800'>
                        <CleanCard icon={faSearch} color="blue" title="Trouvez votre trajet" description="Recherchez des trajets de covoiturage ou des taxis vers votre destination." theme={theme} />
                        <CleanCard icon={faTicket} color="yellow" title="Réservez votre place" description="Sélectionnez le trajet qui vous convient et réservez votre place en quelques clics." theme={theme} />
                        <CleanCard icon={faCar} color="green" title="Voyagez en toute sérénité" description="Rendez-vous au point de départ, rencontrez votre chauffeur et profitez du voyage." theme={theme} />
                    </div>
                </section>

                {/* --- SECTION: Avantages --- */}
                <section className={`mb-32 py-20 rounded-3xl ${colors.lightBg}`}>
                    <div className='max-w-6xl mx-auto'>
                        <h2 className={`text-center font-bold text-3xl sm:text-4xl mb-16 ${colors.text}`}>Pourquoi choisir Kombicar ?</h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            <CleanCard icon={faCoins} color="green" title="Économisez sur vos trajets" description="Partagez les coûts, réduisez vos dépenses et profitez de tarifs abordables." theme={theme} />
                            <CleanCard icon={faBoltLightning} color="yellow" title="Réservez en un éclair" description="Trouvez et réservez votre place en quelques clics. Votre prochain voyage n'attend pas !" theme={theme} />
                            <CleanCard icon={faNewspaper} color="blue" title="Voyagez en toute confiance" description="Bénéficiez d'un support dédié et de profils vérifiés pour des trajets sereins." theme={theme} />
                        </div>
                    </div>
                </section>

                {/* --- SECTION: Covoiturage vs Taxi --- */}
                <section className='mb-32 max-w-5xl mx-auto'>
                    <h2 className={`text-center font-bold text-3xl sm:text-4xl mb-12 ${colors.text}`}>Covoiturage ou Taxi : choisissez votre option</h2>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className={`flex-1 p-10 rounded-3xl border ${colors.border} ${colors.sectionBg} text-center hover:shadow-lg transition-shadow`}>
                            <h3 className={`font-bold text-2xl mb-4 ${colors.text}`}>Covoiturage</h3>
                            <p className={`text-[15px] mb-8 ${colors.paragraph}`}>Partagez les frais et faites de nouvelles rencontres.</p>
                            <Link to="/covoiturage">
                                <Button className='w-full sm:w-auto px-8 py-3.5 rounded-full bg-kombigreen-500 text-white font-semibold hover:bg-kombigreen-600'>
                                    Rechercher un covoiturage
                                </Button>
                            </Link>
                        </div>
                        <div className={`flex-1 p-10 rounded-3xl border ${colors.border} ${colors.sectionBg} text-center hover:shadow-lg transition-shadow`}>
                            <h3 className={`font-bold text-2xl mb-4 ${colors.text}`}>Taxi</h3>
                            <p className={`text-[15px] mb-8 ${colors.paragraph}`}>Service rapide et adapté à tous vos déplacements, en ville ou hors ville.</p>
                            <Button 
                                onClick={() => toast.error('Service de taxi non disponible pour le moment.')} 
                                className='w-full sm:w-auto px-8 py-3.5 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600'>
                                Réserver un taxi
                            </Button>
                        </div>
                    </div>
                </section>

                {/* --- SECTIONS: Info / Marketing --- */}
                <InfoSection 
                    title="Simplifiez chaque déplacement, voyagez malin avec Kombicar"
                    text="Finis les tracas des transports ! Kombicar rend le covoiturage simple et accessible. Connectez-vous avec des voyageurs fiables et profitez d'une nouvelle façon de vous déplacer."
                    imageSrc="/default/solve.png"
                    imageAlt="Personne résolvant un problème"
                    btnText="Découvrir nos services"
                    theme={theme}
                />

                <InfoSection 
                    title="Votre sécurité, notre priorité. Voyagez sereinement."
                    text="Nous nous engageons à construire une communauté de confiance où chaque membre est vérifié. Profitez d'une expérience de voyage agréable et fiable."
                    imageSrc="/default/car-women.png"
                    imageAlt="Personnes dans une voiture"
                    btnText="En savoir plus sur la sécurité"
                    theme={theme}
                    reverse={true}
                />
            </main>

            {/* --- SECTION: Itinéraires Fréquents (Rendu plus clair, fond blanc/gris très léger) --- */}
            <section className={`py-20 border-t ${colors.border} ${colors.lightBg}`}>
                <div className={`max-w-7xl mx-auto ${SECTION_PADDING}`}>
                    <h3 className={`font-bold text-2xl sm:text-3xl mb-10 ${colors.text}`}>Découvrez les Trajets Fréquents</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {loadingTrips ? (
                            <p className={`${colors.paragraph}`}>Chargement des itinéraires...</p>
                        ) : tripItems.length === 0 ? (
                            <p className={`${colors.paragraph}`}>Aucun itinéraire fréquent trouvé.</p>
                        ) : (
                            tripItems.map((tripData) => (
                                <Link 
                                    to={`/trip-detail/${tripData.trip.id}`} 
                                    key={tripData.trip.id} 
                                    className={`p-5 rounded-2xl border ${colors.border} ${colors.sectionBg} flex justify-between items-center group transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer`}
                                >
                                    <div className={`flex items-center gap-3 ${colors.text}`}>
                                        <p className='font-semibold text-[15px]'>{truncateLocationName(tripData.departureArea?.homeTownName)}</p>
                                        <FontAwesomeIcon icon={faArrowRight} className='text-sm text-gray-400 group-hover:text-blue-500 transition-colors' />
                                        <p className='font-semibold text-[15px]'>{truncateLocationName(tripData.arrivalArea?.homeTownName)}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className='text-gray-300 group-hover:text-blue-500 transition-colors' />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- SECTION: Slider --- */}
            <section className={`py-24 ${SECTION_PADDING} text-center ${colors.pageBg}`}>
                <h2 className={`font-bold text-3xl sm:text-4xl mb-16 ${colors.text}`}>
                    Explorez nos itinéraires les plus recherchés
                </h2>
                <div className='relative max-w-7xl mx-auto'>
                    {!loadingTrips && tripItems.length > 0 && (
                        tripItems.length > 1 ? (
                            <Slider {...sliderSettings} className="-mx-3">
                                {tripItems.map((tripData) => (
                                    <div key={tripData.trip.id} className="px-3 py-4">
                                        <TripCard trip={tripData} />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className="flex justify-center">
                                <div className="px-3">
                                    <TripCard trip={tripItems[0]} />
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* --- CTA: Conducteurs (Bannière épurée) --- */}
            <section className={`py-20 ${colors.lightBg} border-t ${colors.border}`}>
                <div className={`max-w-6xl mx-auto ${SECTION_PADDING} flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10`}>
                    <div className='md:w-2/3'>
                        <h2 className={`font-bold text-3xl sm:text-4xl mb-4 ${colors.text}`}>Vous êtes un conducteur ?</h2>
                        <p className={`text-[17px] ${colors.paragraph}`}>
                            Partagez votre trajet, réduisez vos frais et rencontrez de nouvelles personnes.
                        </p>
                    </div>
                    <div className='md:w-1/3 flex justify-center md:justify-end'>
                        <Link to="/publish-trip">
                            <Button className='px-8 py-4 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 shadow-md transition-all'>
                                Publier mon trajet
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* --- CTA: Profil --- */}
            <section className={`py-24 text-center ${colors.pageBg}`}>
                <div className={`max-w-3xl mx-auto ${SECTION_PADDING}`}>
                    <h2 className={`font-bold text-3xl sm:text-4xl mb-6 ${colors.text}`}>Votre espace personnel</h2>
                    <p className={`text-[17px] mb-10 ${colors.paragraph}`}>
                        Gérez vos trajets, suivez vos réservations et construisez votre réputation au sein de la communauté Kombicar.
                    </p>
                    <Link to="/profile">
                        <Button className='px-10 py-4 rounded-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all'>
                            Gérer mon profil
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;