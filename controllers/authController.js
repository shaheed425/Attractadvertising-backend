import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
export const authAdmin = async (req, res) => {
  const { email, username, password } = req.body;
  const loginInput = (email || username || '').trim();

  try {
    // Check if database has any admin users, auto-create default admin if empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        email: 'admin',
        password: 'admin123',
      });
      console.log('Default Admin Account Created: Username: admin | Password: admin123');
    }

    // Match admin by email or username
    let admin = await Admin.findOne({
      $or: [
        { email: loginInput },
        { email: loginInput.toLowerCase() }
      ]
    });

    // Fallback search if 'admin' was passed as loginInput
    if (!admin && loginInput === 'admin') {
      admin = await Admin.findOne();
    }

    if (admin && (await admin.matchPassword(password))) {
      return res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

