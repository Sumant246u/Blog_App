import Subscriber from '../models/Subscriber.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }

        await Subscriber.create({ email });
        res.json({ success: true, message: 'Subscribed successfully! You will receive updates on new posts.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ success: true, message: 'You are already subscribed!' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
