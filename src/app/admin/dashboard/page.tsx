import React from 'react';
import { getMonthlyUsers } from '@/actions/users';
import { getAverageSensorDataByType } from '@/actions/sensors';
import PageComponent from './page-component';

const DashboardPage = async () => {
  try {
    // Fetch monthly user data
    const rawMonthlyUsers = await getMonthlyUsers();

    // Transform data to match the expected format
    const monthlyUsers = rawMonthlyUsers.map(({ name, newUsers }) => ({
      name,           // Keep the name as it is
      value: newUsers, // Rename `newUsers` to `value` to align with ChartComponent expectations
    }));

    // Fetch average temperature and smoke data across all users
    const temperatureData = await getAverageSensorDataByType('temperature');
    const smokeData = await getAverageSensorDataByType('co');

    // Return the page component with the fetched data
    return (
      <PageComponent
        monthlyUsers={monthlyUsers}
        temperatureData={temperatureData}
        smokeData={smokeData}
      />
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return <div>Failed to load dashboard. Please try again later.</div>;
  }
};

export default DashboardPage;
