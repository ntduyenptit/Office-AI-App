const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Get the absolute path to the templates directory
const templatesDir = path.join(__dirname, 'src', 'assets', 'docx-templates');

// Ensure the templates directory exists
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, templatesDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(docx)$/)) {
      return cb(new Error('Only .docx files are allowed!'), false);
    }
    cb(null, true);
  }
});

// List files endpoint
app.get('/api/templates/list', (req, res) => {
  console.log('Reading directory:', templatesDir);
  
  fs.readdir(templatesDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Failed to read templates directory' });
    }
    
    // Filter for .docx files
    const docxFiles = files.filter(file => file.toLowerCase().endsWith('.docx'));
    console.log('Found files:', docxFiles);
    res.json(docxFiles);
  });
});

// Upload endpoint
app.post('/api/templates/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save endpoint
app.post('/api/templates/save', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      filename: req.file.filename,
      path: req.file.path
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Templates directory: ${templatesDir}`);
}); 