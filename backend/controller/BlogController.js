import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/comment.js';
import main from '../configs/gemini.js';


export const addBlog = async (req, res) => {

    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !subTitle || !description || !category || !imageFile) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        const response = await imagekit.upload({
            file: imageFile.buffer,
            fileName: imageFile.originalname,
            folder: '/blogs'
        })

        // optimize through imagekit URL transformation

        const OptimizedImgeUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' }, //Auto compression
                { format: 'webp' }, //convert to modern format
                { width: '1280' }   //width resizing
            ]
        })

        const Image = OptimizedImgeUrl;

        await Blog.create({ title, subTitle, description, category, image: Image, isPublished })

        res.json({ success: true, message: 'Blog added successfully' });



    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const getAllBlogs = async (req, res) => {
    try {

        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const getBlogId = async (req, res) => {

    try {

        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.json({ success: false, message: 'Blog not Found' })
        }

        res.json({ success: true, blog })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Delete any blog

export const DeleteBlogId = async (req, res) => {

    try {

        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        // Delete all comments associated with the blog
        await Comment.deleteMany({ blog: id });

        res.json({ success: true, message: 'Blog delete successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


//Publish or Unpublish blog

export const togglePublish = async (req, res) => {

    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({ success: true, message: 'Blog  status updated ' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// Add comment

export const addComment = async (req, res) => {

    try {

        const { blog, name, content } = req.body
        await Comment.create({ blog, name, content });
        res.json({ success: true, message: 'Comment added for review ' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const getBlogComments = async (req, res) => {

    try {
        const { blogId } = req.body;
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments })
    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Generate Content through AI

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body
        const content = await main(prompt + 'generate a blog content for this topic in simple text format')
        res.json({ success: true, content })

    } catch (error) {
        const message = error?.message || "Failed to generate content";
        const friendlyMessage = message.includes("503")
            ? "Gemini is busy right now. Please try again in a few seconds."
            : message.includes("429")
                ? "Gemini free quota reached. Please wait a minute and try again."
                : message;
        res.json({ success: false, message: friendlyMessage })
    }
}