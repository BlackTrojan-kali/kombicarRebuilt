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
import VehiculeDoc from "./Pages/Client/VehiculeDoc" // Import du nouveau composant

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


const Routes = () => {
  const route = useRoutes([
    {
      // ------------------------------------
      // SECTION CLIENT (Layout: ClientLayout)
      // ------------------------------------
      path:"/",
      element:<ClientLayout/>,
      children:[
        // Chemin racine (Accueil)
        {
          index: true, // Remplace path: "/" dans les enfants
          element:<Home/>
        },
        {
          path:"covoiturage",
          element:<Covoiturage/>
        },
        {
          path:"taxi",
          element:<Taxi/>
        },
        {
          path:"trip-detail/:tripId",
          element:<TripDetail/>
        },
        {
          path:"publish-trip",
          element:<Publish/>
        },
        {
          path:"results",
          element:<Results/>
        },
        // Routes du profil utilisateur (imbriquées sous ClientLayout)
        {
          path:"profile",
          element:<Profile/>
        },
        {
          path:"profile/car", 
          element:<MyVehicle/>
        },
        // Ajout de la nouvelle route pour les documents de véhicule
        {
          path:"profile/car/documents/:carId",
          element:<VehiculeDoc/>
        },
        {
          path:"profile/wallet", 
          element:<UserWallet/>
        }
      ]
    },
    {
      // ---------------------------------
      // SECTION AUTHENTIFICATION (Layout: AuthLayout)
      // ---------------------------------
      path:"auth", // Chemin de base "/auth"
      element:<AuthLayout/>,
      children:[
        {
          // Chemin final: /auth/signin
          path:"signin", 
          element:<Signin/>
        },
        {
          // ERREUR CORRIGÉE: Le composant doit être rendu, pas une chaîne de caractères
          // Chemin final: /auth/signup
          path:"signup", 
          element:<Signup/> 
        },
        {
          // Chemin final: /auth/confirm-email
          path:"confirm-email",
          element:<ConfirmEmail/>
        }
      ]
    },
    {
      // ------------------------------------
      // SECTION ADMIN (Connexion)
      // ------------------------------------
      path:"/admin/signin", // Doit être une route de niveau supérieur
      element:<SignInAdmin/>
    },
    {
      // ------------------------------------
      // SECTION ADMIN (Dashboard Layout)
      // ------------------------------------
      path:"admin", // Chemin de base "/admin"
      element:<DashboardLayout/>,
      children:[
        {
        // Chemin final: /admin/dashboard
        path:"dashboard",
        element:<Dashboard/>
      },
        {
        // Chemin final: /admin/admins
        path:"admins",
        element:<Admins/>
      },
        {
        path:"drivers",
        element:<Drivers/>
      },
        {
        path:"users",
        element:<Utilisateurs/>
      },
      {
        path:"trajets/:type",
        element:<Trajets/>
      },
      {
        path:"cars",
        element:<Cars/>
      },
      {
        path:"cars-type",
        element:<CarTypes/>
      },
      {
        path:"colors",
        element:<Colors/>
      },
      {
        path:"wallets",
        element:<Wallet/>
      },
      ]
    }
  ])
  return route
}

export default Routes;
