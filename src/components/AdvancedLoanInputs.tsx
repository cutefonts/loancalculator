import React from 'react';
import { Home, Shield, Calculator, TrendingUp } from 'lucide-react';
import { Currency, formatCurrency } from '../types/currency';

interface AdvancedLoanInputsProps {
  currency: Currency;
  propertyTax: number;
  setPropertyTax: (value: number) => void;
  homeInsurance: number;
  setHomeInsurance: (value: number) => void;
  pmi: number;
  setPmi: (value: number) => void;
  hoaFees: number;
  setHoaFees: (value: number) => void;
  downPaymentPercent: number;
  setDownPaymentPercent: (value: number) => void;
  loanAmount: number;
}

const AdvancedLoanInputs: React.FC<AdvancedLoanInputsProps> = ({
  currency,
  propertyTax,
  setPropertyTax,
  homeInsurance,
  setHomeInsurance,
  pmi,
  setPmi,
  hoaFees,
  setHoaFees,
  downPaymentPercent,
  setDownPaymentPercent,
  loanAmount
}) => {
  const downPaymentAmount = (loanAmount * downPaymentPercent) / 100;
  const totalMonthlyExtras = (propertyTax + homeInsurance + pmi + hoaFees) / 12;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Advanced Options</h3>
        <p className="text-blue-200 text-sm">Additional costs and fees</p>
      </div>

      <div className="space-y-6">
        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Down Payment
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="20"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-blue-300">%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-white font-medium">
                {formatCurrency(downPaymentAmount, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Property Tax */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Annual Property Tax
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              min="0"
              value={propertyTax}
              onChange={(e) => setPropertyTax(Math.max(0, Number(e.target.value)))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="12000"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatCurrency(propertyTax / 12, currency)}/month
          </p>
        </div>

        {/* Home Insurance */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Annual Home Insurance
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              min="0"
              value={homeInsurance}
              onChange={(e) => setHomeInsurance(Math.max(0, Number(e.target.value)))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="2400"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatCurrency(homeInsurance / 12, currency)}/month
          </p>
        </div>

        {/* PMI */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Annual PMI (Private Mortgage Insurance)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calculator className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              min="0"
              value={pmi}
              onChange={(e) => setPmi(Math.max(0, Number(e.target.value)))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="3600"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatCurrency(pmi / 12, currency)}/month
          </p>
        </div>

        {/* HOA Fees */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Annual HOA Fees
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="h-5 w-5 text-blue-300" />
            </div>
            <input
              type="number"
              min="0"
              value={hoaFees}
              onChange={(e) => setHoaFees(Math.max(0, Number(e.target.value)))}
              className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="1200"
            />
          </div>
          <p className="mt-1 text-sm text-blue-200">
            {formatCurrency(hoaFees / 12, currency)}/month
          </p>
        </div>

        {/* Total Additional Monthly Costs */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total Additional Monthly Costs:</span>
            <span className="text-emerald-400 font-bold text-lg">
              {formatCurrency(totalMonthlyExtras, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLoanInputs;