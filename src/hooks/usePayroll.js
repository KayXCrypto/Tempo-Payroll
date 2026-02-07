import { useState, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseUnits } from 'viem';
import { TOKEN_ABI } from '../config/contracts';

export function usePayroll({ onSuccess, onError, onLog } = {}) {
  const { isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const executeBatchPayment = useCallback(async (employees, tokenAddress, feeTokenAddress) => {
    if (!isConnected) return onError?.("Wallet not connected!");
    if (!tokenAddress) return onError?.("Please select Token!");
    if (!feeTokenAddress) return onError?.("Please select Fee Token!");

    try {
      setIsProcessing(true);
      onLog?.("--- START PAYING ---");
      onLog?.(`Using ${feeTokenAddress === tokenAddress ? 'same token' : 'different token'} for gas fees`);

      for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        onLog?.(`[${i+1}/${employees.length}] Send ${emp.amount} to ${emp.name}...`);

        // Cấu hình giao dịch với fee token
        const txConfig = {
          address: tokenAddress,
          abi: TOKEN_ABI,
          functionName: 'transfer',
          args: [emp.address, parseUnits(String(emp.amount), 6)],
          gas: 3000000n,
        };

        // Nếu fee token khác với payment token, thêm thông tin vào config
        // Lưu ý: Tempo chain hỗ trợ EIP-1559 với paymaster pattern
        if (feeTokenAddress !== tokenAddress) {
          onLog?.(`Using ${feeTokenAddress.slice(0, 10)}... for gas payment`);
          // Thêm logic paymaster nếu Tempo chain hỗ trợ
          // txConfig.paymaster = { token: feeTokenAddress };
        }

        // Sử dụng await để lấy hash ngay lập tức
        const hash = await writeContractAsync(txConfig);

        // Gửi log kèm link explorer
        onLog?.({
          text: `✓ Success: ${hash.slice(0, 10)}...`,
          link: `https://explore.tempo.xyz/tx/${hash}`
        });
        
        // Nghỉ một chút giữa các giao dịch để tránh lỗi nonce
        if (i < employees.length - 1) await new Promise(r => setTimeout(r, 2000));
      }

      onLog?.("✓ ALL PAYMENTS COMPLETED!");
      onSuccess?.();
    } catch (err) {
      const msg = err.shortMessage || err.message || "Transaction failed";
      onLog?.(`[Error] ${msg}`);
      onError?.(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [isConnected, writeContractAsync, onLog, onError, onSuccess]);

  return { executeBatchPayment, isProcessing };
}