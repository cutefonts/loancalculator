export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', locale: 'pl-PL' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal', locale: 'ar-QA' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', locale: 'ar-KW' },
  { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', locale: 'ar-BH' },
  { code: 'OMR', symbol: '﷼', name: 'Omani Rial', locale: 'ar-OM' },
  { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar', locale: 'ar-JO' },
  { code: 'LBP', symbol: '£', name: 'Lebanese Pound', locale: 'ar-LB' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', locale: 'ar-EG' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', locale: 'ro-RO' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', locale: 'bg-BG' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', locale: 'hr-HR' },
  { code: 'RSD', symbol: 'дин', name: 'Serbian Dinar', locale: 'sr-RS' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', locale: 'uk-UA' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', locale: 'kk-KZ' },
  { code: 'UZS', symbol: 'лв', name: 'Uzbekistani Som', locale: 'uz-UZ' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram', locale: 'hy-AM' },
  { code: 'GEL', symbol: '₾', name: 'Georgian Lari', locale: 'ka-GE' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijani Manat', locale: 'az-AZ' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', locale: 'be-BY' },
  { code: 'MDL', symbol: 'L', name: 'Moldovan Leu', locale: 'ro-MD' },
  { code: 'ALL', symbol: 'L', name: 'Albanian Lek', locale: 'sq-AL' },
  { code: 'MKD', symbol: 'ден', name: 'Macedonian Denar', locale: 'mk-MK' },
  { code: 'BAM', symbol: 'KM', name: 'Bosnia-Herzegovina Convertible Mark', locale: 'bs-BA' }
];

export const formatCurrency = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyPrecise = (value: number, currency: Currency): string => {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};