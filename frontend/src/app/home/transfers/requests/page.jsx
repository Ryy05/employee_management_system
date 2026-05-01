'use client'
import React from 'react'
import { useUser } from '@/context/UserContext'

import AdminTransfer from '../AdminTransfer';

function TransferRequests() {
  const{user , userRole} = useUser();
  return (
    <>
    {userRole === "CEO" && <AdminTransfer/>}
    
    </>
    
  )
}

export default TransferRequests