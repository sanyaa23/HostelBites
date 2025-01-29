import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { ApiResponse } from './utils/ApiResponse.js';
import profileRouter from './routes/profile.routes.js';
import userRouter from './routes/user.routes.js';
import menuRouter from './routes/menu.routes.js'
import messCommitteeRouter from './routes/messCommittee.routes.js'
import complaintRouter from './routes/complaint.routes.js'


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

connectDB();

// Use Routes
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/complaint', complaintRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/committee', messCommitteeRouter);


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

