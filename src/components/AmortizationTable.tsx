import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Calendar } from 'lucide-react';
import { Currency, formatCurrency, formatCurrencyPrecise } from '../types/currency';

interface AmortizationTableProps {
  schedule: Array<{
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    date: string;
  }>;
  currency: Currency;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule, currency }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const displayedSchedule = isExpanded 
    ? schedule.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : schedule.slice(0, 6);

  const totalPages = Math.ceil(schedule.length / itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Payment #', 'Date', 'Payment Amount', 'Principal', 'Interest', 'Remaining Balance'];
    const rows = schedule.map(payment => [
      payment.payment,
      payment.date,
      (payment.principal + payment.interest).toFixed(2),
      payment.principal.toFixed(2),
      payment.interest.toFixed(2),
      payment.balance.toFixed(2)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Amortization Schedule</h2>
            <p className="text-blue-200 text-sm">
              {schedule.length} total payments
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Export CSV</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm">Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span className="text-sm">Show All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-blue-200 font-medium">#</th>
              <th className="text-left py-3 px-4 text-blue-200 font-medium">Date</th>
              <th className="text-right py-3 px-4 text-blue-200 font-medium">Payment</th>
              <th className="text-right py-3 px-4 text-blue-200 font-medium">Principal</th>
              <th className="text-right py-3 px-4 text-blue-200 font-medium">Interest</th>
              <th className="text-right py-3 px-4 text-blue-200 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayedSchedule.map((payment, index) => {
              const paymentAmount = payment.principal + payment.interest;
              const principalPercentage = (payment.principal / paymentAmount) * 100;
              
              return (
                <tr 
                  key={payment.payment} 
                  className={`border-b border-white/10 hover:bg-white/5 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white/5' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-white font-medium">
                    {payment.payment}
                  </td>
                  <td className="py-3 px-4 text-blue-200">
                    {payment.date}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-medium">
                    {formatCurrencyPrecise(paymentAmount, currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-blue-300 font-medium">
                      {formatCurrencyPrecise(payment.principal, currency)}
                    </div>
                    <div className="text-xs text-blue-400">
                      {principalPercentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="text-red-300 font-medium">
                      {formatCurrencyPrecise(payment.interest, currency)}
                    </div>
                    <div className="text-xs text-red-400">
                      {(100 - principalPercentage).toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-white font-medium">
                    {formatCurrency(payment.balance, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {isExpanded && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-blue-200 text-sm">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, schedule.length)} of {schedule.length} payments
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors duration-200"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-blue-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(schedule.reduce((sum, p) => sum + p.principal, 0), currency)}
            </p>
            <p className="text-blue-200 text-sm">Total Principal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-300">
              {formatCurrency(schedule.reduce((sum, p) => sum + p.interest, 0), currency)}
            </p>
            <p className="text-blue-200 text-sm">Total Interest</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-300">
              {formatCurrency(schedule.reduce((sum, p) => sum + p.principal + p.interest, 0), currency)}
            </p>
            <p className="text-blue-200 text-sm">Total Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmortizationTable;