// Danh sách các Token trên mạng Tempo
export const TOKENS = [
  { symbol: 'PathUSD',  address: '0x20c0000000000000000000000000000000000000', decimals: 6 },
  { symbol: 'AlphaUSD', address: '0x20c0000000000000000000000000000000000001', decimals: 6 },
  { symbol: 'BetaUSD',  address: '0x20c0000000000000000000000000000000000002', decimals: 6 },
  { symbol: 'ThetaUSD', address: '0x20c0000000000000000000000000000000000003', decimals: 6 },
];

export const CONTRACTS = {
  ALPHA_USD: '0x20c0000000000000000000000000000000000001',
};

// ABI tối giản cho các hàm cần thiết
export const TOKEN_ABI = [
  {
    "name": "balanceOf",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "type": "address", "name": "account" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "name": "transfer",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      { "type": "address", "name": "to" },
      { "type": "uint256", "name": "amount" }
    ],
    "outputs": [{ "type": "bool" }]
  }
];