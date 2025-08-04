import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Debug server is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register endpoint hit:', req.body);
  res.json({
    success: true,
    message: 'Register endpoint working',
    data: req.body
  });
});

app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    message: 'Jobs endpoint working',
    data: []
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
}); 