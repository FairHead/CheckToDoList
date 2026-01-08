/**
 * Validation utilities
 */

/**
 * Validates phone number format (E.164)
 * E.164 format: +[country code][number]
 * Example: +491234567890
 * 
 * @param phoneNumber - Phone number to validate
 * @returns Object with isValid flag and optional error message
 */
export const validatePhoneNumber = (phoneNumber: string): { 
  isValid: boolean; 
  error?: string 
} => {
  if (!phoneNumber.trim()) {
    return { isValid: false, error: 'Please enter your phone number' };
  }

  if (!phoneNumber.startsWith('+')) {
    return { 
      isValid: false, 
      error: 'Phone number must start with + and country code (e.g., +49)' 
    };
  }

  // Basic length check: E.164 allows 1-15 digits after +
  const digitsOnly = phoneNumber.slice(1).replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return { 
      isValid: false, 
      error: 'Phone number must be between 7 and 15 digits' 
    };
  }

  return { isValid: true };
};

/**
 * Validates display name
 * 
 * @param displayName - Display name to validate
 * @param minLength - Minimum length (default: 2)
 * @returns Object with isValid flag and optional error message
 */
export const validateDisplayName = (
  displayName: string, 
  minLength: number = 2
): { 
  isValid: boolean; 
  error?: string 
} => {
  if (!displayName.trim()) {
    return { isValid: false, error: 'Please enter your name' };
  }

  if (displayName.trim().length < minLength) {
    return { 
      isValid: false, 
      error: `Name must be at least ${minLength} characters long` 
    };
  }

  return { isValid: true };
};

/**
 * Validates email format
 * 
 * @param email - Email to validate
 * @returns Object with isValid flag and optional error message
 */
export const validateEmail = (email: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!email.trim()) {
    return { isValid: false, error: 'Please enter your email' };
  }

  // RFC 5322 simplified email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 * Requirements: min 8 chars, 1 uppercase, 1 number
 * 
 * @param password - Password to validate
 * @returns Object with isValid flag and optional error message
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!password) {
    return { isValid: false, error: 'Please enter a password' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

/**
 * Validates password confirmation
 * 
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns Object with isValid flag and optional error message
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): {
  isValid: boolean;
  error?: string;
} => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Validates birth date and age requirement
 * User must be at least 13 years old
 * 
 * @param birthDate - Birth date in YYYY-MM-DD format
 * @param minAge - Minimum age requirement (default: 13)
 * @returns Object with isValid flag and optional error message
 */
export const validateBirthDate = (
  birthDate: string,
  minAge: number = 13
): {
  isValid: boolean;
  error?: string;
} => {
  if (!birthDate) {
    return { isValid: false, error: 'Please enter your birth date' };
  }

  const date = new Date(birthDate);
  const today = new Date();
  
  // Check if valid date
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  // Check if date is not in the future
  if (date > today) {
    return { isValid: false, error: 'Birth date cannot be in the future' };
  }

  // Calculate age
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { 
      isValid: false, 
      error: `You must be at least ${minAge} years old to register` 
    };
  }

  return { isValid: true };
};

/**
 * Validates username format
 * Username must be alphanumeric with optional underscores and hyphens
 * 
 * @param username - Username to validate
 * @param minLength - Minimum length (default: 3)
 * @param maxLength - Maximum length (default: 20)
 * @returns Object with isValid flag and optional error message
 */
export const validateUsername = (
  username: string,
  minLength: number = 3,
  maxLength: number = 20
): {
  isValid: boolean;
  error?: string;
} => {
  if (!username) {
    // Username is optional, so empty is valid
    return { isValid: true };
  }

  if (username.length < minLength) {
    return { 
      isValid: false, 
      error: `Username must be at least ${minLength} characters long` 
    };
  }

  if (username.length > maxLength) {
    return { 
      isValid: false, 
      error: `Username must be no more than ${maxLength} characters long` 
    };
  }

  // Only alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { 
      isValid: false, 
      error: 'Username can only contain letters, numbers, underscores, and hyphens' 
    };
  }

  return { isValid: true };
};

export default {
  validatePhoneNumber,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateBirthDate,
  validateUsername,
};
