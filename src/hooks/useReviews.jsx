import { useContext } from "react";
import { reviewContext } from "../contexts/reviewContext";

export default function useReviews(){
    const context= useContext(reviewContext)

    if(!context){
        throw new Error("the useReview hook should be used in a ReviewContextProvider ");
    }

    return context
}