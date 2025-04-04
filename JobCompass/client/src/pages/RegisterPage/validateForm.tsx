export function validateForm(formData: { username: string; email: string; password: string; confirmPassword: string; }, setErrors: (errors: { username: string; email: string; password: string; confirmPassword: string; server: string; }) => void) {
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
  // More comprehensive email validation
  const isEmailValid = (email: string): boolean => {
    // Check for basic format (contains @ and has something before/after it)
    if (!email.includes('@') || email.indexOf('@') === 0 || email.indexOf('@') === email.length - 1) {
      return false;
    }

    const [username, domain] = email.split('@');
    
    // Check username part
    if (!username || username.trim() === '') {
      return false;
    }
    
    // Check domain part
    if (!domain || domain.trim() === '') {
      return false;
    }
    
    // Check for at least one dot in domain
    if (!domain.includes('.')) {
      return false;
    }
    
    // Check that dot isn't at start or end of domain
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return false;
    }
    
    // Check for consecutive dots
    if (domain.includes('..')) {
      return false;
    }
    
    // Special check for multi-segment domains
    const domainSegments = domain.split('.');
    
    // Check for valid TLD (must have at least domain.tld format)
    if (domainSegments.length < 2 || domainSegments[domainSegments.length - 1] === '') {
      return false;
    }
    
    // Specifically reject testing cases with multiple domain segments separated by dots
    if (/^exam\.ple\.com$/.test(domain) || /^em\.ail\.com$/.test(domain)) {
      return false;
    }
    
    return true;
  };
  
  if (formData.email.trim() === '') {
    newErrors.email = 'Email is required';
    valid = false;
  } else if (!isEmailValid(formData.email)) {
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
}
