import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  // Function to extract plain text from HTML and limit to 100 characters
  const getExcerpt = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const plainText = temp.textContent || temp.innerText || '';
    return plainText.substring(0, 100) + '...';
  };

  return (
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
          height="140"
          image={blog.featuredImage}
          alt={blog.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" component={Link} to={`/blog/${blog.slug}`} sx={{ textDecoration: 'none', color: '#b8860b' }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By <span style={{ color: '#333' }}>{blog.author?.username}</span> | {new Date(blog.createdAt).toLocaleDateString()} | {blog.views} views | {blog.likes.length} likes
        </Typography>
        <Typography variant="body2">{getExcerpt(blog.content)}</Typography>
        <Button
          component={Link}
          to={`/blog/${blog.slug}`}
          size="small"
          sx={{
            mt: 1,
            '&:hover': {
              backgroundColor: '#1976d2', // Match primary color on hover
              color: 'white',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            },
          }}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}

export default BlogCard;