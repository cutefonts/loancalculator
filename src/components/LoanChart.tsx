import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';
import { LoanData, LoanResults } from '../App';
import { Currency, formatCurrency } from '../types/currency';

interface LoanChartProps {
  loanData: LoanData;
  results: LoanResults;
  currency: Currency;
}

const LoanChart: React.FC<LoanChartProps> = ({ loanData, results, currency }) => {
  const [chartType, setChartType] = useState<'pie' | 'timeline' | 'breakdown'>('pie');

  const interestPercentage = (results.totalInterest / results.totalPayment) * 100;
  const principalPercentage = 100 - interestPercentage;

  // Generate yearly breakdown for timeline view
  const yearlyBreakdown = React.useMemo(() => {
    const breakdown = [];
    const schedule = results.amortizationSchedule;
    let currentYear = new Date(loanData.startDate).getFullYear();
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    let yearlyBalance = loanData.principal;

    schedule.forEach((payment, index) => {
      const paymentYear = new Date(payment.date).getFullYear();
      
      if (paymentYear === currentYear) {
        yearlyPrincipal += payment.principal;
        yearlyInterest += payment.interest;
        yearlyBalance = payment.balance;
      } else {
        breakdown.push({
          year: currentYear,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          balance: yearlyBalance,
          totalPayment: yearlyPrincipal + yearlyInterest
        });
        
        currentYear = paymentYear;
        yearlyPrincipal = payment.principal;
        yearlyInterest = payment.interest;
        yearlyBalance = payment.balance;
      }
      
      if (index === schedule.length - 1 && yearlyPrincipal > 0) {
        breakdown.push({
          year: currentYear,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          balance: yearlyBalance,
          totalPayment: yearlyPrincipal + yearlyInterest
        });
      }
    });

    return breakdown.slice(0, 10); // Show first 10 years
  }, [results.amortizationSchedule, loanData]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      {/* Header with Chart Type Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Loan Visualization</h2>
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {[
            { type: 'pie', label: 'Overview', icon: PieChart },
            { type: 'timeline', label: 'Timeline', icon: BarChart3 },
            { type: 'breakdown', label: 'Breakdown', icon: TrendingUp }
          ].map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setChartType(type as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                chartType === type
                  ? 'bg-white text-slate-900'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pie Chart View */}
      {chartType === 'pie' && (
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-12">
          {/* SVG Pie Chart */}
          <div className="relative">
            <svg width="240" height="240" className="transform -rotate-90">
              <circle
                cx="120"
                cy="120"
                r="80"
                fill="none"
                stroke="rgb(59 130 246 / 0.3)"
                strokeWidth="40"
              />
              <circle
                cx="120"
                cy="120"
                r="80"
                fill="none"
                stroke="url(#principalGradient)"
                strokeWidth="40"
                strokeDasharray={`${(principalPercentage / 100) * 502.65} 502.65`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <circle
                cx="120"
                cy="120"
                r="80"
                fill="none"
                stroke="url(#interestGradient)"
                strokeWidth="40"
                strokeDasharray={`${(interestPercentage / 100) * 502.65} 502.65`}
                strokeDashoffset={`-${(principalPercentage / 100) * 502.65}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="principalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1E40AF" />
                </linearGradient>
                <linearGradient id="interestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(results.totalPayment, currency)}
                </p>
                <p className="text-sm text-blue-200">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
              <div>
                <p className="text-white font-medium">Principal</p>
                <p className="text-blue-200 text-sm">
                  {formatCurrency(loanData.principal, currency)} ({principalPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
              <div>
                <p className="text-white font-medium">Interest</p>
                <p className="text-blue-200 text-sm">
                  {formatCurrency(results.totalInterest, currency)} ({interestPercentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {chartType === 'timeline' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-blue-200 mb-2">Annual Payment Breakdown (First 10 Years)</p>
            <p className="text-sm text-blue-300">Principal vs Interest over time</p>
          </div>
          <div className="space-y-3">
            {yearlyBreakdown.map((year, index) => (
              <div key={year.year} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Year {index + 1}</span>
                  <span className="text-blue-200 text-sm">
                    {formatCurrency(year.totalPayment, currency)}
                  </span>
                </div>
                <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(year.principal / year.totalPayment) * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                  <div 
                    className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(year.interest / year.totalPayment) * 100}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-blue-300">
                  <span>Principal: {formatCurrency(year.principal, currency)}</span>
                  <span>Interest: {formatCurrency(year.interest, currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown View */}
      {chartType === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Monthly Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-blue-200">Payment Amount</span>
                <span className="text-white font-semibold">
                  {formatCurrency(results.monthlyPayment, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-blue-200">First Payment Interest</span>
                <span className="text-red-300 font-semibold">
                  {formatCurrency(results.amortizationSchedule[0]?.interest || 0, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-blue-200">First Payment Principal</span>
                <span className="text-blue-300 font-semibold">
                  {formatCurrency(results.amortizationSchedule[0]?.principal || 0, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Loan Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Loan Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>Interest Paid</span>
                  <span>{interestPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${interestPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>Principal Paid</span>
                  <span>{principalPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${principalPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanChart;