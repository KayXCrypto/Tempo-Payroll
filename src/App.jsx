import React, { useState } from 'react';
import { Zap, Terminal, Activity, Users, CreditCard, LayoutGrid, Fuel } from 'lucide-react';

// Components
import WalletPanel from './components/wallet/WalletPanel';
import AddEmployeeForm from './components/payroll/AddEmployeeForm';
import EmployeeCard from './components/payroll/EmployeeCard';

// Hooks & Config
import { useEmployees } from './hooks/useEmployees';
import { usePayroll } from './hooks/usePayroll';
import { useTokenBalances } from './hooks/useTokenBalances';
import { TOKENS, getFeeTokens } from './config/contracts';
import { formatUSD } from './utils/formatters';
import logo from '../public/favicon.ico';

export default function App() {
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: 'Tempo Payroll Agent Ready' }
  ]);

  const [selectedToken, setSelectedToken] = useState(TOKENS[1].address);
  const [feeToken, setFeeToken] = useState(TOKENS[0].address); // Token để trả phí
  const { employees, addEmployee, removeEmployee, getTotalAmount } = useEmployees();
  const { balances, isLoading: loadingBalances } = useTokenBalances();

  // Hàm addLog thông minh xử lý cả chuỗi và object chứa link
  const addLog = (entry) => {
    const time = new Date().toLocaleTimeString();
    const newLog = typeof entry === 'object' ? { time, ...entry } : { time, text: entry };
    setLogs(prev => [newLog, ...prev].slice(0, 15));
  };

  const { executeBatchPayment, isProcessing } = usePayroll({
    onSuccess: () => addLog("Batch processed successfully!"),
    onError: (err) => addLog(`Error: ${err}`),
    onLog: (msg) => addLog(msg)
  });

  const currentToken = TOKENS.find(t => t.address === selectedToken) || TOKENS[1];
  const currentFeeToken = TOKENS.find(t => t.address === feeToken) || TOKENS[0];
  const feeTokensList = getFeeTokens();

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="bg-blue-600/10 p-1 rounded-lg border border-blue-500/20">
            <img
              src={logo}
              alt="Tempo Logo"
              className="w-10 h-10 object-contain shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tempo Payroll</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              Account Abstraction Billing
            </p>
          </div>
        </header>

        <WalletPanel />

        {/* Token Selection & Balances */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
            <CreditCard size={14} /> Select Payment Token
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {balances.map((token) => (
              <div
                key={token.address}
                onClick={() => setSelectedToken(token.address)}
                className={`cursor-pointer transition-all border p-4 rounded-xl relative ${selectedToken === token.address
                    ? 'bg-blue-600/10 border-blue-500 shadow-lg'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <p className="text-[10px] text-slate-500 uppercase font-bold">{token.symbol}</p>
                <p className="text-lg font-mono font-bold text-white mt-1">
                  {loadingBalances ? "..." : parseFloat(token.formatted).toLocaleString()}
                </p>
                {selectedToken === token.address && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </div>
            ))}
          </div>
        </section>

        {/* Fee Token Selection */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
            <Fuel size={14} /> Gas Fee Token
          </h2>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm text-slate-400">Pay gas fees with:</span>
              <div className="flex gap-2">
                {feeTokensList.map((token) => {
                  const balance = balances.find(b => b.address === token.address);
                  return (
                    <button
                      key={token.address}
                      onClick={() => setFeeToken(token.address)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        feeToken === token.address
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {token.symbol}
                      <span className="text-xs ml-2 opacity-70">
                        ({loadingBalances ? '...' : parseFloat(balance?.formatted || 0).toFixed(2)})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
              <Activity size={12} />
              Current fee token: <span className="text-emerald-400 font-bold">{currentFeeToken.symbol}</span>
            </p>
          </div>
        </section>

        {/* Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Payroll Amount</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-white">{formatUSD(getTotalAmount())}</span>
            <span className="text-blue-500 font-bold">{currentToken.symbol}</span>
          </div>
          <Activity className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800/30" size={60} />
        </div>

        <AddEmployeeForm onAdd={addEmployee} />

        {/* Queue & Execute */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
            <LayoutGrid size={14} /> Payment Queue ({employees.length})
          </h2>

          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
            {employees.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-xl opacity-40">
                <Users size={30} className="mx-auto mb-2" />
                <p className="text-sm">No recipients in queue</p>
              </div>
            ) : (
              employees.map(emp => <EmployeeCard key={emp.id} employee={emp} onRemove={removeEmployee} />)
            )}
          </div>

          <button
            onClick={() => executeBatchPayment(employees, selectedToken, feeToken)}
            disabled={isProcessing || employees.length === 0}
            className={`w-full py-4 rounded-xl font-bold transition-all ${isProcessing || employees.length === 0 ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl'
              }`}
          >
            {isProcessing ? 'Processing...' : `Execute Batch Payroll with ${currentToken.symbol}`}
          </button>
          <p className="text-xs text-center text-slate-500 mt-2">
            Gas fees will be paid in {currentFeeToken.symbol}
          </p>
        </div>

        {/* Console with Explorer Links */}
        <div className="bg-black border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <Terminal size={14} />
            <h2 className="text-[10px] font-bold uppercase tracking-widest">Transaction Console</h2>
          </div>
          <div className="font-mono text-[11px] h-40 overflow-y-auto custom-scrollbar space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={log.text?.includes('Error') || log.text?.includes('[Lỗi]') ? 'text-red-400' : 'text-emerald-500'}>
                    ➜ {log.text}
                  </span>
                  {log.link && (
                    <a href={log.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">[View Explorer]</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}