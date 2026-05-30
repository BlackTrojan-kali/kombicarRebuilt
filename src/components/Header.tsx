// src/components/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, Car, PlusCircle, Calendar, 
  MessageSquare, Bell, User, Settings, HelpCircle, 
  LogOut, ChevronRight, ChevronDown, Wallet,
  CalendarClock
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import logo from '../assets/logo.png'; // Utilisation stricte de l'icône "K"

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown de profil si on clique en dehors (Desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquer le scroll de la page quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Nettoyage si le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // --- COMPOSANT RÉUTILISABLE POUR LES LIENS DU MENU MOBILE ---
  const MobileMenuItem = ({ to, icon: Icon, label, badge, highlighted = false }: any) => (
    <Link 
      to={to} 
      onClick={closeMenu}
      className={`flex items-center justify-between p-4 mb-2 rounded-xl border ${
        highlighted 
          ? 'border-kombi-orange-500 text-kombi-orange-500 bg-orange-50 dark:bg-orange-900/10' 
          : 'border-border-main text-text-main bg-surface'
      } hover:shadow-sm transition-all`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={highlighted ? 'text-kombi-orange-500' : 'text-text-muted'} />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="bg-kombi-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight size={18} className="text-text-muted opacity-50" />
      </div>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border-main shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO : Icône "K" + texte "ombicar" */}
          <Link to="/" className="flex items-center gap-0.5" onClick={closeMenu}>
            <img src={logo} alt="Logo Kombicar" className="h-8 w-auto object-contain" />
            <span className="text-2xl font-bold text-text-main tracking-tight mt-1">ombicar</span>
          </Link>

          {/* --- NAVIGATION DESKTOP --- */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/recherche" className="text-text-main hover:text-kombi-orange-500 font-medium transition-colors">
              Rechercher
            </Link>
            
            {isAuthenticated && (
              <>
                <Link to="/covoiturage/publier" className="text-text-main hover:text-kombi-orange-500 font-medium transition-colors">
                  Publier un trajet
                </Link>
                <Link to="/vtc" className="text-text-main hover:text-kombi-orange-500 font-medium transition-colors">
                  VTC
                </Link>
              </>
            )}
          </nav>

          {/* --- ACTIONS DESKTOP (Thème + Profil / Auth / Notifications) --- */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                
                {/* --- BOUTON NOTIFICATIONS DESKTOP --- */}
                <Link 
                  to="/notifications" 
                  className="relative p-2 text-text-muted hover:text-kombi-orange-500 hover:bg-base rounded-full transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {/* Pastille pour simuler une notification non lue */}
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-kombi-orange-500 border-2 border-surface rounded-full"></span>
                </Link>

                {/* Dropdown Profil (Utilisateur connecté) */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-border-main hover:bg-base transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-kombi-dark-500 text-white flex items-center justify-center font-bold text-sm">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-text-main hidden lg:block">
                      {user.firstName}
                    </span>
                    <ChevronDown size={16} className="text-text-muted mr-1" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-border-main rounded-xl shadow-lg overflow-hidden py-2">
                      <Link to="/profil" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <User size={16} /> Mon profil
                      </Link>
                      {/* --- NOUVEAU LIEN WALLET DESKTOP --- */}
                      <Link to="/wallet" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <Wallet size={16} /> Mon portefeuille
                      </Link>
                      <Link to="/mes-trajets-conducteur" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <Car size={16} /> Mes trajets
                      </Link>
                      <Link to="/mes-reservations" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <Calendar size={16} /> Mes réservations
                      </Link>
                      
                      <Link to="/planifier" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <CalendarClock size={16} /> Planifications
                      </Link>
                      <Link to="/conversations" className="flex items-center gap-2 px-4 py-2 text-text-main hover:bg-base" onClick={() => setIsProfileDropdownOpen(false)}>
                        <MessageSquare size={16} /> Messages
                      </Link>
                      <div className="border-t border-border-main my-2"></div>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-left">
                        <LogOut size={16} /> Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Boutons Login / Register (Non connecté)
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-text-main font-medium hover:text-kombi-orange-500 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* --- BOUTON MENU MOBILE --- */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated && (
              <Link 
                to="/notifications" 
                className="relative p-1.5 text-text-muted hover:text-kombi-orange-500 transition-colors"
              >
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-kombi-orange-500 border border-surface rounded-full"></span>
              </Link>
            )}
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-main bg-surface border border-border-main rounded-xl shadow-sm"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MENU MOBILE (Tiroir Opaque) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-surface overflow-y-auto pb-6">
          <div className="p-4 space-y-6">
            
            {/* Carte Utilisateur ou Bloc Inscription */}
            {isAuthenticated && user ? (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-kombi-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-300 text-sm flex items-center gap-1 mt-0.5">
                      ⭐ 4,9 • {user.reviewsCount || 0} trajets
                    </p>
                  </div>
                </div>
                <Link to="/profil" onClick={closeMenu}>
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              </div>
            ) : (
              <div className="bg-surface border border-border-main rounded-2xl p-5 text-center shadow-sm">
                <h3 className="font-semibold text-text-main mb-2">Rejoignez la communauté</h3>
                <p className="text-text-muted text-sm mb-4">Inscrivez-vous pour publier des trajets et réserver vos places.</p>
                <div className="flex flex-col gap-3">
                  <Link to="/register" onClick={closeMenu} className="w-full bg-kombi-orange-500 text-white py-2.5 rounded-xl font-medium">Créer un compte</Link>
                  <Link to="/login" onClick={closeMenu} className="w-full bg-base border border-border-main text-text-main py-2.5 rounded-xl font-medium">Se connecter</Link>
                </div>
              </div>
            )}

            {/* Section TRAJETS */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-2">Trajets</p>
              <MobileMenuItem to="/recherche" icon={Search} label="Rechercher un trajet" highlighted={true} />
              
              {isAuthenticated && (
                <>
                  <MobileMenuItem to="/mes-reservations" icon={Calendar} label="Mes réservations" />
                  <MobileMenuItem to="/mes-trajets-conducteur" icon={Car} label="Mes trajets (Conducteur)" />
                  <MobileMenuItem to="/covoiturage/publier" icon={PlusCircle} label="Publier un trajet" />
                </>
              )}
            </div>

            {/* Section COMMUNICATION (Protégée) */}
            {isAuthenticated && (
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-2 mt-6">Communication</p>
                <MobileMenuItem to="/conversations" icon={MessageSquare} label="Conversations" badge="3" />
                <MobileMenuItem to="/notifications" icon={Bell} label="Notifications" />
              </div>
            )}

            {/* Section COMPTE */}
            {isAuthenticated && (
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 ml-2 mt-6">Compte</p>
                <MobileMenuItem to="/profil" icon={User} label="Mon profil" />
                
                <MobileMenuItem to="/planifier" icon={Calendar} label="plannificaiton trajet" />
                {/* --- NOUVEAU LIEN WALLET MOBILE --- */}
                <MobileMenuItem to="/profil/retraits" icon={Wallet} label="Mon portefeuille" />
                
                <MobileMenuItem to="/parametres" icon={Settings} label="Paramètres" />
                <MobileMenuItem to="/aide" icon={HelpCircle} label="Aide & support" />
                
                {/* Bouton Déconnexion style Mobile */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 mt-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} />
                    <span className="font-medium">Déconnexion</span>
                  </div>
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};