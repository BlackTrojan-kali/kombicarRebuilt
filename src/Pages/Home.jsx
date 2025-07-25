import React from 'react';
import HeroSection from '../Components/page-components/HeroSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBoltLightning, faCoins, faNewspaper, faChevronLeft, faChevronRight, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/ui/Button';
import TripCard from '../Components/Cards/TripCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Composants de flèches personnalisées pour le slider
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 hidden lg:flex items-center justify-center dark:bg-gray-800 dark:hover:bg-gray-700`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} className="text-xl text-gray-700 dark:text-gray-300" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 hidden lg:flex items-center justify-center dark:bg-gray-800 dark:hover:bg-gray-700`}
      style={{ ...style, display: "flex" }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-xl text-gray-700 dark:text-gray-300" />
    </div>
  );
};

const Home = () => {
  // Paramètres du slider pour les trajets populaires
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
        breakpoint: 1280, // xl breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024, // lg breakpoint
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // md breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px',
        }
      }
    ]
  };

  // Données de trajets pour le slider (plus complètes pour la démo)
  const tripsData = [
    { thumbnail: "/default/city-1.jpg", depart: "Yaoundé", arrive: "Douala", prix: 4000, chauffeur: { nom: "Yassine", trajets_effectues: 20 }, distance: 240 },
    { thumbnail: "/default/city-2.jpg", depart: "Douala", arrive: "Bafoussam", prix: 3500, chauffeur: { nom: "Fatima", trajets_effectues: 15 }, distance: 280 },
    { thumbnail: "/default/city-3.jpg", depart: "Yaoundé", arrive: "Kribi", prix: 5000, chauffeur: { nom: "Jean", trajets_effectues: 10 }, distance: 180 },
   ];

  return (
    // Supprimé la classe `bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300` ici
    <div>
      <HeroSection label={"bienvenue sur kombicar"}/>

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-16 mt-[250px] lg:mt-[100px]'>
        {/* --- */}
        {/* Section des Avantages Clés */}
        <section className='max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 text-center md:text-left mb-24'>
          <div className='md:w-1/3 p-6 bg-white rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800'>
            <FontAwesomeIcon icon={faCoins} className='text-5xl text-green-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Économisez sur vos trajets</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Partagez les coûts, réduisez vos dépenses et profitez de tarifs abordables pour toutes vos destinations.
            </p>
          </div>
          <div className='md:w-1/3 p-6 bg-white rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800'>
            <FontAwesomeIcon icon={faBoltLightning} className='text-5xl text-yellow-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Réservez en un éclair</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Trouvez et réservez votre place en quelques clics. Votre prochain voyage n'attend pas !
            </p>
          </div>
          <div className='md:w-1/3 p-6 bg-white rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800'>
            <FontAwesomeIcon icon={faNewspaper} className='text-5xl text-blue-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Voyagez en toute confiance</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Bénéficiez d'un support dédié et de profils vérifiés pour des trajets sereins et sécurisés.
            </p>
          </div>
        </section>

        {/* --- */}
        {/* Section Texte et Image : Simplicité */}
        <section className='mt-24 flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto mb-24'>
          <img
            src="/default/solve.png"
            alt="Personne résolvant un problème, métaphore de la simplicité"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className='font-extrabold text-3xl sm:text-4xl mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
              Simplifiez chaque déplacement, voyagez malin avec Kombicar
            </h2>
            <p className='text-gray-700 leading-relaxed text-lg mb-8 dark:text-gray-300'>
              Finis les tracas des transports ! Kombicar rend le covoiturage au Cameroun simple et accessible. Trouvez ou proposez des trajets en quelques clics, connectez-vous avec des voyageurs fiables et profitez d'une nouvelle façon de vous déplacer, économique et conviviale.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'>
                Découvrir nos services
              </Button>
            </div>
          </div>
        </section>

        {/* --- */}
        {/* Section Texte et Image (inversée) : Sécurité et Communauté */}
        <section className='mt-24 flex flex-col md:flex-row-reverse gap-12 items-center max-w-7xl mx-auto mb-24'>
          <img
            src="/default/car-women.png"
            alt="Personnes souriantes dans une voiture, illustrant la convivialité et la sécurité"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className='font-extrabold text-3xl sm:text-4xl mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
              Votre sécurité, notre priorité. Voyagez sereinement.
            </h2>
            <p className='text-gray-700 leading-relaxed text-lg mb-8 dark:text-gray-300'>
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

      {/* --- */}
      {/* Section des Itinéraires Populaires */}
      <section className='w-full text-left bg-emerald-800 py-12 px-4 sm:px-6 lg:px-12 xl:px-24 mt-24 dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto'>
          <h3 className='text-white font-bold text-3xl sm:text-4xl mb-10'>Découvrez les Trajets Fréquents</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {['Yaoundé - Douala', 'Douala - Bafoussam', 'Yaoundé - Kribi', 'Bafoussam - Limbe', 'Douala - Edea', 'Yaoundé - Garoua'].map((route, index) => (
              <a href="#" key={index} className='bg-white p-6 rounded-lg shadow-md flex justify-between items-center group hover:bg-gray-50 transition-colors duration-200 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600'>
                <div className='flex items-center gap-4 text-gray-800 dark:text-gray-100'>
                  <p className='font-semibold'>{route.split(' - ')[0]}</p>
                  <FontAwesomeIcon icon={faArrowRight} className='text-lg text-gray-500 group-hover:translate-x-1 transition-transform dark:text-gray-400' />
                  <p className='font-semibold'>{route.split(' - ')[1]}</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className='text-xl text-gray-500 group-hover:text-green-500 transition-colors dark:text-gray-400' />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}
      {/* Slider des Trajets Populaires */}
      <section className='py-20 px-4 sm:px-6 lg:px-12 xl:px-24 text-center bg-gray-50 dark:bg-gray-900'>
        <h2 className='font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 text-gray-800 dark:text-gray-100'>
          Explorez nos itinéraires les plus recherchés
        </h2>
        <div className='relative max-w-7xl mx-auto'>
          <Slider {...sliderSettings}>
            {tripsData.map((tripData, index) => (
              <div key={index} className="px-3">
                <TripCard trip={tripData} />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* --- */}
      {/* Section Carte du Cameroun */}
      <section className='mt-24 flex flex-col md:flex-row gap-12 items-center px-4 sm:px-6 lg:px-12 xl:px-24 pb-20 max-w-7xl mx-auto'>
        <img
          src="/default/map-cameroon.png"
          alt="Carte du Cameroun avec les principales villes"
          className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
        />
        <div className='w-full md:w-1/2 md:p-8'>
          <h2 className='font-extrabold text-3xl sm:text-4xl mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
            Le Cameroun à portée de main avec Kombicar
          </h2>
          <p className='text-gray-700 leading-relaxed text-lg mb-8 dark:text-gray-300'>
            Que vous voyagiez pour le travail, les études ou les loisirs, Kombicar vous connecte aux villes clés du Cameroun. Découvrez de nouvelles régions et vivez des expériences authentiques grâce à notre réseau de covoiturage fiable et étendu.
          </p>
          <div className='text-center md:text-left'>
            <Button className='px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75'>
              Voir toutes nos destinations
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;