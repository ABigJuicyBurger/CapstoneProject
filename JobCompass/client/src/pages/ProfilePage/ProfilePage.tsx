import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.scss';

type ProfilePageProps = {
  user: any;
  loggedIn: boolean;
};

type UserMetaData = {
  id: number;
  user_id: number;
  bio: string;
  resume: string;
  savedjobs: string | string[]; // Update the type of savedjobs to string | string[]
};

function ProfilePage({ user, loggedIn }: ProfilePageProps) {
  const [userMeta, setUserMeta] = useState<UserMetaData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editableBio, setEditableBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Redirect if not logged in
    if (!loggedIn) {
      navigate('/signIn');
      return;
    }

    // Fetch user meta data
    const fetchUserMeta = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/user/meta`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserMeta(response.data);
        setEditableBio(response.data.bio || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user meta data:', error);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserMeta();
  }, [loggedIn, navigate]);

  const handleSaveBio = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      // Only send the bio field to update, to avoid touching other fields like savedjobs
      const response = await axios.put(`${API_URL}/user/meta`, {
        bio: editableBio
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update the local state with the response data to ensure consistency
      if (response.data) {
        setUserMeta(response.data);
      }
      
      setEditMode(false);
      setUpdateMessage('Bio updated successfully!');
      
      // Clear the success message after a few seconds
      setTimeout(() => {
        setUpdateMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating bio:', error);
      setUpdateError('Failed to update bio. Please try again.');
      
      // Clear the error message after a few seconds
      setTimeout(() => {
        setUpdateError('');
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // More robust function for counting saved jobs
  const renderJobCount = () => {
    try {
      if (!userMeta || !userMeta.savedjobs) return 0;
      
      // Handle both string and array formats
      if (typeof userMeta.savedjobs === 'string') {
        // It's a string - parse it
        const savedJobsValue = userMeta.savedjobs.trim() === '' ? '[]' : userMeta.savedjobs;
        const savedJobs = JSON.parse(savedJobsValue);
        return Array.isArray(savedJobs) ? savedJobs.length : 0;
      } else if (Array.isArray(userMeta.savedjobs)) {
        // It's already an array
        return userMeta.savedjobs.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Error parsing saved jobs:', error);
      return 0;
    }
  };

  const renderSavedJobsSection = () => {
    try {
      const jobCount = renderJobCount();
      
      return (
        <div className="profile-section">
          <h2 className="profile-section__title">Saved Jobs</h2>
          {jobCount > 0 ? (
            <div className="profile-saved-jobs">
              <p className="profile-saved-jobs__count">{jobCount} job{jobCount !== 1 ? 's' : ''} saved</p>
              <Link to="/user/savedJobs" className="profile-saved-jobs__link">
                View all saved jobs
              </Link>
            </div>
          ) : (
            <div className="profile-saved-jobs profile-saved-jobs--empty">
              <p>You haven't saved any jobs yet.</p>
              <Link to="/jobs" className="profile-saved-jobs__link">
                Browse Jobs
              </Link>
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering saved jobs section:', error);
      return (
        <div className="profile-section">
          <h2 className="profile-section__title">Saved Jobs</h2>
          <div className="profile-saved-jobs profile-saved-jobs--error">
            <p>There was an error loading your saved jobs.</p>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="page-content profile-page">
        <div className="profile-page__loading">
          <div className="profile-page__loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content profile-page">
      <div className="profile-container">
        {error && <div className="profile-page__error">{error}</div>}
        
        <div className="profile-header">
          <div className="profile-avatar">
            <img 
              src={user.avatar || `${API_URL}/default-avatar.png`} 
              alt={`${user.userName}'s avatar`} 
              className="profile-avatar__image"
              onError={(e) => {
                // Fallback to inline SVG if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23cccccc"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">' + (user.userName ? user.userName.charAt(0).toUpperCase() : 'U') + '</text></svg>';
              }}
            />
          </div>
          
          <div className="profile-header__info">
            <h1 className="profile-header__name">{user.userName}</h1>
            <div className="profile-header__meta">
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="profile-stat__count">{renderJobCount()}</span>
                  <span className="profile-stat__label">Saved Jobs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-section__header">
              <h2 className="profile-section__title">About</h2>
              <button 
                className="profile-section__edit-button"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {updateMessage && (
              <div className="profile-bio__success">{updateMessage}</div>
            )}
            
            {updateError && (
              <div className="profile-bio__error">{updateError}</div>
            )}
            
            {editMode ? (
              <div className="profile-bio profile-bio--edit">
                <textarea
                  className="profile-bio__input"
                  value={editableBio}
                  onChange={(e) => setEditableBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <div className="profile-bio__actions">
                  <button
                    className="profile-bio__button profile-bio__button--cancel"
                    onClick={() => {
                      setEditMode(false);
                      setEditableBio(userMeta?.bio || '');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="profile-bio__button profile-bio__button--save"
                    onClick={handleSaveBio}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-bio">
                {userMeta?.bio || 'No bio yet. Click Edit to add one.'}
              </div>
            )}
          </div>
          
          {renderSavedJobsSection()}
          
          <div className="profile-section">
            <h2 className="profile-section__title">Resume</h2>
            {userMeta?.resume ? (
              <div className="profile-resume">
                <a href={userMeta.resume} className="profile-resume__link" target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </div>
            ) : (
              <div className="profile-resume profile-resume--empty">
                <p>No resume uploaded yet.</p>
                <button className="profile-resume__upload-button">Upload Resume</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
