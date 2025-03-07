import { useEffect, useState, useContext, useRef, useCallback } from 'react'; // Added useCallback for memoization
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, Box, Button, Divider, CircularProgress } from '@mui/material';
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
  const isFetching = useRef(false); // Ref to prevent multiple simultaneous requests
  const fetchCount = useRef(0); // Track number of fetch attempts for debugging

  // Memoize fetchBlog to prevent unnecessary re-creations
  const fetchBlog = useCallback(async () => {
    if (!slug) {
      console.error('Slug is undefined in BlogPost');
      setError('Invalid blog URL');
      setIsLoading(false);
      return;
    }

    if (isFetching.current) {
      console.warn('Request already in progress, skipping duplicate fetch for slug:', slug);
      return;
    }
    isFetching.current = true;
    fetchCount.current += 1;
    console.log(`Fetching blog with slug: ${slug}, attempt #${fetchCount.current}, at: ${new Date().toISOString()}`);

    try {
      const response = await getBlog(slug);
      setBlog(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog - Full error:', err);
      setError(err.response?.data?.message || 'Failed to load blog');
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, [slug]); // Only depend on slug for memoization

  // Use useEffect with strict dependency control
  useEffect(() => {
    let mounted = true;

    fetchBlog();

    return () => {
      mounted = false; // Cleanup to prevent memory leaks
    };
  }, [fetchBlog]); // Depend on fetchBlog, not slug directly

  const handleLike = useCallback(async () => {
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
  }, [slug, blog, user?.id]);

  const handleDelete = useCallback(async () => {
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
  }, [slug, blog, navigate]);

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
      <Typography variant="h3" sx={{ color: '#b8860b' }} gutterBottom>{blog.title}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        By <span style={{ color: '#333' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views
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