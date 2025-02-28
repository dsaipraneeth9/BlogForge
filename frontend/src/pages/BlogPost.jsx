import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Typography, Box, Button, Divider } from '@mui/material'
import { getBlog, toggleLike, deleteBlog } from '../services/api.js'
import CommentSection from '../components/Blog/CommentSection.jsx'
import { AuthContext } from '../contexts/AuthContext.jsx'

function BlogPost() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlog(slug)
        setBlog(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchBlog()
  }, [slug])

  const handleLike = async () => {
    try {
      await toggleLike(slug)
      setBlog((prev) => ({
        ...prev,
        likes: prev.likes.includes(user?.id)
          ? prev.likes.filter((id) => id !== user.id)
          : [...prev.likes, user.id]
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlog(slug)
        navigate('/')
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (!blog) return <Typography>Loading...</Typography>

  const isAuthor = user && blog.author._id.toString() === user.id.toString()
  const canEditDelete = user && (isAuthor || user.role === 'admin')

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
  )
}

export default BlogPost