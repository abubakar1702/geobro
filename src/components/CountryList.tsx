'use client'

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface CountryData {
  name: string;
  flagUrl: string;
  region: string;
  subregion: string;
  area: number;
  capital: string;
}

interface RestCountry {
  name: {
    common: string;
  };
  flags: {
    png?: string;
    svg?: string;
  };
  region: string;
  subregion?: string;
  area?: number;
  capital?: string[];
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
        const response: AxiosResponse<RestCountry[]> = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,region,subregion,area,capital"
        );
        const mapped: CountryData[] = response.data
          .map((country) => ({
            name: country.name.common,
            flagUrl: country.flags.png ?? country.flags.svg ?? "",
            region: country.region,
            subregion: country.subregion || "—",
            area: country.area ?? 0,
            capital: country.capital?.[0] ?? "—",
          }))
          .filter((country) => Boolean(country.flagUrl));
        setCountries(mapped);
        setFilteredCountries(mapped);
      } catch (error) {
        console.error("Error fetching country data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const normalized = term.toLowerCase();
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(normalized)
    );
    setFilteredCountries(filtered);
  };

  return (
    <section className="px-4 py-8 md:py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <div className="glass-panel flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50 md:text-xs">
              Explore the atlas
            </p>
            <h1 className="mt-1 text-2xl font-black md:text-3xl lg:text-4xl">
              Discover every country&apos;s colors
            </h1>
          </div>
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search by country name"
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-lg font-semibold text-white placeholder:text-white/40 focus:border-sky-300 focus:outline-none focus:ring-0"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-white/10"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-sky-400 animate-spin"></div>
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCountries.map((country) => (
              <article
                key={country.name}
                className="glass-panel flex flex-col overflow-hidden p-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900">
                  <img
                    src={country.flagUrl}
                    alt={`Flag of ${country.name}`}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm text-white/70">
                  <h2 className="text-xl font-bold text-white">{country.name}</h2>
                  <p>
                    <span className="text-white/50">Region:</span> {country.region}
                  </p>
                  <p>
                    <span className="text-white/50">Subregion:</span> {country.subregion}
                  </p>
                  <p>
                    <span className="text-white/50">Area:</span>{" "}
                    {country.area.toLocaleString()} km²
                  </p>
                  <p>
                    <span className="text-white/50">Capital:</span> {country.capital}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CountryList;

