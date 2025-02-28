import { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material'; // Ensure all imports
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { getBlogs } from '../../services/api.js';

function AuthorDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  console.log('Rendering AuthorDashboard with user:', user);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs({ author: user.id });
        setBlogs(response.data.blogs);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      }
    };
    if (user) fetchBlogs();
  }, [user]);

  if (!user) return <div>User not found</div>;

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Author Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{blog.title}</Typography>
                <Typography variant="body2">Created: {new Date(blog.createdAt).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AuthorDashboard;