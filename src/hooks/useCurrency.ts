import { useState, useCallback } from 'react';
import { Currency, CURRENCIES } from '../types/currency';

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    CURRENCIES.find(c => c.code === 'USD') || CURRENCIES[0]
  );

  const changeCurrency = useCallback((currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  }, []);

  return {
    selectedCurrency,
    changeCurrency,
    currencies: CURRENCIES
  };
};