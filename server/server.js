import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder root route
app.get('/', (req, res) => {
  res.send('WorkVix API is running');
});

// TODO: Import and use routes
// import userRoutes from './routes/users.js';
// app.use('/api/users', userRoutes);
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
