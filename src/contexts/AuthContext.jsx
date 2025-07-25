import { createContext, useEffect, useState } from "react";

export const authContext = createContext({});

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null); // Initialisé à null par défaut

    // Faux utilisateur pour le développement
    const fakeUser = {
        id: "user_123",
        username: "Jean Dupont",
        email: "jean.dupont@example.com",
        profilePicture: "https://randomuser.me/api/portraits/men/75.jpg", // Image de profil aléatoire
        bio: "Passionné par les voyages et les découvertes. J'adore rencontrer de nouvelles personnes sur la route !",
        phone: "+237 6XX XX XX XX",
        memberSince: "2023-01-15",
        tripsCompleted: 42,
        rating: 4.9,
        // Ajoutez d'autres champs pertinents pour un profil utilisateur
    };

    // Fonctions d'authentification (laissées vides pour l'exemple)
    const login = async ({ email, password }) => {
        // En mode développement, simulez une connexion réussie
        console.log("Tentative de connexion:", { email, password });
        setUser(fakeUser); // Affecte le faux utilisateur après une "connexion"
        console.log("Faux utilisateur connecté:", fakeUser.username);
    };

    const register = async ({ email, password }) => {
        console.log("Tentative d'enregistrement:", { email, password });
        // Pour l'exemple, l'enregistrement connecte aussi le faux utilisateur
        setUser(fakeUser);
        console.log("Faux utilisateur enregistré et connecté:", fakeUser.username);
    };

    const logout = async () => {
        console.log("Déconnexion de l'utilisateur.");
        setUser(null); // Réinitialise l'utilisateur à null
    };

    // Pour que le faux utilisateur soit disponible dès le chargement de l'application
    // sans avoir besoin de passer par login/register, vous pouvez l'initialiser ici.
    // **ATTENTION : À retirer en production !**
    useEffect(() => {
        if (!user) { // S'il n'y a pas déjà un utilisateur connecté
            setUser(fakeUser); // Connecte le faux utilisateur automatiquement au chargement
        }
    }, []); // Dépendance vide pour s'exécuter une seule fois au montage

    return (
        <authContext.Provider value={{ user, login, register, logout }}>
            {children}
        </authContext.Provider>
    );
}