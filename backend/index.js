import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import userRoutes from './route/user.route.js';
import verificationRoutes from './route/verificationRoutes.js';
import runRoutes from './route/run.route.js';
import paymentRoutes from './route/payment.route.js';
import adminRoutes from './route/admin.route.js';
import chatbotRoutes from './route/chatbot.route.js';


dotenv.config({});

const app = express();
const port = process.env.PORT || 5000;
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) {
  throw new Error("TRUST_PROXY_HOPS must be a non-negative integer");
}
app.set('trust proxy', trustProxyHops);

const corsOptions = {
  origin: ['http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'https://645-running-club.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
if (process.env.FRONTEND_ORIGIN) {
  corsOptions.origin.push(process.env.FRONTEND_ORIGIN);
}

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

 
app.use('/api/user', userRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatbotRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, message: 'Invalid JSON request body.' });
  }
  res.status(error.status || 500).json({
    success: false,
    message: error.status && error.status < 500 ? 'Invalid request.' : 'Server error',
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
