'use client'
import React, { useEffect, useState } from 'react';
import CeoOffice from './ceoOffice';
import ZeoOffice from './zeoOffice'; // Assuming you are using React Query
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';




function Page() {
  const router = useRouter();

  const { user } = useUser();
  console.log(user);

  switch (user?.role) {
    case 'CEO':
      return <CeoOffice />;
    case 'ZEO':
      return <ZeoOffice />;
    default:
      return <div>Unauthorized Access</div>;
  }
}

export default Page;
