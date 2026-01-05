import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { tempoTestnet } from './chains';

// Get WalletConnect Project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('⚠️ WalletConnect Project ID is not set. Please add VITE_WALLETCONNECT_PROJECT_ID to your .env file');
}

// Configure Wagmi with RainbowKit
export const wagmiConfig = getDefaultConfig({
  appName: 'Tempo Payroll Agent',
  projectId: projectId || 'demo-project-id', // Fallback for development
  chains: [tempoTestnet],
  transports: {
    [tempoTestnet.id]: http(tempoTestnet.rpcUrls.default.http[0]),
  },
  ssr: false, // Disable SSR for client-side only apps
});

// RainbowKit theme configuration
export const rainbowKitTheme = {
  accentColor: '#3b82f6', // Blue
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
};