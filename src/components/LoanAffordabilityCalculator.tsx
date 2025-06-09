import React, { useState } from 'react';
import { DollarSign, TrendingUp, Home, Calculator } from 'lucide-react';
import { Currency, formatCurrency } from '../types/currency';

interface LoanAffordabilityCalculatorProps {
  currency: Currency;
}

const LoanAffordabilityCalculator: React.FC<LoanAffordabilityCalculatorProps> = ({ currency }) => {
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(28);

  // Calculate affordability
  const maxMonthlyPayment = (monthlyIncome * debtToIncomeRatio) / 100 - monthlyDebts;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  
  const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, totalPayments) - 1) / 
                       (monthlyRate * Math.pow(1 + monthlyRate, totalPayments));
  
  const maxHomePrice = maxLoanAmount + downPayment;

  const affordabilityMetrics = [
    {
      title: 'Maximum Home Price',
      value: formatCurrency(maxHomePrice, currency),
      subtitle: 'Based on your income and debts',
      icon: Home,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Maximum Loan Amount',
      value: formatCurrency(maxLoanAmount, currency),
      subtitle: 'After down payment',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Monthly Payment',
      value: formatCurrency(maxMonthlyPayment, currency),
      subtitle: 'Principal & Interest only',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Debt-to-Income Ratio',
      value: `${((monthlyDebts + maxMonthlyPayment) / monthlyIncome * 100).toFixed(1)}%`,
      subtitle: `Target: ${debtToIncomeRatio}%`,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Home className="h-6 w-6 text-emerald-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Affordability Calculator</h2>
            <p className="text-blue-200">Determine how much home you can afford</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Your Financial Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Monthly Gross Income
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Monthly Debt Payments
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="number"
                  value={monthlyDebts}
                  onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <p className="mt-1 text-sm text-blue-200">Credit cards, auto loans, etc.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Down Payment Available
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Loan Term (years)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Target Debt-to-Income Ratio (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={debtToIncomeRatio}
                onChange={(e) => setDebtToIncomeRatio(Number(e.target.value))}
                className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="mt-1 text-sm text-blue-200">Recommended: 28% or lower</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Affordability Metrics */}
          <div className="grid grid-cols-1 gap-4">
            {affordabilityMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.title}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-200 mb-1">
                        {metric.title}
                      </p>
                      <p className="text-xl font-bold text-white mb-1">
                        {metric.value}
                      </p>
                      <p className="text-sm text-blue-300">
                        {metric.subtitle}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Affordability Breakdown */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Affordability Breakdown</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">Gross Monthly Income</span>
                <span className="text-white font-medium">{formatCurrency(monthlyIncome, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">Existing Monthly Debts</span>
                <span className="text-red-300 font-medium">-{formatCurrency(monthlyDebts, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">Available for Housing ({debtToIncomeRatio}%)</span>
                <span className="text-emerald-400 font-medium">{formatCurrency(monthlyIncome * debtToIncomeRatio / 100, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold">
                <span className="text-white">Maximum Monthly Payment</span>
                <span className="text-emerald-400 text-lg">{formatCurrency(maxMonthlyPayment, currency)}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendations</h3>
            <div className="space-y-2 text-sm text-blue-100">
              <p>• Consider a 20% down payment to avoid PMI</p>
              <p>• Keep total debt-to-income ratio below 36%</p>
              <p>• Budget for property taxes, insurance, and maintenance</p>
              <p>• Maintain 3-6 months of expenses in emergency fund</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanAffordabilityCalculator;