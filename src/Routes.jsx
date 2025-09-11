import { useRoutes } from "react-router-dom"
import Home from "./Pages/Home"
import ClientLayout from "./Layouts/ClientLayout"
import AuthLayout from "./Layouts/AuthLayout"
import Signin from "./Pages/Auth/Signin"
import Signup from "./Pages/Auth/Signup"
import Covoiturage from "./Pages/Covoiturage"
import Taxi from "./Pages/Taxi"
import Results from "./Pages/Results"
import TripDetail from "./Pages/TripDetail"
import Profile from "./Pages/Client/Profile"
import MyVehicle from "./Pages/Client/Vehicule" 
import UserWallet from "./Pages/Client/UserWallet"
import VehiculeDoc from "./Pages/Client/VehiculeDoc" 
import MyDrivingLicence from "./Pages/Client/MyDrivingLicence"

import DashboardLayout from "./Layouts/DashboardLayout"
import Dashboard from "./Pages/Dashboard/Dashboard"
import Admins from "./Pages/Dashboard/Admins"
import Drivers from "./Pages/Dashboard/Drivers"
import Utilisateurs from "./Pages/Dashboard/Utilisateurs"
import Trajets from "./Pages/Dashboard/Trajets"
import Cars from "./Pages/Dashboard/Cars"
import CarTypes from "./Pages/Dashboard/CarTypes"
import Colors from "./Pages/Dashboard/Colors"
import Wallet from "./Pages/Dashboard/Wallet"
import Publish from "./Pages/Publish"
import SignInAdmin from "./Pages/Auth/SignInAdmin"
import ConfirmEmail from "./Pages/Auth/ConfirmEmail"
import { StatsContextProvider } from "./contexts/StatsContext"

// Nouveaux imports pour les pages des codes promo
import PromoCode from "./Pages/Dashboard/PromoCode/PromoCode"
import PromoCodeDetails from "./Pages/Dashboard/PromoCode/PromoCodeDetails"
import MyReservations from "./Pages/Client/MyReservations"
import ChatRoom from "./Pages/Chat/ChatRoom" // 🎯 Importation du composant ChatRoom
import MyChats from "./Pages/Chat/MyChats" // 🎯 Importation du composant MyChats
import { ChatContextProvider } from "./contexts/ChatContext"

const Routes = () => {
  const route = useRoutes([
    {
      // ------------------------------------
      // SECTION CLIENT (Layout: ClientLayout)
      // ------------------------------------
      path: "/",
      element: <ClientLayout/>,
      children: [
        {
          index: true, // Chemin racine (Accueil)
          element: <Home/>
        },
        {
          path: "covoiturage",
          element: <Covoiturage/>
        },
        {
          path: "taxi",
          element: <Taxi/>
        },
        {
          path: "trip-detail/:tripId",
          element: <TripDetail/>
        },
        {
          path: "publish-trip",
          element: <Publish/>
        },
        {
          // La route "results" acceptera désormais des paramètres optionnels dans l'URL
          path: "results",
          element: <Results/>
        },
        // Routes du profil utilisateur (imbriquées sous ClientLayout)
        {
          path: "profile",
          element: <Profile/>
        },
        {
          path: "profile/car", 
          element: <MyVehicle/>
        },
        {
          path: "profile/car/:carId/documents", // Chemin mis à jour pour être plus sémantique
          element: <VehiculeDoc/>
        },
        {
          path: "profile/wallet", 
          element: <UserWallet/>
        },
        {
          path: "profile/reservations", 
          element: <MyReservations/>
        },
        {
          path: "profile/licence",
          element: <MyDrivingLicence/>
        },
        // 🎯 Nouvelle route pour la liste des conversations
        {
          path: "profile/chats",
          element: <ChatContextProvider><MyChats/></ChatContextProvider>
        },
        // 🎯 Nouvelle route pour la salle de chat
        {
          path: "chat/:reservationId",
          element:<ChatContextProvider> <ChatRoom/></ChatContextProvider>
        }
      ]
    },
    {
      // ---------------------------------
      // SECTION AUTHENTIFICATION (Layout: AuthLayout)
      // ---------------------------------
      path: "/auth",
      element: <AuthLayout/>,
      children: [
        {
          index: true, // Redirige la route de base /auth vers /auth/signin
          element: <Signin/>
        },
        {
          path: "signin", 
          element: <Signin/> 
        },
        {
          path: "signup", 
          element: <Signup/> 
        },
        {
          path: "confirm-email",
          element: <ConfirmEmail/>
        }
      ]
    },
    {
      // ------------------------------------
      // SECTION ADMIN (Connexion)
      // ------------------------------------
      path: "admin/signin",
      element: <SignInAdmin/>
    },
    {
      // ------------------------------------
      // SECTION ADMIN (Dashboard Layout)
      // ------------------------------------
      path: "admin",
      element: <StatsContextProvider><DashboardLayout/></StatsContextProvider>,
      children: [
        {
          path: "dashboard",
          element: <Dashboard/>
        },
        {
          path: "admins",
          element: <Admins/>
        },
        {
          path: "drivers",
          element: <Drivers/>
        },
        {
          path: "users",
          element: <Utilisateurs/>
        },
        {
          path: "trajets/:type",
          element: <Trajets/>
        },
        {
          path: "cars",
          element: <Cars/>
        },
        {
          path: "cars-type",
          element: <CarTypes/>
        },
        {
          path: "colors",
          element: <Colors/>
        },
        {
          path: "wallets",
          element: <Wallet/>
        },
        // Routes pour la gestion des codes promo
        {
          path: "promocodes",
          children: [
            {
              index: true, // Redirige vers la liste par défaut si on accède à /admin/promocodes
              element: <PromoCode />
            },
            {
              path: "list/:type", // Chemin pour la liste avec un paramètre de type
              element: <PromoCode />
            },
            {
              path: "details/:id", // Chemin pour les détails d'un code
              element: <PromoCodeDetails />
            }
          ]
        },
      ]
    }
  ]);
  return route;
}

export default Routes;
