import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
export default function useUser(){
    const context = useContext(UserContext)
    if(!context) throw new Error("the useContext hook must be used under a AuthContextProvider");
    return context;
}