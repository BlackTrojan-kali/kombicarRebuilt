// src/pages/profil/UserProfile.tsx
import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit3, Car, CalendarClock, Star, CreditCard, 
  Wallet, ShieldCheck, Mail, Phone, MapPin, BadgeCheck,
  CarFront // Ajout de la nouvelle icône pour les véhicules
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { EditProfileModal } from '../../components/modals/EditProfileModal';

export const UserProfile = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sécurité d'affichage (bien que la route soit protégée)
  if (!user) return null;

  // Formatage de la date d'inscription
  const formattedDate = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* --- EN-TÊTE DE PAGE --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-main">Mon Profil</h1>
      </div>

      {/* --- CARTE PRINCIPALE : INFO UTILISATEUR --- */}
      <div className="bg-surface border border-border-main rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.pictureProfileUrl ? (
                <img 
                  src={user.pictureProfileUrl} 
                  alt="Profil" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-base shadow-sm" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-kombi-orange-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-base shadow-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
              {user.isVerified && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm" title="Compte vérifié">
                  <BadgeCheck size={24} className="text-kombi-green-500" />
                </div>
              )}
            </div>

            {/* Infos de base */}
            <div>
              <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Star size={16} className="text-kombi-orange-500 fill-kombi-orange-500" />
                  {user.note > 0 ? user.note.toFixed(1) : 'Nouveau'}
                </span>
                <span>•</span>
                <span>Membre depuis {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Bouton d'édition */}
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-base border border-border-main hover:border-kombi-orange-500 hover:text-kombi-orange-500 text-text-main font-medium py-2.5 px-5 rounded-xl transition-colors"
          >
            <Edit3 size={18} />
            Modifier le profil
          </button>

        </div>

        {/* Coordonnées détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border-main">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-base rounded-lg text-text-muted">
              <Mail size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-text-muted">Email</p>
              <p className="text-sm font-medium text-text-main truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-base rounded-lg text-text-muted">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Téléphone</p>
              <p className="text-sm font-medium text-text-main">{user.phoneNumber || 'Non renseigné'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-base rounded-lg text-text-muted">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Pays</p>
              <p className="text-sm font-medium text-text-main">
                {/* Exemple d'affichage, à adapter selon comment tu gères l'ID du pays côté client */}
                {user.country === 1 ? 'Cameroun' : `Code pays: ${user.country}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE NAVIGATION : ACCÈS RAPIDES --- */}
      <h3 className="text-lg font-bold text-text-main mt-8 mb-4">Tableau de bord</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Solde / Retraits (Mise en évidence) */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-sm text-white flex flex-col justify-between relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-gray-300 mb-1">
              <Wallet size={18} />
              <span className="text-sm font-medium uppercase tracking-wider">Solde actuel</span>
            </div>
            <p className="text-3xl font-bold">
              {user.balance.toLocaleString('fr-FR')} <span className="text-lg text-kombi-orange-500">FCFA</span>
            </p>
          </div>
          <Link 
            to="/profil/retraits" 
            className="mt-6 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white font-medium py-2 px-4 rounded-xl text-center transition-colors relative z-10"
          >
            Gérer mes retraits
          </Link>
          {/* Décoration arrière-plan */}
          <div className="absolute -bottom-6 -right-6 text-white/5">
            <Wallet size={120} />
          </div>
        </div>

        {/* Bouton Trajets */}
        <Link to="/profil/mes-trajets-conducteur" className="group bg-surface border border-border-main rounded-2xl p-5 hover:border-kombi-blue-500 transition-all hover:shadow-md flex flex-col justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-kombi-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Car size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main">Mes Trajets</h4>
            <p className="text-sm text-text-muted">Historique et trajets en cours</p>
          </div>
        </Link>

        {/* Bouton Véhicules */}
        <Link to="/profil/vehicules" className="group bg-surface border border-border-main rounded-2xl p-5 hover:border-purple-500 transition-all hover:shadow-md flex flex-col justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CarFront size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main">Mes Véhicules</h4>
            <p className="text-sm text-text-muted">Gérer vos voitures et documents</p>
          </div>
        </Link>

        {/* Bouton Réservations */}
        <Link to="/profil/mes-reservations" className="group bg-surface border border-border-main rounded-2xl p-5 hover:border-kombi-orange-500 transition-all hover:shadow-md flex flex-col justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarClock size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main">Réservations</h4>
            <p className="text-sm text-text-muted">Billets et places réservées</p>
          </div>
        </Link>

        {/* Bouton Revues */}
        <Link to={`/conducteurs/${user.id}/avis`} className="group bg-surface border border-border-main rounded-2xl p-5 hover:border-yellow-500 transition-all hover:shadow-md flex flex-col justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main">Mes Avis</h4>
            <p className="text-sm text-text-muted">Consulter les avis reçus ({user.reviewsCount})</p>
          </div>
        </Link>

        {/* Bouton Permis de conduire */}
        <Link to="/profil/permis" className="group bg-surface border border-border-main rounded-2xl p-5 hover:border-kombi-green-500 transition-all hover:shadow-md flex flex-col justify-center gap-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-kombi-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main">Permis de conduire</h4>
            <p className="text-sm text-text-muted">Documents conducteurs</p>
          </div>
          {/* Badge statuts (Optionnel, exemple visuel) */}
          {user.role === 1 && ( // Supposons que rôle conducteur = 1
            <div className="absolute top-4 right-4">
              <ShieldCheck size={20} className="text-kombi-green-500" />
            </div>
          )}
        </Link>

      </div>

      {/* --- MODALE D'ÉDITION DE PROFIL --- */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

    </div>
  );
};