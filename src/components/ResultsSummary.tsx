import React from 'react';
import { DollarSign, TrendingUp, Calendar, Percent, Home } from 'lucide-react';
import { LoanData, LoanResults } from '../App';
import { Currency, formatCurrency, formatCurrencyPrecise } from '../types/currency';

interface ResultsSummaryProps {
  loanData: LoanData;
  results: LoanResults;
  currency: Currency;
  additionalCosts?: {
    propertyTax: number;
    homeInsurance: number;
    pmi: number;
    hoaFees: number;
  };
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ 
  loanData, 
  results, 
  currency, 
  additionalCosts 
}) => {
  const interestPercentage = (results.totalInterest / results.totalPayment) * 100;
  const totalAdditionalMonthly = additionalCosts ? 
    additionalCosts.propertyTax + additionalCosts.homeInsurance + additionalCosts.pmi + additionalCosts.hoaFees : 0;
  const totalMonthlyPayment = results.monthlyPayment + totalAdditionalMonthly;

  const summaryCards = [
    {
      title: 'Principal & Interest',
      value: formatCurrencyPrecise(results.monthlyPayment, currency),
      subtitle: `${loanData.paymentFrequency} payment`,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-100'
    },
    {
      title: 'Total Monthly Payment',
      value: formatCurrencyPrecise(totalMonthlyPayment, currency),
      subtitle: 'Including all costs',
      icon: Home,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-100'
    },
    {
      title: 'Total Interest',
      value: formatCurrency(results.totalInterest, currency),
      subtitle: `${interestPercentage.toFixed(1)}% of total`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-100'
    },
    {
      title: 'Payoff Date',
      value: results.payoffDate,
      subtitle: `${results.amortizationSchedule.length} payments`,
      icon: Calendar,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Loan Summary</h2>
          <div className="text-right">
            <p className="text-sm text-blue-200">Loan Amount</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(loanData.principal, currency)}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Principal vs Interest</span>
            <span>{interestPercentage.toFixed(1)}% interest</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div className="relative h-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                style={{ width: `${((loanData.principal / results.totalPayment) * 100)}%` }}
              ></div>
              <div 
                className="absolute top-0 right-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-r-full"
                style={{ width: `${interestPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-blue-300 mt-1">
            <span>Principal: {formatCurrency(loanData.principal, currency)}</span>
            <span>Interest: {formatCurrency(results.totalInterest, currency)}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-200 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-200">
                    {card.value}
                  </p>
                  <p className="text-sm text-blue-300">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Costs Breakdown */}
      {additionalCosts && totalAdditionalMonthly > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Payment Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-blue-200">Principal & Interest</span>
              <span className="text-white font-medium">{formatCurrencyPrecise(results.monthlyPayment, currency)}</span>
            </div>
            {additionalCosts.propertyTax > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">Property Tax</span>
                <span className="text-blue-300">{formatCurrencyPrecise(additionalCosts.propertyTax, currency)}</span>
              </div>
            )}
            {additionalCosts.homeInsurance > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">Home Insurance</span>
                <span className="text-blue-300">{formatCurrencyPrecise(additionalCosts.homeInsurance, currency)}</span>
              </div>
            )}
            {additionalCosts.pmi > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">PMI</span>
                <span className="text-blue-300">{formatCurrencyPrecise(additionalCosts.pmi, currency)}</span>
              </div>
            )}
            {additionalCosts.hoaFees > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-200">HOA Fees</span>
                <span className="text-blue-300">{formatCurrencyPrecise(additionalCosts.hoaFees, currency)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 font-bold text-lg">
              <span className="text-white">Total Monthly Payment</span>
              <span className="text-emerald-400">{formatCurrencyPrecise(totalMonthlyPayment, currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {((loanData.principal / results.totalPayment) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-blue-200">Principal Ratio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {(results.monthlyPayment / loanData.principal * 100).toFixed(3)}%
            </p>
            <p className="text-sm text-blue-200">Payment-to-Principal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {formatCurrency(results.totalInterest / loanData.termYears, currency)}
            </p>
            <p className="text-sm text-blue-200">Annual Interest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;