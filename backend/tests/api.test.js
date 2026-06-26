import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';
import Blog from '../models/Blog.js';
import { JWT_EXPIRES_IN } from '../utils/auth.js';

vi.mock('../configs/imagekit.js', () => ({
    default: {
        upload: vi.fn().mockResolvedValue({ filePath: '/blogs/test.webp' }),
        url: vi.fn().mockReturnValue('https://ik.imagekit.io/test/blog.webp'),
    },
}));

const authToken = () =>
    jwt.sign({ email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

describe('API integration', () => {
    it('GET / returns API health message', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('API is working');
    });

    it('POST /api/admin/login rejects invalid credentials', async () => {
        const res = await request(app)
            .post('/api/admin/login')
            .send({ email: 'wrong@test.com', password: 'wrong' });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Invalid Credentials');
    });

    it('POST /api/admin/login returns token for valid credentials', async () => {
        const res = await request(app)
            .post('/api/admin/login')
            .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeTruthy();
    });

    it('POST /api/newsletter/subscribe saves email', async () => {
        const res = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email: 'reader@example.com' });

        expect(res.body.success).toBe(true);
    });

    it('POST /api/newsletter/subscribe rejects invalid email', async () => {
        const res = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email: 'not-an-email' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('GET /api/blog/all returns only published blogs', async () => {
        await Blog.create({
            title: 'Published Post',
            description: '<p>Published</p>',
            category: 'Technology',
            image: 'https://example.com/img.jpg',
            slug: 'published-post',
            isPublished: true,
        });
        await Blog.create({
            title: 'Draft Post',
            description: '<p>Draft</p>',
            category: 'Startup',
            image: 'https://example.com/img2.jpg',
            slug: 'draft-post',
            isPublished: false,
        });

        const res = await request(app).get('/api/blog/all');

        expect(res.body.success).toBe(true);
        expect(res.body.blogs).toHaveLength(1);
        expect(res.body.blogs[0].title).toBe('Published Post');
    });

    it('GET /api/blog/:slug returns published blog and increments views', async () => {
        const blog = await Blog.create({
            title: 'SEO Slug Post',
            subTitle: 'Subtitle',
            description: '<p>Content</p>',
            category: 'Finance',
            image: 'https://example.com/img.jpg',
            slug: 'seo-slug-post',
            isPublished: true,
            views: 0,
        });

        const res = await request(app).get('/api/blog/seo-slug-post');

        expect(res.body.success).toBe(true);
        expect(res.body.blog.title).toBe('SEO Slug Post');
        expect(res.body.blog.views).toBe(1);

        const updated = await Blog.findById(blog._id);
        expect(updated.views).toBe(1);
    });

    it('GET /api/blog/:slug returns 404 for unpublished blogs', async () => {
        await Blog.create({
            title: 'Secret Draft',
            description: '<p>Hidden</p>',
            category: 'Lifestyle',
            image: 'https://example.com/img.jpg',
            slug: 'secret-draft',
            isPublished: false,
        });

        const res = await request(app).get('/api/blog/secret-draft');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Blog not Found');
    });

    it('POST /api/blog/add requires authentication', async () => {
        const res = await request(app).post('/api/blog/add');
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized');
    });

    it('POST /api/blog/update/:id updates blog with auth', async () => {
        const blog = await Blog.create({
            title: 'Original Title',
            description: '<p>Old</p>',
            category: 'Technology',
            image: 'https://example.com/img.jpg',
            slug: 'original-title',
            isPublished: false,
        });

        const blogPayload = JSON.stringify({
            title: 'Updated Title',
            subTitle: 'New subtitle',
            description: '<p>Updated content</p>',
            category: 'Startup',
            isPublished: true,
        });

        const res = await request(app)
            .post(`/api/blog/update/${blog._id}`)
            .set('Authorization', authToken())
            .field('blog', blogPayload);

        expect(res.body.success).toBe(true);

        const updated = await Blog.findById(blog._id);
        expect(updated.title).toBe('Updated Title');
        expect(updated.slug).toBe('updated-title');
        expect(updated.isPublished).toBe(true);
    });
});
