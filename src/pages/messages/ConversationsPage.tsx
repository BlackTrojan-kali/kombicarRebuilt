// src/pages/messages/ConversationsPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Send, MessageSquare, User, 
  Loader2, ArrowRight, Calendar, Check, CheckCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { messageService } from '../../services/messageService';
import { reservationService } from '../../services/reservationService';
import { useAuth } from '../../features/auth/AuthContext';
import type { MessageItem } from '../../types/MessageTypes';
import type { UserReservationListItem } from '../../types/ReservationTypes';

export const ConversationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // États pour les fils de discussion (Threads)
  const [threads, setThreads] = useState<UserReservationListItem[]>([]);
  const [isThreadsLoading, setIsThreadsLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<UserReservationListItem | null>(null);

  // États pour la fenêtre de chat active
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // État pour basculer l'affichage sur Mobile (Liste vs Chat)
  const [showChatMobile, setShowChatMobile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. CHARGEMENT DES FILS DE DISCUSSION (BASÉ SUR LES RÉSERVATIONS) ---
  const loadThreads = async () => {
    try {
      // On récupère les réservations confirmées (statut 1) qui ont des discussions actives
      const response = await reservationService.getUserReservationsList(1, 1);
      setThreads(response.items || []);
    } catch (error) {
      console.error("Erreur fils de discussion", error);
    } finally {
      setIsThreadsLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  // --- 2. CHARGEMENT DES MESSAGES D'UNE DISCUSSION ---
  const loadMessages = async (reservationId: number) => {
    setIsMessagesLoading(true);
    try {
      const chatHistory = await messageService.getMessages(reservationId, 1);
      setMessages(chatHistory || []);
      
      // Marquer automatiquement tous les messages de ce fil comme lus
      await messageService.markAllAsSeen(reservationId);
    } catch (error) {
      toast.error("Impossible de charger l'historique des messages.");
    } finally {
      setIsMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread.reservation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThread]);

  // Défilement automatique vers le bas lors de l'arrivée de messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 3. ENVOI D'UN MESSAGE ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeThread || isSending) return;

    const resId = activeThread.reservation.id;
    const content = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const createdMessage = await messageService.sendMessage(resId, content);
      // Injection locale immédiate du message pour une UI fluide
      setMessages(prev => [...prev, createdMessage]);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message.");
      setNewMessage(content); // Restitution du texte en cas d'échec
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectThread = (thread: UserReservationListItem) => {
    setActiveThread(thread);
    setShowChatMobile(true);
  };

  return (
    <div className="min-h-screen bg-base md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-surface border border-border-main md:rounded-3xl shadow-sm h-[calc(100vh-4rem)] md:h-[80vh] flex overflow-hidden">
        
        {/* ========================================================
            COLONNE GAUCHE : LISTE DES CONVERSATIONS
           ======================================================== */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-border-main flex flex-col shrink-0 bg-surface ${
          showChatMobile ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header Liste */}
          <div className="p-4 border-b border-border-main flex items-center gap-3 shrink-0">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors"
            >
              <ChevronLeft size={20} className="text-text-main" />
            </button>
            <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
              <MessageSquare size={18} className="text-kombi-orange-500" /> Conversations
            </h1>
          </div>

          {/* Liste des fils */}
          <div className="flex-1 overflow-y-auto divide-y divide-border-main bg-base/20">
            {isThreadsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="text-kombi-orange-500 animate-spin" />
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center p-8 opacity-60 mt-12">
                <MessageSquare className="mx-auto mb-2 opacity-40" size={36} />
                <p className="text-sm font-medium">Aucune discussion active</p>
                <p className="text-xs text-text-muted mt-1">Vos fils de discussion apparaîtront une fois vos réservations confirmées.</p>
              </div>
            ) : (
              threads.map((thread) => {
                const isSelected = activeThread?.reservation.id === thread.reservation.id;
                const tripDate = new Date(thread.trip.departureDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

                return (
                  <div
                    key={thread.reservation.id}
                    onClick={() => handleSelectThread(thread)}
                    className={`p-4 cursor-pointer transition-all flex gap-3 items-start relative ${
                      isSelected ? 'bg-orange-50/50 dark:bg-orange-500/10 border-l-4 border-kombi-orange-500' : 'hover:bg-base/40'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-kombi-dark-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      <User size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-extrabold text-sm text-text-main truncate">Discussion Voyage</p>
                        <span className="text-[10px] bg-base border px-1.5 py-0.5 rounded-md font-bold text-text-muted shrink-0 flex items-center gap-1">
                          <Calendar size={10} /> {tripDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-main font-bold mb-1">
                        <span className="truncate">{thread.departureArea.homeTownName}</span>
                        <ArrowRight size={12} className="text-kombi-orange-500 shrink-0" />
                        <span className="truncate">{thread.arrivalArea.homeTownName}</span>
                      </div>
                      <p className="text-xs text-text-muted truncate">Cliquez pour ouvrir les messages...</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================
            COLONNE DROITE : ZONE DE CHAT INTERACTIVE
           ======================================================== */}
        <div className={`flex-1 flex flex-col bg-base/30 ${
          !showChatMobile ? 'hidden md:flex' : 'flex'
        }`}>
          {activeThread ? (
            <>
              {/* Header Zone Chat */}
              <div className="p-4 bg-surface border-b border-border-main flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setShowChatMobile(false)}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border-main bg-surface"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-text-main">
                      <span>{activeThread.departureArea.homeTownName}</span>
                      <ArrowRight size={14} className="text-kombi-orange-500 shrink-0" />
                      <span>{activeThread.arrivalArea.homeTownName}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">Fil lié à la réservation N° {activeThread.reservation.id}</p>
                  </div>
                </div>
              </div>

              {/* Zone Messages défilante */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base/10">
                {isMessagesLoading ? (
                  <div className="flex justify-center pt-8">
                    <Loader2 size={24} className="text-kombi-orange-500 animate-spin" />
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    // Vérification de l'expéditeur (Si msg.userId correspond à user.id connecté -> message à droite)
                    const isMe = msg.userId === user?.id;
                    const time = new Date(msg.sendedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm relative group ${
                          isMe 
                            ? 'bg-kombi-dark-500 text-white rounded-tr-none' 
                            : 'bg-surface border border-border-main text-text-main rounded-tl-none'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed break-words">{msg.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1 opacity-70 text-[10px]">
                            <span>{time}</span>
                            {isMe && (
                              msg.seen ? <CheckCheck size={12} className="text-kombi-orange-400" /> : <Check size={12} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Formulaire d'envoi en bas */}
              <form onSubmit={handleSendMessage} className="p-4 bg-surface border-t border-border-main shrink-0 flex gap-2">
                <input
                  type="text"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  disabled={isSending}
                  className="flex-1 bg-base border border-border-main rounded-xl px-4 py-2.5 text-sm text-text-main placeholder-text-muted outline-none focus:border-kombi-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="w-11 h-11 rounded-xl bg-kombi-orange-500 hover:bg-kombi-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
                >
                  {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
            </>
          ) : (
            /* État vide par défaut (ordinateur) */
            <div className="hidden md:flex flex-col items-center justify-center flex-1 opacity-50 p-6">
              <MessageSquare size={48} className="text-text-muted mb-3" />
              <p className="font-bold text-text-main">Sélectionnez une conversation</p>
              <p className="text-sm text-text-muted text-center max-w-xs mt-1">Choisissez un fil de discussion à gauche pour commencer à échanger avec votre passager ou conducteur.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};