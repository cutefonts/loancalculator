import React, { useState } from 'react';
import { Plus, X, TrendingUp, Calculator } from 'lucide-react';
import { Currency, formatCurrency, formatCurrencyPrecise } from '../types/currency';

interface LoanScenario {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  termYears: number;
  results?: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
  };
}

interface LoanComparisonProps {
  currency: Currency;
}

const LoanComparison: React.FC<LoanComparisonProps> = ({ currency }) => {
  const [scenarios, setScenarios] = useState<LoanScenario[]>([
    {
      id: '1',
      name: 'Scenario 1',
      principal: 300000,
      interestRate: 6.5,
      termYears: 30
    },
    {
      id: '2',
      name: 'Scenario 2',
      principal: 300000,
      interestRate: 5.8,
      termYears: 15
    }
  ]);

  const calculateLoan = (scenario: LoanScenario) => {
    const { principal, interestRate, termYears } = scenario;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = termYears * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const totalPayment = monthlyPayment * totalPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalInterest,
      totalPayment
    };
  };

  // Calculate results for all scenarios
  const scenariosWithResults = scenarios.map(scenario => ({
    ...scenario,
    results: calculateLoan(scenario)
  }));

  const addScenario = () => {
    const newId = (scenarios.length + 1).toString();
    setScenarios([...scenarios, {
      id: newId,
      name: `Scenario ${newId}`,
      principal: 300000,
      interestRate: 6.0,
      termYears: 30
    }]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 2) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  const updateScenario = (id: string, field: keyof LoanScenario, value: string | number) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  // Find best scenario for each metric
  const bestMonthlyPayment = scenariosWithResults.reduce((best, current) => 
    current.results!.monthlyPayment < best.results!.monthlyPayment ? current : best
  );
  const lowestInterest = scenariosWithResults.reduce((best, current) => 
    current.results!.totalInterest < best.results!.totalInterest ? current : best
  );
  const lowestTotal = scenariosWithResults.reduce((best, current) => 
    current.results!.totalPayment < best.results!.totalPayment ? current : best
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Loan Comparison</h2>
              <p className="text-blue-200">Compare different loan scenarios side by side</p>
            </div>
          </div>
          <button
            onClick={addScenario}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Scenario</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-4 px-4 text-blue-200 font-medium">Metric</th>
              {scenariosWithResults.map(scenario => (
                <th key={scenario.id} className="text-center py-4 px-4 text-blue-200 font-medium min-w-[200px]">
                  <div className="flex items-center justify-center space-x-2">
                    <span>{scenario.name}</span>
                    {scenarios.length > 2 && (
                      <button
                        onClick={() => removeScenario(scenario.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Loan Amount */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Loan Amount</td>
              {scenariosWithResults.map(scenario => (
                <td key={scenario.id} className="py-3 px-4 text-center">
                  <input
                    type="number"
                    value={scenario.principal}
                    onChange={(e) => updateScenario(scenario.id, 'principal', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-blue-300 mt-1">
                    {formatCurrency(scenario.principal, currency)}
                  </div>
                </td>
              ))}
            </tr>

            {/* Interest Rate */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Interest Rate</td>
              {scenariosWithResults.map(scenario => (
                <td key={scenario.id} className="py-3 px-4 text-center">
                  <input
                    type="number"
                    step="0.01"
                    value={scenario.interestRate}
                    onChange={(e) => updateScenario(scenario.id, 'interestRate', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-blue-300 mt-1">
                    {scenario.interestRate}% APR
                  </div>
                </td>
              ))}
            </tr>

            {/* Term */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Loan Term</td>
              {scenariosWithResults.map(scenario => (
                <td key={scenario.id} className="py-3 px-4 text-center">
                  <input
                    type="number"
                    value={scenario.termYears}
                    
                    onChange={(e) => updateScenario(scenario.id, 'termYears', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-xs text-blue-300 mt-1">
                    {scenario.termYears} years
                  </div>
                </td>
              ))}
            </tr>

            {/* Results Section */}
            <tr className="bg-blue-900/20">
              <td className="py-3 px-4 text-white font-bold">RESULTS</td>
              {scenariosWithResults.map(() => (
                <td key="results-header" className="py-3 px-4"></td>
              ))}
            </tr>

            {/* Monthly Payment */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Monthly Payment</td>
              {scenariosWithResults.map(scenario => (
                <td 
                  key={scenario.id} 
                  className={`py-3 px-4 text-center font-semibold ${
                    scenario.id === bestMonthlyPayment.id ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {formatCurrencyPrecise(scenario.results!.monthlyPayment, currency)}
                  {scenario.id === bestMonthlyPayment.id && (
                    <div className="text-xs text-emerald-300 mt-1">Lowest</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Total Interest */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Total Interest</td>
              {scenariosWithResults.map(scenario => (
                <td 
                  key={scenario.id} 
                  className={`py-3 px-4 text-center font-semibold ${
                    scenario.id === lowestInterest.id ? 'text-emerald-400' : 'text-red-300'
                  }`}
                >
                  {formatCurrency(scenario.results!.totalInterest, currency)}
                  {scenario.id === lowestInterest.id && (
                    <div className="text-xs text-emerald-300 mt-1">Lowest</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Total Payment */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-4 text-white font-medium">Total Payment</td>
              {scenariosWithResults.map(scenario => (
                <td 
                  key={scenario.id} 
                  className={`py-3 px-4 text-center font-semibold ${
                    scenario.id === lowestTotal.id ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {formatCurrency(scenario.results!.totalPayment, currency)}
                  {scenario.id === lowestTotal.id && (
                    <div className="text-xs text-emerald-300 mt-1">Lowest</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Interest Percentage */}
            <tr>
              <td className="py-3 px-4 text-white font-medium">Interest as % of Total</td>
              {scenariosWithResults.map(scenario => {
                const percentage = (scenario.results!.totalInterest / scenario.results!.totalPayment) * 100;
                return (
                  <td key={scenario.id} className="py-3 px-4 text-center text-blue-300 font-medium">
                    {percentage.toFixed(1)}%
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Calculator className="h-6 w-6 text-emerald-200" />
            <h3 className="font-semibold">Best Monthly Payment</h3>
          </div>
          <p className="text-2xl font-bold mb-2">
            {formatCurrencyPrecise(bestMonthlyPayment.results!.monthlyPayment, currency)}
          </p>
          <p className="text-emerald-200 text-sm">
            {bestMonthlyPayment.name} • {bestMonthlyPayment.termYears} years @ {bestMonthlyPayment.interestRate}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-200" />
            <h3 className="font-semibold">Lowest Interest</h3>
          </div>
          <p className="text-2xl font-bold mb-2">
            {formatCurrency(lowestInterest.results!.totalInterest, currency)}
          </p>
          <p className="text-blue-200 text-sm">
            {lowestInterest.name} • {lowestInterest.termYears} years @ {lowestInterest.interestRate}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Calculator className="h-6 w-6 text-purple-200" />
            <h3 className="font-semibold">Lowest Total Cost</h3>
          </div>
          <p className="text-2xl font-bold mb-2">
            {formatCurrency(lowestTotal.results!.totalPayment, currency)}
          </p>
          <p className="text-purple-200 text-sm">
            {lowestTotal.name} • {lowestTotal.termYears} years @ {lowestTotal.interestRate}%
          </p>
        </div>
      </div>

      {/* Comparison Insights */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Interest Rate Impact</h4>
            <p className="text-blue-200 text-sm">
              A {Math.abs(scenariosWithResults[0].interestRate - scenariosWithResults[1].interestRate).toFixed(1)}% 
              difference in interest rate results in {formatCurrency(Math.abs(scenariosWithResults[0].results!.totalInterest - scenariosWithResults[1].results!.totalInterest), currency)} 
              difference in total interest paid.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Term Length Impact</h4>
            <p className="text-blue-200 text-sm">
              Choosing a {Math.abs(scenariosWithResults[0].termYears - scenariosWithResults[1].termYears)} year 
              difference in loan term affects your monthly payment by {formatCurrency(Math.abs(scenariosWithResults[0].results!.monthlyPayment - scenariosWithResults[1].results!.monthlyPayment), currency)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanComparison;