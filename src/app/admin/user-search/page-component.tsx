// src/app/admin/user-search/page-component.tsx
'use client';

import React from 'react';
import { UserData } from './types';

type PageComponentProps = {
  userData: UserData;
};

const PageComponent = ({ userData }: PageComponentProps) => {
  return (
    <div className="mt-6 p-4 border rounded shadow-lg">
      <h2 className="text-xl font-semibold">User Information</h2>
      <p><strong>User ID:</strong> {userData.id}</p>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default PageComponent;
