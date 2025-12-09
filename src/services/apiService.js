// API Service for StudentHub
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  // Fetch all tasks and ideas
  async fetchIdeas() {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/ideas`);
      const response = await fetch(`${API_BASE_URL}/ideas`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Fetch API response:', result);
      // Extract data from the response object
      const ideas = result.success ? result.data : [];
      console.log('Extracted ideas:', ideas.length, 'items');
      return ideas;
    } catch (error) {
      console.error('Error fetching ideas:', error);
      throw error;
    }
  }

  // Create new idea/task
  async createIdea(ideaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('CreateIdea API response:', result);
      // Extract data from the response object
      return result.success ? result.data : result;
    } catch (error) {
      console.error('Backend unavailable, using offline mode');
      // Offline mode - create idea locally
      // Get next available ID from localStorage
      const savedIdeas = JSON.parse(localStorage.getItem('ideas') || '[]');
      const maxId = savedIdeas.length > 0 ? Math.max(...savedIdeas.map(i => i.id)) : 0;
      
      const offlineIdea = {
        id: maxId + 1,
        title: ideaData.title,
        description: ideaData.description,
        category: ideaData.category || 'Other',
        type: ideaData.type || 'idea',
        createdAt: new Date().toLocaleDateString(),
        likes: 0,
        comments: [],
        author: 'current-user',
        liked: false
      };
      console.log('Created offline idea:', offlineIdea);
      return offlineIdea;
    }
  }

  // Update idea (like/unlike)
  async updateIdea(ideaId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  }

  // Delete idea
  async deleteIdea(ideaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  }

  // Add comment
  async addComment(ideaId, commentText) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const comment = await response.json();
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Toggle like
  async toggleLike(ideaId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Helper methods to generate realistic student data
  generateStudentTitle(index) {
    const titles = [
      "Study Group for Data Structures & Algorithms",
      "Mobile App Development Project Idea",
      "Need Partner for Machine Learning Research",
      "Web Development Bootcamp Study Circle", 
      "AI-Powered Campus Assistant Concept",
      "Looking for React.js Study Buddy"
    ];
    return titles[index] || `Student Project ${index + 1}`;
  }

  generateStudentDescription(body, index) {
    const descriptions = [
      "Looking for motivated students to join our weekly DSA study sessions. We'll solve coding problems, discuss algorithms, and prepare for technical interviews together.",
      "Idea for a cross-platform mobile app that helps students find study spaces, track assignments, and connect with classmates for collaborative learning.",
      "Working on ML research about student performance prediction. Need a partner with Python and statistics background to help with data analysis.",
      "Starting a web development study group focused on modern frameworks. Perfect for beginners who want to learn HTML, CSS, JavaScript, and React.",
      "Concept for an AI assistant that helps students with schedule management, assignment reminders, and personalized learning recommendations.",
      "Looking for a study partner to learn React.js together. Plan to build projects and practice coding challenges to improve our skills."
    ];
    return descriptions[index] || body.substring(0, 200) + "...";
  }

  getRandomCategory() {
    const categories = ['Education', 'Technology', 'Research', 'Social', 'Business', 'Health', 'Arts', 'Sports'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  generateComments(postId) {
    if (Math.random() > 0.6) {
      return [
        {
          id: 1,
          author: 'Alex Kumar',
          text: 'This sounds really interesting! Count me in.',
          createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      ];
    }
    return [];
  }
}

// Export as named export
export const apiService = new ApiService();

// Also export as default for flexibility
export default new ApiService();