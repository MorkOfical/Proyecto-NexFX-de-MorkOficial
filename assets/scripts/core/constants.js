/* NexFX © 2025 Mork_Oficial — All rights reserved */

export const LANGS = [
  { code: 'es', flag: '🇲🇽', label: 'Español (MX)' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
];

export const UK = 'nfx_u';
export const SK = 'nfx_s';

export const CURR = [
  { code: 'USD', flag: '🇺🇸' },
  { code: 'MXN', flag: '🇲🇽' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'CAD', flag: '🇨🇦' },
  { code: 'JPY', flag: '🇯🇵' },
  { code: 'BRL', flag: '🇧🇷' },
  { code: 'ARS', flag: '🇦🇷' },
  { code: 'COP', flag: '🇨🇴' },
  { code: 'CLP', flag: '🇨🇱' },
  { code: 'CNY', flag: '🇨🇳' },
  { code: 'INR', flag: '🇮🇳' },
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'CHF', flag: '🇨🇭' },
  { code: 'KRW', flag: '🇰🇷' },
  { code: 'SGD', flag: '🇸🇬' },
  { code: 'NOK', flag: '🇳🇴' },
  { code: 'SEK', flag: '🇸🇪' },
  { code: 'DKK', flag: '🇩🇰' },
  { code: 'ZAR', flag: '🇿🇦' },
  { code: 'TRY', flag: '🇹🇷' },
  { code: 'SAR', flag: '🇸🇦' },
  { code: 'AED', flag: '🇦🇪' },
  { code: 'HKD', flag: '🇭🇰' },
  { code: 'NZD', flag: '🇳🇿' },
  { code: 'RUB', flag: '🇷🇺' },
];

/** Mapa código → bandera (antes FL en script monolítico) */
export const FL = Object.fromEntries(CURR.map((c) => [c.code, c.flag]));
