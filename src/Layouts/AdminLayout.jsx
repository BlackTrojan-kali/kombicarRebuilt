import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth'; // Assurez-vous que le chemin est correct

// Ce composant est un "Layout" ou une "Garde de Route"
// Il vérifie si l'utilisateur est connecté et a le rôle d'administrateur.
// Si ce n'est pas le cas, il le redirige vers la page de connexion.
const AdminLayout = () => {
    // Utilise le hook useAuth pour obtenir l'état de l'utilisateur et le statut de chargement.
    const { user, loading } = useAuth();
    // Hook de navigation pour les redirections.
    const navigate = useNavigate();

    // useEffect est utilisé pour vérifier l'état d'authentification et le rôle de l'utilisateur
    // à chaque fois que l'état 'user' ou 'loading' change.
    useEffect(() => {
        // La vérification doit se faire après le chargement initial de l'authentification.
        if (!loading) {
            // Si l'utilisateur n'est pas connecté ou si son rôle n'est pas 'Admin',
            // on le redirige.
            if (!user || user.role !== 'Admin') {
                console.log("Accès refusé. Redirection vers la page de connexion.");
                // 'replace: true' empêche l'utilisateur de revenir en arrière avec le bouton du navigateur.
                navigate('/admin/signin', { replace: true });
            }
        }
    }, [user, loading, navigate]); // Les dépendances assurent que le useEffect se déclenche correctement.

    // Affiche un état de chargement pendant la vérification initiale.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Chargement en cours...</p>
            </div>
        );
    }
    
    // Si l'utilisateur est un Admin, on rend le contenu enfant via <Outlet />.
    // L'Outlet est la place réservée pour les composants enfants (par ex. Dashboard, Admins, etc.).
    if (user && user.role === 'Admin') {
        return <Outlet />;
    }

    // Retourne null si la redirection est en cours pour éviter de rendre du contenu temporairement.
    return null;
};

export default AdminLayout;
