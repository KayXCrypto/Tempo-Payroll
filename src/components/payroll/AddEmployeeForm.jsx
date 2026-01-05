import React, { useState } from 'react';
import { Plus, User, Wallet, DollarSign, AlertCircle } from 'lucide-react';
import { sanitizeInput } from '@/utils/validators';

export default function AddEmployeeForm({ onAdd }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    address: '', 
    amount: '' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    // Sanitize inputs
    const sanitized = {
      name: sanitizeInput(formData.name),
      address: formData.address.trim(),
      amount: formData.amount.trim(),
    };

    const result = await onAdd(sanitized);
    
    if (result.success) {
      // Clear form on success
      setFormData({ name: '', address: '', amount: '' });
    } else {
      // Set errors
      setErrors(result.errors || {});
    }
    
    setIsSubmitting(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50">
      <div className="flex items-center gap-3 mb-4">
        <Plus className="text-blue-400" size={24} />
        <h2 className="text-xl font-bold text-white">Add Payment Recipient</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Name Input */}
        <div className="md:col-span-3 relative">
          <User className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="Recipient Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyPress={handleKeyPress}
            className={`w-full bg-slate-900/70 border ${
              errors.name ? 'border-red-500' : 'border-slate-700'
            } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.name}
            </p>
          )}
        </div>
        
        {/* Address Input */}
        <div className="md:col-span-6 relative">
          <Wallet className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="0x... Tempo Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            onKeyPress={handleKeyPress}
            className={`w-full bg-slate-900/70 border ${
              errors.address ? 'border-red-500' : 'border-slate-700'
            } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm`}
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.address}
            </p>
          )}
        </div>
        
        {/* Amount Input */}
        <div className="md:col-span-3 relative">
          <DollarSign className="absolute left-3 top-3.5 text-slate-500 pointer-events-none" size={18} />
          <input
            type="number"
            placeholder="Amount $"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            onKeyPress={handleKeyPress}
            step="0.01"
            min="0"
            className={`w-full bg-slate-900/70 border ${
              errors.amount ? 'border-red-500' : 'border-slate-700'
            } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.amount}
            </p>
          )}
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !formData.name || !formData.address || !formData.amount}
        className={`w-full mt-4 font-bold py-3 rounded-xl transition-all transform flex items-center justify-center gap-2 ${
          isSubmitting || !formData.name || !formData.address || !formData.amount
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-[1.02] shadow-lg shadow-green-500/20'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Adding...
          </>
        ) : (
          <>
            <Plus size={20} />
            Add to Batch Queue
          </>
        )}
      </button>
    </div>
  );
}