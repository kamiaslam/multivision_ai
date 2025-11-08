/**
 * Formats a phone number for display (no spaces)
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number string without spaces
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different phone number formats without spaces
  if (cleaned.length === 10) {
    // US format: +1XXXXXXXXXX
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US format with country code: +1XXXXXXXXXX
    return `+${cleaned}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('44')) {
    // UK format: +44XXXXXXXXXX
    return `+${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('44')) {
    // UK format: +44XXXXXXXXX
    return `+${cleaned}`;
  } else if (cleaned.length === 10 && cleaned.startsWith('44')) {
    // UK format: +44XXXXXXXX
    return `+${cleaned}`;
  } else if (cleaned.length >= 7 && cleaned.length <= 15) {
    // International format: +XXXXXXXXXXXX
    return `+${cleaned}`;
  }
  
  // Return with + prefix if no pattern matches but has digits
  return cleaned ? `+${cleaned}` : phoneNumber;
};

/**
 * Validates if a phone number is in a valid format
 * @param phoneNumber - The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid length (7-15 digits)
  if (cleaned.length < 7 || cleaned.length > 15) return false;
  
  // Additional validation for specific formats
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    // US format with country code
    return true;
  } else if (cleaned.startsWith('44') && (cleaned.length >= 10 && cleaned.length <= 12)) {
    // UK format
    return true;
  } else if (cleaned.length >= 7 && cleaned.length <= 15) {
    // General international format
    return true;
  }
  
  return false;
};

/**
 * Validates if a phone number is a valid US or UK phone number only
 * @param phoneNumber - The phone number to validate
 * @returns boolean indicating if the phone number is valid US or UK format
 */
export const isValidUSUKPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // US format validation
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    // US format with country code (+1XXXXXXXXXX)
    return true;
  } else if (cleaned.length === 10) {
    // US format without country code (XXXXXXXXXX)
    return true;
  }
  
  // UK format validation
  if (cleaned.startsWith('44') && (cleaned.length >= 10 && cleaned.length <= 12)) {
    // UK format with country code (+44XXXXXXXXXX)
    return true;
  }
  
  return false;
};

/**
 * Normalizes a phone number to a standard format for storage
 * @param phoneNumber - The phone number to normalize
 * @returns Normalized phone number string
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add country code if missing for US numbers
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  // Add + prefix if missing
  if (cleaned.length > 10 && !phoneNumber.startsWith('+')) {
    return `+${cleaned}`;
  }
  
  return phoneNumber;
};
