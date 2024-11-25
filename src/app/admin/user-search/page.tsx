'use client';

import React, { useState } from 'react';
import { getAccessibleSystems } from '@/actions/systems';

interface System {
  id: string;
  name: string;
  description: string;
  role: string;
}

interface AccessibleSystemResponse {
  id?: string;
  name?: string;
  description?: string;
  role?: string;
}

const UserSearchPage = () => {
  const [userId, setUserId] = useState('');
  const [systems, setSystems] = useState<System[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userId.trim()) {
      setError('Please enter a valid user ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setSystems([]);

    try {
      const result: AccessibleSystemResponse[] = await getAccessibleSystems(userId);
      console.log(result); // Check the response structure

      const systemsData: System[] = result.map((item) => ({
        id: item.id || 'unknown_id', // Ensure each system has a unique id
        name: item.name || 'Unnamed system',
        description: item.description || 'No description available',
        role: item.role || 'USER',
      }));

      setSystems(systemsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User System Access</h1>
      <div className="mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {systems.length > 0 ? (
        <ul className="mt-4">
          {systems.map((system) => (
            <li key={system.id} className="border rounded p-4 mb-4 shadow">
              <h3 className="text-lg font-semibold">{system.name}</h3>
              <p className="text-sm">Description: {system.description}</p>
              <p className="text-sm">Role: {system.role}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p className="text-gray-500">No systems found for this user.</p>
      )}
    </div>
  );
};

export default UserSearchPage;
