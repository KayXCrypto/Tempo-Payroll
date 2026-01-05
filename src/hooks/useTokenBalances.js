import { useReadContracts, useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { TOKENS, TOKEN_ABI } from '../config/contracts';

export function useTokenBalances() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts: TOKENS.map((token) => ({
      address: token.address,
      abi: TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address],
    })),
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    }
  });

  // Log lỗi để kiểm tra trong Inspect (F12) -> Console
  if (isError) {
    console.error("Balance error:", error);
  }

  const balances = TOKENS.map((token, index) => {
    // Kiểm tra xem result có tồn tại không (Wagmi v2 trả về mảng object)
    const result = data?.[index];
    const rawBalance = result?.status === 'success' ? result.result : 0n;
    
    return {
      ...token,
      formatted: formatUnits(rawBalance, token.decimals),
      raw: rawBalance
    };
  });

  return { balances, isLoading, refetch, isError };
}