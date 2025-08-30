import { useContext } from 'react'; 
import { StatsContext } from '../contexts/StatsContext';

const useStats = () => {
    const context = useContext(StatsContext);

    if (!context) {
        throw new Error('useStats doit être utilisé à l\'intérieur d\'un CarContextProvider');
    }

    return context;
};

export default useStats;
