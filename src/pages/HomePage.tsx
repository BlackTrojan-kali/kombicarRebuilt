// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Zap, Users, 
  CheckCircle2, Star, MessageCircle, Heart, Loader2, MapPin
} from 'lucide-react';

import { HeroSearch } from '../components/home/HeroSearch';
import { HomeTripCard } from '../components/home/HomeTripCard';
import { tripService } from '../services/tripService';
import { mapService } from '../services/mapService';
import { useAuth } from '../features/auth/AuthContext';
import { type TripListItem, TripStatus } from '../types/TripTypes';

// Import des assets selon ton dossier
import carWomen from '../assets/carsharing-6.jpg';
import mapCameroon from '../assets/map-cameroon.png';

export const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [popularTrips, setPopularTrips] = useState<TripListItem[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  // Helper pour transformer la géolocalisation native en Promise
  const getCoordinates = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000, // On attend max 5 secondes
        maximumAge: 60000 // On accepte une position vieille d'une minute max
      });
    });
  };

  useEffect(() => {
    const fetchPopularTrips = async () => {
      setIsLoadingTrips(true);
      try {
        let currentCountryId = 0; // Valeur de fallback par défaut (0 = Cameroun dans le backend)

        // 1. Détermination du pays
        if (isAuthenticated && user?.country) {
          // L'utilisateur est connecté et a un pays défini
          currentCountryId = user.country;
        } else {
          // Utilisateur non connecté : on tente de le géolocaliser
          try {
            const position = await getCoordinates();
            currentCountryId = await mapService.getCountryFromGps({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } catch (geoError) {
            console.warn("Géolocalisation refusée ou impossible, utilisation du pays par défaut.");
            // Si le GPS échoue, currentCountryId reste à 0
          }
        }

        // 2. Appel de l'API publique avec la page 1
        const response = await tripService.listPublicTrips({ 
          page: 1, 
          tripStatus: TripStatus.PUBLISHED,
          country: currentCountryId
        });
        
        // On conserve les 6 premiers résultats pour l'accueil
        setPopularTrips(response.items.slice(0, 6)); 

      } catch (error) {
        console.error("Erreur lors du chargement des itinéraires populaires :", error);
      } finally {
        setIsLoadingTrips(false);
      }
    };

    fetchPopularTrips();
  }, [isAuthenticated, user?.country]); // Se relance si l'état de connexion change

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
      {/* --- SECTION 1 : HERO & RECHERCHE --- */}
      <section className="relative pt-12 pb-24 px-4 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-kombi-orange-950/10">
        {/* Décoration en arrière-plan (Cameroun) */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
          <img src={mapCameroon} alt="Carte du Cameroun" className="w-full h-full object-contain object-right-top scale-125" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-12">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* --- SECTION 2 : ITINÉRAIRES POPULAIRES --- */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-kombi-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Départs imminents</p>
            <h2 className="text-3xl font-extrabold text-text-main">Itinéraires populaires</h2>
          </div>
          <Link to="/recherche" className="hidden sm:flex items-center gap-2 text-kombi-blue-500 font-bold hover:underline">
            Voir tous les trajets <ArrowRight size={18} />
          </Link>
        </div>

        {/* Gestion de l'état de chargement et d'affichage */}
        {isLoadingTrips ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
          </div>
        ) : popularTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTrips.map((trip) => (
              <HomeTripCard key={trip.trip.id} tripData={trip} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border-main rounded-3xl p-10 text-center">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/10 text-kombi-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Aucun trajet disponible</h3>
            <p className="text-text-muted">Il n'y a pas de trajets publiés dans votre zone pour le moment. Soyez le premier à proposer un trajet !</p>
            <Link to="/covoiturage/publier" className="inline-block mt-6 bg-kombi-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-kombi-orange-600 transition-colors">
              Publier un trajet
            </Link>
          </div>
        )}
        
        {/* Bouton mobile "Voir tous" */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/recherche" className="inline-flex items-center gap-2 text-kombi-blue-500 font-bold hover:underline">
            Voir tous les trajets <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* --- SECTION 3 : CONFIANCE & SÉCURITÉ --- */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-kombi-dark-500 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Cercles de décoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-kombi-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-medium mb-8">
              <ShieldCheck size={18} className="text-kombi-orange-500" />
              La sécurité est notre priorité
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Chaque membre de la <br />communauté est <span className="text-kombi-orange-500">vérifié</span>.
            </h2>
            
            <p className="text-gray-400 text-lg max-w-2xl mb-12 leading-relaxed">
              Kombicar est un réseau basé sur la confiance. Nous vérifions les profils, les avis et les pièces d'identité pour que vous puissiez voyager l'esprit tranquille.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-kombi-orange-500">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-bold">Profils vérifiés</h4>
                <p className="text-sm text-gray-500">Pièces d'identité et permis contrôlés par nos soins.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-yellow-500">
                  <Star size={24} />
                </div>
                <h4 className="font-bold">Notes et Avis</h4>
                <p className="text-sm text-gray-500">Voyagez uniquement avec des personnes de confiance.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-kombi-blue-400">
                  <Zap size={24} />
                </div>
                <h4 className="font-bold">Support 24/7</h4>
                <p className="text-sm text-gray-500">Une assistance disponible via WhatsApp et téléphone.</p>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5">
              <Link to="/securite" className="inline-block bg-white text-black font-bold py-4 px-10 rounded-2xl hover:bg-gray-100 transition-all">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4 : CTA CONDUCTEURS --- */}
      <section className="py-20 px-4 bg-base">
        <div className="max-w-7xl mx-auto bg-orange-100/50 dark:bg-orange-950/10 border border-kombi-orange-500/20 rounded-[2.5rem] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            
            <div className="p-8 md:p-16 space-y-8">
              <div>
                <p className="text-kombi-orange-500 font-bold text-sm uppercase tracking-widest mb-4">Conducteurs</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight">
                  Vos trajets,<br /><span className="text-kombi-orange-500">vos revenus.</span>
                </h2>
              </div>
              
              <p className="text-text-muted text-lg leading-relaxed">
                Publiez un trajet en 30 secondes et économisez jusqu'à 75% sur vos frais de carburant en prenant des passagers.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-text-main font-medium">
                  <CheckCircle2 size={20} className="text-kombi-green-500" /> Paiements garantis et sécurisés
                </li>
                <li className="flex items-center gap-3 text-text-main font-medium">
                  <CheckCircle2 size={20} className="text-kombi-green-500" /> Vous choisissez vos passagers
                </li>
                <li className="flex items-center gap-3 text-text-main font-medium">
                  <CheckCircle2 size={20} className="text-kombi-green-500" /> Flexibilité totale sur vos horaires
                </li>
              </ul>

              <div className="pt-4">
                <Link to="/covoiturage/publier" className="inline-flex items-center justify-center gap-3 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-extrabold text-lg py-5 px-10 rounded-2xl transition-all shadow-lg hover:shadow-orange-500/30">
                  Publier mon trajet <ArrowRight size={22} />
                </Link>
              </div>
            </div>

            <div className="relative h-full min-h-[400px] bg-kombi-orange-500">
              <img 
                src={carWomen} 
                alt="Femme conductrice souriante" 
                className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kombi-orange-600/50 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white hidden sm:block">
                <p className="text-sm font-medium italic">"Depuis que j'utilise Kombicar pour mes trajets Douala-Yaoundé, mes frais de route sont totalement amortis !"</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                  <span className="text-xs font-bold">— Marie-Noëlle, conductrice certifiée</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION 5 : APPEL COMMUNAUTÉ --- */}
      <section className="py-24 px-4 text-center space-y-8">
        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Heart size={40} fill="currentColor" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-text-main max-w-3xl mx-auto leading-tight">
          Rejoignez le futur de la mobilité au Cameroun.
        </h2>
        <p className="text-text-muted text-xl max-w-2xl mx-auto">
          Déjà plus de 12 000 utilisateurs nous font confiance chaque mois. Pourquoi pas vous ?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {!isAuthenticated && (
            <Link to="/register" className="w-full sm:w-auto bg-kombi-dark-500 text-white font-bold py-5 px-10 rounded-2xl hover:bg-black transition-all">
              Créer un compte gratuitement
            </Link>
          )}
          <Link to="/aide" className="w-full sm:w-auto bg-surface border border-border-main text-text-main font-bold py-5 px-10 rounded-2xl hover:bg-base transition-all">
            Comment ça marche ?
          </Link>
        </div>
      </section>

    </div>
  );
};