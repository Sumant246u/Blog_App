import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './Routes/AdminRoutes.js';
import blogRouter from './Routes/BlogRoutes.js';
import newsletterRouter from './Routes/NewsletterRoutes.js';

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:4173',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, allowedOrigins[0]);
        }
    },
}));
app.use(express.json({ limit: '1mb' }))

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

app.get('/', (req, res) => res.send('API is working'))

app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)
app.use('/api/newsletter', newsletterRouter)

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;

    const startServer = async () => {
        try {
            await connectDB();
            console.log('Database connected');
        } catch (error) {
            console.error('Database connection failed:', error.message);
            console.error('Check MONGODB_URI in .env and your internet / Atlas cluster status.');
        }

        const server = app.listen(PORT, () => {
            console.log('Server is running on port ' + PORT);
            console.log('Test: http://localhost:' + PORT + '/');
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Stop the other process or use a different PORT.`);
            } else {
                console.error('Server error:', error.message);
            }
            process.exit(1);
        });
    };

    startServer();
}

export default app