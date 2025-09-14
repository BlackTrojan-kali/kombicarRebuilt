import { useContext } from 'react';
import { withdrawContext } from '../contexts/withdrawContext';

const useWithDraw = () => {
    const context = useContext(withdrawContext);

    if (!context) {
        throw new Error('useWithdraw doit être utilisé à l\'intérieur d\'un withdrawContextProvider');
    }

    return context;
};

export default useWithDraw;
