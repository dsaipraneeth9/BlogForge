// import { useState } from 'react';
// import { Box, Card, CardContent, TextField, Button } from '@mui/material';
// import { updateBlog } from '../../services/api.js';

// function BlogCardUpdate({ blog, setBlogs, setSelectedBlog }) {
//   const [title, setTitle] = useState(blog.title);
//   const [content, setContent] = useState(blog.content);
//   const [loading, setLoading] = useState(false);

//   const handleUpdate = async () => {
//     try {
//         await updateBlog(blog.slug, { title, content }); // Using slug instead of ID
//         alert('Blog updated successfully!');
//     } catch (error) {
//         console.error('Update failed:', error);
//         alert('Failed to update blog.');
//     }
// };


//   return (
//     <Box sx={{ mb: 3 }}>
//       <Card>
//         <CardContent>
//           <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
//           <TextField
//             fullWidth
//             multiline
//             label="Content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             rows={4}
//           />
//           <Button onClick={handleUpdate} variant="contained" disabled={loading} sx={{ mt: 2 }}>
//             {loading ? 'Updating...' : 'Update'}
//           </Button>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default BlogCardUpdate;
