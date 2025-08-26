"use client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'; // Importations mises à jour pour React Router
import { Toaster, toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth'; // Assurez-vous que le chemin est correct

export default function ConfirmEmail() {
    // Récupère les fonctions et les états nécessaires du contexte
    const { confirmEmail, resendConfirmationEmail, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Vérification de votre e-mail en cours...");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [email, setEmail] = useState(""); // Nouvel état pour l'email à renvoyer

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            const verifyEmail = async () => {
                const success = await confirmEmail(token);
                if (success) {
                    setMessage("Votre adresse e-mail a été confirmée avec succès !");
                    setIsConfirmed(true);
                    toast.success("Votre e-mail est confirmé ! Vous pouvez vous connecter.", {
                        position: "top-center",
                    });
                } else {
                    setMessage("La confirmation de votre e-mail a échoué. Le lien est invalide ou a expiré.");
                    setIsConfirmed(false);
                }
            };
            verifyEmail();
        } else {
            setMessage("Lien de confirmation invalide. Le token est manquant.");
        }
    }, [])//confirmEmail, searchParams]);

    // Fonction de redirection vers la page de connexion
    const goToLogin = () => {
        navigate('/login');
    };

    // Fonction pour gérer l'envoi du nouvel e-mail de confirmation
    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Veuillez saisir votre adresse e-mail.", {
                position: "top-right",
            });
            return;
        }
        await resendConfirmationEmail(email);
    };

    return (
        <>
            <Toaster />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center space-y-6">
                    <picture>
                        <img
                            src="/default/logo.png"
                            alt="Logo Kombicar"
                            className="w-[80px] h-[80px] mx-auto"
                        />
                    </picture>
                    <h2 className="text-3xl font-bold text-gray-800">Confirmation d'e-mail</h2>
                    <p className="text-gray-600">
                        {message}
                    </p>
                    {isConfirmed && (
                        <button
                            onClick={goToLogin}
                            disabled={loading}
                            className="w-full bg-[#2682F3] hover:bg-[#0B32B5] text-white text-xl p-3 rounded-md transition duration-300 ease-in-out disabled:bg-gray-400"
                        >
                            {loading ? "Chargement..." : "Se connecter"}
                        </button>
                    )}
                    {!isConfirmed && !loading && (
                        <>
                            <p className="text-sm text-gray-500">
                                Si le lien est invalide, vous pouvez en demander un nouveau ci-dessous.
                            </p>
                            <div className="flex flex-col space-y-4">
                                <input
                                    type="email"
                                    placeholder="Entrez votre email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2682F3]"
                                />
                                <button
                                    onClick={handleResendEmail}
                                    disabled={loading}
                                    className="w-full bg-gray-500 hover:bg-gray-700 text-white text-xl p-3 rounded-md transition duration-300 ease-in-out disabled:bg-gray-400"
                                >
                                    {loading ? "Envoi..." : "Renvoyer l'e-mail"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
