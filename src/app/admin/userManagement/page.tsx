'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { supabase } from '@/supabase/clients';

type User = {
  id: string;
  email: string;
  username: string | null;
  type: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState(''); // State for password field
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []); // Set filtered users initially
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open dialog for editing or adding a user
  const openDialog = (user?: User) => {
    setEditingUser(
      user || {
        id: '', // Empty for new user
        email: '',
        username: '',
        type: 'USER',
        avatar_url: '',
        created_at: null,
      }
    );
    setPassword(''); // Clear password field when opening dialog
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setPassword('');
    setSuccessMessage(null); // Reset success message when closing the dialog
  };

  // Save user (both create or update)
  const saveUser = async () => {
    if (!editingUser) return;

    try {
      const defaultAvatarUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

      // Get the current admin session before creating or updating the user
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession) {
        console.error('No active session found for admin.');
        return;
      }

      // Check if the user exists in the 'users' table based on the email
      const { data: existingUser, error: getUserError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', editingUser.email)
        .single(); // We assume there is only one user with a unique email

      if (getUserError && getUserError.code !== 'PGRST116') {
        console.error('Error checking user:', getUserError);
        throw getUserError;
      }

      if (existingUser) {
        // If the user exists, update their information in the 'users' table
        const { error: updateError } = await supabase
          .from('users')
          .update({
            email: editingUser.email,
            username: editingUser.username || '',
            type: editingUser.type || 'USER',
            avatar_url: editingUser.avatar_url || defaultAvatarUrl,
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error updating user:', updateError);
          throw updateError;
        }

        console.log('User updated successfully');
      } else {
        // If the user does not exist, sign them up with Supabase Auth using the provided password
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: editingUser.email,
          password: password || 'someRandomPassword123', // Use a password from the form or a default
        });

        if (signUpError) {
          console.error('Error during sign-up:', signUpError);
          throw signUpError;
        }

        const userId = data.user?.id;
        if (!userId) {
          console.error('User ID not returned during sign-up');
          throw new Error('Failed to create user');
        }

        // Insert the new user into the custom 'users' table
        const { error: dbError } = await supabase.from('users').insert({
          id: userId, // Use the ID returned from Supabase Auth
          email: editingUser.email,
          username: editingUser.username || '',
          type: editingUser.type || 'USER',
          avatar_url: editingUser.avatar_url || defaultAvatarUrl,
        });

        if (dbError) {
          console.error('Error inserting user into database:', dbError);
          throw dbError;
        }

        console.log('User created and inserted into database');
      }

      fetchUsers(); // Refresh the users list
      closeDialog();

      // Ensure the admin session remains valid
      if (currentSession && currentSession.access_token && currentSession.refresh_token) {
        await supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
        });
      }

    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter users based on email or username
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        (user.username && user.username.toLowerCase().includes(term))
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>

      {/* Search Field */}
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
      />

      {/* Add User Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => openDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>

      {/* User Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{user.type || 'USER'}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDialog(user)}>Edit</Button>
                    <Button
                      color="secondary"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{editingUser?.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            value={editingUser?.email || ''}
            onChange={(e) =>
              setEditingUser((prev) => ({ ...prev!, email: e.target.value }))
            }
          />
          <TextField
            label="Username"
            fullWidth
            value={editingUser?.username || ''}
            onChange={(e) =>
              setEditingUser((prev) => ({
                ...prev!,
                username: e.target.value,
              }))
            }
          />
          <TextField
            label="Type"
            fullWidth
            value={editingUser?.type || 'USER'}
            onChange={(e) =>
              setEditingUser((prev) => ({ ...prev!, type: e.target.value }))
            }
          />
          <TextField
            label="Avatar URL"
            fullWidth
            value={editingUser?.avatar_url || ''}
            onChange={(e) =>
              setEditingUser((prev) => ({
                ...prev!,
                avatar_url: e.target.value,
              }))
            }
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Leave blank for existing users"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={saveUser}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
