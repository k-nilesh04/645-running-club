import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import userRoutes from './route/user.route.js';
import verificationRoutes from './route/verificationRoutes.js';


dotenv.config({});

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, // Allow cookies to be sent with requests
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

 
app.use('/api/user', userRoutes);
app.use("/api/verification", verificationRoutes);

app.listen(port, () => {
  connectDB(); 
  console.log(`Server is running on port ${port}`);
});

