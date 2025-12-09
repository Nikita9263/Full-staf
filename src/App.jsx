import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import AddIdeaModal from './components/AddIdeaModal'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import LoginPage from './components/LoginPage'
import IdeaCard from './components/IdeaCard'
import { apiService } from './services/apiService'
import './App.css'

function App() {
  // Modal states
  const [isAddIdeaOpen, setIsAddIdeaOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  // Data states
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Authentication states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load ideas from localStorage on mount (fallback data)
  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      console.log('Loading saved ideas from localStorage');
      const parsedIdeas = JSON.parse(savedIdeas);
      setIdeas(parsedIdeas);
      // Clear any previous error when loading from localStorage
      setError(null);
      setLoading(false);
      console.log('Loaded', parsedIdeas.length, 'ideas from localStorage');
    } else {
      // Set some demo data if no saved data exists
      const demoData = [
        {
          id: 1,
          title: "Study Group for Machine Learning",
          description: "Looking for students to form a study group for ML concepts. We'll meet weekly to discuss algorithms, work on projects, and prepare for exams together.",
          category: "Education",
          type: "task",
          createdAt: "9/12/2025",
          likes: 5,
          comments: [],
          author: "current-user",
          liked: false
        },
        {
          id: 2,
          title: "Smart Campus Navigation App",
          description: "An idea for a mobile app that helps students navigate large campus buildings using AR technology.",
          category: "Technology",
          type: "idea",
          createdAt: "8/12/2025",
          likes: 12,
          comments: [],
          author: "other-user",
          liked: false
        }
      ];
      setIdeas(demoData);
      localStorage.setItem('ideas', JSON.stringify(demoData));
    }
  }, []);

  // Fetch ideas from API on component mount (only if we don't have localStorage data)
  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    if (!savedIdeas) {
      console.log('No localStorage data found, fetching from API');
      fetchIdeas();
    } else {
      console.log('Using localStorage data, skipping API call');
      setLoading(false); // Set loading to false since we have data
    }
  }, []);

  const fetchIdeas = async () => {
    try {
      console.log('Fetching ideas from API...');
      setLoading(true);
      setError(null);
      const data = await apiService.fetchIdeas();
      console.log('Fetched ideas:', data);
      console.log('Ideas data type:', typeof data, 'Is array:', Array.isArray(data));
      // Ensure we always set an array
      const validData = Array.isArray(data) ? data : [];
      if (validData.length > 0) {
        setIdeas(validData);
        // Store in localStorage as backup
        localStorage.setItem('ideas', JSON.stringify(validData));
        console.log('Updated ideas from API:', validData.length, 'items');
      } else {
        console.log('API returned empty data, keeping existing localStorage data');
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
      // Try to load from localStorage as backup
      const backupIdeas = localStorage.getItem('ideas');
      if (backupIdeas) {
        console.log('Loading ideas from localStorage backup');
        const parsedIdeas = JSON.parse(backupIdeas);
        setIdeas(parsedIdeas);
        // Clear error if we have backup data
        if (parsedIdeas.length > 0) {
          setError(null);
          console.log('Error cleared - using localStorage data');
        } else {
          setError('Failed to fetch ideas. Please try again.');
        }
      } else {
        setIdeas([]);
        setError('Failed to fetch ideas. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function to force API fetch
  const handleRefreshIdeas = async () => {
    console.log('Manual refresh triggered');
    await fetchIdeas();
  };

  // Authentication handlers
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignupClose = () => {
    setIsSignupModalOpen(false);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogin = async (loginData) => {
    setAuthLoading(true);
    try {
      // Mock login for now - replace with real API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: 1,
        name: loginData.email.split('@')[0],
        email: loginData.email
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoginModalOpen(false);
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (signupData) => {
    setAuthLoading(true);
    try {
      // Mock signup for now - replace with real API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: Date.now(),
        name: signupData.name,
        email: signupData.email
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsSignupModalOpen(false);
    } catch (error) {
      throw new Error('Signup failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleAddIdeaClick = () => {
    setIsAddIdeaOpen(true);
  };

  const handleAddIdea = async (ideaData) => {
    try {
      setLoading(true);
      console.log('Creating idea with data:', ideaData);
      const newIdea = await apiService.createIdea(ideaData);
      console.log('Received new idea:', newIdea);
      
      if (newIdea) {
        // Ensure ideas is always an array before spreading
        const updatedIdeas = [newIdea, ...(ideas || [])];
        setIdeas(updatedIdeas);
        // Update localStorage
        localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
        setIsAddIdeaOpen(false);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      alert('Failed to add idea. Please try again.');
      console.error('Error adding idea:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (ideaId) => {
    try {
      const result = await apiService.toggleLike(ideaId);
      setIdeas(ideas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, likes: result.likes, liked: result.liked }
          : idea
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleEdit = (ideaToEdit) => {
    // For now, we'll just show an alert. You can implement full edit functionality later
    alert(`Edit functionality for "${ideaToEdit.title}" would open the modal with pre-filled data`);
  };

  const handleDelete = async (ideaId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiService.deleteIdea(ideaId);
        setIdeas(ideas.filter(idea => idea.id !== ideaId));
      } catch (err) {
        alert('Failed to delete idea. Please try again.');
        console.error('Error deleting idea:', err);
      }
    }
  };

  const handleAddComment = async (ideaId, commentText) => {
    try {
      const newComment = await apiService.addComment(ideaId, commentText);
      setIdeas(ideas.map(idea => 
        idea.id === ideaId 
          ? { 
              ...idea, 
              comments: [...idea.comments, newComment]
            }
          : idea
      ));
    } catch (err) {
      alert('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    }
  };

  // If user is not logged in, show login page
  if (!user) {
    console.log('User not logged in, showing LoginPage');
    return <LoginPage onLogin={handleLogin} />;
  }

  console.log('User logged in, showing main app. Ideas count:', ideas.length);
  console.log('Ideas array:', ideas);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  // If user is logged in, show main app
  return (
    <>
      <Navbar 
        onAddIdeaClick={handleAddIdeaClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="hero-section">
          <h1>🎓 Welcome to StudentHub</h1>
          <p>Share your tasks and ideas with fellow students. Collaborate, learn, and achieve together!</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{ideas.length}</span>
              <span className="stat-label">Posts Shared</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Learning Opportunities</span>
            </div>
          </div>
        </div>

        <section className="ideas-section">
          <h2>📚 Latest Tasks & Ideas</h2>
          <p style={{color: 'white', padding: '10px', background: '#333'}}>
            Debug: Ideas Count: {ideas?.length || 0}, Loading: {loading ? 'Yes' : 'No'}, Error: {error || 'None'}
          </p>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading amazing ideas...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>❌ Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="primary-btn" onClick={fetchIdeas}>
                🔄 Try Again
              </button>
            </div>
          ) : ideas.length > 0 ? (
            <div className="ideas-grid">
              {ideas.map(idea => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No posts yet!</h3>
              <p>Be the first to share a task or idea with your fellow students.</p>
              <button className="primary-btn" onClick={handleAddIdeaClick}>
                🚀 Add Your First Post
              </button>
            </div>
          )}
        </section>
      </main>

      {isAddIdeaOpen && (
        <AddIdeaModal 
          isOpen={isAddIdeaOpen}
          onClose={() => setIsAddIdeaOpen(false)} 
          onSubmit={handleAddIdea}
        />
      )}
      
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleLoginClose}
          onLogin={handleLogin}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      
      {isSignupModalOpen && (
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={handleSignupClose}
          onSignup={handleSignup}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  )
}

export default App
