const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const userExists = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (userExists) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const { lastID } = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          if (err) reject(err);
          resolve(this);
        }
      );
    });

    // Generate token
    const token = jwt.sign(
      { userId: lastID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true,
      token, 
      user: { id: lastID, username } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      success: true,
      token, 
      user: { id: user.id, username: user.username } 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Token valid' 
    });
  });
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      const error = req.fileValidationError || 'No file uploaded';
      console.error('Upload error:', error);
      return res.status(400).json({ 
        success: false,
        error: error,
        details: process.env.NODE_ENV === 'development' ? {
          receivedFiles: req.files,
          body: req.body
        } : undefined
      });
    }

    if (!req.body.userId) {
      throw new Error('User ID is required');
    }

    const userId = req.body.userId;
    const uploadDir = path.join(__dirname, '../../public/uploads');
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const filename = `profile-${userId}-${Date.now()}${fileExt}`;
    const imageUrl = `/uploads/${filename}`;
    const tempPath = req.file.path;
    const targetPath = path.join(uploadDir, filename);

    // Create upload directory if not exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Use streams for reliable file transfer
    const readStream = fs.createReadStream(tempPath);
    const writeStream = fs.createWriteStream(targetPath);

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', (error) => {
          // Clean up if error occurs
          fs.unlink(targetPath, () => reject(error));
        });
    });

    // Delete temp file after successful transfer
    await fs.promises.unlink(tempPath);

    // Verify user exists before updating
    const userExists = await new Promise((resolve) => {
      db.get('SELECT id FROM users WHERE id = ?', [userId], (err, row) => {
        resolve(!!row);
      });
    });

    if (!userExists) {
      throw new Error('User not found');
    }

    // Verify database schema first
    const hasProfileImageColumn = await new Promise((resolve) => {
      db.get(
        "SELECT 1 FROM pragma_table_info('users') WHERE name='profileImage'",
        (err, row) => {
          if (err) {
            console.error('Schema verification error:', err);
            resolve(false);
          } else {
            resolve(!!row);
          }
        }
      );
    });

    if (!hasProfileImageColumn) {
      throw new Error('Database schema is missing required profileImage column');
    }

    // Update database
    await new Promise((resolve, reject) => {

      db.run(
        'UPDATE users SET profileImage = ? WHERE id = ?',
        [imageUrl, userId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            reject(new Error('Failed to update profile image'));
          } else {
            resolve(this);
          }
        }
      );
    });

    // Get updated user data
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        imageUrl,
        user: {
          id: user.id,
          username: user.username
        }
      }
    });

  } catch (error) {
    console.error('Upload error:', error.stack);
    
    // Clean up any created files
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        await fs.promises.unlink(req.file.path);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload profile image',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

module.exports = { register, login, verifyToken, uploadProfileImage };
