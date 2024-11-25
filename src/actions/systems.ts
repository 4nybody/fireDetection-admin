'use server';

import { createClient } from '@/supabase/server';

/**
 * Fetch system details owned by a user.
 * @param userId - The ID of the user (owner).
 */
export const getSystemForOwner = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('systems')
    .select('*')
    .eq('owner_id', userId)
    .single();

  if (error) throw new Error(`Error fetching system for owner: ${error.message}`);
  return data;
};

/**
 * Fetch systems accessible to a user.
 * @param userId - The ID of the user.
 */
export const getAccessibleSystems = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('system_access')
    .select('system_id, role, systems(*)')
    .eq('user_id', userId);

  if (error) throw new Error(`Error fetching accessible systems: ${error.message}`);
  return data.map(record => ({
    ...record.systems,
    role: record.role,
  }));
};

/**
 * Fetch sensor data for a system.
 * @param systemId - The ID of the system.
 */
export const getSensorDataForSystem = async (systemId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sensor_data')
    .select('*')
    .eq('system_id', systemId);

  if (error) throw new Error(`Error fetching sensor data: ${error.message}`);
  return data;
};
