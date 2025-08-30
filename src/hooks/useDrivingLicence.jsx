    import React, { useContext } from 'react'
    import { DrivingLicenceContext } from '../contexts/DrivingLicenceContext'

    const useDrivingLicence = () => {
        const context = useContext(DrivingLicenceContext)
    
        if(!context) throw new Error("the useColorScheme must be use under a ColorSchemeProvider");
        return context
    
    }

    export default useDrivingLicence
