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

export default {
  validatePhoneNumber,
  validateDisplayName,
};
