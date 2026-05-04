import React, { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

// ==========================================
// 1. IMPORTS STATIQUES (Layouts et Contexts)
// ==========================================
import ClientLayout from "./Layouts/ClientLayout";
import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import PromoCodeLayout from "./Layouts/CustomAdminLayouts/PromoCodeLayout";
import WithDrawalsLayout from "./Layouts/CustomAdminLayouts/WithDrawalsLayout";
import DrivingLicenceLayout from "./Layouts/CustomAdminLayouts/DrivingLicenceLayout";

import { StatsContextProvider } from "./contexts/Admin/StatsContext";
import { ChatContextProvider } from "./contexts/ChatContext";
import { WithdrawContextProvider } from "./contexts/withdrawContext";
import { DrivingLicenceProvider } from "./contexts/DrivingLicenceContext";
import { TripAdminContextProvider } from "./contexts/Admin/TripAdminContext";
import CarContextProvider from "./contexts/carContext";
import CarAdminContextProvider from "./contexts/Admin/CarAdminContext";

// ==========================================
// 2. IMPORTS DYNAMIQUES (Pages - Lazy Loading)
// ==========================================
const Home = lazy(() => import("./Pages/Home"));
const Signin = lazy(() => import("./Pages/Auth/Signin"));
const Signup = lazy(() => import("./Pages/Auth/Signup"));
const Covoiturage = lazy(() => import("./Pages/Covoiturage"));
const Taxi = lazy(() => import("./Pages/Taxi"));
const Results = lazy(() => import("./Pages/Results"));
const TripDetail = lazy(() => import("./Pages/TripDetail"));
const Profile = lazy(() => import("./Pages/Client/Profile"));
const MyVehicle = lazy(() => import("./Pages/Client/Vehicule"));
const VehiculeDoc = lazy(() => import("./Pages/Client/VehiculeDoc"));
const MyDrivingLicence = lazy(() => import("./Pages/Client/MyDrivingLicence"));
const Dashboard = lazy(() => import("./Pages/Dashboard/Dashboard"));
const Admins = lazy(() => import("./Pages/Dashboard/Admins"));
const Drivers = lazy(() => import("./Pages/Dashboard/Drivers"));
const Utilisateurs = lazy(() => import("./Pages/Dashboard/Utilisateurs"));
const Trajets = lazy(() => import("./Pages/Dashboard/Trajets"));
const Cars = lazy(() => import("./Pages/Dashboard/Cars"));
const CarTypes = lazy(() => import("./Pages/Dashboard/CarTypes"));
const Colors = lazy(() => import("./Pages/Dashboard/Colors"));
const Publish = lazy(() => import("./Pages/Publish"));
const SignInAdmin = lazy(() => import("./Pages/Auth/SignInAdmin"));
const ConfirmEmail = lazy(() => import("./Pages/Auth/ConfirmEmail"));
const PromoCode = lazy(() => import("./Pages/Dashboard/PromoCode/PromoCode"));
const PromoCodeDetails = lazy(() => import("./Pages/Dashboard/PromoCode/PromoCodeDetails"));
const MyReservations = lazy(() => import("./Pages/Client/MyReservations"));
const ChatRoom = lazy(() => import("./Pages/Chat/ChatRoom"));
const MyChats = lazy(() => import("./Pages/Chat/MyChats"));
const DrivingLicences = lazy(() => import("./Pages/Dashboard/DrivingLicences"));
const DrivingLicenceDetails = lazy(() => import("./Pages/Dashboard/DrivingLicenceDetails"));
const UserWithdrawalHistory = lazy(() => import("./Pages/Client/UserWithdrawalHistory"));
const AdminWithdrawals = lazy(() => import("./Pages/Dashboard/withdraw/AdminWithdrawals"));
const AdminWithdrawalDetails = lazy(() => import("./Pages/Dashboard/withdraw/AdminWithdrawalDetails"));
const Reviews = lazy(() => import("./Pages/Client/Reviews"));
const SubmitReview = lazy(() => import("./Pages/Client/SubmitReview"));
const CarDocuments = lazy(() => import("./Pages/Dashboard/CarDocuments"));
const DriverReservations = lazy(() => import("./Pages/Client/DriverReservations"));
const ReservationSuccess = lazy(() => import("./Pages/Client/ReservationSuccess"));
const UserNotifications = lazy(() => import("./Pages/Notifications/UserNotifications"));
const AdminNotifications = lazy(() => import("./Pages/Notifications/AdminNotifications"));
const PublishNotification = lazy(() => import("./Pages/Notifications/PublishNotification"));
const RoleList = lazy(() => import("./Pages/Dashboard/Roles/RoleList"));
const CreateOrEditRole = lazy(() => import("./Pages/Dashboard/Roles/CreateOrEditRole"));
const EditRole = lazy(() => import("./Pages/Dashboard/Roles/EditRole"));
const TripAdminDetail = lazy(() => import("./Pages/Dashboard/TripAdminDetail"));
const ForgotPasswordPage = lazy(() => import("./Pages/Auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./Pages/Auth/ResetPasswordPage"));
const Contact = lazy(() => import("./Pages/Contact"));
const SuggestTrip = lazy(() => import("./SuggestTrip"));
const SuggestedTrips = lazy(() => import("./SuggestedTrips"));
const Suggestions = lazy(() => import("./Pages/Dashboard/Suggestions/Suggestions"));
const VtcVehicules = lazy(() => import("./Pages/Dashboard/VTC/vtcVehicules/vtcVehicules"));
const VtcVehicleTypes = lazy(() => import("./Pages/Dashboard/VTC/VtcVehicleTypes"));
const VtcRidesHistory = lazy(() => import("./Pages/Dashboard/VTC/VtcRidesHistory"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const DriverVehicles = lazy(() => import("./Pages/Dashboard/DriverVehicles"));
const DriverLicence = lazy(() => import("./Pages/Dashboard/DriverLicence"));
const AdminDriversList = lazy(() => import("./Pages/Dashboard/VTC/AdminDriversList"));
const DriverDetailView = lazy(() => import("./Pages/Dashboard/VTC/DriverDetailView"));
const AdminRidesPage = lazy(() => import("./Pages/Dashboard/VTC/AdminRidesPage"));
const VtcSettings = lazy(() => import("./Pages/Dashboard/VTC/VtcSettings"));
const CarpoolingSettings = lazy(() => import("./Pages/Dashboard/settings/CarpoolingSettings"));
const VtcAdminDisputeDetail = lazy(() => import("./Pages/Dashboard/VTC/VtcAdminDisputeDetail"));
const VtcAdminDisputes = lazy(() => import("./Pages/Dashboard/VTC/VtcAdminDisputes"));
const VtcAdminReviews = lazy(() => import("./Pages/Dashboard/VTC/VtcAdminReviews"));
const CustomLocationsPage = lazy(() => import("./Pages/Dashboard/VTC/CustomLocationsPage"));
const DeleteAccountRequest = lazy(() => import("./Pages/DeleteAccountRequest"));

// ==========================================
// 3. CONFIGURATION DES ROUTES
// ==========================================
const Routes = () => {
  const route = useRoutes([
    {
      // ------------------------------------
      // SECTION CLIENT (Layout: ClientLayout)
      // ------------------------------------
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "covoiturage",
          element: <Covoiturage />,
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "taxi",
          element: <Taxi />,
        },
        {
          path: "delete-account",
          element: <DeleteAccountRequest />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/reservation/success",
          element: <ReservationSuccess />,
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
        {
          path: "profile/withdrawals",
          element: (
            <WithdrawContextProvider>
              <UserWithdrawalHistory />
            </WithdrawContextProvider>
          ),
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
        {
          path: "profile/notifications",
          element: <UserNotifications />,
        },
        // --- Routes des Avis ---
        {
          path: "profile/reviews",
          element: <Reviews />,
        },
        {
          path: "reviews/:tripId",
          element: <Reviews />,
        },
        {
          path: "reviews/create/:tripId",
          element: <SubmitReview />,
        },
        {
          path: "profile/chats",
          element: (
            <ChatContextProvider>
              <MyChats />
            </ChatContextProvider>
          ),
        },
        {
          path: "/suggest-trip",
          element: <SuggestTrip />,
        },
        {
          path: "/suggestions",
          element: <SuggestedTrips />,
        },
      ],
    },
    {
      path: "chat/:reservationId",
      element: (
        <ChatContextProvider>
          <ChatRoom />
        </ChatContextProvider>
      ),
    },
    {
      // ---------------------------------
      // SECTION AUTHENTIFICATION
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
      // Par ceci :
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
      element: (
        <StatsContextProvider>
          <DashboardLayout />
        </StatsContextProvider>
      ),
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
        {
          path: "publish-notification",
          element: <PublishNotification />,
        },
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
          element: (
            <TripAdminContextProvider>
              <Trajets />
            </TripAdminContextProvider>
          ),
        },
        {
          path: "trajets/details/:tripId",
          element: (
            <TripAdminContextProvider>
              <TripAdminDetail />
            </TripAdminContextProvider>
          ),
        },
        {
          path: "cars",
          element: (
            <CarAdminContextProvider>
              <Cars />
            </CarAdminContextProvider>
          ),
        },
        {
          path: "cars/:userId",
          element: (
            <CarAdminContextProvider>
              <DriverVehicles />
            </CarAdminContextProvider>
          ),
        },
        {
          path: "car-documents/:vehiculeId",
          element: (
            <CarAdminContextProvider>
              <CarDocuments />
            </CarAdminContextProvider>
          ),
        },
        {
          path: "cars-type",
          element: <CarTypes />,
        },
        {
          path: "colors",
          element: <Colors />,
        },
        {
          path: "withdrawals",
          element: <WithDrawalsLayout />,
          children: [
            {
              index: true,
              element: <AdminWithdrawals />,
            },
            {
              path: "pending",
              element: <AdminWithdrawals type="pending" />,
            },
            {
              path: "history",
              element: <AdminWithdrawals type="history" />,
            },
            {
              path: "details/:requestId",
              element: <AdminWithdrawalDetails />,
            },
            {
              path: "user-history/:userId",
              element: <AdminWithdrawals type="user-history" />,
            },
          ],
        },
        {
          path: "roles",
          children: [
            {
              index: true,
              element: <RoleList />,
            },
            {
              path: "create",
              element: <CreateOrEditRole />,
            },
            {
              path: "edit/:roleId",
              element: <EditRole />,
            },
          ],
        },
        {
          path: "licences",
          element: <DrivingLicenceLayout />,
          children: [
            {
              index: true,
              element: <DrivingLicences verificationState="all" page="1" />,
            },
            {
              path: "users/:userId",
              element: <DriverLicence />,
            },
            {
              path: ":verificationState",
              element: <DrivingLicences />,
            },
            {
              path: ":verificationState/:page",
              element: <DrivingLicences />,
            },
            {
              path: "details/:licenceId",
              element: <DrivingLicenceDetails />,
            },
          ],
        },
        {
          path: "promocodes",
          element: <PromoCodeLayout />,
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
          path: "/admin/suggestions",
          element: <Suggestions />,
        },
        {
          path: "/admin/vtc/vehicles",
          element: <VtcVehicules />,
        },
        {
          path: "/admin/vtc/pricing",
          element: <VtcVehicleTypes />,
        },
        {
          path: "/admin/vtc/courses/history",
          element: <VtcRidesHistory />,
        },
        {
          path: "/admin/vtc/drivers",
          element: <AdminDriversList />,
        },
        {
          path: "/admin/vtc/drivers/:id",
          element: <DriverDetailView />,
        },
        {
          path: "/admin/vtc/rides",
          element: <AdminRidesPage />,
        },
        {
          path: "/admin/vtc/settings",
          element: <VtcSettings />,
        },
        {
          path: "/admin/carpooling/settings",
          element: <CarpoolingSettings />,
        },
        {
          path: "/admin/vtc/support/disputes",
          element: <VtcAdminDisputes />,
        },
        {
          path: "/admin/vtc/support/disputes/:id",
          element: <VtcAdminDisputeDetail />,
        },
        {
          path: "/admin/vtc/support/reviews",
          element: <VtcAdminReviews />,
        },
        {
          path: "/admin/vtc/custom-locations",
          element: <CustomLocationsPage />,
        },
      ],
    },
  ]);

  // Enveloppe la configuration des routes avec Suspense pour gérer le chargement des composants "lazy"
  return (
    <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#666' }}>
            Chargement de la page...
        </div>
    }>
      {route}
    </Suspense>
  );
};

export default Routes;
