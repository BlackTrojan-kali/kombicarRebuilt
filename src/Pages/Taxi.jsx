import React, { useEffect } from 'react';
import HeroSection from '../Components/page-components/HeroSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBoltLightning, faCoins, faUserShield, faMapLocationDot, faTaxi, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../Components/ui/Button';
import TripCard from '../Components/Cards/TripCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useTrips from '../hooks/useTrips'; // Importez le hook useTrips
import useColorScheme from '../hooks/useColorScheme'; // Importez le hook de thème

// Composants de flèches personnalisées pour le slider
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  const { theme } = useColorScheme(); // Utilisez le thème ici
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
  const { theme } = useColorScheme(); // Utilisez le thème ici
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

const Taxi = () => {
  const { trips, loading, error, fetchTrips } = useTrips(); // Utilisez le hook useTrips
  const { theme } = useColorScheme(); // Pour les couleurs de fond de la page

  // Paramètres du slider pour les trajets populaires (adaptés du composant Home)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Ajusté à 3 pour les cartes de taxi plus grandes
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
          slidesToShow: 2,
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

  // Charger les trajets au montage du composant
  useEffect(() => {
    fetchTrips();
  }, []); // Ajoutez fetchTrips comme dépendance pour éviter les avertissements ESLint

  // Définition des couleurs dynamiques pour la page
  const pageBgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const sectionBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColorPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const textColorSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';


  return (
    <div className={`${pageBgColor} ${textColorPrimary} transition-colors duration-300`}>
      {/* Hero Section for Taxi */}
      <HeroSection url='/default/carsharing-6.jpg' label="Taxi : Voyagez avec chauffeur en toute sérénité" showLogo={false} />

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-16'>

        {/* --- */}
        {/* Section des Avantages Clés du Taxi */}
        <section className='max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 text-center md:text-left mb-24'>
          <div className={`md:w-1/3 p-6 ${sectionBgColor} rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300`}>
            <FontAwesomeIcon icon={faUserShield} className='text-5xl text-blue-600 mb-4' /> {/* icône adaptée */}
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Confort et Sérénité</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Voyagez dans des véhicules modernes et bien entretenus, conduits par des chauffeurs professionnels et courtois.
            </p>
          </div>
          <div className={`md:w-1/3 p-6 ${sectionBgColor} rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300`}>
            <FontAwesomeIcon icon={faCoins} className='text-5xl text-green-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Tarifs Transparents</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Connaissez le prix de votre course à l'avance, sans surprise. Nos tarifs sont clairs et compétitifs pour tous vos trajets.
            </p>
          </div>
          <div className={`md:w-1/3 p-6 ${sectionBgColor} rounded-lg shadow-xl flex flex-col items-center md:items-start transform hover:scale-105 transition-transform duration-300`}>
            <FontAwesomeIcon icon={faBoltLightning} className='text-5xl text-yellow-500 mb-4' />
            <h4 className='font-bold text-xl mb-2 text-gray-800 dark:text-gray-100'>Service Rapide et Disponible</h4>
            <p className='text-gray-600 text-base leading-relaxed dark:text-gray-300'>
              Réservez votre Taxi en quelques clics, disponible 24h/24 et 7j/7 pour tous vos déplacements urgents ou planifiés.
            </p>
          </div>
        </section>

        {/* --- */}
        {/* Section Texte et Image : Pourquoi choisir Kombicar Taxi */}
        <section className='mt-24 flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto mb-24'>
          <img
            src="/default/carsharing-4.jpg" // Image plus pertinente pour le taxi
            alt="Intérieur d'un taxi propre et confortable"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColorPrimary} leading-tight`}>
              Voyagez sans contrainte, avec un chauffeur dédié
            </h2>
            <p className={`${textColorSecondary} leading-relaxed text-lg mb-8`}>
              Pour vos rendez-vous d'affaires, vos transferts aéroport, ou simplement pour un confort optimal, Kombicar Taxi est votre solution privilégiée. Profitez d'un service personnalisé, discret et ponctuel, adapté à tous vos besoins.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'>
                Réserver un Taxi
              </Button>
            </div>
          </div>
        </section>

        {/* --- */}
        {/* Section Texte et Image (inversée) : Sécurité et Fiabilité */}
        <section className='mt-24 flex flex-col md:flex-row-reverse gap-12 items-center mb-24 max-w-7xl mx-auto'>
          <img
            src="/default/carsharing-2.jpg" // Nouvelle image pertinente
            alt="Chauffeur de taxi souriant et passager en sécurité"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColorPrimary} leading-tight`}>
              La sécurité et la fiabilité au cœur de chaque course
            </h2>
            <p className={`${textColorSecondary} leading-relaxed text-lg mb-8`}>
              Avec Kombicar Taxi, votre tranquillité est garantie. Nos chauffeurs sont rigoureusement sélectionnés et nos véhicules sont régulièrement inspectés. Profitez d'un suivi de course en temps réel et d'un support client dédié pour une expérience sans souci.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'>
                En savoir plus sur nos engagements
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* --- */}
      {/* Slider des Trajets Taxi Populaires (Remplace la Swiper Section) */}
      <section className={`${pageBgColor} py-20 px-4 sm:px-6 lg:px-12 xl:px-24 text-center`}>
        <h2 className={`font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 ${textColorPrimary}`}>
          Découvrez nos itinéraires Taxi les plus populaires
        </h2>
        <div className='relative max-w-7xl mx-auto'>
          {loading ? (
            <p className={`${textColorSecondary}`}>Chargement des trajets taxi...</p>
          ): trips.length === 0 ? (
            <p className={`${textColorSecondary}`}>Aucun trajet taxi disponible pour le moment.</p>
          ) : (
            <Slider {...sliderSettings}>
              {trips.map((tripData) => (
                <div key={tripData.id} className="px-3">
                  <TripCard trip={tripData} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>

      {/* --- */}
      {/* FAQ Section for Taxi */}
      <section className={`py-16 px-4 sm:px-6 lg:px-12 xl:px-24 rounded-lg max-w-7xl mx-auto ${sectionBgColor} mt-24`}>
        <h1 className={`text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 ${textColorPrimary}`}>
          <FontAwesomeIcon icon={faTaxi} className='text-3xl sm:text-4xl text-red-500 mr-4' />
          Questions fréquentes sur nos services Taxi
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className={`${sectionBgColor} p-6 rounded-lg shadow-md`}>
            <h4 className={`font-bold text-xl ${textColorPrimary} mb-2`}>Comment réserver un Taxi avec Kombicar ?</h4>
            <p className={`${textColorSecondary} text-base leading-relaxed`}>
              La réservation d'un Taxi est simple et rapide. Rendez-vous sur notre application mobile ou sur le site web, choisissez votre destination, la date et l'heure souhaitées, et confirmez votre course en quelques secondes.
            </p>
          </div>
          <div className={`${sectionBgColor} p-6 rounded-lg shadow-md`}>
            <h4 className={`font-bold text-xl ${textColorPrimary} mb-2`}>Puis-je commander un Taxi à l'avance ?</h4>
            <p className={`${textColorSecondary} text-base leading-relaxed`}>
              Oui, absolument ! Vous avez la possibilité de réserver votre Taxi plusieurs heures ou même plusieurs jours à l'avance. C'est la solution idéale pour vos transferts aéroport, vos rendez-vous importants ou vos événements spéciaux.
            </p>
          </div>
          <div className={`${sectionBgColor} p-6 rounded-lg shadow-md`}>
            <h4 className={`font-bold text-xl ${textColorPrimary} mb-2`}>Quels sont les modes de paiement acceptés ?</h4>
            <p className={`${textColorSecondary} text-base leading-relaxed`}>
              Pour votre confort, nous acceptons plusieurs modes de paiement sécurisés, y compris les cartes de crédit/débit et les paiements mobiles populaires au Cameroun. Vous réglez votre course en toute simplicité.
            </p>
          </div>
          <div className={`${sectionBgColor} p-6 rounded-lg shadow-md`}>
            <h4 className={`font-bold text-xl ${textColorPrimary} mb-2`}>Les chauffeurs sont-ils qualifiés et fiables ?</h4>
            <p className={`${textColorSecondary} text-base leading-relaxed`}>
              Absolument. Tous nos chauffeurs Taxi sont des professionnels expérimentés, rigoureusement sélectionnés, titulaires des licences nécessaires et soumis à des contrôles de qualité réguliers pour garantir votre satisfaction et votre sécurité.
            </p>
          </div>
        </div>
      </section>

      {/* --- */}
      {/* Section Carte du Cameroun (ajoutée pour la cohérence) */}
      <section className='mt-24 flex flex-col md:flex-row gap-12 items-center px-4 sm:px-6 lg:px-12 xl:px-24 pb-20 max-w-7xl mx-auto'>
        <img
          src="/default/map-cameroon.png" // Réutilisation de l'image de la page d'accueil
          alt="Carte du Cameroun avec les principales villes"
          className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
        />
        <div className='w-full md:w-1/2 md:p-8'>
          <h2 className={`font-extrabold text-3xl sm:text-4xl mb-6 ${textColorPrimary} leading-tight`}>
            Le Cameroun à portée de main avec Kombicar Taxi
          </h2>
          <p className={`${textColorSecondary} leading-relaxed text-lg mb-8`}>
            Que vous ayez besoin d'une course en ville, d'un transfert interurbain ou d'un service de transport privé, Kombicar Taxi vous connecte aux villes clés du Cameroun. Profitez d'une flexibilité et d'une efficacité inégalées.
          </p>
          <div className='text-center md:text-left'>
            <Button className='px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75'>
              Voir toutes nos destinations Taxi
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile App Presentation (gardée telle quelle car déjà bien stylisée) */}
      <section className="py-16 bg-yellow-400 text-gray-700 dark:bg-yellow-700 dark:text-gray-100">
        <h1 className="text-3xl sm:text-4xl text-center font-bold mb-4">Simplifiez votre expérience</h1>
        <h2 className="text-xl sm:text-2xl text-center font-semibold mb-12">Téléchargez notre application mobile !</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 sm:px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto">
          <div className="flex justify-center flex-shrink-0">
            <img src="/default/app-kombicar.png" alt="Kombicar mobile app screenshot" className="w-[280px] md:w-[350px] shadow-xl rounded-lg object-contain transition-transform duration-300 hover:scale-[1.02]" />
          </div>
          <div className='flex flex-col items-center md:items-start gap-4'>
            <a href="https://apps.apple.com/us/app/kombicar/id6468362045" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur l'App Store">
              <button
                type="button"
                className="flex items-center justify-center w-60 py-4 text-gray-800 bg-white border border-gray-300 rounded-xl transition-all hover:bg-gray-100 shadow-md
                           dark:text-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="mr-3">
                  <svg viewBox="0 0 384 512" width="28" fill="currentColor">
                    <path
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">Téléchargez sur</div>
                  <div className="font-sans text-xl font-semibold">
                    App Store
                  </div>
                </div>
              </button>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.kombicar.app" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur Google Play">
              <button
                type="button"
                className="flex items-center justify-center w-60 py-4 text-white bg-gray-900 rounded-xl transition-all hover:bg-gray-700 shadow-md
                           dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="mr-3">
                  <svg viewBox="30 336.7 120.9 129.2" width="28" fill="currentColor">
                    <path
                      d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                    ></path>
                    <path
                      d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                    ></path>
                    <path
                      d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                    ></path>
                    <path
                      d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">DISPONIBLE SUR</div>
                  <div className="font-sans text-xl font-semibold">
                    Google Play
                  </div>
                </div>
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Taxi;
