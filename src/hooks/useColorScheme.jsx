import { useContext } from "react";
import { ColorSchemeContext } from "../contexts/ColorSchemeContext";

export default function useColorScheme(){
    const context = useContext(ColorSchemeContext)
    if(!context) throw new Error("the useColorScheme must be use under a ColorSchemeProvider");
    return context
}