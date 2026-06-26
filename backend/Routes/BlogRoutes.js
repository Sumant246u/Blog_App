import express from 'express'
import { addBlog, addComment, DeleteBlogId, generateContent, getAllBlogs, getBlogComments, getBlogId, togglePublish, updateBlog } from '../controller/BlogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/Auth.js';

const blogRouter = express.Router();

blogRouter.post('/add', upload.single('image'), auth, addBlog);
blogRouter.post('/update/:id', upload.single('image'), auth, updateBlog);
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogId);
blogRouter.post('/delete', auth, DeleteBlogId);
blogRouter.post('/toggle-publish', auth, togglePublish);
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);
blogRouter.post('/generate', auth, generateContent);

export default blogRouter;