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
import ChatRoom from "./Pages/Chat/ChatRoom" 
import MyChats from "./Pages/Chat/MyChats" 
import { ChatContextProvider } from "./contexts/ChatContext"

// Import de la nouvelle page pour les permis de conduire
import DrivingLicences from "./Pages/Dashboard/DrivingLicences"
import DrivingLicenceDetails from "./Pages/Dashboard/DrivingLicenceDetails"

// 🆕 NOUVEAUX IMPORTS POUR LA GESTION DES RETRAITS
import UserWithdrawalHistory from "./Pages/Client/UserWithdrawalHistory"
import AdminWithdrawals from "./Pages/Dashboard/withdraw/AdminWithdrawals"
import AdminWithdrawalDetails from "./Pages/Dashboard/withdraw/AdminWithdrawalDetails"
import Reviews from "./Pages/Client/Reviews"

// 🆕 NOUVEAUX IMPORTS POUR LES AVIS
import SubmitReview from "./Pages/Client/SubmitReview";


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
          path: "results",
          element: <Results/>
        },
        // Routes du profil utilisateur
        {
          path: "profile",
          element: <Profile/>
        },
        {
          path: "profile/car",
          element: <MyVehicle/>
        },
        {
          path: "profile/car/documents/:carId",
          element: <VehiculeDoc/>
        },
        // 🆕 MISE À JOUR : Remplacement de UserWallet par UserWithdrawalHistory
        {
          path: "profile/withdrawals",
          element:<UserWithdrawalHistory/>
        },
        {
          path: "profile/reservations",
          element: <MyReservations/>
        },
        {
          path: "profile/licence",
          element: <MyDrivingLicence/>
        },
        {
          path: "profile/chats",
          element: <ChatContextProvider><MyChats/></ChatContextProvider>
        },
        {
          path: "chat/:reservationId",
          element:<ChatContextProvider> <ChatRoom/></ChatContextProvider>
        },
        // 🚧 NOTA BENE: la route "profile/reviews" est redondante
        // avec la nouvelle structure, mais nous la laissons pour ne
        // pas modifier la route existante.
        {
          path: "profile/reviews",
          element:<Reviews/>
        },
        // 🆕 NOUVELLES ROUTES POUR LES AVIS
        {
          path: "reviews/:tripId",
          element: <Reviews />
        },
        {
          path: "reviews/create/:tripId",
          element: <SubmitReview />
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
          index: true,
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
        // 🆕 NOUVELLES ROUTES pour la gestion des retraits (Admin)
        {
          path: "withdrawals",
          children: [
            {
              index: true,
              element:<AdminWithdrawals />
            },
            {
              path: "pending", // Demandes en attente
              element:<AdminWithdrawals type="pending" />
            },
            {
              path: "history", // Historique complet
              element:<AdminWithdrawals type="history" />
            },
            {
              path: "details/:requestId", // Détails d'une demande spécifique
              element:<AdminWithdrawalDetails />
            },
            {
              path: "user-history/:userId", // Historique d'un utilisateur
              element:<AdminWithdrawals type="user-history" />
            },
          ]
        },
        {
          path: "licences",
          children: [
            {
              path: ":verificationState/:page",
              element: <DrivingLicences />
            },
            {
              path: "details/:licenceId",
              element: <DrivingLicenceDetails />
            }
          ]
        },
        {
          path: "promocodes",
          children: [
            {
              index: true,
              element: <PromoCode />
            },
            {
              path: "list/:type",
              element: <PromoCode />
            },
            {
              path: "details/:id",
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