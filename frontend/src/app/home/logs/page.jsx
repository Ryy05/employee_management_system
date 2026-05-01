'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import AdminLogs from './AdminLogs';
import LocalLogsPage from './LocalLogs';

function page() {
  const{user , userRole} = useUser();
  console.log(userRole);
  return (
    <>
    {userRole === "CEO" && <AdminLogs/>}
    {userRole === "ZEO" && <AdminLogs/>}
    {userRole === "schoolAdmin" && <AdminLogs/>}
    </>
    
  )
}

export default page