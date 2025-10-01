import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';

// Import Mongoose Models to ensure they are registered
import './models/User';
import './models/License';
import './models/Bond';
import './models/ComplianceRule';
import './models/ComplianceTemplate';
import './models/ComplianceAlert';
import './models/ComplianceState';
import './models/ComplianceChatHistory';

// Import routes
import authRoutes from './routes/auth';
import complianceRoutes from './routes/compliance';
import licensesRoutes from './routes/licenses';
import bondsRoutes from './routes/bonds';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/licenses', licensesRoutes);
app.use('/api/bonds', bondsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
