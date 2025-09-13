import React, { useEffect } from 'react';
import HeroSection from '../Components/page-components/HeroSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Ajout des icônes pour la nouvelle section "Comment ça marche ?"
import { faArrowRight, faBoltLightning, faCoins, faNewspaper, faChevronLeft, faChevronRight, faSearch, faTicket, faCar } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/ui/Button';
import TripCard from '../Components/Cards/TripCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useTrips from '../hooks/useTrips';
import useColorScheme from '../hooks/useColorScheme';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  const { theme } = useColorScheme();
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div
      className={`${className} absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200 hidden lg:flex items-center justify-center ${bgColor} ${hoverBgColor}`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} className={`text-xl ${textColor}`} />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  const { theme } = useColorScheme();
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  
  return (
    <div
      className={`${className} absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 rounded-full shadow-lg cursor-pointer transition-colors duration-200 hidden lg:flex items-center justify-center ${bgColor} ${hoverBgColor}`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} className={`text-xl ${textColor}`} />
    </div>
  );
};

const Home = () => {
  const { trips, loading, error, listPublicTrips } = useTrips();
const truncateLocationName = (name) => {
    const maxLength = 12; // La limite de caractères
    if (name && name.length > maxLength) {
      return `${name.substring(0, maxLength)}...`;
    }
    return name;
  };
  const { theme } = useColorScheme();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  useEffect(() => {
    listPublicTrips({
      page: 1,
      tripStatus: 0, // "Published" status
        });
  }, []);

  console.log(trips)
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : '';
  const sectionBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const paragraphColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  const tripItems = trips || [];

  return (
    <div className={`${pageBgColor} ${textColor} transition-colors duration-300`}>
      <HeroSection label={"BIENVENUE SUR KOMBICAR"} />

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-16 mt-[250px] lg:mt-[100px]'>
        
        {/* ==================================== */}
        {/* NOUVELLE SECTION: Comment ça marche ? */}
        {/* ==================================== */}
        <section className='mb-24 max-w-7xl mx-auto'>
            <h2 className={`text-center font-extrabold text-3xl sm:text-4xl mb-12 ${textColor}`}>Comment ça marche ?</h2>
            <div className='flex flex-col md:flex-row justify-between gap-8 text-center'>
                <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
                    <FontAwesomeIcon icon={faSearch} className='text-5xl text-blue-500 mb-4' />
                    <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Trouvez votre trajet</h4>
                    <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
                        Recherchez des trajets de covoiturage ou des taxis vers votre destination.
                    </p>
                </div>
                <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
                    <FontAwesomeIcon icon={faTicket} className='text-5xl text-yellow-500 mb-4' />
                    <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Réservez votre place</h4>
                    <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
                        Sélectionnez le trajet qui vous convient et réservez votre place en quelques clics.
                    </p>
                </div>
                <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
                    <FontAwesomeIcon icon={faCar} className='text-5xl text-green-500 mb-4' />
                    <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Voyagez en toute sérénité</h4>
                    <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
                        Rendez-vous au point de départ, rencontrez votre chauffeur et profitez du voyage.
                    </p>
                </div>
            </div>
        </section>

        {/* ==================================== */}
        {/* Ancienne Section: Avantages Clés */}
        {/* ==================================== */}
        <section className='max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 text-center md:text-left mb-24'>
          <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
            <FontAwesomeIcon icon={faCoins} className='text-5xl text-green-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Économisez sur vos trajets</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Partagez les coûts, réduisez vos dépenses et profitez de tarifs abordables pour toutes vos destinations.
            </p>
          </div>
          <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
            <FontAwesomeIcon icon={faBoltLightning} className='text-5xl text-yellow-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Réservez en un éclair</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Trouvez et réservez votre place en quelques clics. Votre prochain voyage n'attend pas !
            </p>
          </div>
          <div className={`md:w-1/3 p-6 rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
            <FontAwesomeIcon icon={faNewspaper} className='text-5xl text-blue-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Voyagez en toute confiance</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Bénéficiez d'un support dédié et de profils vérifiés pour des trajets sereins et sécurisés.
            </p>
          </div>
        </section>

        {/* ==================================== */}
        {/* NOUVELLE SECTION: Covoiturage vs Taxi */}
        {/* ==================================== */}
        <section className='max-w-7xl mx-auto w-full mb-24'>
            <h2 className={`text-center font-extrabold text-3xl sm:text-4xl mb-12 ${textColor}`}>Covoiturage ou Taxi : choisissez votre option</h2>
            <div className='flex flex-col md:flex-row justify-between gap-8 text-center'>
                <div className={`md:w-1/2 p-8 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
                    <h3 className='font-bold text-2xl mb-4 text-gray-800 dark:text-gray-100'>Covoiturage</h3>
                    <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300 mb-6'>
                        Partagez les frais de voyage et réduisez vos dépenses sur les longs trajets tout en faisant de nouvelles rencontres.
                    </p>
                    <Link to="/covoiturage">
                        <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300'>
                            Rechercher un covoiturage
                        </Button>
                    </Link>
                </div>
                <div className={`md:w-1/2 p-8 rounded-2xl shadow-xl flex flex-col items-center transform hover:scale-105 transition-transform duration-300 ${sectionBgColor}`}>
                    <h3 className='font-bold text-2xl mb-4 text-gray-800 dark:text-gray-100'>Taxi</h3>
                    <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300 mb-6'>
                        Réservez un taxi en un clic pour un service rapide et adapté à tous vos déplacements, en ville ou hors de la ville.
                    </p>
                        <Button 
                         onClick={() => toast.error('Service de taxi non disponible pour le moment. Nous travaillons à le rendre opérationnel !')} 
                        className='px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-300'>
                            Réserver un taxi
                        </Button>
                </div>
            </div>
        </section>

        {/* ==================================== */}
        {/* Ancienne Section: Texte et Image - Simplicité */}
        {/* ==================================== */}
        <section className='mt-24 flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto mb-24'>
          <img
            src="/default/solve.png"
            alt="Personne résolvant un problème, métaphore de la simplicité"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColor} leading-tight`}>
              Simplifiez chaque déplacement, voyagez malin avec Kombicar
            </h2>
            <p className={`leading-relaxed text-lg mb-8 ${paragraphColor}`}>
              Finis les tracas des transports ! Kombicar rend le covoiturage au Cameroun simple et accessible. Trouvez ou proposez des trajets en quelques clics, connectez-vous avec des voyageurs fiables et profitez d'une nouvelle façon de vous déplacer, économique et conviviale.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'>
                Découvrir nos services
              </Button>
            </div>
          </div>
        </section>

        {/* ==================================== */}
        {/* Ancienne Section: Texte et Image - Sécurité et Communauté */}
        {/* ==================================== */}
        <section className='mt-24 flex flex-col md:flex-row-reverse gap-12 items-center max-w-7xl mx-auto mb-24'>
          <img
            src="/default/car-women.png"
            alt="Personnes souriantes dans une voiture, illustrant la convivialité et la sécurité"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColor} leading-tight`}>
              Votre sécurité, notre priorité. Voyagez sereinement.
            </h2>
            <p className={`leading-relaxed text-lg mb-8 ${paragraphColor}`}>
              Chez Kombicar, chaque trajet est pensé pour votre tranquillité. Nous nous engageons à construire une communauté de confiance où chaque membre est vérifié et évalué. Profitez d'une expérience de voyage agréable et fiable, à chaque fois.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'>
                En savoir plus sur la sécurité
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ==================================== */}
      {/* Ancienne Section: Itinéraires Fréquents */}
      {/* ==================================== */}
      <section className='w-full text-left bg-emerald-800 py-12 px-4 sm:px-6 lg:px-12 xl:px-24 mt-24 dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto'>
          <h3 className='text-white font-bold text-3xl sm:text-4xl mb-10'>Découvrez les Trajets Fréquents</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {loading ? (
              <p className="text-gray-300">Chargement des itinéraires...</p>
            ) : tripItems.length === 0 ? (
              <p className="text-gray-300">Aucun itinéraire fréquent trouvé.</p>
            ) : (
              tripItems.map((tripData) => (
                <Link to={`/trip-detail/${tripData.trip.id}`} key={tripData.trip.id} className={`p-6 rounded-lg shadow-md flex justify-between items-center group transition-colors duration-200 cursor-pointer hover:bg-emerald-700 dark:hover:bg-gray-700 ${sectionBgColor}`}>
                  <div className='flex items-center gap-4 text-gray-800 dark:text-gray-100 group-hover:text-white'>
                    <p className='font-semibold'>{truncateLocationName(tripData.departureArea?.homeTownName || 'N/A')}</p>
                    <FontAwesomeIcon icon={faArrowRight} className='text-lg text-gray-500 group-hover:translate-x-1 transition-transform dark:text-gray-400 group-hover:text-white' />
                    <p className='font-semibold'>{truncateLocationName(tripData.arrivalArea?.homeTownName || 'N/A')}</p>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className='text-xl text-gray-500 group-hover:text-green-500 transition-colors dark:text-gray-400' />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ==================================== */}
      {/* Ancienne Section: Slider des Trajets Populaires */}
      {/* ==================================== */}
      <section className='py-20 px-4 sm:px-6 lg:px-12 xl:px-24 text-center bg-gray-50 dark:bg-gray-900'>
        <h2 className='font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 text-gray-800 dark:text-gray-100'>
          Explorez nos itinéraires les plus recherchés
        </h2>
        <div className='relative max-w-7xl mx-auto'>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Chargement des trajets...</p>
          ) : tripItems.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Aucune donnée trouvée.</p>
          ) : (
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
                <div key={tripItems[0].trip.id} className="px-3">
                  <TripCard trip={tripItems[0]} />
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ==================================== */}
      {/* NOUVELLE SECTION: Appel à l'action pour les conducteurs */}
      {/* ==================================== */}
      <section className='mt-24 bg-gray-100 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-12 xl:px-24'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left'>
            <div className='md:w-3/4'>
                <h2 className={`font-extrabold text-3xl sm:text-4xl mb-4 ${textColor}`}>Vous êtes un conducteur ?</h2>
                <p className={`leading-relaxed text-lg mb-8 ${paragraphColor}`}>
                    Partagez votre trajet, réduisez vos frais de déplacement et rencontrez de nouvelles personnes. C'est simple et rapide.
                </p>
            </div>
            <div className='md:w-1/4 text-center md:text-right'>
                <Link to="/publish-trip">
                    <Button className='px-8 py-4 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105'>
                        Publier mon trajet
                    </Button>
                </Link>
            </div>
        </div>
      </section>
      
      {/* ==================================== */}
{/* NOUVELLE SECTION: Gestion du Profil */}
{/* ==================================== */}
<section className='mt-24 bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-12 xl:px-24'>
    <div className='max-w-7xl mx-auto text-center'>
        <h2 className={`font-extrabold text-3xl sm:text-4xl mb-4 ${textColor}`}>
            Votre espace personnel
        </h2>
        <p className={`leading-relaxed text-lg mb-8 max-w-2xl mx-auto ${paragraphColor}`}>
            Gérez vos trajets, suivez vos réservations et construisez votre réputation au sein de la communauté Kombicar. Votre profil est la clé d'une expérience de voyage personnalisée.
        </p>
        <Link to="/profile">
            <Button className='px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105'>
                Gérer mon profil
            </Button>
        </Link>
    </div>
</section>


      {/* ==================================== */}
      {/* Ancienne Section: Carte du Cameroun */}
      {/* ==================================== */}
      <section className='mt-24 flex flex-col md:flex-row gap-12 items-center px-4 sm:px-6 lg:px-12 xl:px-24 pb-20 max-w-7xl mx-auto'>
        <img
          src="/default/map-cameroon.png"
          alt="Carte du Cameroun avec les principales villes"
          className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
        />
        <div className='w-full md:w-1/2 md:p-8'>
          <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColor} leading-tight`}>
            Le Cameroun à portée de main avec Kombicar
          </h2>
          <p className={`leading-relaxed text-lg mb-8 ${paragraphColor}`}>
            Que vous voyagiez pour le travail, les études ou les loisirs, Kombicar vous connecte aux villes clés du Cameroun. Découvrez de nouvelles régions et vivez des expériences authentiques grâce à notre réseau de covoiturage fiable et étendu.
          </p>
          <div className='text-center md:text-left'>
            
              <Link to="/results">
            <Button className='px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75'>
              Voir toutes nos destinations
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;