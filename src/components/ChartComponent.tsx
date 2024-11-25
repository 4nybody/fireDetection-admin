'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartProps = {
  data: { name: string; value: number }[];
  title: string;
  dataKey: string;
  color?: string;
};

const ChartComponent = ({ data, title, dataKey, color = '#8884d8' }: ChartProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
