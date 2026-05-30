// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Gestionnaire d'événement pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      // Affiche le bouton si on a défilé de plus de 300px vers le bas
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Nettoyage de l'écouteur lors du démontage du composant
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour remonter en douceur
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-base relative">
      <Header />
      
      {/* Contenu principal de la page */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />

      {/* Bouton Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 p-3 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-kombi-orange-500/30 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Retour en haut"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};