import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SkillForge Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    data: {
      server: 'SkillForge Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillForge Test Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/test`);
}); 