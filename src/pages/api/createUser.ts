// import { NextApiRequest, NextApiResponse } from 'next';
// import { supabase } from '@/supabase/clients';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { email, username, type, avatar_url } = req.body;

//   if (!email || !username || !type || !avatar_url) {
//     console.error('Missing required fields:', { email, username, type, avatar_url });
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Step 1: Create a user in Supabase Auth
//     const { data, error: authError } = await supabase.auth.signUp({
//       email,
//       password: 'someRandomPassword123', // Replace with a secure password generator
//     });

//     if (authError) {
//       console.error('Auth sign-up error:', authError);
//       return res.status(400).json({ message: authError.message });
//     }

//     const userId = data?.user?.id;
//     if (!userId) {
//       console.error('User ID not returned after signUp');
//       return res.status(500).json({ message: 'Failed to create user in Auth' });
//     }

//     // Step 2: Insert user into the 'users' table
//     const { error: insertError } = await supabase.from('users').insert({
//       id: userId,
//       email,
//       username,
//       type,
//       avatar_url,
//     });

//     if (insertError) {
//       console.error('Database insert error:', insertError);
//       return res.status(400).json({ message: insertError.message });
//     }

//     console.log('User created successfully:', { userId, email, username });
//     res.status(201).json({ message: 'User created successfully', userId });
//   } catch (error) {
//     console.error('Unexpected error in createUser API:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// }
