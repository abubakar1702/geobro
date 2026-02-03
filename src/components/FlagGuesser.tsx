"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faTrophy, faArrowRight, faRotateRight } from "@fortawesome/free-solid-svg-icons";

interface CountryData {
    name: string;
    flagUrl: string;
    code: string;
}

interface RestCountry {
    name: {
        common: string;
    };
    flags: {
        png?: string;
        svg?: string;
    };
    cca3: string;
}

const HIGH_SCORE_KEY = "geobro_flag_guesser_high_score";

export default function FlagGuesser() {
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [target, setTarget] = useState<CountryData | null>(null);
    const [options, setOptions] = useState<CountryData[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answered, setAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [nextLoading, setNextLoading] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response: AxiosResponse<RestCountry[]> = await axios.get(
                    "https://restcountries.com/v3.1/all?fields=name,flags,cca3"
                );
                const data = response.data
                    .map((c) => ({
                        name: c.name.common,
                        flagUrl: c.flags.png ?? c.flags.svg ?? "",
                        code: c.cca3,
                    }))
                    .filter((c) => c.flagUrl && c.name);
                setCountries(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching countries:", error);
                setLoading(false);
            }
        };

        fetchCountries();

        const stored = localStorage.getItem(HIGH_SCORE_KEY);
        if (stored) setHighScore(Number(stored));
    }, []);

    const startRound = useCallback(() => {
        if (countries.length < 4) return;

        const targetIndex = Math.floor(Math.random() * countries.length);
        const newTarget = countries[targetIndex];

        const distractors: CountryData[] = [];
        while (distractors.length < 3) {
            const idx = Math.floor(Math.random() * countries.length);
            if (idx !== targetIndex && !distractors.includes(countries[idx])) {
                distractors.push(countries[idx]);
            }
        }

        const newOptions = [...distractors, newTarget].sort(() => Math.random() - 0.5);

        setTarget(newTarget);
        setOptions(newOptions);
        setAnswered(false);
        setSelectedOption(null);
        setNextLoading(false);
    }, [countries]);

    useEffect(() => {
        if (!loading && countries.length > 0 && !target) {
            startRound();
        }
    }, [loading, countries, target, startRound]);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem(HIGH_SCORE_KEY, String(score));
        }
    }, [score, highScore]);

    const handleGuess = (countryName: string) => {
        if (answered || !target) return;

        setAnswered(true);
        setSelectedOption(countryName);

        if (countryName === target.name) {
            setScore(s => s + 1);
            setNextLoading(true);
            // Automatically move to the next flag after 1.5 seconds
            setTimeout(() => {
                startRound();
            }, 1500);
        } else {
            setScore(0);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-slate-700 dark:text-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200/80 border-t-sky-400 dark:border-white/20"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            {/* Header Stats */}
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-3 md:p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <FontAwesomeIcon icon={faBolt} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">Streak</p>
                        <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{score}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                        <FontAwesomeIcon icon={faTrophy} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">Best</p>
                        <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{highScore}</p>
                    </div>
                </div>
            </div>

            {/* Game Card */}
            {target && (
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
                    <div className="relative flex min-h-[200px] md:min-h-[300px] items-center justify-center bg-slate-100/80 p-6 md:p-8 dark:bg-slate-950/50">
                        {nextLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200/80 border-t-emerald-400 dark:border-white/10"></div>
                                <p className="text-emerald-400 font-bold animate-pulse">Next Flag...</p>
                            </div>
                        ) : (
                            <img
                                src={target.flagUrl}
                                alt="Guess the flag"
                                className="max-h-[160px] md:max-h-[240px] w-auto rounded-lg shadow-2xl ring-1 ring-slate-200/80 dark:ring-white/10"
                            />
                        )}
                    </div>

                    <div className="grid gap-3 p-6 sm:grid-cols-2">
                        {options.map((option) => {
                            let btnClass = "border-slate-200/80 bg-white/80 hover:bg-slate-900/5 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white";

                            if (answered) {
                                if (option.name === target.name) {
                                    btnClass = "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100";
                                } else if (option.name === selectedOption) {
                                    btnClass = "border-rose-500 bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100";
                                } else {
                                    btnClass = "border-slate-200/60 bg-white/70 text-slate-400 dark:border-white/5 dark:bg-white/5 dark:text-white/30";
                                }
                            }

                            return (
                                <button
                                    key={option.code}
                                    onClick={() => handleGuess(option.name)}
                                    disabled={answered || nextLoading}
                                    className={`flex items-center justify-center rounded-xl border-2 p-4 text-center font-bold transition-all active:scale-95 ${btnClass}`}
                                >
                                    {option.name}
                                </button>
                            );
                        })}
                    </div>

                    {answered && !nextLoading && selectedOption !== target.name && (
                        <div className="border-t border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5">
                            <button
                                onClick={startRound}
                                className="primary-btn w-full justify-center py-4 text-lg"
                            >
                                Play Again <FontAwesomeIcon icon={faRotateRight} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
