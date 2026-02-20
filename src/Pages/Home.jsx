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

// --- SOUS-COMPOSANTS UI (Pour alléger le composant principal) ---

const ArrowButton = ({ onClick, direction, theme }) => {
    const isDark = theme === 'dark';
    const classes = `absolute top-1/2 -translate-y-1/2 z-10 p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200 hidden lg:flex items-center justify-center 
        ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-100 text-gray-700'}`;
    
    return (
        <div 
            className={`${classes} ${direction === 'left' ? 'left-4' : 'right-4'}`} 
            onClick={onClick}
        >
            <FontAwesomeIcon icon={direction === 'left' ? faChevronLeft : faChevronRight} className="text-xl" />
        </div>
    );
};

const FeatureCard = ({ icon, title, description, colorClass, theme }) => (
    <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        <FontAwesomeIcon icon={icon} className={`text-5xl mb-4 ${colorClass}`} />
        <h4 className='font-bold text-xl mb-2'>{title}</h4>
        <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {description}
        </p>
    </div>
);

const StepCard = ({ icon, title, description, colorClass, theme }) => (
    <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        <FontAwesomeIcon icon={icon} className={`text-5xl mb-4 ${colorClass}`} />
        <h4 className='font-bold text-xl mb-2'>{title}</h4>
        <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {description}
        </p>
    </div>
);

const InfoSection = ({ title, text, imageSrc, imageAlt, btnText, btnLink, theme, reverse = false }) => (
    <section className={`mt-24 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center max-w-7xl mx-auto mb-24`}>
        <img
            src={imageSrc}
            alt={imageAlt}
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
        />
        <div className='w-full md:w-1/2 md:p-8'>
            <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 leading-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                {title}
            </h2>
            <p className={`leading-relaxed text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {text}
            </p>
            {btnText && (
                <div className='text-center md:text-left'>
                    {btnLink ? (
                         <Link to={btnLink}>
                            <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105'>
                                {btnText}
                            </Button>
                         </Link>
                    ) : (
                        <Button className='px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105'>
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
    // Note: On extrait listPublicTrips mais on NE L'AJOUTE PAS aux dépendances du useEffect
    const { trips, loading: loadingTrips, listPublicTrips } = useTrips();
    const { user, defaultCountry, loading: authLoading } = useAuth();
    const { theme } = useColorScheme();
    const { getReservationsWithStatus } = useReservation();
    
    const [pendingReservations, setPendingReservations] = useState([]); 
    const [loadingReservations, setLoadingReservations] = useState(false); 

    // 2. Computed Values (Styles & Data)
    const currentCountry = user?.country || defaultCountry?.countryName;
    const tripItems = trips || [];
    
    // Utilisation de useMemo pour éviter de recalculer les objets de style à chaque render
    const colors = useMemo(() => ({
        pageBg: theme === 'dark' ? 'bg-gray-900' : '',
        sectionBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
        text: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        paragraph: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        border: theme === 'dark' ? 'border-gray-700' : '',
    }), [theme]);

    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <ArrowButton direction="right" theme={theme} />,
        prevArrow: <ArrowButton direction="left" theme={theme} />,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: '20px' } }
        ]
    }), [theme]);

    // 3. Effects

    // CORRECTION ICI : listPublicTrips retiré des dépendances pour éviter la boucle infinie
    useEffect(() => {
        if (authLoading) return;
        
        const countryCode = user?.country || defaultCountry?.countryCode;
        
        if (countryCode) {
            listPublicTrips({
                page: 1,
                tripStatus: 0, // Published
                country: countryCode,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, user, defaultCountry]); 

    // Charger les réservations actives
    useEffect(() => {
        const loadPendingReservations = async () => {
            if (!user || authLoading) return;

            setLoadingReservations(true);
            try {
                const STATUS_FILTER = 0; // Ajuster selon votre logique métier (0 = en attente, 1 = confirmé ?)
                // Assurez-vous que getReservationsWithStatus est stable ou ne cause pas de re-render
                const response = await getReservationsWithStatus(1, STATUS_FILTER);
                
                // Protection contre les réponses vides ou mal formées
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
    }, [user, authLoading]); // getReservationsWithStatus retiré pour sécurité


    // 4. Render
    return (
        <div className={`${colors.pageBg} ${colors.text} transition-colors duration-300 pb-20`}>
            <HeroSection 
                label="BIENVENUE SUR KOMBICAR"
                showCountrySelect={!user && !authLoading && !!defaultCountry} 
                currentCountry={currentCountry}
            />

            <main className={`${SECTION_PADDING} py-16 mt-[250px] lg:mt-[100px]`}>
                
                {/* --- SECTION: Réservations Actives --- */}
                {user && (
                    <section className='mb-24 max-w-7xl mx-auto'>
                        <h2 className={`font-extrabold text-3xl sm:text-4xl mb-8 ${colors.text}`}>
                            <FontAwesomeIcon icon={faClock} className="mr-3 text-red-500" />
                            Vos Trajets et Réservations Actives
                        </h2>
                        
                        {loadingReservations ? (
                            <div className="flex justify-center py-10">
                                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-blue-500" />
                            </div>
                        ) : pendingReservations.length === 0 ? (
                            <div className={`${colors.sectionBg} border ${colors.border} p-6 rounded-lg shadow-xl text-center`}>
                                <p className={`${colors.paragraph} text-lg`}>
                                    Vous n'avez aucune réservation ou aucun trajet confirmé en cours.
                                </p>
                                <Link to="/results" className='mt-4 inline-block'>
                                    <Button className='bg-blue-500 hover:bg-blue-600 px-6 py-2'>Rechercher un trajet</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {pendingReservations.map((r) => (
                                    <div key={r.reservation.id} className={`${colors.sectionBg} border ${colors.border} p-5 rounded-xl shadow-md`}>
                                        <h4 className='font-bold text-xl mb-2 text-blue-500'>
                                            {r.departureArea.homeTownName} → {r.arrivalArea.homeTownName}
                                        </h4>
                                        <p className={`${colors.paragraph} text-sm mb-1`}>
                                            <FontAwesomeIcon icon={faClock} className="mr-2 text-yellow-500" />
                                            Départ : {dayjs(r.trip.departureDate).format('DD MMM à HH:mm')}
                                        </p>
                                        <p className={`${colors.paragraph} text-sm mb-3`}>
                                            <FontAwesomeIcon icon={faUserTag} className="mr-2 text-green-500" />
                                            {r.reservation.numberReservedPlaces} place(s) réservée(s)
                                        </p>
                                        <Link to={`/profile/reservations`} className='mt-3 inline-block'>
                                            <Button className='text-sm px-4 py-2 bg-green-500 hover:bg-red-600'>
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
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
                <section className='mb-24 max-w-7xl mx-auto'>
                    <h2 className={`text-center font-extrabold text-3xl sm:text-4xl mb-12 ${colors.text}`}>Comment ça marche ?</h2>
                    <div className='flex flex-col md:flex-row justify-between gap-8 text-center'>
                        <StepCard icon={faSearch} colorClass="text-blue-500" title="Trouvez votre trajet" description="Recherchez des trajets de covoiturage ou des taxis vers votre destination." theme={theme} />
                        <StepCard icon={faTicket} colorClass="text-yellow-500" title="Réservez votre place" description="Sélectionnez le trajet qui vous convient et réservez votre place en quelques clics." theme={theme} />
                        <StepCard icon={faCar} colorClass="text-green-500" title="Voyagez en toute sérénité" description="Rendez-vous au point de départ, rencontrez votre chauffeur et profitez du voyage." theme={theme} />
                    </div>
                </section>

                {/* --- SECTION: Avantages --- */}
                <section className='max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 text-center md:text-left mb-24'>
                    <FeatureCard icon={faCoins} colorClass="text-green-500" title="Économisez sur vos trajets" description="Partagez les coûts, réduisez vos dépenses et profitez de tarifs abordables." theme={theme} />
                    <FeatureCard icon={faBoltLightning} colorClass="text-yellow-500" title="Réservez en un éclair" description="Trouvez et réservez votre place en quelques clics. Votre prochain voyage n'attend pas !" theme={theme} />
                    <FeatureCard icon={faNewspaper} colorClass="text-blue-500" title="Voyagez en toute confiance" description="Bénéficiez d'un support dédié et de profils vérifiés pour des trajets sereins." theme={theme} />
                </section>

                {/* --- SECTION: Covoiturage vs Taxi --- */}
                <section className='max-w-7xl mx-auto w-full mb-24'>
                    <h2 className={`text-center font-extrabold text-3xl sm:text-4xl mb-12 ${colors.text}`}>Covoiturage ou Taxi : choisissez votre option</h2>
                    <div className='flex flex-col md:flex-row justify-between gap-8 text-center'>
                        <div className={`md:w-1/2 p-8 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${colors.sectionBg}`}>
                            <h3 className={`font-bold text-2xl mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Covoiturage</h3>
                            <p className={`text-base leading-relaxed mb-6 ${colors.paragraph}`}>
                                Partagez les frais et faites de nouvelles rencontres.
                            </p>
                            <Link to="/covoiturage">
                                <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all'>Rechercher un covoiturage</Button>
                            </Link>
                        </div>
                        <div className={`md:w-1/2 p-8 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${colors.sectionBg}`}>
                            <h3 className={`font-bold text-2xl mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Taxi</h3>
                            <p className={`text-base leading-relaxed mb-6 ${colors.paragraph}`}>
                                Service rapide et adapté à tous vos déplacements, en ville ou hors ville.
                            </p>
                            <Button 
                                onClick={() => toast.error('Service de taxi non disponible pour le moment.')} 
                                className='px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all'>
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

            {/* --- SECTION: Itinéraires Fréquents --- */}
            <section className={`w-full text-left py-12 ${SECTION_PADDING} dark:bg-gray-800 bg-emerald-800`}>
                <div className='max-w-7xl mx-auto'>
                    <h3 className='text-white font-bold text-3xl sm:text-4xl mb-10'>Découvrez les Trajets Fréquents</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {loadingTrips ? (
                            <p className="text-gray-300">Chargement des itinéraires...</p>
                        ) : tripItems.length === 0 ? (
                            <p className="text-gray-300">Aucun itinéraire fréquent trouvé.</p>
                        ) : (
                            tripItems.map((tripData) => (
                                <Link 
                                    to={`/trip-detail/${tripData.trip.id}`} 
                                    key={tripData.trip.id} 
                                    className={`p-6 rounded-lg shadow-md flex justify-between items-center group transition-colors duration-200 cursor-pointer 
                                    hover:bg-emerald-700 dark:hover:bg-gray-700 ${colors.sectionBg}`}
                                >
                                    <div className={`flex items-center gap-4 group-hover:text-white ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                                        <p className='font-semibold'>{truncateLocationName(tripData.departureArea?.homeTownName)}</p>
                                        <FontAwesomeIcon icon={faArrowRight} className='text-lg text-gray-500 group-hover:translate-x-1 transition-transform group-hover:text-white' />
                                        <p className='font-semibold'>{truncateLocationName(tripData.arrivalArea?.homeTownName)}</p>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className='text-xl text-gray-500 group-hover:text-green-500 transition-colors' />
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* --- SECTION: Slider --- */}
            <section className={`py-20 ${SECTION_PADDING} text-center bg-gray-50 dark:bg-gray-900`}>
                <h2 className={`font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 ${colors.text}`}>
                    Explorez nos itinéraires les plus recherchés
                </h2>
                <div className='relative max-w-7xl mx-auto'>
                    {!loadingTrips && tripItems.length > 0 && (
                        tripItems.length > 1 ? (
                            <Slider {...sliderSettings}>
                                {tripItems.map((tripData) => (
                                    <div key={tripData.trip.id} className="px-3">
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

            {/* --- CTA: Conducteurs --- */}
            <section className={`py-20 ${SECTION_PADDING} bg-gray-100 dark:bg-gray-800`}>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left'>
                    <div className='md:w-3/4'>
                        <h2 className={`font-extrabold text-3xl sm:text-4xl mb-4 ${colors.text}`}>Vous êtes un conducteur ?</h2>
                        <p className={`leading-relaxed text-lg mb-8 ${colors.paragraph}`}>
                            Partagez votre trajet, réduisez vos frais et rencontrez de nouvelles personnes.
                        </p>
                    </div>
                    <div className='md:w-1/4 text-center md:text-right'>
                        <Link to="/publish-trip">
                            <Button className='px-8 py-4 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all transform hover:scale-105'>
                                Publier mon trajet
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* --- CTA: Profil --- */}
            <section className={`py-20 ${SECTION_PADDING} bg-gray-50 dark:bg-gray-800`}>
                <div className='max-w-7xl mx-auto text-center'>
                    <h2 className={`font-extrabold text-3xl sm:text-4xl mb-4 ${colors.text}`}>Votre espace personnel</h2>
                    <p className={`leading-relaxed text-lg mb-8 max-w-2xl mx-auto ${colors.paragraph}`}>
                        Gérez vos trajets, suivez vos réservations et construisez votre réputation au sein de la communauté Kombicar.
                    </p>
                    <Link to="/profile">
                        <Button className='px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all transform hover:scale-105'>
                            Gérer mon profil
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;     