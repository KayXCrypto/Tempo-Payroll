import { useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { TOKEN_ABI } from '../config/contracts';

export function usePayroll({ onSuccess, onError, onLog } = {}) {
  const { isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const executeBatchPayment = useCallback(async (employees, tokenAddress) => {
    if (!isConnected) return onError?.("Wallet not connected!");
    if (!tokenAddress) return onError?.("Please select Token!");

    try {
      setIsProcessing(true);
      onLog?.("--- START PAYING ---");

      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        onLog?.(`[${i+1}/${employees.length}] Send ${emp.amount} to ${emp.name}...`);

        // Sử dụng await để lấy hash ngay lập tức
        const hash = await writeContractAsync({
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: 'transfer',
          args: [emp.address, parseUnits(String(emp.amount), 6)],
          gas: 3000000n, 
        });

        // Gửi log kèm link explorer
        onLog?.({
          text: `Success: ${hash.slice(0, 10)}...`,
          link: `https://explore.tempo.xyz/tx/${hash}`
        });
        
        // Nghỉ một chút giữa các giao dịch để tránh lỗi nonce
        if (i < employees.length - 1) await new Promise(r => setTimeout(r, 2000));
      }

      onLog?.("✓ IT'S ALL DONE!");
      onSuccess?.();
    } catch (err) {
      const msg = err.shortMessage || err.message || "The trade failed.";
      onLog?.(`[Error] ${msg}`);
      onError?.(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [isConnected, writeContractAsync, onLog, onError, onSuccess]);

  return { executeBatchPayment, isProcessing };
}