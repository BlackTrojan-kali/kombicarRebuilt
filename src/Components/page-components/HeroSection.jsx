import React from 'react';
import SearchBar from './SearchBar';

const HeroSection = ({ children, url = "/default/carsharing-2.jpg", label }) => {
  return (
    <div className='relative w-full'>
      {/* Image de fond avec une superposition foncée pour la lisibilité */}
      <div 
        className='absolute inset-0 bg-black/50 z-10'
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
        }}
      ></div>

      {/* Contenu principal : texte et barre de recherche */}
      <div className="relative z-20 flex flex-col items-center justify-around h-[80vh] px-4">
        <div className="text-white text-center">
          <p className="text-5xl md:text-6xl font-extrabold leading-tight backdrop-blur-xl">{label}</p>
          {children && <div className="mt-4 text-xl md:text-2xl font-light">{children}</div>}
        </div>
        
        {/* Intégration de la SearchBar avec un style plus adapté */}
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;