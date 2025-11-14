const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const taskRoutes = require('./routes/tasks');

// ✅ newly added routes [refer to AMIRUL]
const postRoutes = require('./routes/post');
const threadRoutes = require('./routes/thread');
const groupRoutes = require('./routes/group');

const app = express();


// refer to AMIRUL
// ✅ Allow requests from any host in dev (keep cookies working)
app.use(
  cors({
    origin: true,           // reflect the request origin
    credentials: true,      // allow cookies to be sent
  })
);


// refer to AMIRUL
// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// refer to AMIRUL
// ✅ Routes (auth first, then protected)
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/post', postRoutes);
app.use('/api/thread', threadRoutes);
app.use('/api/group', groupRoutes);

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

