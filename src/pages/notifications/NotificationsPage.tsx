// src/pages/notifications/NotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, CheckCircle2, MessageSquare, 
  Clock, ShieldCheck, Star, DollarSign, Bell, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { notificationService } from '../../services/notificationService';
import type { NotificationItem } from '../../types/NotificationTypes';

// --- FONCTIONS UTILITAIRES ---

// Déduit l'icône et la couleur en fonction de mots-clés dans le titre
const getNotificationVisuals = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('confirmé') || lowerTitle.includes('accepté')) {
    return { icon: CheckCircle2, color: 'text-kombi-green-500', bg: 'bg-green-50 dark:bg-green-500/10' };
  }
  if (lowerTitle.includes('message')) {
    return { icon: MessageSquare, color: 'text-kombi-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' };
  }
  if (lowerTitle.includes('rappel')) {
    return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' };
  }
  if (lowerTitle.includes('vérifié') || lowerTitle.includes('identité')) {
    return { icon: ShieldCheck, color: 'text-kombi-green-500', bg: 'bg-green-50 dark:bg-green-500/10' };
  }
  if (lowerTitle.includes('évaluez') || lowerTitle.includes('avis')) {
    return { icon: Star, color: 'text-kombi-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' };
  }
  if (lowerTitle.includes('paiement') || lowerTitle.includes('reçu')) {
    return { icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-500/10' };
  }
  return { icon: Bell, color: 'text-text-muted', bg: 'bg-base' };
};

// Formate la date relative (ex: "il y a 12 min", "Hier", "3 mai")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24 && now.getDate() === date.getDate()) return `il y a ${diffHours} h`;
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
    return "Hier";
  }
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// Regroupe les notifications par catégories temporelles
const groupNotifications = (notifications: NotificationItem[]) => {
  const groups: Record<string, NotificationItem[]> = {
    "AUJOURD'HUI": [],
    "HIER": [],
    "CETTE SEMAINE": [],
    "PLUS ANCIEN": []
  };

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  notifications.forEach(notif => {
    // Attention au nom de la propriété renvoyée par le backend (pusblishAt)
    const date = new Date(notif.pusblishAt);
    
    if (date.toDateString() === now.toDateString()) {
      groups["AUJOURD'HUI"].push(notif);
    } else if (date.toDateString() === yesterday.toDateString()) {
      groups["HIER"].push(notif);
    } else if (date > oneWeekAgo) {
      groups["CETTE SEMAINE"].push(notif);
    } else {
      groups["PLUS ANCIEN"].push(notif);
    }
  });

  return groups;
};

// --- COMPOSANT PRINCIPAL ---

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchNotifications = async (page: number, append = false) => {
    try {
      const response = await notificationService.getUserNotifications(page);
      if (append) {
        setNotifications(prev => [...prev, ...response.items]);
      } else {
        setNotifications(response.items);
      }
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      toast.error("Impossible de charger les notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;

    setIsMarkingAll(true);
    try {
      await notificationService.markAsRead(unreadIds);
      // Mise à jour de l'état local pour éviter de recharger toute la page
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("Toutes les notifications ont été marquées comme lues.");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    // Si non lue, on la marque comme lue individuellement
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead([notif.id]);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (error) {
        console.error("Erreur mark as read", error);
      }
    }
    // Tu peux ajouter ici une logique de redirection basée sur le contenu
    // ex: navigate(`/trajets/${notif.tripId}`) si l'ID était dispo dans l'objet
  };

  const groupedNotifications = groupNotifications(notifications);
  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="min-h-screen bg-base pb-24">
      {/* HEADER FIXED */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main">Notifications</h1>
          <button 
            onClick={handleMarkAllAsRead}
            disabled={!hasUnread || isMarkingAll}
            className={`text-sm font-bold transition-colors ${
              hasUnread ? 'text-kombi-orange-500 hover:text-kombi-orange-600' : 'text-text-muted opacity-50'
            }`}
          >
            {isMarkingAll ? <Loader2 size={16} className="animate-spin" /> : "Tout lire"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-6 px-4">
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-surface border border-border-main rounded-3xl p-10 text-center mt-4">
            <div className="w-16 h-16 bg-base rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-text-muted opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-text-main mb-2">Vous êtes à jour !</h3>
            <p className="text-text-muted text-sm">Vous n'avez aucune nouvelle notification pour le moment.</p>
          </div>
        ) : (
          <div className="bg-surface border border-border-main rounded-[20px] overflow-hidden shadow-sm">
            {Object.entries(groupedNotifications).map(([groupName, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={groupName}>
                  {/* Titre du groupe */}
                  <div className="px-5 py-3 bg-base/50 border-y border-border-main first:border-t-0">
                    <h3 className="text-xs font-extrabold text-text-muted tracking-wider">
                      {groupName}
                    </h3>
                  </div>

                  {/* Liste des notifications du groupe */}
                  <div className="divide-y divide-border-main">
                    {items.map((notif) => {
                      const visual = getNotificationVisuals(notif.title);
                      
                      return (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`flex items-start gap-4 p-5 cursor-pointer hover:bg-base/50 transition-colors ${
                            !notif.isRead ? 'bg-orange-50/30 dark:bg-orange-900/5' : ''
                          }`}
                        >
                          {/* Icône */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${visual.bg} ${visual.color}`}>
                            <visual.icon size={18} />
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-text-main text-sm mb-0.5">{notif.title}</p>
                            <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                              {notif.content}
                            </p>
                            <p className="text-xs text-text-muted mt-2 opacity-75">
                              {formatRelativeTime(notif.pusblishAt)}
                            </p>
                          </div>

                          {/* Pastille non lu */}
                          {!notif.isRead && (
                            <div className="w-2.5 h-2.5 bg-kombi-orange-500 rounded-full shrink-0 mt-2"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton Charger plus */}
        {hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-6 py-2.5 bg-surface border border-border-main rounded-xl text-sm font-bold text-text-main hover:bg-base transition-colors"
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};