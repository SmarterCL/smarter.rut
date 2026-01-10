const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the www directory
app.use(express.static(path.join(__dirname, 'www')));

// Handle SPA routing - serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

const PORT = 3005;
app.listen(PORT, 'localhost', () => {
  console.log(`Local Ionic app server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server.');
});