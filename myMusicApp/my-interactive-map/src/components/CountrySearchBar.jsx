import React, { useState } from 'react';

const CountrySearchBar = ({ countries, onSelectCountry }) => {
  const [query, setQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  //Handles the typed input, only shows countries that are available in the list with data
  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = countries.filter(country =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  };

  //Handles selecting the country
  const handleSelect = (country) => {
    setQuery(country);
    setFilteredCountries([]);
    onSelectCountry(country);
  };

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a country"
      />
      {filteredCountries.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 z-10 max-h-60 overflow-y-auto">
          {filteredCountries.map((country, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(country)}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySearchBar;
