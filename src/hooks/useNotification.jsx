import { useContext } from 'react';
import NotificationContext from '../contexts/NotificationContext';


const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useCars doit être utilisé à l\'intérieur d\'un CarContextProvider');
    }

    return context;
};

export default useNotification;
