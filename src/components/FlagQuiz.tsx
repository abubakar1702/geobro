"use client";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface CountryData {
  name: string;
  flags: {
    png: string;
  };
}

export default function FlagQuiz() {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [multipleCountryData, setMultipleCountryData] = useState<CountryData[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<CountryData[]> = await axios.get(
          "https://restcountries.com/v2/all"
        );
        const countries = response.data;

        // Get 4 random indices
        const randomIndices: number[] = [];
        while (randomIndices.length < 4) {
          const randomIndex = Math.floor(Math.random() * countries.length);
          if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
          }
        }

        // Get the corresponding countries
        const randomCountries = randomIndices.map((index) => countries[index]);

        // Shuffle the array once
        const shuffledData = [...randomCountries];
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
        }

        // Set the initial country data
        setCountryData(shuffledData[0]);

        // Set the shuffled array for multipleCountryData
        setMultipleCountryData(shuffledData);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (selectedCountry: CountryData) => {
    // Check if the selected country matches the correct answer
    if (selectedCountry.name === countryData?.name) {
      alert("Correct!");
    } else {
      alert("Incorrect. Try again.");
    }

    // Trigger a new round
    setCountryData(multipleCountryData[0]); // Set the next country for display
    setMultipleCountryData((prevData) => {
      // Remove the first element (correct answer) and shuffle the rest
      const shuffledData = prevData.slice(1);
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
      }
      return shuffledData;
    });
  };

  return (
    <div>
      <div className="p-4 shadow rounded-md">
        {countryData && (
          <div>
            <h2>Guess the Country</h2>
            <img src={countryData.flags.png} alt={`${countryData.name} flag`} />
          </div>
        )}
      </div>
      <div className="flex w-full">
        <div className="w-[50%]">
          <div className="flex justify-center">
            {multipleCountryData.map((country, index) => (
              <button
                key={index}
                className="bg-green-500 p-2 h-24 w-40 text-white rounded-md shadow m-2 hover:bg-green-700"
                onClick={() => handleButtonClick(country)}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

