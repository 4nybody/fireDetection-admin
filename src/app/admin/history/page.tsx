"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/supabase/clients";

type HistoryData = {
  sensorType: string;
  values: { name: string; value: number }[];
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [data, setData] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth + 1, 1).toISOString();

      const { data: historyData, error } = await supabase
        .from("sensor_data")
        .select("sensor_type, value, created_at")
        .gte("created_at", startDate)
        .lt("created_at", endDate)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const groupedData = groupDataByType(historyData);
      setData(groupedData);
    } catch (error) {
      console.error("Error fetching history data:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupDataByType = (data: any[]) => {
    const grouped: Record<string, { name: string; value: number }[]> = {};
    data.forEach((entry) => {
      if (!grouped[entry.sensor_type]) grouped[entry.sensor_type] = [];
      grouped[entry.sensor_type].push({
        name: new Date(entry.created_at).toLocaleDateString(),
        value: entry.value,
      });
    });
    return Object.entries(grouped).map(([sensorType, values]) => ({
      sensorType,
      values,
    }));
  };

  useEffect(() => {
    fetchHistoryData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Sensor Data History</h1>

      {/* Month and Year Selection */}
      <div className="flex space-x-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Graphs */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        data.map((sensor) => (
          <div key={sensor.sensorType} className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{sensor.sensorType} Data</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sensor.values}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))
      )}
    </div>
  );
}
