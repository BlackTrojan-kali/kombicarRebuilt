import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

export default function useAuth(){
    const context = useContext(authContext)
    if(!context) throw new Error("the useContext hook must be used under a AuthContextProvider");
    return context;
}