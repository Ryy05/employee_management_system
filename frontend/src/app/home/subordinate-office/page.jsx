'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import AddZone from './AddZone';
import AddOffice from './AddOffice';




function Page() {
  const router = useRouter();

  const { user } = useUser();
  console.log(user);

  switch (user?.role) {
    case 'CEO':
      return <AddZone />;
    case 'ZEO':
      return <AddOffice/>;
    default:
      return <div>Unauthorized Access</div>;
  }
}

export default Page;
