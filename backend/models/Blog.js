import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, required: true }
}, { timestamps: true }
);

const Blog = mongoose.model('blog', blogSchema);

export default Blog;
