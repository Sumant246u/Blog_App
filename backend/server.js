import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './Routes/AdminRoutes.js';
import blogRouter from './Routes/BlogRoutes.js';

const app = express();

app.use(cors())
app.use(express.json())

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