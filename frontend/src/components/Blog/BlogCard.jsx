import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function BlogCard({ blog }) {
  return (
    <Card>
      {blog.featuredImage && (
        <CardMedia
          component="img"
          height="140"
          image={blog.featuredImage}
          alt={blog.title}
        />
      )}
      <CardContent>
        <Typography variant="h6" component={Link} to={`/blog/${blog.slug}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
          {blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          By {blog.author?.username} | {new Date(blog.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">{blog.content.substring(0, 100)}...</Typography>
        <Button component={Link} to={`/blog/${blog.slug}`} size="small" sx={{ mt: 1 }}>Read More</Button>
      </CardContent>
    </Card>
  );
}

export default BlogCard;