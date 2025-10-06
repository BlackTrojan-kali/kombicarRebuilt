import React, { useState, useEffect, useRef } from "react";
import useChat from "../../hooks/useChat"; // Ton hook personnalisé
import useAuth from "../../hooks/useAuth"; // Pour obtenir l'utilisateur connecté
import { useParams } from "react-router-dom";
import { Send, Eye, Loader2 } from 'lucide-react'; // Icônes pour l'esthétique

const ChatRoom = () => {
    const {
        messages,
        loadingMessages,
        messagesError,
        fetchMessages,
        sendMessage,
        markAllAsSeen,
        // currentReservationId, // Optionnel, mais utile pour la vérification
    } = useChat();

    // NOTE: Assurez-vous que useAuth() retourne un objet user avec une propriété 'id' ou 'uid'
    const { user } = useAuth(); // utilisateur actuel
    const { reservationId } = useParams(); // Récupère l'ID de la réservation
    const [newMessageContent, setNewMessageContent] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [initialLoad, setInitialLoad] = useState(true); // Pour éviter le scroll "brutal" initial

    // Charger les messages et marquer comme lus à l'ouverture du chat
    useEffect(() => {
        if (reservationId) {
            // Vider les messages avant de charger les nouveaux pour la nouvelle conversation
            // (Si non géré dans le ChatContext)
            // setMessages([]); 
            
            fetchMessages(reservationId, 1);
            markAllAsSeen(reservationId);
            setInitialLoad(true);
        }
    }, [reservationId]); // Déclenche au changement d'ID de réservation

    // Scroll automatique en bas
    useEffect(() => {
        // Scroll en douceur seulement après la première ouverture/chargement complet
        if (!loadingMessages && messages.length > 0) {
            scrollToBottom(initialLoad);
            if (initialLoad) {
                setInitialLoad(false);
            }
        }
    }, [messages, loadingMessages]);

    const scrollToBottom = (instant) => {
        messagesEndRef.current?.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
    };
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedContent = newMessageContent.trim();
        if (!trimmedContent || !reservationId) return;

        setSending(true);
        try {
            // 🛑 CORRECTION ICI : Passer le contenu du message (string) directement
            await sendMessage(reservationId, trimmedContent);
            setNewMessageContent("");
            // Le scrollToBottom sera géré par l'useEffect qui écoute 'messages'
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            // Afficher l'erreur à l'utilisateur si possible
            alert(`Erreur d'envoi: ${error.message || "Problème de connexion"}`); // Utiliser un modal dans une app réelle
        } finally {
            setSending(false);
        }
    };

    // Le tri est correct pour afficher les messages du plus ancien au plus récent
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.sendedAt) - new Date(b.sendedAt)
    );

    // Placeholder de l’autre participant (devrait être récupéré via la conversationId ou un hook)
    const otherParticipant = {
        id: "someOtherUserId",
        name: "Partenaire de Trajet",
    };

    if (!reservationId) {
        return (
            <div className="flex justify-center items-center h-screen dark:text-white">
                <p>Sélectionnez une conversation pour commencer.</p>
            </div>
        );
    }

    if (loadingMessages && messages.length === 0) { // N'affiche le loader que si c'est le chargement initial
        return (
            <div className="flex justify-center items-center h-screen dark:text-white">
                <Loader2 className="animate-spin mr-2" size={24} />
                <p>Chargement des messages...</p>
            </div>
        );
    }

    if (messagesError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400">
                <p>Erreur lors du chargement des messages : {messagesError}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900 mt-10 transition-colors duration-300">
            {/* === HEADER === */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg p-4 sticky top-0 z-10">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    💬 Conversation avec {otherParticipant.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Réservation : {reservationId}
                </p>
            </div>

            {/* === ZONE DES MESSAGES === */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-gray-900">
                
                {/* Indicateur de chargement d'historique (scroll infini) */}
                {loadingMessages && messages.length > 0 && (
                     <div className="flex justify-center py-2">
                        <Loader2 className="animate-spin text-blue-500" size={20} />
                     </div>
                )}

                {sortedMessages.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 pt-8">
                        Aucun message pour le moment. Envoyez-en un !
                    </p>
                ) : (
                    sortedMessages.map((message, index) => {
                        // Utiliser hasBeenSeen (ou seen) selon votre structure de données
                        const isOwnMessage = message.fromUserId === user?.id; 
                        const isSeen = message.hasBeenSeen || message.seen; 
                        
                        return (
                            <div
                                key={message.id || index}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-xl shadow-md text-sm transition-all duration-200 ${
                                        isOwnMessage
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-tl-none"
                                    }`}
                                >
                                    <p>{message.content}</p>
                                    <div className="flex items-center justify-end text-xs mt-1 opacity-80">
                                        {message.sendedAt &&
                                            new Date(message.sendedAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        {isOwnMessage && (
                                            <span className="ml-2 text-white">
                                                {isSeen ? (
                                                    <Eye 
                                                        title="Vu"
                                                        className="h-3 w-3 text-green-300"
                                                    /> // Icône vue (double coche ou oeil)
                                                ) : (
                                                    <Send
                                                        title="Envoyé"
                                                        className="h-3 w-3 text-blue-200"
                                                    /> // Icône envoyé (une coche ou send)
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} /> {/* Ancre pour scroll automatique */}
            </div>

            {/* === INPUT MESSAGE === */}
            <form
                onSubmit={handleSendMessage}
                className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center shadow-lg sticky bottom-0 z-10"
            >
                <input
                    type="text"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 text-base"
                    disabled={sending}
                />
                <button
                    type="submit"
                    disabled={!newMessageContent.trim() || sending}
                    className={`ml-3 p-3 rounded-full font-medium transition duration-200 shadow-md flex items-center justify-center ${
                        sending || !newMessageContent.trim()
                            ? "bg-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-400"
                            : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                    }`}
                >
                    {sending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
