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

const Routes = () => {
  const route = useRoutes([
    {
      path:"/",
      element:<ClientLayout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/covoiturage",
          element:<Covoiturage/>
        },
        {
          path:"/taxi",
          element:<Taxi/>
        },
        {
          path:"/results",
          element:<Results/>
        },
        {
          path:"/trip-detail",
          element:<TripDetail/>
        }
        ,
        {
          path:"/profile",
          element:<Profile/>
        }
      ]
    },
    {
      path:"/auth",
      element:<AuthLayout/>,
      children:[
        {
          path:"/auth/signin",
          element:<Signin/>
        },
        {

          path:"/auth/signup",
          element:<Signup/>
        }
      ]
    },{
      path:"/admin",
      element:<DashboardLayout/>,
      children:[
        {
        path:"/admin/dashboard",
        element:<Dashboard/>
      },
        {
        path:"/admin/admins",
        element:<Admins/>
      },

        {
        path:"/admin/drivers",
        element:<Drivers/>
      },
        {
        path:"/admin/users",
        element:<Utilisateurs/>
      },
      {
        path:"/admin/trajets",
        element:<Trajets/>
      },
      {
        path:"/admin/cars",
        element:<Cars/>
      },

      {
        path:"/admin/cars-type",
        element:<CarTypes/>
      },
      {
        path:"/admin/colors",
        element:<Colors/>
      },

      {
        path:"/admin/wallets",
        element:<Wallet/>
      },
      
      ]
    }
  ])
  return route 
}

export default Routes