import { useContext } from "react";
import { ReservationContext } from "../contexts/ReservationContext";

export default function useReservation(){
    const context = useContext(ReservationContext)
    if(!context) throw new Error("the useContext hook must be used under a AuthContextProvider");
    return context;
}