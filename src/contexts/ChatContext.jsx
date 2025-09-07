import { createContext, useState, useEffect } from "react";
import api from '../api';

export const ChatContext = createContext({});

export function ChatContextProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversationsError, setConversationsError] = useState(null);

    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    // GET /api/v1/messages/conversations
    const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
            const response = await api.get('/messages/conversations');
            if (Array.isArray(response.data)) {
                setConversations(response.data);
            } else {
                setConversations([]);
            }
            setConversationsError(null);
        } catch (err) {
            setConversationsError("Impossible de charger les conversations.");
        } finally {
            setLoadingConversations(false);
        }
    };
    
    // GET /api/v1/messages/{reservationId}/{pageNumber}
    const fetchMessages = async (reservationId, pageNumber) => {
        setLoadingMessages(true);
        setMessagesError(null);
        try {
            const response = await api.get(`/messages/${reservationId}/${pageNumber}`);
            if (Array.isArray(response.data)) {
                if (pageNumber === 1) {
                    setMessages(response.data);
                } else {
                    setMessages(prevMessages => [...prevMessages, ...response.data]);
                }
            } else {
                setMessages([]);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.title) {
                setMessagesError(err.response.data.detail || err.response.data.title);
            } else {
                setMessagesError("Impossible de charger les messages.");
            }
        } finally {
            setLoadingMessages(false);
        }
    };

    // POST /api/v1/messages/{reservationId}
    const sendMessage = async (reservationId, content) => {
        try {
            const response = await api.post(`/messages/${reservationId}`, { content });
            if (response.data) {
                setMessages(prevMessages => [...prevMessages, response.data]);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
            setMessagesError("Impossible d'envoyer le message.");
        }
    };

    // PUT /api/v1/messages/mark-as-seen/{messageId}
    const markMessageAsSeen = async (messageId) => {
        try {
            await api.put(`/messages/mark-as-seen/${messageId}`);
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg.messageId === messageId ? { ...msg, hasBeenSeen: true } : msg
                )
            );
        } catch (err) {
            console.error(`Erreur lors du marquage du message ${messageId}:`, err);
        }
    };

    // PUT /api/v1/messages/mark-all-as-seen/{reservationId}
    const markAllAsSeen = async (reservationId) => {
        try {
            await api.put(`/messages/mark-all-as-seen/${reservationId}`);
            
            setConversations(prevConversations =>
                prevConversations.map(conv => 
                    conv.reservationId === reservationId ? { ...conv, hasUnseenMessages: false } : conv
                )
            );

            setMessages(prevMessages => 
                prevMessages.map(msg => ({ ...msg, hasBeenSeen: true }))
            );
        } catch (err) {
            console.error(`Erreur lors du marquage de tous les messages de la conversation ${reservationId}:`, err);
        }
    };
    
    useEffect(() => {
        fetchConversations();
    }, []);

    const value = {
        conversations,
        loadingConversations,
        conversationsError,
        fetchConversations,
        
        messages,
        loadingMessages,
        messagesError,
        fetchMessages,
        
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