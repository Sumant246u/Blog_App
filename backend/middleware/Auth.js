import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        res.status(401).json({ success: false, message });
    }
};

export default auth;
