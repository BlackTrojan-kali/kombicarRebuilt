import { useContext } from 'react';
import { tripContext } from '../contexts/TripContext'; // Assurez-vous que le chemin est correct

const useTrips = () => {
    const context = useContext(tripContext);

    if (context === undefined) {
        throw new Error('useTrips doit être utilisé à l\'intérieur d\'un TripContextProvider');
    }

    return context;
};

export default useTrips;
