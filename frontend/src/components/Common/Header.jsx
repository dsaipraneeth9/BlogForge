import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';


function Header() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redirect to home or login page after logout
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            BlogForge
          </Typography>
          <CircularProgress size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          BlogForge
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/search">Search</Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/create-post">Create Post</Button>
              <Button color="inherit" component={Link} to="/dashboard/author">Dashboard</Button>
              <Button color="inherit" component={Link} to="/profile">
                <Avatar src={user.photo} sx={{ width: 24, height: 24, mr: 1 }} />
                {user.username}
              </Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;