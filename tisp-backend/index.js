const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  failedAttempts: { type: Number, default: 0 }, 
  lockUntil: { type: Date },
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  const { password, ...rest } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ ...rest, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

const MAX_ATTEMPTS = 5; // Maximum allowed failed attempts
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes lockout

app.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ 
    $or: [{ email: identifier }, { username: identifier }] 
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check if the account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(403).json({
      message: `Account locked. Try again in ${remainingTime} minutes.`,
    });
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Reset failed attempts on successful login
    user.failedAttempts = 0;
    user.lockUntil = undefined; // Clear any lock
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.json({ token });
  } else {
    // Increment failed attempts
    user.failedAttempts += 1;

    if (user.failedAttempts >= MAX_ATTEMPTS) {
      // Lock account if too many attempts
      user.lockUntil = Date.now() + LOCK_TIME;
      await user.save();
      return res.status(403).json({
        message: `Too many failed attempts. Account locked for 15 minutes.`,
      });
    }

    await user.save();
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // Vite dev server address
//     methods: ["GET", "POST"],
//   },
// });

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('send_message', (message) => {
//     io.emit('receive_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });



const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
