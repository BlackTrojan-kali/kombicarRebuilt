import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faUserCircle,
    faEnvelope,
    faSpinner,
    faHourglassHalf
} from "@fortawesome/free-solid-svg-icons";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";

const MyChats = () => {
    const {
        conversations,
        loadingConversations,
        conversationsError,
        fetchConversations
    } = useChat();
    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef(null);

    // =====================================================
    // Formatage des dates
    // =====================================================
    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return (
            date.toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }) +
            " à " +
            date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };

    // =====================================================
    // Chargement d'une page de conversations
    // =====================================================
    const loadConversationsPage = useCallback(
        async (pageToLoad = 1) => {
            if (!hasMore || loadingConversations) return;

            try {
                const nextHasMore = await fetchConversations(pageToLoad);
                setHasMore(nextHasMore);
                setCurrentPage(pageToLoad);
            } catch (error) {
                console.error("Erreur lors du chargement des conversations:", error);
                setHasMore(false);
            }
        },
        [hasMore,]
    );

    // =====================================================
    // Chargement initial
    // =====================================================
    useEffect(() => {
        if (user) {
            setCurrentPage(1);
            setHasMore(true);
            loadConversationsPage(1);
        }
    }, [user, loadConversationsPage]);

    // =====================================================
    // Scroll infini via Intersection Observer
    // =====================================================
    useEffect(() => {
        if (!loadMoreRef.current || !user || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingConversations) {
                    loadConversationsPage(currentPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        const currentRef = loadMoreRef.current;
        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [hasMore, currentPage, user]);

    // =====================================================
    // Rendu
    // =====================================================
    if (loadingConversations && conversations.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen dark:text-white">
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="mr-2 text-blue-500"
                />
                Chargement des conversations...
            </div>
        );
    }

    if (conversationsError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400 p-4 text-center">
                {conversationsError}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen pt-24 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                Mes conversations
            </h1>

            {/* Aucune conversation */}
            {conversations.length === 0 && !loadingConversations ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Vous n'avez pas encore de conversations.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {conversations.map((chat) => (
                        <li key={chat.reservationId}>
                            <Link
                                to={`/chat/${chat.reservationId}`}
                                className={`flex items-center p-4 rounded-lg shadow-md transition-all duration-200 ${
                                    chat.hasUnseenMessages
                                        ? "bg-blue-100 dark:bg-blue-800 border-l-4 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-700"
                                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                {/* Avatar utilisateur */}
                                <div className="relative flex-shrink-0">
                                    <FontAwesomeIcon
                                        icon={faUserCircle}
                                        className="text-5xl text-gray-400 dark:text-gray-500"
                                    />
                                    {chat.hasUnseenMessages && (
                                        <FontAwesomeIcon
                                            icon={faEnvelope}
                                            className="absolute bottom-0 right-0 text-red-500 text-xl -translate-x-1 -translate-y-1"
                                        />
                                    )}
                                </div>

                                {/* Contenu */}
                                <div className="ml-4 flex-grow min-w-0">
                                    <h2
                                        className={`font-semibold text-lg truncate ${
                                            chat.hasUnseenMessages
                                                ? "text-blue-600 dark:text-blue-200"
                                                : "text-gray-900 dark:text-gray-100"
                                        }`}
                                    >
                                        Conversation avec :{" "}
                                        <span className="text-green-500">
                                            {chat.otherUserFullName ||
                                                "Utilisateur Inconnu"}
                                        </span>
                                        <span className="text-gray-500 font-normal ml-2">
                                            Réservation #{chat.reservationId}
                                        </span>
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {chat.lastMessage?.content ||
                                            chat.lastMessageContent ||
                                            "Démarrer la conversation..."}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Dernier message :{" "}
                                        {chat.lastMessage?.sendedAt ||
                                        chat.lastMessageSendedAt
                                            ? formatTime(
                                                  chat.lastMessage?.sendedAt ||
                                                      chat.lastMessageSendedAt
                                              )
                                            : "N/A"}
                                    </p>
                                </div>

                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="ml-auto text-gray-400 text-xl"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* Footer / Pagination */}
            <div className="mt-8 text-center">
                {loadingConversations && conversations.length > 0 && (
                    <div className="py-2 px-4 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center mx-auto">
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Chargement de la page {currentPage + 1}...
                    </div>
                )}

                {!loadingConversations && hasMore && conversations.length > 0 && (
                    <div
                        ref={loadMoreRef}
                        className="py-4 text-gray-600 dark:text-gray-400 cursor-pointer hover:underline"
                        onClick={() => loadConversationsPage(currentPage + 1)}
                    >
                        Cliquez ou faites défiler pour charger plus... (Page{" "}
                        {currentPage + 1})
                    </div>
                )}

                {!loadingConversations && !hasMore && conversations.length > 0 && (
                    <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faHourglassHalf}
                            className="mr-2"
                        />
                        Vous avez atteint la fin de la liste.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MyChats;
