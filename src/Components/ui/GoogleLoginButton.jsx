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
    console.log(response)
    const res = api.post("/api/v1/users/login-google", { token: response.credential })
    console.log(res)
  };

  return <div id="google-btn"></div>;

}

export default GoogleLoginButton;