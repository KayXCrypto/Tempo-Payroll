import React from 'react';
import { Wallet } from 'lucide-react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress, formatEther } from '@/utils/formatters';
import { tempoTestnet } from '@/config/chains';

export default function WalletPanel() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Get native balance
  const { data: balance } = useBalance({
    address: address,
    chainId: tempoTestnet.id,
  });

  const isCorrectNetwork = chain?.id === tempoTestnet.id;

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50">
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-white">Wallet Connection</h2>
      </div>
      
      {!isConnected ? (
        <div className="space-y-4">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                Connect to Tempo Testnet
              </button>
            )}
          </ConnectButton.Custom>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-300 text-xs text-center">
              Connect your wallet to start sending payments on Tempo Network
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Address */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Connected Address</p>
            <p className="text-white font-mono text-sm break-all">
              {formatAddress(address, 10, 8)}
            </p>
            <p className="text-slate-500 text-xs mt-1 font-mono">{address}</p>
          </div>
          
          {/* Balance */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-1">Balance</p>
            <p className="text-white font-bold text-xl">
              {balance ? formatEther(balance.value, 4) : '0.0000'} {balance?.symbol || 'USD'}
            </p>
          </div>

          {/* Network Status */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-slate-400 text-sm mb-2">Network</p>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-semibold">
                {chain?.name || 'Unknown'}
              </span>
              {isCorrectNetwork ? (
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                  Connected
                </span>
              ) : (
                <span className="text-amber-400 text-xs flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                  Wrong Network
                </span>
              )}
            </div>
          </div>

          {/* RainbowKit Button for full features */}
          <div className="pt-2">
            <ConnectButton 
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
          </div>
        </div>
      )}

      {/* Network Info */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Chain ID</span>
          <span className="text-slate-300 font-mono">{tempoTestnet.id}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-400">RPC</span>
          <span className="text-slate-500 text-xs font-mono truncate ml-2">
            {tempoTestnet.rpcUrls.default.http[0]}
          </span>
        </div>
      </div>
    </div>
  );
}