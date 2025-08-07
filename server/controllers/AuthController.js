import User from '../models/User.js';
import bcrypt from 'bcryptjs';

class AuthController {
  static async register(req, res) {
    const { name, email, password, role } = req.body;
    try {
      const user = await User.create({ name, email, password, role });
      // In a real application, you'd generate and return a token here
      res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Registration error:', error);
      // Handle specific errors, e.g., duplicate email
      res.status(500).json({ success: false, message: 'Registration failed' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // In a real application, you'd generate and return a token here
      res.status(200).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Login failed' });
    }
  }
}

export default AuthController; 