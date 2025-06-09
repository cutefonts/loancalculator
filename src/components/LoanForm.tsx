import React from 'react';
import { DollarSign, Percent, Calendar, Clock } from 'lucide-react';
import { LoanData } from '../App';
import { Currency, formatCurrency } from '../types/currency';

interface LoanFormProps {
  loanData: LoanData;
  setLoanData: (data: LoanData) => void;
  currency: Currency;
}

const LoanForm: React.FC<LoanFormProps> = ({ loanData, setLoanData, currency }) => {
  const handleChange = (field: keyof LoanData, value: string | number) => {
    setLoanData({
      ...loanData,
      [field]: value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Loan Details</h2>
        <p className="text-blue-200">Enter your loan information below</p>
      </div>

      <div className="space-y-6">
        {/* Principal Amount */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-blue-300 font-medium">{currency.symbol}</span>
            </div>
            <input
              type="number"
              value={loanData.principal}
              onChange={(e) => handleChange('principal', Number(e.target.value))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="300,000"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatCurrency(loanData.principal, currency)}
          </p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Interest Rate (Annual)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              step="0.01"
              value={loanData.interestRate}
              onChange={(e) => handleChange('interestRate', Number(e.target.value))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="6.5"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {loanData.interestRate}% APR
          </p>
        </div>

        {/* Term */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Loan Term
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              value={loanData.termYears}
              onChange={(e) => handleChange('termYears', Number(e.target.value))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="30"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {loanData.termYears} years ({loanData.termYears * 12} payments)
          </p>
        </div>

        {/* Payment Frequency */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Payment Frequency
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-blue-300" />
            </div>
            <select
              value={loanData.paymentFrequency}
              onChange={(e) => handleChange('paymentFrequency', e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="monthly" className="bg-slate-800">Monthly</option>
              <option value="biweekly" className="bg-slate-800">Bi-weekly</option>
              <option value="weekly" className="bg-slate-800">Weekly</option>
            </select>
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {loanData.paymentFrequency === 'monthly' && '12 payments per year'}
            {loanData.paymentFrequency === 'biweekly' && '26 payments per year'}
            {loanData.paymentFrequency === 'weekly' && '52 payments per year'}
          </p>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            First Payment Date
          </label>
          <input
            type="date"
            value={loanData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-white mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Starter Home', amount: 200000 },
            { label: 'Family Home', amount: 400000 },
            { label: 'Luxury Home', amount: 750000 },
            { label: 'Investment', amount: 500000 }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleChange('principal', preset.amount)}
              className="px-3 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-blue-200 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/30"
            >
              {preset.label}
              <div className="text-xs opacity-75">
                {formatCurrency(preset.amount, currency)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanForm;