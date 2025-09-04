import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";

function GoogleLoginButton() {
    const { loginGoogle } = useAuth();

    const handleCredentialResponse = (response) => {
        // Envoie le token à ton backend
        console.log(response);
        loginGoogle(response.credential);
    };

    useEffect(() => {
        // La ligne suivante est une bonne pratique pour éviter une erreur de lint,
        // mais elle n'est pas nécessaire pour le bon fonctionnement du code.
        // eslint-disable-next-line no-undef
        if (window.google) {
            google.accounts.id.initialize({
                client_id: "246979621166-sah339sh5nge2n3epsdbj1kegv60htqb.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("google-btn"),
                { theme: "outline", size: "large" }
            );
        }
    }, [handleCredentialResponse]); // Ajout de la dépendance handleCredentialResponse

    return <div id="google-btn"></div>;
}

export default GoogleLoginButton;