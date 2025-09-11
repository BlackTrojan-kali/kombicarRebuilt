import React, { useState, useEffect, useRef } from 'react';
import useChat from '../../hooks/useChat'; // Assuming this is your custom hook
import useAuth from '../../hooks/useAuth'; // To get the current user's ID
import { useParams } from 'react-router-dom'; // Assuming react-router-dom for reservationId

const ChatRoom = () => {
    const { 
        messages, 
        loadingMessages, 
        messagesError, 
        fetchMessages, 
        sendMessage, 
        markAllAsSeen 
    } = useChat();
    const { user } = useAuth(); // Get current user for message identification

    // Assuming you get the reservationId from the URL for a specific chat
    const { reservationId } = useParams(); 
    const [newMessageContent, setNewMessageContent] = useState('');
    const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message
    const [pageNumber, setPageNumber] = useState(1); // For pagination

    // Fetch messages when the component mounts or reservationId changes
    useEffect(() => {
        if (reservationId) {
            fetchMessages(reservationId, 1); // Fetch initial page of messages
            // Mark all messages as seen when entering the chat room
            markAllAsSeen(reservationId); 
        }
    }, [reservationId]); // Re-fetch if reservationId changes

    // Scroll to the latest message whenever messages are updated
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessageContent.trim() && reservationId) {
            await sendMessage(reservationId, { content: newMessageContent });
            setNewMessageContent('');
        }
    };

    // Placeholder for who the other user is in this chat
    const otherParticipant = {
        id: 'someOtherUserId', 
        name: 'Autre Utilisateur' 
    };
    
    console.log(messages)

    if (loadingMessages) {
        return (
            <div className="flex justify-center items-center h-screen dark:text-white">
                <p>Chargement des messages...</p>
            </div>
        );
    }

    if (messagesError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 dark:text-red-400">
                <p>Erreur lors du chargement des messages: {messagesError}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 mt-10 dark:bg-gray-900 transition-colors duration-300">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Conversation avec {otherParticipant.name} (Réservation ID: {reservationId})
                </h3>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-gray-900">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Aucun message pour le moment. Envoyez-en un !</p>
                ) : (
                    messages.map((message) => (
                        <div 
                            key={message.id} 
                            className={`flex ${
                                message.fromUserId === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div 
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow 
                                    ${message.fromUserId === user?.id 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                                    }`}
                            >
                                <p className="text-sm">{message.content}</p>
                                <div className="text-xs mt-1 opacity-75">
                                    {message.sendedAt && new Date(message.sendedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {/* Read Indicator */}
                                    {message.fromUserId === user?.id && (
                                        <span className="ml-2">
                                            {message.seen ? (
                                                <span title="Vu" className="text-green-200 dark:text-green-400">✓✓</span>
                                            ) : (
                                                <span title="Envoyé" className="text-gray-300 dark:text-gray-400">✓</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200 flex items-center dark:bg-gray-800 dark:border-gray-700">
                <input
                    type="text"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
                <button
                    type="submit"
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!newMessageContent.trim()} // Disable if input is empty
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
