"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import GameOver from "./GameOver";

interface CountryData {
  name: string;
  flags: {
    png: string;
  };
}

export default function FlagQuiz() {
  const [score, setScore] = useState(0);
  const [fourRandomCountry, setFourRandomCountry] = useState<CountryData[]>([]);
  const [flag, setFlag] = useState<CountryData | null>(null);
  const [oldFlags, setOldFlags] = useState<(CountryData | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [wrong, setWrong] = useState(false);
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [rightAns, setRightAns] = useState(0);
  const [wrongAns, setWrongAns] = useState(0);
  const [selectedValue, setSelectedValue] = useState<number>(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<CountryData[]> = await axios.get(
        "https://restcountries.com/v2/all"
      );
      const countries = response.data;

      const filteredCountries = countries.filter(
        (country) => !oldFlags.some((oldFlag) => oldFlag?.name === country.name)
      );

      const randomCountries: CountryData[] = [];
      while (randomCountries.length < 4) {
        const randomIndex = Math.floor(
          Math.random() * filteredCountries.length
        );
        const randomCountry = filteredCountries[randomIndex];
        if (
          !randomCountries.some(
            (country) => country.name === randomCountry.name
          )
        ) {
          randomCountries.push(randomCountry);
        }
      }

      setFourRandomCountry(randomCountries);
      const randomSelectedIndex = Math.floor(
        Math.random() * randomCountries.length
      );
      setFlag(randomCountries[randomSelectedIndex]);

      setOldFlags((prev) => [...prev, flag]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching country data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
  
    if (startGame && timeRemaining > 0) {
      timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    }
  
    if (timeRemaining === 0) {
      setGameOver(true);
      setStartGame(false);
    }
  
    return () => clearTimeout(timerId);
  }, [startGame, timeRemaining, gameOver]);
  

  const handleAnswer = (country: CountryData) => {
    if (country.name === flag?.name) {
      setMessage(true);
      setScore((prev) => prev + 10);
      setRightAns((prev) => prev + 1);
    } else {
      setScore((prev) => prev - 10);
      setWrongAns((prev) => prev + 1);
      setShow(false);
      setWrong(true);
    }
  };

  const handleWrongButton = () => {
    setShow(true);
    fetchData();
  };
  const handleNextButton = () => {
    setFlag(null);
    setOldFlags((prev) => [...prev, flag]);
    setMessage(false);
    setWrong(false);
    setShow(true);
    fetchData();
  };
  const handleStartGame = () => {
    setStartGame(true);
    setGameOver(false);
    setTimeRemaining(selectedValue * 60);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setFourRandomCountry([]);
    setFlag(null);
    setOldFlags([]);
    setLoading(true);
    setGameOver(false);
    setTimeRemaining(60);
    setWrong(false);
    setShow(true);
    setMessage(false);
    setStartGame(true);
    setRightAns(0);
    setWrongAns(0);
    fetchData();
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const minutes = Number(event.target.value);
    setTimeRemaining(Number(event.target.value) * 60);
    setSelectedValue(Number(event.target.value));
  };

  
  return (
    <>
      {startGame && (
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl my-4 text-center">
              Score:{" "}
              <span
                className={`${score < 0 ? "text-red-600" : "text-green-600"}`}
              >
                {score}
              </span>{" "}
            </h1>
            <h1 className="text-cernter">
              Right: <span className="text-green-600">{rightAns}</span> | Wrong:{" "}
              <span className="text-red-600">{wrongAns}</span>
            </h1>
          </div>
          <div className="flex justify-center">
            Time Remaining: {timeRemaining} seconds
          </div>
          <div>
            <div className="flex justify-center">
              <div className="m-auto">
                {loading && (
                  <div
                    className="flag-image-container m-6 relative"
                    style={{
                      width: "400px",
                      height: "250px",
                      backgroundColor: "#eee",
                    }}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
                      </div>
                    </div>
                  </div>
                )}
                {!loading && flag?.flags && (
                  <div
                    className="flag-image-container m-6"
                    style={{ width: "400px", height: "250px" }}
                  >
                    <img
                      src={flag.flags.png}
                      className="flag-image object-contain w-[98%] p-6 h-full"
                    />
                  </div>
                )}
              </div>
            </div>
            {show && (
              <div className={`flex ${message && "hidden"} justify-center mx-4`}>
                <div className="flex flex-col">
                  {fourRandomCountry.slice(0, 2).map((country, index) => (
                    <button
                      className="p-2 font-bold h-24 md:h-28 w-36 md:w-40 border-solid border-4 border-sky-600 rounded-md m-2"
                      onClick={() => handleAnswer(country)}
                      key={index}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col">
                  {fourRandomCountry.slice(2, 4).map((country, index) => (
                    <button
                      className="p-2 font-bold h-24 md:h-28 w-36 md:w-40 border-solid border-4 border-sky-600 rounded-md m-2"
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
                  <div className="m-auto w-[80%]">
                    <h1 className="text-green-600 text-center">
                      Great! correct answer. You have earned 10 points.
                    </h1>
                    <h1 className="p-4 text-center font-semibold text-2xl w-full text-blue-950 m-2">
                      {flag?.name}
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
                      {flag?.name}
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
          </div>
        </div>
      )}
      {gameOver && (
        <GameOver
          score={score}
          right={rightAns}
          wrong={wrongAns}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {!startGame && !gameOver && (
        <div className="fle p-8 flex-col">
          <h1 className="p-4 text-xl text-center font-bold">Welcome to</h1>
          <h1 className="text-center text-4xl">
            <span className="p-4 text-2xl font-bold">
              Ge
              <FontAwesomeIcon className="text-green-700" icon={faEarth} />
              Bro
            </span>
          </h1>
          <div className="flex justify-center my-8">
            <select
              className="p-2 rounded-md bg-slate-500 text-white px-6"
              value={selectedValue}
              onChange={handleSelectChange}
            >
              {[...Array(5)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} minute
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center my-8">
            <button
              onClick={handleStartGame}
              className="bg-sky-500 px-10 py-4 rounded"
            >
              Start <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
