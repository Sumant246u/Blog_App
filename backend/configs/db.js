import dns from "dns";
import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        // Windows/local DNS often blocks Node SRV lookups for mongodb+srv URIs
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

export default connectDB;

