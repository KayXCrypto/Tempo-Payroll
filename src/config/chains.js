// Tempo Testnet Chain Configuration
export const tempoTestnet = {
  id: 42429,
  name: 'Tempo Testnet',
  network: 'tempo-testnet',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.tempo.xyz'],
      webSocket: ['wss://rpc.testnet.tempo.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.tempo.xyz'],
      webSocket: ['wss://rpc.testnet.tempo.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: 'https://explore.tempo.xyz',
    },
  },
  contracts: {
    // Add your deployed contract addresses here
    // multicall3: {
    //   address: '0x20c0000000000000000000000000000000000001',
    //   blockCreated: 0,
    // },
  },
  testnet: true,
};

// Tempo Mainnet (for future use)
export const tempoMainnet = {
  id: 0, // Replace with actual mainnet chain ID when available
  name: 'Tempo',
  network: 'tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.tempo.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.tempo.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: 'https://explore.tempo.xyz',
    },
  },
  testnet: false,
};

// Export all supported chains
export const supportedChains = [tempoTestnet];

// Helper function to get chain by ID
export function getChainById(chainId) {
  return supportedChains.find(chain => chain.id === chainId);
}

// Helper function to check if chain is supported
export function isChainSupported(chainId) {
  return supportedChains.some(chain => chain.id === chainId);
}