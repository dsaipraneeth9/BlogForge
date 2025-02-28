import { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import { getBlogs, deleteBlog } from '../../services/api.js';
import BlogCardUpdate from '../Blog/BlogCardUpdate.jsx';

function AuthorDashboard() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // Blog selected for editing
  const [error, setError] = useState('');

  console.log('Rendering AuthorDashboard with user:', user);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!user || !user.id) {
          setError('User not authenticated or missing ID');
          setBlogs([]);
          console.warn('User or user.id is missing:', user);
          return;
        }
        const response = await getBlogs({ author: user.id });
        setBlogs(response.data.blogs);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blogs');
        console.error('Error fetching blogs:', err);
      }
    };
    if (user) fetchBlogs();
  }, [user]);

  const handleDelete = async (blogSlug) => {
    if (!blogSlug) {
      setError('Invalid blog slug for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        console.log('Attempting to delete blog with slug:', blogSlug);
        const response = await deleteBlog(blogSlug); // Use slug instead of blogId

        // Check if the deletion was successful (204 status)
        if (response.status === 204) {
          console.log('Blog deleted successfully from database with slug:', blogSlug);
          // Update the blogs state immediately after a successful deletion
          setBlogs(blogs.filter((blog) => blog.slug !== blogSlug));
          setError(''); // Clear any previous errors
          alert('Blog deleted successfully!');
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Delete failed - Full error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setError(`Failed to delete blog: ${error.response.data.message || error.message}`);
          alert('Failed to delete blog.');
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('Network error: Failed to delete blog');
          alert('Failed to delete blog.');
        } else {
          console.error('Error setting up request:', error.message);
          setError(`Error deleting blog: ${error.message}`);
          alert('Failed to delete blog.');
        }
      }
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
  };

  if (!user) return <div>User not found</div>;

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Author Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Render BlogCardUpdate if a blog is selected for editing */}
      {selectedBlog && (
        <BlogCardUpdate
          blog={selectedBlog}
          setBlogs={setBlogs}
          setSelectedBlog={setSelectedBlog} // Allow closing the editor
        />
      )}

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog._id}>
            <Card
              sx={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for scale and shadow
                '&:hover': {
                  transform: 'scale(1.05)', // Slight scale on hover
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Enhanced shadow on hover
                },
              }}
            >
              {blog.featuredImage && (
                <CardMedia
                  component="img"
                  height="140" // Adjust height for a thumbnail size
                  image={blog.featuredImage}
                  alt={blog.title}
                  sx={{ objectFit: 'cover' }} // Ensure image fits well
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ color: '#b8860b' }}>{blog.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  By <span style={{ color: '#333' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(blog)}
                  sx={{
                    mr: 1,
                    mt: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle hover effect
                      transition: 'background-color 0.3s ease',
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(blog.slug)} // Use blog.slug instead of blog._id
                  sx={{
                    mt: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)', // Subtle hover effect for delete
                      transition: 'background-color 0.3s ease',
                    },
                  }}
                >
                  Delete
                </Button>
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
// import { Box, Typography, Grid, Card, CardContent, CardMedia, Alert, Button } from '@mui/material';
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
//       if (!user || !user.id) {
//         setError('User not authenticated or missing ID');
//         setBlogs([]);
//         return;
//       }
//       try {
//         const response = await getBlogs({ author: user.id });
//         // Double-check that only the author's blogs are returned
//         const authorBlogs = response.data.blogs.filter(blog => 
//           blog.author && blog.author._id && blog.author._id.toString() === user.id.toString()
//         );
//         setBlogs(authorBlogs);
//         setError('');
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch blogs');
//         console.error('Error fetching blogs:', err);
//       }
//     };
//     fetchBlogs();
//   }, [user]);

//   const handleDelete = async (blogId) => {
//     if (window.confirm('Are you sure you want to delete this blog?')) {
//       try {
//         await deleteBlog(blogId);
//         setBlogs(blogs.filter((blog) => blog._id !== blogId));
//       } catch (err) {
//         console.error('Error deleting blog:', err);
//         setError('Failed to delete blog');
//       }
//     }
//   };

//   const handleEdit = (blog) => {
//     setSelectedBlog(blog);
//   };

//   if (!user) return <div>User not found</div>;

//   return (
//     <Box sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom>Author Dashboard</Typography>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Render BlogCardUpdate if a blog is selected for editing */}
//       {selectedBlog && (
//         <BlogCardUpdate
//           blog={selectedBlog}
//           setBlogs={setBlogs}
//           setSelectedBlog={setSelectedBlog} // Allow closing the editor
//         />
//       )}

//       <Grid container spacing={3}>
//         {blogs.map((blog) => (
//           <Grid item xs={12} sm={6} md={4} key={blog._id}>
//             <Card>
//               {blog.featuredImage && (
//                 <CardMedia
//                   component="img"
//                   height="140" // Adjust height for a thumbnail size
//                   image={blog.featuredImage}
//                   alt={blog.title}
//                   sx={{ objectFit: 'cover' }} // Ensure image fits well
//                 />
//               )}
//               <CardContent>
//                 <Typography variant="h6">{blog.title}</Typography>
//                 <Typography variant="body2">Created: {new Date(blog.createdAt).toLocaleDateString()}</Typography>
//                 <Button
//                   variant="outlined"
//                   onClick={() => handleEdit(blog)}
//                   sx={{ mr: 1, mt: 1 }}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => handleDelete(blog._id)}
//                   sx={{ mt: 1 }}
//                 >
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