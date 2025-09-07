import React, { useContext } from 'react'
import { ChatContext } from '../contexts/ChatContext';

const useChat = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useChat doit être utilisé à l\'intérieur d\'un ChatContextProvider');
    }

    return context;
}

export default useChat
