import { createContext } from "react";

const GestionStateContext = createContext({})

export function GestionStateContextProvider (children){
    const [gestionState,setGestionState]= useState(localStorage.getItem("gestionMode") ? localStorage.getItem("gestionMode"):"vtc")
    const changeMode = (mode)=>{
        localStorage.setItem(mode)
        setGestionState(mode)
    }
    return (
        <GestionStateContext.Provider value={{gestionState,changeMode}}>
            {children}
        </GestionStateContext.Provider>
    )
    
}