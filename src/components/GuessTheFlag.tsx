"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth,faArrowRight } from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import Opening from "./Opening";

interface CountryData {
  name: string;
  flags: {
    png: string;
  };
}

export default function GuessTheFlag() {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [multipleCountryData, setMultipleCountryData] = useState<CountryData[]>([]);
  const [message, setMessage] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(false)
  const [timer, setTimer] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<CountryData[]> = await axios.get(
        "https://restcountries.com/v2/all"
      );
      const countries = response.data;
      const randomCountries: CountryData[] = [];
      while (randomCountries.length < 4) {
        const randomIndex = Math.floor(Math.random() * countries.length);
        const randomCountry = countries[randomIndex];
        if (
          !randomCountries.some(
            (country) => country.name === randomCountry.name
          )
        ) {
          randomCountries.push(randomCountry);
        }
      }
      setMultipleCountryData(randomCountries);
      const randomSelectedIndex = Math.floor(
        Math.random() * randomCountries.length
      );
      setCountryData(randomCountries[randomSelectedIndex]);
      setMessage(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching country data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnswer = (country: CountryData) => {
    if (country.name === countryData?.name) {
      setMessage(true);
      setScore((prev) => prev + 10);
    } else {
      setScore((prev) => prev - 10);
      setShow(false);
      setWrong(true);
    }
  };
  const handleWrongButton = () => {
    setShow(true);
    fetchData();
  };
  const handleNextButton = () => {
    fetchData();
  };

  const handleStart=()=>{
    setStart(true)
  }

  return (
    <>
    <div className={`fle p-8 flex-col ${start && "hidden"}`}>
      <h1 className="p-4 text-xl text-center font-bold">Welcome to</h1>
      <h1 className="text-center text-4xl">
        <span className="p-4 text-2xl font-bold">
          Ge
          <FontAwesomeIcon className="text-green-700" icon={faEarth} />
          Bro
        </span>
      </h1>
      {/* <div className="flex justify-center my-8">
        <select className="p-2 rounded-md bg-slate-500 text-white">
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} minute
            </option>
          ))}
        </select>
      </div> */}
      <div className="flex justify-center my-8">
        <button onClick={handleStart} className="bg-sky-500 px-10 py-4 rounded">
          Start <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
    <div>
      {start && <div className="flex flex-col h-full justify-around items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl my-4 text-center">
          Score:{" "}
          <span className={`${score < 0 ? "text-red-600" : "text-green-600"}`}>
            {score}
          </span>{" "}
        </h1>
      </div>

      <div className="m-auto">
      {loading && (
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        )}
        {!loading && countryData?.flags && (
          <img
            src={countryData.flags.png}
            alt={`Flag of ${countryData.name}`}
            className="flag-image m-6"
          />
        )}
      </div>

      {show && (
        <div className={`flex ${message && "hidden"} justify-center`}>
          <div className="flex flex-col">
            {multipleCountryData.slice(0, 2).map((country, index) => (
              <button
                className="p-4 font-bold h-24 w-48 border-solid border-4 border-blue-600 rounded-md m-2"
                onClick={() => handleAnswer(country)}
                key={index}
              >
                {country.name}
              </button>
            ))}
          </div>
          <div className="flex flex-col">
            {multipleCountryData.slice(2, 4).map((country, index) => (
              <button
                className="p-4 font-bold w-48 h-24 border-solid border-4 border-blue-600 rounded-md m-2"
                onClick={() => handleAnswer(country)}
                key={index + 2}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className="m-auto">
          <div>
            <div className="m-auto">
              <h1 className="text-green-600 text-center">
                Great! correct answer. You have earned 10 points.
              </h1>
              <h1 className="p-4 text-center font-semibold text-2xl w-full text-blue-950 m-2">
                {countryData?.name}
              </h1>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleNextButton}
                className="bg-sky-500 hover:bg-sky-600 w-48 text-white rounded-full px-6 py-4"
              >
                Next flag <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      )}

      {wrong && !show && (
        <div className="m-auto">
          <div>
            <div className="m-auto">
              <h1 className="text-red-600 text-center">
                -10 for the wrong answer
              </h1>
              <h1 className="p-4 text-center font-semibold text-2xl w-full text-blue-950 m-2">
                {countryData?.name}
              </h1>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleWrongButton}
                className="bg-sky-500 hover:bg-sky-500 w-48 text-white rounded-full px-6 py-4"
              >
                Next flag <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>}
    </div>
    
    </>
  );
}
