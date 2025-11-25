import React from 'react'
import { Outlet } from 'react-router-dom'
import { WithdrawalAdminContextProvider } from '../../contexts/Admin/WithDrawalAdminContext'

const WithDrawalsLayout = () => {
  return (
    <WithdrawalAdminContextProvider>
    <Outlet/>
    </WithdrawalAdminContextProvider>
)
}

export default WithDrawalsLayout
