import Blog from '../models/Blog.js';

export const generateSlug = (title) =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

export const uniqueSlug = async (title, excludeId = null) => {
    const base = generateSlug(title);
    let slug = base;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        const exists = await Blog.findOne(query);
        if (!exists) return slug;
        slug = `${base}-${counter++}`;
    }
};
