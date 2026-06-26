import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import { verifyAdminPassword, JWT_EXPIRES_IN } from '../utils/auth.js';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const validPassword = await verifyAdminPassword(password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBlogAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCooments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate('blog').sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });

        res.json({ success: true, dashboard: { blogs, comments, drafts, recentBlogs } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const ApproveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, { isApproved: true });
        res.json({ success: true, message: 'Comment approved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
