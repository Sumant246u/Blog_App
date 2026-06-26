import bcrypt from 'bcrypt';

export const verifyAdminPassword = async (password) => {
    if (process.env.ADMIN_PASSWORD_HASH) {
        return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    }
    if (process.env.ADMIN_PASSWORD) {
        return password === process.env.ADMIN_PASSWORD;
    }
    return false;
};

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
