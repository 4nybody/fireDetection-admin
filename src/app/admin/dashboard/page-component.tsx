'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Dynamically import ChartComponent to ensure client-side rendering
const ChartComponent = dynamic(() => import('@/components/ChartComponent'), {
  ssr: false,
});

type PageComponentProps = {
  monthlyUsers: { name: string; value: number }[];
  temperatureData: { name: string; value: number }[];
  smokeData: { name: string; value: number }[];
};

const PageComponent = ({
  monthlyUsers,
  temperatureData,
  smokeData,
}: PageComponentProps) => {
  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Users Chart */}
        <Card>
          <CardHeader>
            <CardTitle>New Users Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={monthlyUsers}
              title="New Users"
              dataKey="value"
              color="#82ca9d"
            />
          </CardContent>
        </Card>

        {/* Temperature Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Average Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={temperatureData}
              title="Temperature"
              dataKey="value"
              color="#ff7300"
            />
          </CardContent>
        </Card>

        {/* Smoke Sensor Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Average Smoke Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={smokeData}
              title="Smoke Levels"
              dataKey="value"
              color="#8884d8"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageComponent;
