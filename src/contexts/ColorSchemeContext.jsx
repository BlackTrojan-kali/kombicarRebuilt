import { createContext, useEffect, useState } from "react";

export const ColorSchemeContext = createContext({});


export function ColorSchemeProvider({children}){
    const [theme,setTheme] = useState(localStorage.theme);
    const colorScheme = theme ==="dark" ? "light" :"dark";
    useEffect(()=>{
        const root =window.document.documentElement;
        root.classList.remove(colorScheme);
        root.classList.add(theme);
        localStorage.setItem("theme",theme);
    },[colorScheme,setTheme])
    return(
        <ColorSchemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ColorSchemeContext.Provider>
    )
}