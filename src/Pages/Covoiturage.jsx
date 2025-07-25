import React from 'react';
import HeroSection from '../Components/page-components/HeroSection'; // Assurez-vous que le chemin est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronRight, faCircleQuestion, } from '@fortawesome/free-solid-svg-icons'; // Ajout de faApple et faGooglePlay si vous utilisez FontAwesome pour les icônes d'app store. Sinon, les SVGs inline sont conservés.
import Button from '../Components/ui/Button';

const Covoiturage = () => {
  return (
    // Le div parent n'a pas de background global car le body le gère
    <div className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Padding pour le header fixe - Ajusté pour la responsivité */}
    

      {/* Hero Section */}
      <HeroSection url='/default/jeunes.jpg' label="Covoiturage : Votre trajet partagé, facile et économique" showLogo={false} />

      <main className='px-4 sm:px-6 lg:px-12 xl:px-24 py-16'>

        {/* --- */}
        {/* Section 1: Covoiturage pour les Conducteurs */}
        <section className='flex flex-col md:flex-row gap-12 items-center mb-24 max-w-7xl mx-auto'>
          <img
            src="/default/carsharing-4.jpg"
            alt="Personne utilisant une application de covoiturage"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className='font-extrabold text-3xl sm:text-4xl mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
              Conducteurs : Partagez vos trajets, réduisez vos coûts !
            </h2>
            <p className='text-gray-700 leading-relaxed text-lg mb-8 dark:text-gray-300'>
              Vous avez des places libres dans votre véhicule ? Proposez-les sur Kombicar ! C'est l'occasion idéale de partager vos frais de carburant et d'entretien avec des passagers allant dans la même direction que vous. Une solution simple, économique et écologique pour tous vos déplacements.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'>
                Proposer un trajet
              </Button>
            </div>
          </div>
        </section>

        {/* --- */}
        {/* Section des Trajets de Covoiturage Disponibles */}
        <section className='w-full text-left bg-emerald-800 py-12 px-4 sm:px-6 lg:px-12 xl:px-24 mb-24 rounded-lg max-w-7xl mx-auto dark:bg-gray-800'>
          <h3 className='text-white font-bold text-3xl sm:text-4xl mb-8'>Découvrez les itinéraires de covoiturage populaires</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'> {/* Ajout de xl:grid-cols-4 pour plus de colonnes sur grand écran */}
            {[
              { depart: 'Yaoundé', arrivee: 'Douala' },
              { depart: 'Douala', arrivee: 'Bafoussam' },
              { depart: 'Kribi', arrivee: 'Yaoundé' },
              { depart: 'Edea', arrivee: 'Kribi' },
              { depart: 'Bamenda', arrivee: 'Limbe' },
              { depart: 'Garoua', arrivee: 'Maroua' },
              { depart: 'Buea', arrivee: 'Douala' },
              { depart: 'Foumban', arrivee: 'Bafoussam' },
            ].map((route, index) => (
              <a href="#" key={index} className='bg-white p-6 rounded-lg shadow-md flex justify-between items-center group hover:bg-gray-50 transition-colors duration-200 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600'>
                <div className='flex items-center gap-4 text-gray-800 dark:text-gray-100'>
                  <p className='font-semibold'>{route.depart}</p>
                  <FontAwesomeIcon icon={faArrowRight} className='text-lg text-gray-500 group-hover:translate-x-1 transition-transform dark:text-gray-400' />
                  <p className='font-semibold'>{route.arrivee}</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className='text-xl text-gray-500 group-hover:text-green-500 transition-colors dark:text-gray-400' />
              </a>
            ))}
          </div>
        </section>

        {/* --- */}
        {/* Section 2: Covoiturage pour les Passagers */}
        <section className='flex flex-col md:flex-row-reverse gap-12 items-center mb-24 max-w-7xl mx-auto'>
          <img
            src="/default/carsharing-6.jpg"
            alt="Personnes heureuses dans une voiture"
            className='w-full md:w-1/2 rounded-2xl shadow-xl object-cover h-auto transition-transform duration-300 hover:scale-[1.02]'
          />
          <div className='w-full md:w-1/2 md:p-8'>
            <h2 className='font-extrabold text-3xl sm:text-4xl mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
              Passagers : Trouvez votre trajet idéal en un clin d'œil !
            </h2>
            <p className='text-gray-700 leading-relaxed text-lg mb-8 dark:text-gray-300'>
              Vous cherchez un moyen de transport flexible, abordable et convivial ? Avec Kombicar, trouvez facilement des covoitureurs pour vos déplacements quotidiens ou occasionnels. Dites adieu aux transports en commun bondés et voyagez confortablement.
            </p>
            <div className='text-center md:text-left'>
              <Button className='px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'>
                Rechercher un trajet
              </Button>
            </div>
          </div>
        </section>

        {/* --- */}
        {/* FAQ Section */}
        <section className='py-16 px-4 sm:px-6 lg:px-12 xl:px-24 bg-gray-50 rounded-lg max-w-7xl mx-auto dark:bg-gray-900'>
          <h1 className='text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-12 text-gray-800 dark:text-gray-100'>
            <FontAwesomeIcon icon={faCircleQuestion} className='text-3xl sm:text-4xl text-blue-500 mr-4' />
            Questions fréquentes sur le covoiturage
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* FAQ Item 1 */}
            <div className='p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
              <h4 className='font-bold text-xl text-gray-800 mb-2 dark:text-gray-100'>Comment fonctionne le covoiturage sur Kombicar ?</h4>
              <p className='text-gray-700 text-base leading-relaxed dark:text-gray-300'>
                Que vous soyez conducteur ou passager, le principe est simple : les conducteurs proposent leurs trajets avec leurs places disponibles, et les passagers peuvent les réserver. Le partage des frais se fait directement via l'application, en toute transparence.
              </p>
            </div>
            {/* FAQ Item 2 */}
            <div className='p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
              <h4 className='font-bold text-xl text-gray-800 mb-2 dark:text-gray-100'>Est-ce que le covoiturage est sûr ?</h4>
              <p className='text-gray-700 text-base leading-relaxed dark:text-gray-300'>
                La sécurité est notre priorité absolue. Nous encourageons nos utilisateurs à vérifier les profils, les avis et les évaluations des autres membres avant de voyager. Vous pouvez également communiquer avec eux avant le départ pour plus de sérénité.
              </p>
            </div>
            {/* FAQ Item 3 */}
            <div className='p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
              <h4 className='font-bold text-xl text-gray-800 mb-2 dark:text-gray-100'>Comment sont fixés les prix ?</h4>
              <p className='text-gray-700 text-base leading-relaxed dark:text-gray-300'>
                Les prix sont suggérés par Kombicar en fonction de la distance et des frais habituels (carburant, péages), mais le conducteur peut ajuster ce montant dans une certaine limite. L'objectif est de partager les frais de manière équitable, pas de faire du profit.
              </p>
            </div>
            {/* FAQ Item 4 */}
            <div className='p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
              <h4 className='font-bold text-xl text-gray-800 mb-2 dark:text-gray-100'>Que faire en cas de problème ou d'annulation ?</h4>
              <p className='text-gray-700 text-base leading-relaxed dark:text-gray-300'>
                En cas d'imprévu, nous avons mis en place des politiques d'annulation claires et flexibles. Notre support client est également disponible pour vous aider à résoudre rapidement tout problème ou question que vous pourriez avoir.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- */}
      {/* Mobile App Presentation */}
      <section className="py-16 bg-yellow-400 text-gray-700 dark:bg-yellow-700 dark:text-gray-100">
        <h1 className="text-3xl sm:text-4xl text-center font-bold mb-4">Simplifiez votre expérience</h1>
        <h2 className="text-xl sm:text-2xl text-center font-semibold mb-12">Téléchargez notre application mobile !</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 sm:px-6 lg:px-12 xl:px-24 max-w-7xl mx-auto">
          <div className="flex justify-center flex-shrink-0"> {/* flex-shrink-0 pour éviter le rétrécissement de l'image */}
            <img
              src="/default/app-kombicar.png"
              alt="Capture d'écran de l'application mobile Kombicar"
              className="w-[280px] md:w-[350px] shadow-xl rounded-lg object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
          <div className='flex flex-col items-center md:items-start gap-4'>
            {/* App Store Button */}
            <a href="https://apps.apple.com/us/app/kombicar/id6468362045" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur l'App Store">
              <button
                type="button"
                className="flex items-center justify-center w-60 py-4 text-gray-800 bg-white border border-gray-300 rounded-xl transition-all hover:bg-gray-100 shadow-md
                           dark:text-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="mr-3">
                  {/* Utilisation de FontAwesome pour l'icône Apple si disponible, sinon SVG avec fill="currentColor" */}
                  {/* Si faApple est importé: <FontAwesomeIcon icon={faApple} className="text-2xl" /> */}
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
            {/* Google Play Button */}
            <a href="https://play.google.com/store/apps/details?id=com.kombicar.app" target="_blank" rel="noopener noreferrer" aria-label="Télécharger sur Google Play">
              <button
                type="button"
                className="flex items-center justify-center w-60 py-4 text-white bg-gray-900 rounded-xl transition-all hover:bg-gray-700 shadow-md
                           dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="mr-3">
                  {/* Utilisation de FontAwesome pour l'icône Google Play si disponible, sinon SVG avec fill="currentColor" */}
                  {/* Si faGooglePlay est importé: <FontAwesomeIcon icon={faGooglePlay} className="text-2xl" /> */}
                  <svg viewBox="30 336.7 120.9 129.2" width="28" fill="currentColor">
                    {/* Pour les SVGs multi-couleurs comme Google Play, il est préférable de ne pas utiliser currentColor sur les chemins internes
                        si vous voulez conserver les couleurs distinctes.
                        Si vous voulez qu'il change de couleur avec le thème, vous devez soit le simplifier en une seule couleur,
                        soit gérer les couleurs des chemins individuellement avec des classes Tailwind.
                        Pour l'instant, je vais le rendre monochrome avec currentColor pour s'adapter au thème.
                        Si les couleurs distinctes sont cruciales, il faudrait laisser les fills en dur et accepter qu'il ne change pas avec le thème.
                    */}
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

export default Covoiturage;