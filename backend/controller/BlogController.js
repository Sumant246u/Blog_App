import mongoose from 'mongoose';
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import main from '../configs/gemini.js';
import { uniqueSlug } from '../utils/slug.js';

const uploadOptimizedImage = async (imageFile) => {
    const response = await imagekit.upload({
        file: imageFile.buffer,
        fileName: imageFile.originalname,
        folder: '/blogs'
    });

    return imagekit.url({
        path: response.filePath,
        transformation: [
            { quality: 'auto' },
            { format: 'webp' },
            { width: '1280' }
        ]
    });
};

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category || !imageFile) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const image = await uploadOptimizedImage(imageFile);
        const slug = await uniqueSlug(title);

        await Blog.create({ title, subTitle, description, category, image, slug, isPublished });

        res.json({ success: true, message: 'Blog added successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !description || !category) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }

        blog.title = title;
        blog.subTitle = subTitle;
        blog.description = description;
        blog.category = category;
        blog.isPublished = isPublished;
        blog.slug = await uniqueSlug(title, id);

        if (imageFile) {
            blog.image = await uploadOptimizedImage(imageFile);
        }

        await blog.save();

        res.json({ success: true, message: 'Blog updated successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const query = mongoose.Types.ObjectId.isValid(blogId)
            ? { _id: blogId }
            : { slug: blogId };

        const blog = await Blog.findOne(query);
        if (!blog || !blog.isPublished) {
            return res.status(404).json({ success: false, message: 'Blog not Found' });
        }

        blog.views += 1;
        await blog.save();

        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const DeleteBlogId = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);
        await Comment.deleteMany({ blog: id });

        res.json({ success: true, message: 'Blog delete successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: 'Blog not found' });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: 'Blog status updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        if (!blog || !name || !content) {
            return res.json({ success: false, message: 'Missing required fields' });
        }
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'Comment added for review' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + 'generate a blog content for this topic in simple text format');
        res.json({ success: true, content });
    } catch (error) {
        const message = error?.message || "Failed to generate content";
        const friendlyMessage = message.includes("503")
            ? "Gemini is busy right now. Please try again in a few seconds."
            : message.includes("429")
                ? "Gemini free quota reached. Please wait a minute and try again."
                : message;
        res.json({ success: false, message: friendlyMessage });
    }
};
