'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR ₹' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD $' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP £' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD $' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD $' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD $' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR €' },
];

interface CountryContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  countries: Country[];
}

const CountryContext = createContext<CountryContextType>({
  selectedCountry: COUNTRIES[0],
  setSelectedCountry: () => {},
  countries: COUNTRIES,
});

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountryState] = useState<Country>(COUNTRIES[0]);

  useEffect(() => {
    try {
      // 1. Check localStorage first
      const savedCode = localStorage.getItem('selected_country');
      if (savedCode) {
        const found = COUNTRIES.find((c) => c.code === savedCode);
        if (found) {
          setSelectedCountryState(found);
          return;
        }
      }

      // 2. Check Cookie if localStorage not set
      const cookies = document.cookie.split(';');
      const countryCookie = cookies.find((c) => c.trim().startsWith('selected_country='));
      if (countryCookie) {
        const code = countryCookie.split('=')[1]?.trim();
        const found = COUNTRIES.find((c) => c.code === code);
        if (found) {
          setSelectedCountryState(found);
        }
      }
    } catch {
      // Ignore storage errors in SSR or restricted environments
    }
  }, []);

  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    try {
      localStorage.setItem('selected_country', country.code);
      document.cookie = `selected_country=${country.code}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry, countries: COUNTRIES }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
