import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { ApiResponse } from './utils/ApiResponse.js';
// import fileUpload from 'express-fileupload';
//import { uploadOnCloudinary } from './utils/cloudinary.js';
// import userRoutes from './routes/user';
// import complaintRoutes from './routes/complaint';
import profileRouter from './routes/profile.routes.js';
import userRouter from './routes/user.routes.js';
import menuRouter from './routes/menu.routes.js'
// import menuRoutes from './routes/menu';
// import committeeRoutes from './routes/commitee';
// import dailyExpense from './routes/expense';
// import ratingRoutes from './routes/rating';

dotenv.config({
    path: './.env'
})

const app = express();
const port = process.env.PORT || 8000;

// Middleware
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: '/tmp/',
//     })
// );

// Connect to DB and Cloudinary
connectDB();
//uploadOnCloudinary();

// Use Routes
app.use('/api/v1/auth', userRouter);
// app.use('/api/v1/complaint', complaintRoutes);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/menu', menuRouter);
// app.use('/api/v1/committee', committeeRoutes);
// app.use('/api/v1/expense', dailyExpense);
// app.use('/api/v1/rating', ratingRoutes);

// Default route
app.get('/', (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "server running")
        );
    // return res.status(200).json({
    //     success: true,
    //     message: 'server is running',
    // });
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});

export { app }