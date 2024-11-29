'use server';

import { createClient } from '@/supabase/server';

/**
 * Fetches daily average sensor data for a specific type using an RPC function.
 *
 * @param sensorType - The type of the sensor (e.g., "temperature").
 * @returns An array of daily averages with date labels.
 * @throws If the query fails or no data is available.
 */
export const getAverageSensorDataByType = async (sensorType: string) => {
  const supabase = await createClient();

  try {
    // Define the expected return type for the data
    type SensorDataRow = { date: string; avg_value: number };

    // Call the RPC function with the correct type signature
    const { data, error } = await supabase.rpc('get_daily_avg_sensor_data', {
      sensor_type_param: sensorType,
    });

    if (error) {
      throw new Error(`Error fetching sensor data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`No data available for sensor type: ${sensorType}`);
    }

    // Log the fetched data to understand its shape
    console.log("Fetched Sensor Data:", data);

    // Map results to a user-friendly structure
    return data.map((row: SensorDataRow) => ({
      name: `Avg ${sensorType.charAt(0).toUpperCase() + sensorType.slice(1)} on ${row.date}`,
      value: row.avg_value,
    }));
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error Details:', err.message);
      throw new Error(`Unexpected error occurred: ${err.message}`);
    }
    throw new Error('An unexpected error occurred.');
  }
};