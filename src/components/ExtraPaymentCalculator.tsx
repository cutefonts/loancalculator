import React, { useState, useMemo } from 'react';
import { Zap, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { LoanData, LoanResults } from '../App';
import { Currency, formatCurrency, formatCurrencyPrecise } from '../types/currency';

interface ExtraPaymentCalculatorProps {
  loanData: LoanData;
  originalResults: LoanResults;
  currency: Currency;
}

const ExtraPaymentCalculator: React.FC<ExtraPaymentCalculatorProps> = ({ 
  loanData, 
  originalResults,
  currency
}) => {
  const [extraPayment, setExtraPayment] = useState(100);
  const [paymentType, setPaymentType] = useState<'monthly' | 'yearly' | 'onetime'>('monthly');
  const [oneTimeAmount, setOneTimeAmount] = useState(10000);
  const [oneTimeMonth, setOneTimeMonth] = useState(12);

  const calculateWithExtraPayments = useMemo(() => {
    const { principal, interestRate } = loanData;
    
    if (!principal || !interestRate || principal <= 0 || interestRate <= 0) {
      return {
        totalPayments: 0,
        totalPaid: 0,
        totalInterest: 0,
        schedule: [],
        yearsToPayoff: 0
      };
    }

    const monthlyRate = interestRate / 100 / 12;
    const originalPayment = originalResults.monthlyPayment;
    
    let balance = principal;
    let totalPaid = 0;
    let totalInterest = 0;
    let month = 0;
    const schedule = [];

    while (balance > 0.01 && month < 600) { // Max 50 years
      month++;
      const interestPayment = balance * monthlyRate;
      let principalPayment = originalPayment - interestPayment;
      let extraThisMonth = 0;

      // Add extra payments based on type
      if (paymentType === 'monthly' && extraPayment > 0) {
        extraThisMonth = extraPayment;
      } else if (paymentType === 'yearly' && month % 12 === 0 && extraPayment > 0) {
        extraThisMonth = extraPayment;
      } else if (paymentType === 'onetime' && month === oneTimeMonth && oneTimeAmount > 0) {
        extraThisMonth = oneTimeAmount;
      }

      // Don't pay more than remaining balance
      const totalPrincipal = Math.min(principalPayment + extraThisMonth, balance);
      const totalPayment = interestPayment + totalPrincipal;
      
      balance -= totalPrincipal;
      totalPaid += totalPayment;
      totalInterest += interestPayment;

      if (month <= 360) { // Only store first 30 years for display
        schedule.push({
          month,
          payment: totalPayment,
          principal: totalPrincipal,
          interest: interestPayment,
          extra: extraThisMonth,
          balance: balance
        });
      }
    }

    return {
      totalPayments: month,
      totalPaid,
      totalInterest,
      schedule: schedule.slice(0, 12), // Show first year
      yearsToPayoff: month / 12
    };
  }, [loanData, originalResults, extraPayment, paymentType, oneTimeAmount, oneTimeMonth]);

  const savings = {
    interestSaved: Math.max(0, originalResults.totalInterest - calculateWithExtraPayments.totalInterest),
    timeSaved: Math.max(0, originalResults.amortizationSchedule.length - calculateWithExtraPayments.totalPayments),
    yearsSaved: Math.max(0, (originalResults.amortizationSchedule.length - calculateWithExtraPayments.totalPayments) / 12)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-yellow-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Extra Payment Calculator</h2>
            <p className="text-blue-200">See how extra payments can save you time and money</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Extra Payment Options */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Options</h3>
          
          <div className="space-y-4">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
                className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="monthly" className="bg-slate-800">Monthly Extra</option>
                <option value="yearly" className="bg-slate-800">Annual Extra</option>
                <option value="onetime" className="bg-slate-800">One-time Payment</option>
              </select>
            </div>

            {/* Amount Input */}
            {paymentType !== 'onetime' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Extra Payment Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-blue-300 font-medium">{currency.symbol}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                    className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="100"
                  />
                </div>
                <p className="mt-1 text-sm text-blue-200">
                  {formatCurrency(extraPayment, currency)} {paymentType}
                </p>
              </div>
            )}

            {/* One-time Payment Inputs */}
            {paymentType === 'onetime' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    One-time Payment Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-blue-300 font-medium">{currency.symbol}</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={oneTimeAmount}
                      onChange={(e) => setOneTimeAmount(Math.max(0, Number(e.target.value)))}
                      className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="10000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Payment Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={oneTimeMonth}
                    onChange={(e) => setOneTimeMonth(Math.min(360, Math.max(1, Number(e.target.value))))}
                    className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="mt-1 text-sm text-blue-200">
                    Month {oneTimeMonth} (Year {Math.ceil(oneTimeMonth / 12)})
                  </p>
                </div>
              </>
            )}

            {/* Quick Presets */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-white mb-3">Quick Presets</h4>
              <div className="grid grid-cols-2 gap-2">
                {[50, 100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      if (paymentType === 'onetime') {
                        setOneTimeAmount(amount * 20);
                      } else {
                        setExtraPayment(amount);
                      }
                    }}
                    className="px-3 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-blue-200 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/30"
                  >
                    {formatCurrency(paymentType === 'onetime' ? amount * 20 : amount, currency)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="h-6 w-6 text-emerald-200" />
                <span className="text-2xl font-bold">
                  {formatCurrency(savings.interestSaved, currency)}
                </span>
              </div>
              <p className="text-emerald-100 text-sm font-medium">Interest Saved</p>
              <p className="text-emerald-200 text-xs">
                {originalResults.totalInterest > 0 ? ((savings.interestSaved / originalResults.totalInterest) * 100).toFixed(1) : 0}% reduction
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-6 w-6 text-blue-200" />
                <span className="text-2xl font-bold">
                  {savings.yearsSaved.toFixed(1)}
                </span>
              </div>
              <p className="text-blue-100 text-sm font-medium">Years Saved</p>
              <p className="text-blue-200 text-xs">
                {savings.timeSaved} fewer payments
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-6 w-6 text-purple-200" />
                <span className="text-2xl font-bold">
                  {calculateWithExtraPayments.yearsToPayoff.toFixed(1)}
                </span>
              </div>
              <p className="text-purple-100 text-sm font-medium">New Payoff Time</p>
              <p className="text-purple-200 text-xs">
                vs {loanData.termYears} years originally
              </p>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Loan Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-blue-200 font-medium">Scenario</th>
                    <th className="text-right py-3 px-4 text-blue-200 font-medium">Total Interest</th>
                    <th className="text-right py-3 px-4 text-blue-200 font-medium">Total Payment</th>
                    <th className="text-right py-3 px-4 text-blue-200 font-medium">Payoff Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">Original Loan</td>
                    <td className="py-3 px-4 text-right text-red-300">
                      {formatCurrency(originalResults.totalInterest, currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      {formatCurrency(originalResults.totalPayment, currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-300">
                      {loanData.termYears} years
                    </td>
                  </tr>
                  <tr className="bg-emerald-900/20">
                    <td className="py-3 px-4 text-white font-medium">With Extra Payments</td>
                    <td className="py-3 px-4 text-right text-emerald-300 font-medium">
                      {formatCurrency(calculateWithExtraPayments.totalInterest, currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      {formatCurrency(calculateWithExtraPayments.totalPaid, currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-300 font-medium">
                      {calculateWithExtraPayments.yearsToPayoff.toFixed(1)} years
                    </td>
                  </tr>
                  <tr className="bg-blue-900/20 font-bold">
                    <td className="py-3 px-4 text-white">Savings</td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      -{formatCurrency(savings.interestSaved, currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      -{formatCurrency(Math.max(0, originalResults.totalPayment - calculateWithExtraPayments.totalPaid), currency)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      -{savings.yearsSaved.toFixed(1)} years
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* First Year Schedule with Extra Payments */}
          {calculateWithExtraPayments.schedule.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">First Year Schedule (with Extra Payments)</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-2 px-3 text-blue-200">Month</th>
                      <th className="text-right py-2 px-3 text-blue-200">Payment</th>
                      <th className="text-right py-2 px-3 text-blue-200">Extra</th>
                      <th className="text-right py-2 px-3 text-blue-200">Principal</th>
                      <th className="text-right py-2 px-3 text-blue-200">Interest</th>
                      <th className="text-right py-2 px-3 text-blue-200">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculateWithExtraPayments.schedule.map((payment) => (
                      <tr key={payment.month} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-2 px-3 text-white">{payment.month}</td>
                        <td className="py-2 px-3 text-right text-white">
                          {formatCurrencyPrecise(payment.payment, currency)}
                        </td>
                        <td className="py-2 px-3 text-right text-yellow-300">
                          {payment.extra > 0 ? formatCurrencyPrecise(payment.extra, currency) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-blue-300">
                          {formatCurrencyPrecise(payment.principal, currency)}
                        </td>
                        <td className="py-2 px-3 text-right text-red-300">
                          {formatCurrencyPrecise(payment.interest, currency)}
                        </td>
                        <td className="py-2 px-3 text-right text-white">
                          {formatCurrency(payment.balance, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraPaymentCalculator;