'use client'

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface CountryData {
  name: string;
  flags: {
    png: string;
  };
  region: string;
  subregion: string;
  area: number;
  capital: string;
}

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<CountryData[]> = await axios.get(
          "https://restcountries.com/v2/all"
        );
        setCountries(response.data);
        setFilteredCountries(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(term)
    );
    setFilteredCountries(filtered);
  };

  return (
    <div>
      <div className="m-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by country name"
          className="p-4 border rounded-full w-96"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          </div>
        </div>
      )}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCountries.map((country) => (
            <div key={country.name} className="country-card p-4 border rounded-md flex flex-col items-center justify-center">
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name}`}
                className="flag-image mb-2 shadow-md"
                style={{ width: "250px", height: "auto" }}
              />
              <div>
                <p className="font-bold">Name: {country.name}</p>
                <p>Region: {country.region}</p>
                <p>Subregion: {country.subregion}</p>
                <p>Area: {country.area} sq km</p>
                <p>Capital: {country.capital}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryList;

