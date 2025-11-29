/**
 * Input validation utilities
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number (basic validation)
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  
  if (phone) {
    // Remove common formatting characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it's all digits and reasonable length
    if (!/^\d+$/.test(cleaned) || cleaned.length < 10 || cleaned.length > 15) {
      errors.push('Invalid phone number format');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: string[] = [];
  
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  
  if (value.length < min) {
    errors.push(`${fieldName} must be at least ${min} characters`);
  }
  
  if (value.length > max) {
    errors.push(`${fieldName} must be no more than ${max} characters`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: {
  name?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  email?: string;
}): ValidationResult {
  const errors: string[] = [];
  
  const nameResult = validateRequired(address.name, 'Name');
  if (!nameResult.valid) errors.push(...nameResult.errors);
  
  const addressResult = validateRequired(address.address1, 'Address');
  if (!addressResult.valid) errors.push(...addressResult.errors);
  
  const cityResult = validateRequired(address.city, 'City');
  if (!cityResult.valid) errors.push(...cityResult.errors);
  
  const stateResult = validateRequired(address.state, 'State');
  if (!stateResult.valid) errors.push(...stateResult.errors);
  
  const countryResult = validateRequired(address.country, 'Country');
  if (!countryResult.valid) errors.push(...countryResult.errors);
  
  const zipResult = validateRequired(address.zip, 'ZIP code');
  if (!zipResult.valid) errors.push(...zipResult.errors);
  
  if (address.email) {
    const emailResult = validateEmail(address.email);
    if (!emailResult.valid) errors.push(...emailResult.errors);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validate and sanitize design description
 */
export function validateDesignDescription(description: string): ValidationResult {
  const errors: string[] = [];
  
  if (!description) {
    errors.push('Design description is required');
  } else {
    const lengthResult = validateLength(description, 10, 500, 'Design description');
    if (!lengthResult.valid) {
      errors.push(...lengthResult.errors);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}


