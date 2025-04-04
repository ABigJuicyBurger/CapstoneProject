import { validateForm } from './validateForm';
import '@testing-library/jest-dom';
// Add explicit Jest imports to resolve TypeScript errors
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('validateForm function', () => {
  let mockSetErrors: jest.Mock;
  
  beforeEach(() => {
    // Create a mock function for setErrors before each test
    mockSetErrors = jest.fn();
  });

  // Valid form data test
  it('should return true for valid form data', () => {
    const validFormData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    };
    
    const result = validateForm(validFormData, mockSetErrors);
    
    expect(result).toBe(true);
    expect(mockSetErrors).toHaveBeenCalledWith({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      server: ''
    });
  });

  // Username validation tests
  describe('Username validation', () => {
    it('should fail when username is empty', () => {
      const formData = {
        username: '',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Username is required'
        })
      );
    });

    it('should fail when username is less than 3 characters', () => {
      const formData = {
        username: 'ab',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Username must be at least 3 characters'
        })
      );
    });

    it('should pass when username is exactly 3 characters', () => {
      const formData = {
        username: 'abc',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      // This test might fail if other validations fail
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          username: ''
        })
      );
    });
  });

  // Email validation tests
  describe('Email validation', () => {
    it('should fail when email is empty', () => {
      const formData = {
        username: 'testuser',
        email: '',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'Email is required'
        })
      );
    });

    it('should fail when email format is invalid', () => {
      const invalidEmails = [
        'testexample.com', // missing @
        'test@example', // missing domain extension
        '@example.com', // missing username
        'test@.com', // missing domain name
        'test@example..com', // double dots
        'test@exam.ple.com' // non-consecutive double dots
        , "anotheremail@em.ail.com"
      ];
      
      invalidEmails.forEach(email => {
        const formData = {
          username: 'testuser',
          email,
          password: 'Password123!',
          confirmPassword: 'Password123!'
        };
        
        const result = validateForm(formData, mockSetErrors);
        
        expect(result).toBe(false);
        expect(mockSetErrors).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'Please enter a valid email address'
          })
        );
        
        // Reset the mock for the next iteration
        mockSetErrors.mockClear();
      });
    });

    it('should pass with valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'test.user@example.com',
        'test+user@example.com',
        'test_user@example.com',
        'test-user@example-domain.com',
        'test@subdomain.example.com'
      ];
      
      validEmails.forEach(email => {
        const formData = {
          username: 'testuser',
          email,
          password: 'Password123!',
          confirmPassword: 'Password123!'
        };
        
        validateForm(formData, mockSetErrors);
        
        // Verify no email error
        expect(mockSetErrors).toHaveBeenCalledWith(
          expect.objectContaining({
            email: ''
          })
        );
        
        // Reset the mock for the next iteration
        mockSetErrors.mockClear();
      });
    });
  });

  // Password validation tests
  describe('Password validation', () => {
    it('should fail when password is empty', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '',
        confirmPassword: ''
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'Password is required'
        })
      );
    });

    it('should fail when password is less than 8 characters', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Pass1!',
        confirmPassword: 'Pass1!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'Password must be at least 8 characters'
        })
      );
    });

    it('should fail when password does not have an uppercase letter', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'Password must contain at least one uppercase letter, one number, and one special character'
        })
      );
    });

    it('should fail when password does not have a number', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password!',
        confirmPassword: 'Password!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'Password must contain at least one uppercase letter, one number, and one special character'
        })
      );
    });

    it('should fail when password does not have a special character', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'Password must contain at least one uppercase letter, one number, and one special character'
        })
      );
    });

    it('should pass with valid passwords', () => {
      const validPasswords = [
        'Password123!',
        'Secure#Password1',
        'ValidP@ssw0rd',
        'C0mpl3x!P@55w0rd'
      ];
      
      validPasswords.forEach(password => {
        const formData = {
          username: 'testuser',
          email: 'test@example.com',
          password,
          confirmPassword: password
        };
        
        validateForm(formData, mockSetErrors);
        
        // Verify no password error
        expect(mockSetErrors).toHaveBeenCalledWith(
          expect.objectContaining({
            password: ''
          })
        );
        
        // Reset the mock for the next iteration
        mockSetErrors.mockClear();
      });
    });
  });

  // Confirm password validation tests
  describe('Confirm Password validation', () => {
    it('should fail when confirm password is empty', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: ''
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmPassword: 'Please confirm your password'
        })
      );
    });

    it('should fail when passwords do not match', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      };
      
      const result = validateForm(formData, mockSetErrors);
      
      expect(result).toBe(false);
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmPassword: 'Passwords do not match'
        })
      );
    });

    it('should pass when passwords match', () => {
      const formData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      validateForm(formData, mockSetErrors);
      
      // Verify no confirm password error
      expect(mockSetErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmPassword: ''
        })
      );
    });
  });

  // Multiple validation errors test
  it('should report multiple validation errors simultaneously', () => {
    const formData = {
      username: 'ab', // Too short
      email: 'invalid-email', // Invalid format
      password: 'pass', // Too short and missing requirements
      confirmPassword: 'different' // Doesn't match
    };
    
    const result = validateForm(formData, mockSetErrors);
    
    expect(result).toBe(false);
    expect(mockSetErrors).toHaveBeenCalledWith({
      username: 'Username must be at least 3 characters',
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters',
      confirmPassword: 'Passwords do not match',
      server: ''
    });
  });
});