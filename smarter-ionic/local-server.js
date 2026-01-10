#!/usr/bin/env node

const express = require('path');
const expressModule = require('express');
const app = expressModule();
const path = require('path');
const fs = require('fs');

// Serve static files from the www directory
app.use(expressModule.static(path.join(__dirname, 'www')));

// Handle SPA routing - serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

const PORT = 3003;
app.listen(PORT, 'localhost', () => {
  console.log(`Local Ionic app server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server.');
});