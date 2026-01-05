import React from 'react';
import { User, X, Wallet } from 'lucide-react';
import { formatAddress, formatUSD } from '@/utils/formatters';

export default function EmployeeCard({ employee, onRemove }) {
  return (
    <div className="group relative bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/50 hover:bg-slate-900/60 rounded-xl p-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-slate-700 flex-shrink-0">
            <User className="text-blue-400" size={20} />
          </div>
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors truncate">
              {employee.name}
            </h4>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mt-1">
              <Wallet size={12} className="flex-shrink-0" />
              <span className="truncate" title={employee.address}>
                {formatAddress(employee.address, 8, 6)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Amount */}
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
            <p className="text-white font-bold text-lg whitespace-nowrap">
              {formatUSD(employee.amount)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(employee.id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
            title="Remove recipient"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
    </div>
  );
}