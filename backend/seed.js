const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as necessary

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
}).then(() => {
  console.log('Connected to MongoDB');
  seedDB();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Create initial data
const users = [
  {
    username: 'admin',
    password: 'adminpassword', // Make sure to hash the password in a real application
    role: 'Admin',
  },
  {
    username: 'editor',
    password: 'editorpassword', // Make sure to hash the password in a real application
    role: 'Editor',
  },
  {
    username: 'user',
    password: 'userpassword', // Make sure to hash the password in a real application
    role: 'User',
  },
];

// Insert initial data
const seedDB = async () => {
  try {
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Database seeded!');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    mongoose.connection.close();
  }
};