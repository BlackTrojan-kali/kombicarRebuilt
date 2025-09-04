import { useEffect } from "react";
import api from "../../api/api";
function GoogleLoginButton() {

  useEffect(() => {
    window.google
    /* global google */
    google.accounts.id.initialize({
      client_id: "246979621166-sah339sh5nge2n3epsdbj1kegv60htqb.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    // Envoie le token à ton backend
    api.post("/api/v1/users/google-login", { token: response.credential })
    .then(res => res.json())
    .then(data => {
      // le JWT et le refresh token sont dans 'data'
      console.log("JWT + refresh token backend:", data);
    });
  };

  return <div id="google-btn"></div>;

}

export default GoogleLoginButton;