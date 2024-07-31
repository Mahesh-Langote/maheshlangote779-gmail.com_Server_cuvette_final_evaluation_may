const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const folderRoutes = require('./routes/folderRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userContentRoutes = require('./routes/userContentRoutes');
const chatbotController = require('./controllers/chatbotController.js');

const app = express();
const serverStartTime = new Date();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Chatbot routes
app.get('/chat/:formId', chatbotController.renderChatbot);
app.post('/api/submit-response', chatbotController.submitResponse);
app.get('/api/form/:formId', chatbotController.getFormData);
app.get('/api/generate-unique-id/:formId', chatbotController.generateUniqueId);

// Other routes
app.get('/api/uptime', (req, res) => {
  const uptime = Date.now() - serverStartTime.getTime();
  res.json({ uptime });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/serverison', (req, res) => {
  const formattedDate = serverStartTime.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  res.send(`Server running since ${formattedDate}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/user', userContentRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;