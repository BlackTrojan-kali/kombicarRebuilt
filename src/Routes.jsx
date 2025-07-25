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
    }
  ])
  return route 
}

export default Routes