import React from 'react'
import { Outlet } from 'react-router-dom'
import { PromoCodeContextProvider } from '../../contexts/Admin/PromoCodeCotext'

const PromoCodeLayout = () => {
  return (
    <PromoCodeContextProvider>
    <Outlet/>
    </PromoCodeContextProvider>
)
}

export default PromoCodeLayout
