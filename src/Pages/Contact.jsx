import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-sans">

      {/* HEADER SECTION - Inspired by the flyer's bold blue/white theme */}
      <header className="bg-blue-800 mt-10 text-white p-6 rounded-lg shadow-xl mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
          📞 Assistance Kombicar
        </h1>
        <p className="text-blue-200 text-lg">
          Votre support <strong className="text-yellow-300">24/7</strong> pour <span className="font-semibold">réservations</span>, <span className="font-semibold">trajets</span> et <span className="font-semibold">informations</span>.
        </p>
      </header>

      {/* --- */}

      {/* CONTACT DETAILS SECTION */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-yellow-500 pb-2">
          Coordonnées d'Assistance par Ville
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Yaoundé Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-600">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Yaoundé</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <span className="text-blue-500 mr-3 text-xl">📱</span> 
                <strong>Appel :</strong> <a href="tel:+237678361119" className="ml-2 text-blue-600 hover:text-blue-900 font-medium">(+237) 678 361 119</a>
              </p>
              <p className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3 text-xl">💬</span> 
                <strong>WhatsApp :</strong> <a href="https://wa.me/237678361119" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 hover:text-green-800 font-medium">(+237) 678 361 119</a>
              </p>
            </div>
          </div>
          
          {/* Douala Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-600">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Douala</h3>
            <div className="space-y-3">
              <p className="flex items-center text-gray-600">
                <span className="text-blue-500 mr-3 text-xl">📱</span> 
                <strong>Appel :</strong> <a href="tel:+237655730577" className="ml-2 text-blue-600 hover:text-blue-900 font-medium">(+237) 655 730 577</a>
              </p>
              <p className="flex items-center text-gray-600">
                <span className="text-green-500 mr-3 text-xl">💬</span> 
                <strong>WhatsApp :</strong> <a href="https://wa.me/237655730577" target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 hover:text-green-800 font-medium">(+237) 655 730 577</a>
              </p>
            </div>
          </div>
          
        </div>

        {/* Call to Action */}
        <div className="mt-8 p-4 text-center bg-yellow-100 border border-yellow-400 rounded-lg text-lg font-bold text-gray-800">
          ⭐ Besoin d'aide immédiate ? Appelez-nous ! ⭐
        </div>
      </section>

      {/* --- */}

      {/* KEY SERVICES SECTION */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2">
          Services de l'Assistance
        </h2>
        <ul className="space-y-3 text-lg text-gray-700 bg-white p-6 rounded-lg shadow-md">
          <li className="flex items-start">
            <span className="text-2xl text-blue-600 mr-3">✅</span>
            <p><strong>Réservations & support covoiturage</strong> : Aide pour planifier vos voyages et gérer vos places.</p>
          </li>
          <li className="flex items-start">
            <span className="text-2xl text-blue-600 mr-3">✅</span>
            <p><strong>Informations trajets & véhicules</strong> : Détails sur les itinéraires disponibles et les types de véhicules.</p>
          </li>
        </ul>
      </section>

      {/* --- */}

      {/* SOCIAL LINKS SECTION */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-500 pb-2">
          Restez Connecté
        </h2>
        <div className="flex flex-wrap gap-4 text-lg">
          <a 
            href="https://www.kombicar.fr/" // Lien basé sur les résultats de recherche
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md"
          >
            <span className="mr-2">🌐</span> Site Web: kombicar.app
          </a>
          <a 
            href="https://facebook.com/kombicar" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md"
          >
            <span className="mr-2">🟦</span> Facebook: @kombicar
          </a>
          <a 
            href="https://instagram.com/kombicar_cmr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md"
          >
            <span className="mr-2">📸</span> Instagram: @kombicar_cmr
          </a>
        </div>
      </section>
      
    </div>
  );
}

export default Contact;