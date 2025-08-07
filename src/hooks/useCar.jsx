import { useContext } from 'react';
import { carContext } from '../contexts/carContext'; // Assurez-vous que le chemin est correct

const useCars = () => {
    const context = useContext(carContext);

    if (!context) {
        throw new Error('useCars doit être utilisé à l\'intérieur d\'un CarContextProvider');
    }

    return context;
};

export default useCars;
