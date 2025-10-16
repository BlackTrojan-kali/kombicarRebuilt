import { useContext } from "react";
import { createContext } from "vm";
import api from "../api/api";
import { API_URL } from "../api/api-settings";

const NotificationContext = createContext({})


export function NotificationContextProvider ({children}){
    const [notification,setNotification]= useState([]);
    
    //liste des notifications
    const getNotification = async(page=1)=>{
        try{
            const res  = await api.get(`${API_URL}/api/v1/notifications/${page}`);
            return res;
        }catch(err){
            console.error("erreur de recuperation des notification"+err);
        }
    }

    //details d'une notification
    const getNotificationById = async(id)=>{    
        try{
            const res = await api.get(`${API_URL}/api/v1/notifications/${id}`);
            return res;
        }catch(err){
            console.error("erreur lors de la recuperation des details de la notification");
        }
    }
    //modifier le contenue d'une notification
    
    const ExportValues= {
        notification,
        setNotification
    }
    
    return(
        <NotificationContext.Provider value={ExportValues}>
            {children}
        </NotificationContext.Provider>
    )
}