const Task = require('../models/Task');
const nodemailer = require('nodemailer');

// Configure email transporter (use your email provider's settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Check deadlines and send reminders
const checkDeadlines = async () => {
  const now = new Date();
  const upcomingTasks = await Task.find({ 
    deadline: { $gte: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) } 
  });

  for (const task of upcomingTasks) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'recipient@example.com', // Replace with the assignee's email
      subject: `Reminder: Upcoming Deadline for "${task.title}"`,
      text: `Hi, just a reminder that the task "${task.title}" is due by ${task.deadline.toLocaleString()}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
};

module.exports = { checkDeadlines };
