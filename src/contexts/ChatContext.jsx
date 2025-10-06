import { createContext, useState, useEffect } from "react";
import api from '../api/api';

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
    // États pour les conversations (liste des discussions)
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversationsError, setConversationsError] = useState(null);

    // États pour les messages du fil de discussion ouvert
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    
    // État pour suivre la conversation ouverte (utile pour éviter les "race conditions")
    const [currentReservationId, setCurrentReservationId] = useState(null);

    // ===================================================
    // GET /api/v1/messages/conversations/{page}
    // Charge une page de conversations et retourne le statut hasNextPage
    // ===================================================
    /**
     * Charge une page de conversations.
     * @param {number} pageNumber - Le numéro de la page à charger (défaut: 1).
     * @returns {boolean} Indique s'il existe une page suivante (hasNextPage).
     */
    const fetchConversations = async (pageNumber = 1) => {
        setLoadingConversations(true);
        setConversationsError(null); 
        let hasNextPage = false; 
        
        try {
            const response = await api.get(`/api/v1/messages/conversations/${pageNumber}`);
            
            // Destructuration pour obtenir les items et l'indicateur de pagination (structure attendue)
            const { items, hasNextPage: apiHasNextPage } = response.data;

            hasNextPage = apiHasNextPage; 

            if (Array.isArray(items)) {
                if (pageNumber === 1) {
                    // Pour la première page, on réinitialise et affiche les conversations
                    setConversations(items);
                } else {
                    // Pour les pages suivantes, on ajoute les nouvelles conversations à la fin
                    setConversations(prevConversations => [...prevConversations, ...items]);
                }
            } else {
                setConversations([]);
            }
        } catch (err) {
            setConversationsError("Impossible de charger les conversations.");
            hasNextPage = false; 
        } finally {
            setLoadingConversations(false);
        }
        
        // Retourne le statut de pagination pour le composant MyChats
        return hasNextPage; 
    };
    
    // ===================================================
    // GET /api/v1/messages/{reservationId}/{pageNumber}
    // Charge les messages d'un fil de discussion
    // ===================================================
    /**
     * Charge une page de messages pour une réservation donnée.
     * @param {string} reservationId - L'ID de la réservation.
     * @param {number} pageNumber - Le numéro de la page à charger (défaut: 1).
     * @returns {boolean} Indique s'il existe une page suivante (hasNextPage).
     */
    const fetchMessages = async (reservationId, pageNumber = 1) => {
        // Enregistre la conversation demandée pour gérer le risque de race condition
        if (pageNumber === 1) {
            setCurrentReservationId(reservationId);
            setMessages([]); // On vide toujours pour le changement de conversation
        }
        
        setLoadingMessages(true);
        setMessagesError(null);
        let hasNextPage = false;
        
        try {
            const response = await api.get(`/api/v1/messages/${reservationId}/${pageNumber}`);
            
            // 🛑 CORRECTION ICI: La réponse.data est un tableau, pas un objet paginé.
            const items = response.data; 
            // =========================================================
            // Logique de pagination MANUELLE basée sur la taille du tableau retourné
            // Si l'API renvoie TOUS les messages en une fois, supprimez cette partie.
            // Si l'API renvoie par page (ex: 8 messages/page), ajustez PAGE_SIZE.
            // =========================================================
            const PAGE_SIZE = 8; // Assurez-vous que cette taille correspond à la taille de page API
            hasNextPage = items.length === PAGE_SIZE; 
            // =========================================================
            
            if (Array.isArray(items)) {
                
           
                
                // IMPORTANT : Inverse les messages. L'API semble renvoyer du plus récent au plus ancien.
                const newMessages = items.reverse();
                console.log(newMessages)
                if (pageNumber === 1) {
                    // Première page : écrase tout (déjà fait, mais on met les nouveaux messages)
                    setMessages(newMessages); 
                } else {
                    // Pages suivantes (historique) : ajoute les NOUVEAUX messages (plus anciens) au DÉBUT de la liste.
                    setMessages(prevMessages => [...newMessages, ...prevMessages]); 
                }
            } else {
                setMessages([]);
            }
        } catch (err) {
            hasNextPage = false;
            // Utilise la structure Problem Details (title et detail) pour le message d'erreur
            const errorMessage = err.response?.data?.detail 
                || err.response?.data?.title 
                || "Impossible de charger les messages. Vérifiez la connexion.";
            setMessagesError(errorMessage);
        } finally {
            setLoadingMessages(false);
        }

        return hasNextPage; // Retourne l'indicateur pour le composant
    };

    // ===================================================
    // POST /api/v1/messages/{reservationId}
    // Envoie un message
    // ===================================================
    const sendMessage = async (reservationId, content) => {
        try {
            // Le corps de la requête est un objet JSON { content: "..." }
            const response = await api.post(`/api/v1/messages/${reservationId}`, { content }); 
            
            if (response.data) {
                // Ajout du nouveau message à la FIN pour l'affichage en temps réel
                setMessages(prevMessages => [...prevMessages, response.data]);
                
                // Mettre à jour l'aperçu de la conversation pour qu'il affiche le nouveau dernier message
                setConversations(prevConversations => 
                    prevConversations.map(conv => 
                        conv.reservationId === reservationId ? { ...conv, lastMessage: response.data } : conv
                    )
                );
            }
            return response.data; 
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
            // Utilise la structure Problem Details pour l'erreur lancée
            const errorDetail = err.response?.data?.detail || "Impossible d'envoyer le message.";
            throw new Error(errorDetail);
        }
    };

    // ===================================================
    // PUT /api/v1/messages/mark-as-seen/{messageId}
    // ===================================================
    const markMessageAsSeen = async (messageId) => {
        try {
            await api.put(`/api/v1/messages/mark-as-seen/${messageId}`);
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg.messageId === messageId ? { ...msg, hasBeenSeen: true } : msg
                )
            );
        } catch (err) {
            console.error(`Erreur lors du marquage du message ${messageId}:`, err);
        }
    };

    // ===================================================
    // PUT /api/v1/messages/mark-all-as-seen/{reservationId}
    // ===================================================
    const markAllAsSeen = async (reservationId) => {
        try {
            await api.put(`/api/v1/messages/mark-all-as-seen/${reservationId}`);
            
            // 1. Mettre à jour les conversations pour retirer le flag non vu
            setConversations(prevConversations =>
                prevConversations.map(conv => 
                    conv.reservationId === reservationId ? { ...conv, hasUnseenMessages: false } : conv
                )
            );

            // 2. Mettre à jour la liste des messages ouverts
            setMessages(prevMessages => 
                prevMessages.map(msg => ({ ...msg, hasBeenSeen: true }))
            );
        } catch (err) {
            console.error(`Erreur lors du marquage de tous les messages de la conversation ${reservationId}:`, err);
        }
    };
    
    // ===================================================
    // EFFET INITIAL
    // ===================================================

    // Charge la première page de conversations au montage
    useEffect(() => {
        fetchConversations(1);
    }, []);

    // ===================================================
    // VALEUR DU CONTEXTE
    // ===================================================

    const value = {
        // Conversations
        conversations,
        loadingConversations,
        conversationsError,
        fetchConversations,
        
        // Messages
        messages,
        loadingMessages,
        messagesError,
        fetchMessages,
        currentReservationId, // Ajouté pour le suivi
        setCurrentReservationId, // Ajouté pour permettre au composant parent de réinitialiser l'état
        
        // Actions
        sendMessage,
        markMessageAsSeen,
        markAllAsSeen
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}