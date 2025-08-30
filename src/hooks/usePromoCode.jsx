import { useContext } from "react";
import { PromoCodeContext } from "../contexts/PromoCodeCotext";

export default function usePromoCode(){
    const context = useContext(PromoCodeContext)
    if(!context) throw new Error("the useContext hook must be used under a AuthContextProvider");
    return context;
}