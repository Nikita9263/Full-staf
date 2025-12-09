const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const dataFilePath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
const initializeDataFile = () => {
  if (!fs.existsSync(dataFilePath)) {
    const initialData = {
      ideas: [
        {
          id: 1,
          title: "Study Group for Machine Learning",
          description: "Looking for students to form a study group for ML concepts. We'll meet weekly to discuss algorithms, work on projects, and prepare for exams together.",
          category: "Education",
          type: "task",
          createdAt: "8/12/2025",
          likes: 5,
          comments: [
            { id: 1, author: "Alex", text: "I'm interested! What time works best?", createdAt: "8/12/2025" }
          ],
          author: "current-user",
          liked: false
        },
        {
          id: 2,
          title: "Smart Campus Navigation App",
          description: "An idea for a mobile app that helps students navigate large campus buildings using AR technology. It could show directions, room availability, and event information.",
          category: "Technology",
          type: "idea",
          createdAt: "7/12/2025",
          likes: 12,
          comments: [
            { id: 1, author: "Sarah", text: "This would be so helpful! Have you considered integration with campus WiFi?", createdAt: "7/12/2025" },
            { id: 2, author: "Mike", text: "Great idea! I'd love to help develop this.", createdAt: "7/12/2025" }
          ],
          author: "other-user",
          liked: false
        },
        {
          id: 3,
          title: "Need Research Partner for Psychology Project",
          description: "Working on a research project about social media's impact on student mental health. Need a partner to help with data collection and analysis.",
          category: "Education",
          type: "task",
          createdAt: "6/12/2025",
          likes: 3,
          comments: [],
          author: "other-user",
          liked: false
        }
      ],
      nextId: 4
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  }
};

// Helper functions
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { ideas: [], nextId: 1 };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Routes

// GET /api/ideas - Get all ideas and tasks
app.get('/api/ideas', (req, res) => {
  try {
    const data = readData();
    res.json({
      success: true,
      data: data.ideas,
      message: 'Ideas fetched successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ideas',
      error: error.message
    });
  }
});

// POST /api/ideas - Create new idea/task
app.post('/api/ideas', (req, res) => {
  try {
    const { title, description, category, type } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const data = readData();
    const newIdea = {
      id: data.nextId,
      title,
      description,
      category: category || 'Other',
      type: type || 'idea',
      createdAt: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
      author: 'current-user',
      liked: false
    };

    data.ideas.unshift(newIdea);
    data.nextId++;
    writeData(data);

    res.status(201).json({
      success: true,
      data: newIdea,
      message: 'Idea created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating idea',
      error: error.message
    });
  }
});

// PUT /api/ideas/:id/like - Like/Unlike an idea
app.put('/api/ideas/:id/like', (req, res) => {
  try {
    const ideaId = parseInt(req.params.id);
    const data = readData();
    
    const ideaIndex = data.ideas.findIndex(idea => idea.id === ideaId);
    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    const idea = data.ideas[ideaIndex];
    if (idea.liked) {
      idea.likes--;
      idea.liked = false;
    } else {
      idea.likes++;
      idea.liked = true;
    }

    writeData(data);

    res.json({
      success: true,
      data: idea,
      message: 'Like status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating like status',
      error: error.message
    });
  }
});

// POST /api/ideas/:id/comments - Add comment to an idea
app.post('/api/ideas/:id/comments', (req, res) => {
  try {
    const ideaId = parseInt(req.params.id);
    const { text, author } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const data = readData();
    const ideaIndex = data.ideas.findIndex(idea => idea.id === ideaId);
    
    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    const newComment = {
      id: Date.now(),
      author: author || 'You',
      text,
      createdAt: new Date().toLocaleDateString()
    };

    data.ideas[ideaIndex].comments.push(newComment);
    writeData(data);

    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
});

// DELETE /api/ideas/:id - Delete an idea (only if user is the author)
app.delete('/api/ideas/:id', (req, res) => {
  try {
    const ideaId = parseInt(req.params.id);
    const data = readData();
    
    const ideaIndex = data.ideas.findIndex(idea => idea.id === ideaId);
    if (ideaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Check if user is the author (in real app, you'd check authentication)
    const idea = data.ideas[ideaIndex];
    if (idea.author !== 'current-user') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts'
      });
    }

    data.ideas.splice(ideaIndex, 1);
    writeData(data);

    res.json({
      success: true,
      message: 'Idea deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting idea',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'StudentHub API is running!',
    timestamp: new Date().toISOString()
  });
});

// Initialize data file
initializeDataFile();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StudentHub API Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💡 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;