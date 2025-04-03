import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    server: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any error for this field when typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      server: ''
    };

    // Username validation
    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation
    if (formData.password === '') {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    } else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one number, and one special character';
      valid = false;
    }

    // Confirm password validation
    if (formData.confirmPassword === '') {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Send registration request to server
      await axios.post('http://localhost:8080/user/register', {
        username: formData.username.toLowerCase(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      // Redirect to login page on success
      setLoading(false);
      navigate('/signIn');
    } catch (error: any) {
      setLoading(false);
      
      // Handle server errors
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 409) {
          // User already exists
          if (data.field === 'username') {
            setErrors({ ...errors, username: 'Username already taken' });
          } else if (data.field === 'email') {
            setErrors({ ...errors, email: 'Email already registered' });
          } else {
            setErrors({ ...errors, server: data.message || 'Registration failed' });
          }
        } else {
          setErrors({ ...errors, server: 'An error occurred during registration' });
        }
      } else {
        setErrors({ ...errors, server: 'Network error - please try again' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="page-content">
      <div className="auth-container">
        <h2 className="auth-title">Create an Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="username" className="auth-form__label">Username</label>
            <input
              className="auth-form__input"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
            {errors.username && <p className="auth-form__error">{errors.username}</p>}
          </div>
          
          <div className="auth-form__field">
            <label htmlFor="email" className="auth-form__label">Email</label>
            <input
              className="auth-form__input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && <p className="auth-form__error">{errors.email}</p>}
          </div>
          
          <div className="auth-form__field">
            <label htmlFor="password" className="auth-form__label">Password</label>
            <div className="auth-form__password-container">
              <input
                className="auth-form__input auth-form__input--with-toggle"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                required
              />
              <button 
                type="button" 
                className="auth-form__password-toggle" 
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="auth-form__error">{errors.password}</p>}
          </div>
          
          <div className="auth-form__field">
            <label htmlFor="confirmPassword" className="auth-form__label">Confirm Password</label>
            <div className="auth-form__password-container">
              <input
                className="auth-form__input auth-form__input--with-toggle"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button 
                type="button" 
                className="auth-form__password-toggle" 
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p className="auth-form__error">{errors.confirmPassword}</p>}
          </div>
          
          {errors.server && <p className="auth-form__error">{errors.server}</p>}
          
          <button 
            className="auth-form__button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
          
          <p className="auth-form__link-text">
            Already have an account? <a href="/signIn" className="auth-form__link">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
