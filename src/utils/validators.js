/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export function isValidAddress(address) {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate amount
 * @param {string|number} amount - Amount to validate
 * @returns {boolean} True if valid
 */
export function isValidAmount(amount) {
  if (!amount) return false;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validate name/string input
 * @param {string} name - Name to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if valid
 */
export function isValidName(name, minLength = 1, maxLength = 100) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Validate transaction hash
 * @param {string} hash - Transaction hash to validate
 * @returns {boolean} True if valid
 */
export function isValidTxHash(hash) {
  if (!hash) return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate chain ID
 * @param {number} chainId - Chain ID to validate
 * @param {number[]} supportedChainIds - Array of supported chain IDs
 * @returns {boolean} True if valid
 */
export function isValidChainId(chainId, supportedChainIds = [42429]) {
  return supportedChainIds.includes(chainId);
}

/**
 * Validate employee data
 * @param {Object} employee - Employee object
 * @returns {Object} Validation result with errors
 */
export function validateEmployee(employee) {
  const errors = {};

  if (!isValidName(employee.name)) {
    errors.name = 'Name is required and must be between 1-100 characters';
  }

  if (!isValidAddress(employee.address)) {
    errors.address = 'Invalid Ethereum address';
  }

  if (!isValidAmount(employee.amount)) {
    errors.amount = 'Amount must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate batch payment data
 * @param {Array} employees - Array of employee objects
 * @returns {Object} Validation result
 */
export function validateBatchPayment(employees) {
  if (!Array.isArray(employees) || employees.length === 0) {
    return {
      isValid: false,
      error: 'No employees to process',
    };
  }

  // Check for duplicate addresses
  const addresses = employees.map(emp => emp.address.toLowerCase());
  const duplicates = addresses.filter((addr, index) => addresses.indexOf(addr) !== index);
  
  if (duplicates.length > 0) {
    return {
      isValid: false,
      error: `Duplicate addresses found: ${duplicates.join(', ')}`,
    };
  }

  // Validate each employee
  for (const employee of employees) {
    const validation = validateEmployee(employee);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: `Invalid employee ${employee.name}: ${Object.values(validation.errors).join(', ')}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}