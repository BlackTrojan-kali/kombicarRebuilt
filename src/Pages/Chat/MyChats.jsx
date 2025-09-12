import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserCircle, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import useChat from "../../hooks/useChat";

const MyChats = () => {
    const { conversations, loadingConversations, conversationsError, fetchConversations } = useChat();

    useEffect(() => {
        // Appeler la fonction de récupération des conversations depuis le contexte si l'état est vide
        // Ceci est une bonne pratique pour s'assurer que les données sont là si elles n'ont pas encore été chargées par un parent
        if (conversations.length === 0 && !loadingConversations) {
            fetchConversations();
        }
    }, [conversations]);


    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' }) + " à " + date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
    };

    if (loadingConversations) {
        return <div className="flex justify-center items-center h-screen dark:text-white">Chargement des conversations...</div>;
    }

    if (conversationsError) {
        return <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400">{conversationsError}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen pt-24 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Mes conversations</h1>

            {conversations.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Vous n'avez pas encore de conversations.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {conversations.map((chat) => (
                        <li key={chat.reservationId}>
                            <Link
                                to={`/chat/${chat.reservationId}`}
                                className={`flex items-center p-4 rounded-lg shadow-md transition-all duration-200
                                           ${chat.hasUnseenMessages ? 'bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-500' : 'bg-white dark:bg-gray-800'}`}
                            >
                                {/* Photo de profil de l'autre utilisateur */}
                                <div className="relative flex-shrink-0">
                                    <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-gray-400 dark:text-gray-500" />
                                    {chat.hasUnseenMessages && (
                                        <FontAwesomeIcon icon={faEnvelope} className="absolute bottom-0 right-0 text-red-500 text-xl -translate-x-1 -translate-y-1" />
                                    )}
                                </div>
                                
                                <div className="ml-4 flex-grow">
                                    <h2 className={`font-semibold text-lg ${chat.hasUnseenMessages ? 'text-blue-600 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}`}>
                                        Conversation avec {chat.otherUserId}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[80%]">
                                        {chat.lastMessageContent}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Dernier message : {formatTime(chat.lastMessageSendedAt)}
                                    </p>
                                </div>

                                <FontAwesomeIcon icon={faChevronRight} className="ml-auto text-gray-400 text-xl" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyChats;
