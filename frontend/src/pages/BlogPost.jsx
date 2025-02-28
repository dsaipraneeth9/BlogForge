import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Button, Divider, CircularProgress } from '@mui/material'; // Added CircularProgress for loading
import { getBlog, toggleLike, deleteBlog } from '../services/api.js';
import CommentSection from '../components/Blog/CommentSection.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';

function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate slug before fetching
  useEffect(() => {
    if (!slug) {
      console.error('Slug is undefined in BlogPost');
      setError('Invalid blog URL');
      setIsLoading(false);
      return;
    }

    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching blog with slug:', slug);
        const response = await getBlog(slug);
        setBlog(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data?.message || 'Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!slug || !blog) {
      console.error('Cannot like: slug or blog is undefined');
      return;
    }
    try {
      await toggleLike(slug);
      setBlog((prev) => ({
        ...prev,
        likes: prev.likes.includes(user?.id)
          ? prev.likes.filter((id) => id !== user.id)
          : [...prev.likes, user.id]
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDelete = async () => {
    if (!slug || !blog) {
      console.error('Cannot delete: slug or blog is undefined');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlog(slug);
        navigate('/');
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6">Blog not found</Typography>
      </Box>
    );
  }

  const isAuthor = user && blog.author && blog.author._id && user.id && blog.author._id.toString() === user.id.toString();
  const canEditDelete = user && (isAuthor || user.role === 'admin');

  return (
    <Box>
      <Typography variant="h3" gutterBottom>{blog.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        By {blog.author?.username} | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views
      </Typography>
      {blog.featuredImage && <img src={blog.featuredImage} alt={blog.title} style={{ maxWidth: '100%', margin: '20px 0' }} />}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <Box sx={{ mt: 2 }}>
        <Button onClick={handleLike} variant="outlined">
          {blog.likes.includes(user?.id) ? 'Unlike' : 'Like'} ({blog.likes.length})
        </Button>
        {canEditDelete && (
          <>
            <Button component={Link} to={`/create-post?slug=${slug}`} variant="outlined" sx={{ ml: 2 }}>Edit</Button>
            <Button onClick={handleDelete} variant="outlined" color="error" sx={{ ml: 2 }}>Delete</Button>
          </>
        )}
      </Box>
      <Divider sx={{ my: 4 }} />
      <CommentSection slug={slug} />
    </Box>
  );
}

export default BlogPost;


// import { useEffect, useState, useContext } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { Typography, Box, Button, Divider, CircularProgress } from '@mui/material';
// import { getBlog, toggleLike, deleteBlog } from '../services/api.js';
// import CommentSection from '../components/Blog/CommentSection.jsx';
// import { AuthContext } from '../contexts/AuthContext.jsx';

// function BlogPost() {
//   const { slug } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!slug) {
//       console.error('Slug is undefined in BlogPost');
//       setError('Invalid blog URL');
//       setIsLoading(false);
//       return;
//     }

//     const fetchBlog = async () => {
//       setIsLoading(true);
//       try {
//         console.log('Fetching blog with slug:', slug);
//         const response = await getBlog(slug);
//         console.log('Blog response:', response.data);
//         setBlog(response.data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching blog:', err);
//         setError(err.response?.data?.message || 'Failed to load blog');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBlog();
//   }, [slug]);

//   const handleLike = async () => {
//     if (!slug || !blog) {
//       console.error('Cannot like: slug or blog is undefined');
//       return;
//     }
//     try {
//       await toggleLike(slug);
//       setBlog((prev) => ({
//         ...prev,
//         likes: prev.likes.includes(user?.id)
//           ? prev.likes.filter((id) => id !== user.id)
//           : [...prev.likes, user.id]
//       }));
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!slug || !blog) {
//       console.error('Cannot delete: slug or blog is undefined');
//       return;
//     }
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       try {
//         await deleteBlog(slug);
//         navigate('/');
//       } catch (error) {
//         console.error('Error deleting blog:', error);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h6" color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!blog) {
//     return (
//       <Box sx={{ py: 4 }}>
//         <Typography variant="h6">Blog not found</Typography>
//       </Box>
//     );
//   }

//   console.log('Blog data in render:', blog);

//   const isAuthor = user && blog.author?._id?.toString() === user.id?.toString();
//   const canEditDelete = user && (isAuthor || user.role === 'admin');

//   return (
//     <Box>
//       <Typography variant="h3" gutterBottom>{blog.title}</Typography>
//       <Typography variant="subtitle1" color="text.secondary">
//         By {blog.author?.username || 'Unknown Author'} | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views
//       </Typography>
//       {blog.featuredImage && <img src={blog.featuredImage} alt={blog.title} style={{ maxWidth: '100%', margin: '20px 0' }} />}
//       <div dangerouslySetInnerHTML={{ __html: blog.content }} />
//       <Box sx={{ mt: 2 }}>
//         <Button onClick={handleLike} variant="outlined">
//           {blog.likes.includes(user?.id) ? 'Unlike' : 'Like'} ({blog.likes.length})
//         </Button>
//         {canEditDelete && (
//           <>
//             <Button component={Link} to={`/create-post?slug=${slug}`} variant="outlined" sx={{ ml: 2 }}>Edit</Button>
//             <Button onClick={handleDelete} variant="outlined" color="error" sx={{ ml: 2 }}>Delete</Button>
//           </>
//         )}
//       </Box>
//       <Divider sx={{ my: 4 }} />
//       <CommentSection slug={slug} />
//     </Box>
//   );
// }

// export default BlogPost;