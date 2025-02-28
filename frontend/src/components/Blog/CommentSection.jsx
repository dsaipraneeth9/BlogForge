import { useState, useEffect, useContext } from 'react'
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { createComment, getComments, deleteComment } from '../../services/api.js'
import { AuthContext } from '../../contexts/AuthContext.jsx'

function CommentSection({ slug }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(slug)
        setComments(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createComment(slug, newComment)
      setComments((prev) => [response.data, ...prev])
      setNewComment('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(slug, commentId)
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Comments</Typography>
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
          <TextField
            label="Add a comment"
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>Post Comment</Button>
        </Box>
      ) : (
        <Typography>Please login to comment</Typography>
      )}
      <List>
        {comments.map((comment) => (
          <ListItem key={comment._id} secondaryAction={
            user && comment.user._id === user.id && (
              <IconButton edge="end" onClick={() => handleDelete(comment._id)}>
                <Delete />
              </IconButton>
            )
          }>
            <ListItemText
              primary={comment.content}
              secondary={`By ${comment.user.username} - ${new Date(comment.createdAt).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default CommentSection