"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useReducer } from "react";
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<CountryData[]> = await axios.get(
        "https://restcountries.com/v2/all"
      );
      const countries = response.data;

      // Filter out flags that have already been shown
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

      // Update oldFlags with the current flag
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

    // Check if time has reached 0, set gameOver to true
    if (timeRemaining === 0) {
      setGameOver(true);
      setStartGame(false); // Optionally, stop the game when time reaches 0
    }

    // Clean up the timer when the component is unmounted or when the game is over
    return () => clearTimeout(timerId);
  }, [startGame, timeRemaining, gameOver]);



  const handleAnswer = (country: CountryData) => {
    if (country.name === flag?.name) {
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
    setFlag(null); // Reset the current flag
    setOldFlags((prev) => [...prev, flag]); // Move the current flag to oldFlags
    setMessage(false); // Reset the message state
    setWrong(false); // Reset the wrong state
    setShow(true); // Show the buttons again
    fetchData(); // Fetch a new set of flags
  };
  const handleStartGame = () => {
    setStartGame(true);
    setGameOver(false);
    setTimeRemaining(60);
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
    fetchData();
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
          </div>
          <div className="flex justify-center">
            Time Remaining: {timeRemaining} seconds
          </div>
          <div>
            <div className="flex justify-center">
              <div className="m-auto">
                {loading && (
                  <div
                    className="flag-image-container m-6"
                    style={{
                      width: "400px",
                      height: "250px",
                      backgroundColor: "#eee",
                      position: "relative",
                    }}
                  >
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
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
                      alt={`Flag of ${flag.name}`}
                      className="flag-image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {show && (
              <div className={`flex ${message && "hidden"} justify-center`}>
                <div className="flex flex-col">
                  {fourRandomCountry.slice(0, 2).map((country, index) => (
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
                  {fourRandomCountry.slice(2, 4).map((country, index) => (
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
      {gameOver && <GameOver score={score} onPlayAgain={handlePlayAgain} />}
      {!startGame && !gameOver &&(
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