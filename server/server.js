import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';
// Import other routes
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Use CORS middleware
// Configure it to allow requests from your frontend's origin
app.use(cors({
  origin: 'https://8080-firebase-workvix-1754383904731.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev'
}));

// Placeholder root route
app.get('/', (req, res) => {
  res.send('WorkVix API is running');
});

// TODO: Import and use routes
// import userRoutes from './routes/users.js';
// Use auth routes
// app.use('/api/users', userRoutes);
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
