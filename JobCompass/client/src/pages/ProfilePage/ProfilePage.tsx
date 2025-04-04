import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  savedjobs: string;
};

function ProfilePage({ user, loggedIn }: ProfilePageProps) {
  const [userMeta, setUserMeta] = useState<UserMetaData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableBio, setEditableBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        
        const response = await axios.get('http://localhost:8080/user/meta', {
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
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:8080/user/meta', {
        bio: editableBio
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      if (userMeta) {
        setUserMeta({
          ...userMeta,
          bio: editableBio
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      setError('Failed to update profile');
    }
  };

  const renderJobCount = () => {
    if (!userMeta || !userMeta.savedjobs) return 0;
    
    try {
      const savedJobs = JSON.parse(userMeta.savedjobs);
      return Array.isArray(savedJobs) ? savedJobs.length : 0;
    } catch (error) {
      return 0;
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
              src={user.avatar || "/default-avatar.png"} 
              alt={`${user.userName}'s avatar`} 
              className="profile-avatar__image" 
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
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <div className="profile-bio profile-bio--editing">
                <textarea
                  className="profile-bio__textarea"
                  value={editableBio}
                  onChange={(e) => setEditableBio(e.target.value)}
                  placeholder="Write a short bio about yourself, your skills, and what kind of job you're looking for..."
                  rows={5}
                ></textarea>
                <button 
                  className="profile-bio__save-button"
                  onClick={handleSaveBio}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="profile-bio">
                <p>{userMeta?.bio || 'No bio added yet. Click Edit to add one.'}</p>
              </div>
            )}
          </div>
          
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
          
          <div className="profile-section">
            <h2 className="profile-section__title">Saved Jobs</h2>
            {renderJobCount() > 0 ? (
              <div className="profile-saved-jobs">
                <a href={`/user/${user.userId}/savedJobs`} className="profile-saved-jobs__link">
                  View all saved jobs
                </a>
              </div>
            ) : (
              <div className="profile-saved-jobs profile-saved-jobs--empty">
                <p>You haven't saved any jobs yet.</p>
                <a href="/jobs" className="profile-saved-jobs__browse-link">Browse Jobs</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
