import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/page-components/Header'
import { Footer } from '../Components/page-components/Footer'

const AuthLayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <br /><br />
    </>
  )
}

export default AuthLayout