'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import StaffDashboard from './StaffDashboard'
import AdminDashboardPage from './AdminDashboardPage'

function page() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "staff" ? <StaffDashboard/>: <AdminDashboardPage/>}
    </>
  )
}

export default page