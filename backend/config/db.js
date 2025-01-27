import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
// dotenv.config({
//     path: '../.env',
// });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Connection issue in DB:', error);
        process.exit(1); // Exit the process if the connection fails
    }
};

export { connectDB }
