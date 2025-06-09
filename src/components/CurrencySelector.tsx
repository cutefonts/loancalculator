import React, { useState } from 'react';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { Currency, CURRENCIES } from '../types/currency';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currencyCode: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  selectedCurrency, 
  onCurrencyChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCurrencies = ['USD', 'EUR', 'INR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];
  const popular = CURRENCIES.filter(c => popularCurrencies.includes(c.code));
  const others = filteredCurrencies.filter(c => !popularCurrencies.includes(c.code));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-200 min-w-[160px]"
      >
        <Globe className="h-5 w-5 text-blue-300" />
        <span className="font-medium">{selectedCurrency.symbol}</span>
        <span className="text-blue-200">{selectedCurrency.code}</span>
        <ChevronDown className={`h-4 w-4 text-blue-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-white/20 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            {/* Popular Currencies */}
            {searchTerm === '' && (
              <div className="p-3 border-b border-white/10">
                <h3 className="text-xs font-medium text-blue-200 mb-2 uppercase tracking-wide">Popular</h3>
                <div className="space-y-1">
                  {popular.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => {
                        onCurrencyChange(currency.code);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-white/10 transition-colors duration-200 ${
                        selectedCurrency.code === currency.code ? 'bg-blue-600/30 text-blue-300' : 'text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-lg">{currency.symbol}</span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-blue-200">{currency.name}</div>
                        </div>
                      </div>
                      {selectedCurrency.code === currency.code && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Currencies */}
            <div className="p-3">
              {searchTerm === '' && (
                <h3 className="text-xs font-medium text-blue-200 mb-2 uppercase tracking-wide">All Currencies</h3>
              )}
              <div className="space-y-1">
                {(searchTerm === '' ? others : filteredCurrencies).map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      onCurrencyChange(currency.code);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-white/10 transition-colors duration-200 ${
                      selectedCurrency.code === currency.code ? 'bg-blue-600/30 text-blue-300' : 'text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-lg min-w-[24px]">{currency.symbol}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-blue-200">{currency.name}</div>
                      </div>
                    </div>
                    {selectedCurrency.code === currency.code && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default CurrencySelector;