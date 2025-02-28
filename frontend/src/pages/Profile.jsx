import { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { updateProfile } from '../services/api.js'; // This will now work

function Profile() {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  console.log('Rendering Profile with user:', user);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (photo) formData.append('photo', photo);
    try {
      await updateProfile(user.id, formData);
      setError('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) return <div>User not found</div>;

  return (
    <Box sx={{ py: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      {error && <Alert severity={error.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        style={{ marginTop: 20 }}
      />
      <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Update Profile
      </Button>
    </Box>
  );
}

export default Profile;