import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/page-components/Header'
import { Footer } from '../Components/page-components/Footer'
import { NotificationContextProvider } from '../contexts/NotificationContext'

const AuthLayout = () => {
  return (
    <>
    
 <NotificationContextProvider>
    <Header/>
    <Outlet/>
    <br /><br /> <br />
    </NotificationContextProvider>
    </>
  )
}

export default AuthLayout