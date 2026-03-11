import { useRoutes } from "react-router-dom";
import Home from "./Pages/Home";
import ClientLayout from "./Layouts/ClientLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Signin from "./Pages/Auth/Signin";
import Signup from "./Pages/Auth/Signup";
import Covoiturage from "./Pages/Covoiturage";
import Taxi from "./Pages/Taxi";
import Results from "./Pages/Results";
import TripDetail from "./Pages/TripDetail";
import Profile from "./Pages/Client/Profile";
import MyVehicle from "./Pages/Client/Vehicule";
import VehiculeDoc from "./Pages/Client/VehiculeDoc";
import MyDrivingLicence from "./Pages/Client/MyDrivingLicence";

import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Admins from "./Pages/Dashboard/Admins";
import Drivers from "./Pages/Dashboard/Drivers";
import Utilisateurs from "./Pages/Dashboard/Utilisateurs";
import Trajets from "./Pages/Dashboard/Trajets";
import Cars from "./Pages/Dashboard/Cars";
import CarTypes from "./Pages/Dashboard/CarTypes";
import Colors from "./Pages/Dashboard/Colors";
// Wallet n'est plus utilisé directement, mais conservé en import au cas où
// import Wallet from "./Pages/Dashboard/Wallet"; 
import Publish from "./Pages/Publish";
import SignInAdmin from "./Pages/Auth/SignInAdmin";
import ConfirmEmail from "./Pages/Auth/ConfirmEmail";
import { StatsContextProvider } from "./contexts/Admin/StatsContext";

// Nouveaux imports pour les pages des codes promo
import PromoCode from "./Pages/Dashboard/PromoCode/PromoCode";
import PromoCodeDetails from "./Pages/Dashboard/PromoCode/PromoCodeDetails";
import MyReservations from "./Pages/Client/MyReservations";
import ChatRoom from "./Pages/Chat/ChatRoom";
import MyChats from "./Pages/Chat/MyChats";
import { ChatContextProvider } from "./contexts/ChatContext"; // 👈 Context pour le chat

// Import de la nouvelle page pour les permis de conduire
import DrivingLicences from "./Pages/Dashboard/DrivingLicences";
import DrivingLicenceDetails from "./Pages/Dashboard/DrivingLicenceDetails";

// NOUVEAUX IMPORTS POUR LA GESTION DES RETRAITS
import UserWithdrawalHistory from "./Pages/Client/UserWithdrawalHistory";
import AdminWithdrawals from "./Pages/Dashboard/withdraw/AdminWithdrawals";
import AdminWithdrawalDetails from "./Pages/Dashboard/withdraw/AdminWithdrawalDetails";
import Reviews from "./Pages/Client/Reviews";

// NOUVEAUX IMPORTS POUR LES AVIS
import SubmitReview from "./Pages/Client/SubmitReview";
import CarDocuments from "./Pages/Dashboard/CarDocuments";
import DriverReservations from "./Pages/Client/DriverReservations";
import ReservationSuccess from "./Pages/Client/ReservationSuccess";
import UserNotifications from "./Pages/Notifications/UserNotifications";
import AdminNotifications from "./Pages/Notifications/AdminNotifications";
import PublishNotification from "./Pages/Notifications/PublishNotification";
import RoleList from "./Pages/Dashboard/Roles/RoleList";
import CreateOrEditRole from "./Pages/Dashboard/Roles/CreateOrEditRole";
import EditRole from "./Pages/Dashboard/Roles/EditRole";
import TripAdminDetail from "./Pages/Dashboard/TripAdminDetail";
import { WithdrawContextProvider } from "./contexts/withdrawContext";
import { DrivingLicenceProvider } from "./contexts/DrivingLicenceContext";
import { TripAdminContextProvider } from "./contexts/Admin/TripAdminContext";
import CarContextProvider from "./contexts/carContext";
import CarAdminContextProvider from "./contexts/Admin/CarAdminContext";
import PromoCodeLayout from "./Layouts/CustomAdminLayouts/PromoCodeLayout";
import WithDrawalsLayout from "./Layouts/CustomAdminLayouts/WithDrawalsLayout";
import DrivingLicenceLayout from "./Layouts/CustomAdminLayouts/DrivingLicenceLayout";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import Contact from "./Pages/Contact";
import SuggestTrip from "./SuggestTrip";
import SuggestedTrips from "./SuggestedTrips";
import Suggestions from "./Pages/Dashboard/Suggestions/Suggestions";
import VtcVehicules from "./Pages/Dashboard/VTC/vtcVehicules/vtcVehicules";
import VtcVehicleTypes from "./Pages/Dashboard/VTC/VtcVehicleTypes";
import VtcRidesHistory from "./Pages/Dashboard/VTC/VtcRidesHistory";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import DriverVehicles from "./Pages/Dashboard/DriverVehicles";
import DriverLicence from "./Pages/Dashboard/DriverLicence";
import { AdminDriversList } from "./Pages/Dashboard/VTC/AdminDriversList";
import { DriverDetailView } from "./Pages/Dashboard/VTC/DriverDetailView";
import AdminRidesPage from "./Pages/Dashboard/VTC/AdminRidesPage";
import VtcSettings from "./Pages/Dashboard/VTC/VtcSettings";
import CarpoolingSettings from "./Pages/Dashboard/settings/CarpoolingSettings";
import VtcAdminDisputeDetail from "./Pages/Dashboard/VTC/VtcAdminDisputeDetail";
import VtcAdminDisputes from "./Pages/Dashboard/VTC/VtcAdminDisputes";
import VtcAdminReviews from "./Pages/Dashboard/VTC/VtcAdminReviews";
import CustomLocationsPage from "./Pages/Dashboard/VTC/CustomLocationsPage";
const Routes = () => {
  const route = useRoutes([
    {
      // ------------------------------------
      // SECTION CLIENT (Layout: ClientLayout)
      // ------------------------------------
      path: "/",
      element:  <ClientLayout />
      ,
      children: [
        {
          index: true, // Chemin racine (Accueil)
          element: <Home />,
        },
        {
          path: "covoiturage",
          element: <Covoiturage />,
        },
        {
          path:"privacy-policy",
          element:<PrivacyPolicy/>
        },
        {
          path: "taxi",
          element: <Taxi />,
        },
        {
          path:"/contact",
          element:<Contact/>
        },
        {
          path:"/reservation/success",
          element:<ReservationSuccess/>
        },
        {
          path: "trip-detail/:tripId",
          element: <TripDetail />,
        },

        {
          path: "publish-trip",
          element: <Publish />,
        },
        {
          path: "results",
          element: <Results />,
        },
        // --- Routes du profil utilisateur ---
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "profile/car",
          element: <MyVehicle />,
        },
        {
          path: "profile/car/documents/:carId",
          element: <VehiculeDoc />,
        },
        // Historique des retraits utilisateur
        {
          path: "profile/withdrawals",
          element:<WithdrawContextProvider> 
                     <UserWithdrawalHistory />
            </WithdrawContextProvider>,
        },
        {
          path: "profile/reservations",
          element: <MyReservations />,
        },
        {
          path: "profile/driver-reservations/:id",
          element: <DriverReservations />,
        },
        {
          path: "profile/licence",
          element: <MyDrivingLicence />,
        },
        // 💡 NOUVELLE ROUTE : Notifications utilisateur
                {
                    path: "profile/notifications", 
                    element: <UserNotifications />,
                },
        // --- Routes du Chat ---
        // 🚀 OPTIMISATION : Application du ChatContextProvider sur la route parent du chat
        

        // --- Routes des Avis ---
        {
          path: "profile/reviews", // Route existante conservée
          element: <Reviews />,
        },
        {
          path: "reviews/:tripId", // Afficher les avis pour un trajet
          element: <Reviews />,
        },
        {
          path: "reviews/create/:tripId", // Créer un avis pour un trajet
          element: <SubmitReview />,
        },
        
    {
          path: "profile/chats",
          element: <ChatContextProvider><MyChats /></ChatContextProvider>,
        },
        {
          path:"/suggest-trip",
          element:<SuggestTrip/>
        },
        {
          path:"/suggestions",
          element:<SuggestedTrips/>
        }
      ],
    },
           {
          path: "chat/:reservationId",
          // ⚠️ Le ChatContextProvider n'a pas besoin d'être répété ici s'il englobe déjà la route parente '/profile/chats'. 
          // Mais dans votre structure actuelle, les deux routes sont des "siblings" directes de ClientLayout.
          // Je le laisse ici car la route '/chat/:reservationId' est en dehors de '/profile/chats'.
          // Si vous voulez une seule instance, vous devriez créer un groupe de routes parent comme ceci:
          /* {
             path: "messagerie", 
             element: <ChatContextProvider><Outlet /></ChatContextProvider>,
             children: [
                 { path: "mes-chats", element: <MyChats/> },
                 { path: "conversation/:reservationId", element: <ChatRoom/> }
             ]
          }
          */
          // Pour la simplicité, j'ajoute le ChatContextProvider également ici
          element: <ChatContextProvider><ChatRoom /></ChatContextProvider>,
        }, 
    {
      // ---------------------------------
      // SECTION AUTHENTIFICATION (Layout: AuthLayout)
      // ---------------------------------
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: <Signin />,
        },
        {
          path: "signin",
          element: <Signin />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "confirm-email",
          element: <ConfirmEmail />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordPage />,
        },
        {
          path: "reset-password",
          element: <ResetPasswordPage />,
        },
      ],
    },
    
    {
      // ------------------------------------
      // SECTION ADMIN (Connexion)
      // ------------------------------------
      path: "admin/signin",
      element: <SignInAdmin />,
    },
    
    {
      // ------------------------------------
      // SECTION ADMIN (Dashboard Layout)
      // ------------------------------------
      path: "admin",
      element: <StatsContextProvider>
                <DashboardLayout />
        </StatsContextProvider>,
    
    children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "admins",
          element: <Admins />,
        },
        {
          path: "drivers",
          element: <Drivers />,
        },
        //notification
        {
          path:"publish-notification",
          element:<PublishNotification/>
        },
        
        // 💡 NOUVELLE ROUTE : Notifications administrateur
                {
                    path: "notifications", 
                    element: <AdminNotifications />,
                },
        
        {
          path: "users",
          element: <Utilisateurs />,
        },
        {
          path: "trajets/:type",
          element:<TripAdminContextProvider> <Trajets /></TripAdminContextProvider>,
        },
        {
          path:"trajets/details/:tripId",
          element:<TripAdminContextProvider><TripAdminDetail/></TripAdminContextProvider> 
        },
        {
          path: "cars",
          element: <CarAdminContextProvider><Cars /></CarAdminContextProvider>,
        },
        {
          path: "cars/:userId",
          element: <CarAdminContextProvider><DriverVehicles/></CarAdminContextProvider>,
        },
        {
          path: "car-documents/:vehiculeId",
          element:  <CarAdminContextProvider><CarDocuments /></CarAdminContextProvider>,
        },
        {
          path: "cars-type",
          element: <CarTypes />,
        },
        {
          path: "colors",
          element: <Colors />,
        },
        // --- NOUVELLES ROUTES pour la gestion des retraits (Admin) ---
        {
          path: "withdrawals",
          element:<WithDrawalsLayout/>,
          children: [
            {
              index: true,
              element: <AdminWithdrawals />,
            },
            {
              path: "pending", // Demandes en attente
              element: <AdminWithdrawals type="pending" />,
            },
            {
              path: "history", // Historique complet
              element: <AdminWithdrawals type="history" />,
            },
            {
              path: "details/:requestId", // Détails d'une demande spécifique
              element: <AdminWithdrawalDetails />,
            },
            {
              path: "user-history/:userId", // Historique d'un utilisateur
              element: <AdminWithdrawals type="user-history" />,
            },
          ],
        },{
          path: "roles",
          children: [
            {
              index: true,
              element: <RoleList />,
            },
            {
              path:"create",
              element:<CreateOrEditRole/>
            },
            {
              path:"edit/:roleId",
              element:<EditRole/>
            }
          ],
        },
        // --- NOUVELLES ROUTES pour les permis de conduire (Admin) ---
        {
          path: "licences",
          element:<DrivingLicenceLayout/>,
          children: [
            // Note: J'ai ajusté la structure des routes enfants pour une meilleure clarté.
            // La route principale 'licences' est maintenant un parent sans élément direct (utilisant un <Outlet/> dans le layout, si nécessaire).
            // Le ':page' dans l'URL semble redondant si c'est géré par la pagination interne du composant DrivingLicences.
            // J'ai conservé votre structure originale pour l'élément, mais optimisé l'index.
            {
                index: true,
                // On peut définir une route par défaut si l'on arrive sur /admin/licences
                // Assuming "all" is the default state and page 1 is the default page
                element: <DrivingLicences verificationState="all" page="1" />
            },{
                path: "users/:userId",
                // On peut définir une route par défaut si l'on arrive sur /admin/licences
                // Assuming "all" is the default state and page 1 is the default page
                element: <DriverLicence/>
            },
            {
              path: ":verificationState", // Ex: /admin/licences/pending
              element: <DrivingLicences />,
            },
            {
                // J'ai retiré le :page de l'URL pour la simplicité, car il est souvent géré dans le composant.
                // Si :page est requis dans l'URL: path: ":verificationState/:page"
                path: ":verificationState/:page", 
                element: <DrivingLicences /> 
            },
            {
              path: "details/:licenceId",
              element: <DrivingLicenceDetails />,
            },
          ],
        },
        // --- NOUVELLES ROUTES pour les codes promo (Admin) ---
        {
          path: "promocodes",
          element:<PromoCodeLayout/>,
          children: [
            {
              index: true,
              element: <PromoCode />,
            },
            {
              path: "list/:type", 
              element: <PromoCode />,
            },
            {
              path: "details/:id",
              element: <PromoCodeDetails />,
            },
          ],
        },
        {
          path:"/admin/suggestions",
          element:<Suggestions/>
        },
        // ... dans votre configuration de routes :
{
  path: "/admin/vtc/vehicles",
  element: <VtcVehicules/>
},
{
  path: "/admin/vtc/pricing", // Route que nous avions prévue dans la Sidebar
  element: <VtcVehicleTypes />
},
{
  path: "/admin/vtc/courses/history",
  element: <VtcRidesHistory />
},
{
  path: "/admin/vtc/drivers",
  element: <AdminDriversList />
},
{
  path: "/admin/vtc/drivers/:id",
  element: <DriverDetailView />
},{
    path: "/admin/vtc/rides",
    element: <AdminRidesPage />
  },

  // ==========================================
  // MODULE : CONFIGURATION GLOBALE (SETTINGS)
  // ==========================================
  {
    path: "/admin/vtc/settings",
    element: <VtcSettings /> // La page des paramètres Redis, distances, webhooks que nous venons de faire
  },
  {
    path: "/admin/carpooling/settings",
    element: <CarpoolingSettings />
  },// SUPPORT & LITIGES
  {
    path: "/admin/vtc/support/disputes",
    element: <VtcAdminDisputes />
  },
  {
    path: "/admin/vtc/support/disputes/:id",
    element: <VtcAdminDisputeDetail />
  },
  {
  path: "/admin/vtc/support/reviews",
  element: <VtcAdminReviews />
},
{
  path:"/admin/vtc/custom-locations",
  element:<CustomLocationsPage/>
}
      ],
    },
  ]);
  return route;
};

export default Routes;