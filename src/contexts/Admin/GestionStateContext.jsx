import React, { createContext, useState, useContext } from "react";

// 1. Création du contexte
export const GestionStateContext = createContext({});

// 2. Le Provider qui englobe votre application
export function GestionStateContextProvider({ children }) {
    const [gestionState, setGestionState] = useState(
        localStorage.getItem("gestionMode") ? localStorage.getItem("gestionMode") : "vtc"
    );

    const changeMode = (mode) => {
        localStorage.setItem("gestionMode", mode);
        setGestionState(mode);
    };

    return (
        <GestionStateContext.Provider value={{ gestionState, changeMode }}>
            {children}
        </GestionStateContext.Provider>
    );
}

// 3. Le Hook personnalisé défini une seule fois ici
export const useGestionState = () => {
    return useContext(GestionStateContext);
};