'use server';

import { createClient } from '@/supabase/server';
// import { UserData } from '@/app/admin/user-search/types';

export const getMonthlyUsers = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('users').select('created_at');

  if (error) throw new Error(error.message);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const usersByMonth = data.reduce((acc: Record<string, number>, user: { created_at: string }) => {
    const date = new Date(user.created_at);
    const month = `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

    if (!acc[month]) acc[month] = 0;
    acc[month]++;

    return acc;
  }, {});

  return Object.keys(usersByMonth).map(month => ({
    name: month,
    newUsers: usersByMonth[month],
  }));
};

// src/actions/users.ts

export const searchUserByUsername = async (username: string) => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users') // Assuming the users are in a table called 'users'
    .select('*')
    .eq('username', username)
    .single(); // To get a single user object

  if (error) {
    throw new Error('User not found or an error occurred.');
  }

  return data; // This will return the user data
};


export const getUserSystems = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_systems')
    .select('system_id')
    .eq('user_id', userId); // Filter by user ID

  if (error) {
    throw new Error(`Error fetching user systems: ${error.message}`);
  }

  return data || [];
};

