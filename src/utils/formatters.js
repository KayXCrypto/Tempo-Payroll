/**
 * Format Ethereum address to shortened version
 * @param {string} address - Full address
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} Formatted address
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format amount to USD currency
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount
 */
export function formatUSD(amount, decimals = 2) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format amount without currency symbol
 * @param {number|string} amount - Amount to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount
 */
export function formatNumber(amount, decimals = 2) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format Wei to Ether
 * @param {bigint|string} wei - Amount in Wei
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted amount in Ether
 */
export function formatEther(wei, decimals = 4) {
  if (!wei) return '0';
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  const ether = Number(weiValue) / 1e6;
  return formatNumber(ether, decimals);
}

/**
 * Parse Ether to Wei
 * @param {string|number} ether - Amount in Ether
 * @returns {bigint} Amount in Wei
 */
export function parseEtherToWei(ether) {
  const etherValue = typeof ether === 'string' ? parseFloat(ether) : ether;
  return BigInt(Math.floor(etherValue * 1e6));
}

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format timestamp to readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time
 */
export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format transaction hash
 * @param {string} hash - Transaction hash
 * @returns {string} Formatted hash
 */
export function formatTxHash(hash) {
  return formatAddress(hash, 10, 8);
}

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatCompactNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}