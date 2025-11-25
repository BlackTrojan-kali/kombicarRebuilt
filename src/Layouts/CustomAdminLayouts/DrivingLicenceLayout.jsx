import React from 'react'
import { Outlet } from 'react-router-dom'
import { AdminDLicenceProvider } from '../../contexts/Admin/AdminDlicenceContext'

const DrivingLicenceLayout = () => {
  return (
    <AdminDLicenceProvider>
    <Outlet/>
    </AdminDLicenceProvider>
)
}

export default DrivingLicenceLayout
