import { Router } from "express";
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';
import { deleteBlog, getBlog, getBlogs, postBlog, ToggleLikeBlog, updateBlog } from "../controllers/blogControllers.js";
import { auth, checkRole } from "../middlewares/auth.js";
import { createComment, deleteComment, getComments } from "../controllers/commentControllers.js";

let upload = multer({ storage: storage });
let router = Router();

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlog);

// Private routes
router.post("/", auth, checkRole('author', 'admin'), upload.single("featuredImage"), postBlog);
router.patch("/:slug", auth, checkRole('author', 'admin'), upload.single("featuredImage"), updateBlog);
router.delete("/:slug", auth, checkRole('admin', 'author'), deleteBlog);

// router.put('/slug/:slug', async (req, res) => { 
//     const { title, content } = req.body;

//     try {
//         const updatedBlog = await Blog.findOneAndUpdate(
//             { slug: req.params.slug }, // Find by slug instead of ID
//             { title, content },
//             { new: true, runValidators: true }
//         );

//         if (!updatedBlog) {
//             return res.status(404).json({ message: 'Blog not found' });
//         }

//         res.json(updatedBlog);
//     } catch (err) {
//         console.error('Update error:', err);
//         res.status(500).json({ message: 'Server error during blog update' });
//     }
// });



router.post("/:slug/like", auth, ToggleLikeBlog);

router.post("/:slug/comments", auth, createComment);
router.get("/:slug/comments", auth, getComments);
router.delete("/:slug/comments/:commentId", auth, deleteComment);

export default router;