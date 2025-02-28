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



// import { useContext, useState, useEffect } from 'react';
// import { Box, Typography, Grid, Card, CardContent, Alert, Button } from '@mui/material';
// import { AuthContext } from '../../contexts/AuthContext.jsx';
// import { getBlogs, deleteBlog } from '../../services/api.js';
// import BlogCardUpdate from '../Blog/BlogCardUpdate.jsx';


// function AuthorDashboard() {
//   const { user } = useContext(AuthContext);
//   const [blogs, setBlogs] = useState([]);
//   const [selectedBlog, setSelectedBlog] = useState(null); // Blog selected for editing
//   const [error, setError] = useState('');

//   console.log('Rendering AuthorDashboard with user:', user);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await getBlogs({ author: user.id });
//         setBlogs(response.data.blogs);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch blogs');
//         console.error('Error fetching blogs:', err);
//       }
//     };
//     if (user) fetchBlogs();
//   }, [user]);

//   const handleDelete = async (blogId) => {
//     if (window.confirm('Are you sure you want to delete this blog?')) {
//       try {
//         await deleteBlog(blogId);
//         setBlogs(blogs.filter((blog) => blog._id !== blogId));
//       } catch (err) {
//         console.error('Error deleting blog:', err);
//       }
//     }
//   };

//   if (!user) return <div>User not found</div>;

//   return (
//     <Box sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom>Author Dashboard</Typography>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Render BlogCard for Editing */}
//       {selectedBlog && <BlogCardUpdate blog={selectedBlog} setBlogs={setBlogs} setSelectedBlog={setSelectedBlog} />}

//       <Grid container spacing={3}>
//         {blogs.map((blog) => (
//           <Grid item xs={12} sm={6} md={4} key={blog._id}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">{blog.title}</Typography>
//                 <Typography variant="body2">Created: {new Date(blog.createdAt).toLocaleDateString()}</Typography>
//                 <Button variant="outlined" onClick={() => setSelectedBlog(blog)} sx={{ mr: 1 }}>
//                   Edit
//                 </Button>
//                 <Button variant="outlined" color="error" onClick={() => handleDelete(blog._id)}>
//                   Delete
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }

// export default AuthorDashboard;
