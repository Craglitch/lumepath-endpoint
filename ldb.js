const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const taskRoutes = require('./routes/tasks');

// new route
const postRoutes = require('./routes/posts');


// old route jangan lupa buang 
// ✅ newly added routes [refer to AMIRUL]
// const postRoutes = require('./routes/posts');
// const threadRoutes = require('./routes/thread');
// const groupRoutes = require('./routes/group');

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://localhost:5173", // Add HTTPS version
    "https://a16cc7aca9fd.ngrok-free.app",
    "https://lumepath.vercel.app"
  ],
  credentials: true
}));

// refer to AMIRUL
// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// refer to AMIRUL
// ✅ Routes (auth first, then protected)
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);
//app.use('/api/post', postRoutes);
//app.use('/api/thread', threadRoutes);
//app.use('/api/group', groupRoutes);
// In your server.js/app.js
app.use('/api/posts', postRoutes);
// ✅ MongoDB connection [local]
mongoose
  .connect('mongodb://localhost:27017/lumepath', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Start server [from AMIRUL also]
app.listen(3000, () =>
  console.log(':::::: CONNECTED SERVER PORT 30 ::::::::')
);

