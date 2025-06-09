import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, PieChart, FileDown, Zap, Home, Settings } from 'lucide-react';
import LoanForm from './components/LoanForm';
import ResultsSummary from './components/ResultsSummary';
import AmortizationTable from './components/AmortizationTable';
import LoanChart from './components/LoanChart';
import ExtraPaymentCalculator from './components/ExtraPaymentCalculator';
import LoanComparison from './components/LoanComparison';
import CurrencySelector from './components/CurrencySelector';
import LoanCalculatorSettings from './components/LoanCalculatorSettings';
import AdvancedLoanInputs from './components/AdvancedLoanInputs';
import LoanAffordabilityCalculator from './components/LoanAffordabilityCalculator';
import { useCurrency } from './hooks/useCurrency';
import { formatCurrency, formatCurrencyPrecise } from './types/currency';

export interface LoanData {
  principal: number;
  interestRate: number;
  termYears: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
  startDate: string;
}

export interface LoanResults {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  payoffDate: string;
  amortizationSchedule: Array<{
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    date: string;
  }>;
}

function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'extra' | 'compare' | 'affordability'>('calculator');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { selectedCurrency, changeCurrency } = useCurrency();
  
  const [loanData, setLoanData] = useState<LoanData>({
    principal: 300000,
    interestRate: 6.5,
    termYears: 30,
    paymentFrequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Advanced loan inputs
  const [propertyTax, setPropertyTax] = useState(12000);
  const [homeInsurance, setHomeInsurance] = useState(2400);
  const [pmi, setPmi] = useState(3600);
  const [hoaFees, setHoaFees] = useState(1200);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);

  const calculateLoan = useMemo(() => {
    const { principal, interestRate, termYears, paymentFrequency } = loanData;
    
    if (!principal || !interestRate || !termYears || principal <= 0 || interestRate <= 0 || termYears <= 0) {
      return null;
    }

    const monthlyRate = interestRate / 100 / 12;
    const paymentsPerYear = paymentFrequency === 'monthly' ? 12 : paymentFrequency === 'biweekly' ? 26 : 52;
    const adjustedRate = interestRate / 100 / paymentsPerYear;
    const totalPayments = termYears * paymentsPerYear;

    let payment: number;
    if (paymentFrequency === 'monthly') {
      if (monthlyRate === 0) {
        // Handle 0% interest rate
        payment = principal / (termYears * 12);
      } else {
        payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termYears * 12)) / 
                  (Math.pow(1 + monthlyRate, termYears * 12) - 1);
      }
    } else {
      if (adjustedRate === 0) {
        // Handle 0% interest rate
        payment = principal / totalPayments;
      } else {
        payment = principal * (adjustedRate * Math.pow(1 + adjustedRate, totalPayments)) / 
                  (Math.pow(1 + adjustedRate, totalPayments) - 1);
      }
    }

    const totalPayment = payment * totalPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = principal;
    const startDate = new Date(loanData.startDate);

    for (let i = 0; i < totalPayments; i++) {
      const interestPayment = remainingBalance * adjustedRate;
      const principalPayment = payment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      const paymentDate = new Date(startDate);
      if (paymentFrequency === 'monthly') {
        paymentDate.setMonth(paymentDate.getMonth() + i);
      } else if (paymentFrequency === 'biweekly') {
        paymentDate.setDate(paymentDate.getDate() + (i * 14));
      } else {
        paymentDate.setDate(paymentDate.getDate() + (i * 7));
      }

      schedule.push({
        payment: i + 1,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance,
        date: paymentDate.toLocaleDateString()
      });

      if (remainingBalance <= 0) break;
    }

    const payoffDate = schedule[schedule.length - 1]?.date || '';

    return {
      monthlyPayment: payment,
      totalPayment,
      totalInterest,
      payoffDate,
      amortizationSchedule: schedule
    };
  }, [loanData]);

  const handleExportPDF = () => {
    // Implementation for PDF export
    alert('PDF export feature would be implemented here');
  };

  const handleShareLink = () => {
    // Implementation for sharing
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleSaveTemplate = () => {
    // Implementation for saving template
    localStorage.setItem('loanTemplate', JSON.stringify(loanData));
    alert('Template saved successfully!');
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'extra', label: 'Extra Payments', icon: Zap },
    { id: 'compare', label: 'Compare Loans', icon: TrendingUp },
    { id: 'affordability', label: 'Affordability', icon: Home }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Advanced Loan Calculator
                </h1>
                <p className="text-blue-200">
                  Professional loan analysis and planning tool
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <CurrencySelector 
                selectedCurrency={selectedCurrency}
                onCurrencyChange={changeCurrency}
              />
              
              {/* Settings */}
              <LoanCalculatorSettings
                onExportPDF={handleExportPDF}
                onShareLink={handleShareLink}
                onSaveTemplate={handleSaveTemplate}
              />
              
              <div className="hidden md:flex items-center space-x-6 text-blue-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Payment Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Amortization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap gap-2 bg-slate-800/50 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 min-w-[160px] justify-center ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                    : 'text-blue-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-1 space-y-6">
              <LoanForm 
                loanData={loanData} 
                setLoanData={setLoanData}
                currency={selectedCurrency}
              />
              
              {/* Advanced Options Toggle */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-white hover:text-blue-300 transition-colors duration-200"
                >
                  <span className="font-medium">Advanced Options</span>
                  <Settings className={`h-5 w-5 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
              </div>
              
              {showAdvanced && (
                <AdvancedLoanInputs
                  currency={selectedCurrency}
                  propertyTax={propertyTax}
                  setPropertyTax={setPropertyTax}
                  homeInsurance={homeInsurance}
                  setHomeInsurance={setHomeInsurance}
                  pmi={pmi}
                  setPmi={setPmi}
                  hoaFees={hoaFees}
                  setHoaFees={setHoaFees}
                  downPaymentPercent={downPaymentPercent}
                  setDownPaymentPercent={setDownPaymentPercent}
                  loanAmount={loanData.principal}
                />
              )}
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2 space-y-8">
              {calculateLoan && (
                <>
                  <ResultsSummary 
                    loanData={loanData} 
                    results={calculateLoan}
                    currency={selectedCurrency}
                    additionalCosts={{
                      propertyTax: propertyTax / 12,
                      homeInsurance: homeInsurance / 12,
                      pmi: pmi / 12,
                      hoaFees: hoaFees / 12
                    }}
                  />
                  <LoanChart 
                    loanData={loanData} 
                    results={calculateLoan}
                    currency={selectedCurrency}
                  />
                  <AmortizationTable 
                    schedule={calculateLoan.amortizationSchedule}
                    currency={selectedCurrency}
                  />
                </>
              )}
              
              {!calculateLoan && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
                  <Calculator className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Enter Loan Details</h3>
                  <p className="text-blue-200">Please enter valid loan amount, interest rate, and term to see calculations.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'extra' && calculateLoan && (
          <ExtraPaymentCalculator 
            loanData={loanData} 
            originalResults={calculateLoan}
            currency={selectedCurrency}
          />
        )}

        {activeTab === 'extra' && !calculateLoan && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Calculate Basic Loan First</h3>
            <p className="text-blue-200">Please go to the Calculator tab and enter valid loan details to use the Extra Payment Calculator.</p>
          </div>
        )}

        {activeTab === 'compare' && (
          <LoanComparison currency={selectedCurrency} />
        )}

        {activeTab === 'affordability' && (
          <LoanAffordabilityCalculator currency={selectedCurrency} />
        )}
      </div>
    </div>
  );
}

export default App;