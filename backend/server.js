const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5010;

const cron = require('node-cron');
const { checkDeadlines } = require('./utils/reminderService');

const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server and pass the express app
const server = http.createServer(app);

// Create Socket.io server and bind it to the HTTP server
const io = new Server(server, { cors: { origin: '*' } });

// Handle socket events
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => console.log('A user disconnected'));
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/tasks', taskRoutes);

// Run cron job every hour
cron.schedule('0 * * * *', () => {
  console.log('Checking deadlines...');
  checkDeadlines();
});

// Default route
app.get('/', (req, res) => {
  res.send('Zidio Task Management API');
});

// Start the server using the HTTP server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
