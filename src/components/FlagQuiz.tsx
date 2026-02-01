"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarth,
  faArrowRight,
  faClock,
  faCircleCheck,
  faCircleXmark,
  faBolt,
  faPlay,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import type { Feature } from "geojson";
import GameOver from "./GameOver";

interface CountryData {
  name: string;
  flagUrl: string;
  code: string;
  numericCode: string;
  region: string;
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
  ccn3: string;
  region: string;
}

const HIGH_SCORE_STORAGE_KEY = "geobro_high_score";
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function FlagQuiz() {
  const [score, setScore] = useState(0);
  const [flag, setFlag] = useState<CountryData | null>(null);
  const [history, setHistory] = useState<{ numericCode: string; status: "correct" | "wrong" }[]>([]);
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
  const [highScore, setHighScore] = useState(0);
  const [allCountries, setAllCountries] = useState<CountryData[]>([]);
  const [streak, setStreak] = useState(0);
  const [clickedCountry, setClickedCountry] = useState<string | null>(null);
  const [clickedCountryId, setClickedCountryId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintData, setHintData] = useState<{ region: string } | null>(null);
  const [mapState, setMapState] = useState({ center: [0, 0] as [number, number], zoom: 1.4 });
  const [geoCentroids, setGeoCentroids] = useState<Record<string, [number, number]>>({});

  const fetchData = useCallback(async (currentHistory = history) => {
    try {
      setLoading(true);
      let countries = allCountries;

      if (countries.length === 0) {
        // Fetch map data to get valid IDs and centroids
        const mapResponse = await axios.get(GEO_URL);
        const geometries = mapResponse.data.objects.countries.geometries;
        const validMapIds = new Set(geometries.map((g: any) => g.id));

        // Simple centroid calculation from bbox or similar would be complex without libraries,
        // but since we want to "focus", we can store the geometry and find a point.
        // For 110m atlas, we can approximate centroids (usually provided in some versions, 
        // but here we might need to manually map or use a helper)
        setGeoCentroids(geometries.reduce((acc: any, g: any) => {
          // This is a placeholder for centroid logic - in a real app we'd use d3-geo
          // For now, let's just use a simplified version if available or leave it to be updated
          acc[g.id] = [0, 0];
          return acc;
        }, {}));

        const response: AxiosResponse<RestCountry[]> = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,cca3,ccn3,region"
        );
        countries = response.data
          .map((country) => ({
            name: country.name.common,
            flagUrl: country.flags.png ?? country.flags.svg ?? "",
            code: country.cca3,
            numericCode: country.ccn3,
            region: country.region,
          }))
          .filter((country) =>
            Boolean(country.flagUrl) &&
            Boolean(country.code) &&
            Boolean(country.numericCode) &&
            validMapIds.has(country.numericCode)
          );
        setAllCountries(countries);
      }

      const playedCodes = new Set(currentHistory.map(h => h.numericCode));
      const availableCountries = countries.filter(
        (country) => !playedCodes.has(country.numericCode)
      );

      if (availableCountries.length === 0) {
        setGameOver(true);
        setLoading(false);
        return;
      }

      const nextCountry =
        availableCountries[Math.floor(Math.random() * availableCountries.length)];
      setFlag(nextCountry);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching country data:", error);
      setLoading(false);
    }
  }, [allCountries, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedHighScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    if (storedHighScore) {
      const parsed = Number(storedHighScore);
      if (!Number.isNaN(parsed)) {
        setHighScore(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (score > highScore) {
      localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (startGame && timeRemaining > 0 && selectedValue !== 0) {
      timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    }

    if (timeRemaining === 0 && selectedValue !== 0) {
      setGameOver(true);
      setStartGame(false);
    }

    return () => clearTimeout(timerId);
  }, [startGame, timeRemaining, gameOver, selectedValue]);

  const handleQuitGame = () => {
    setGameOver(true);
    setStartGame(false);
  };

  const handleWrongButton = () => {
    if (flag) {
      const newHistory = [...history, { numericCode: flag.numericCode, status: "wrong" as const }];
      setHistory(newHistory);
      setWrong(false);
      setMessage(false);
      setShow(true);
      setClickedCountry(null);
      setClickedCountryId(null);
      setShowHint(false);
      setMapState({ center: [0, 0], zoom: 1.4 });
      fetchData(newHistory);
    }
  };
  const handleNextButton = () => {
    if (flag) {
      const newHistory = [...history, { numericCode: flag.numericCode, status: "correct" as const }];
      setHistory(newHistory);
      setFlag(null);
      setMessage(false);
      setWrong(false);
      setShow(true);
      setClickedCountry(null);
      setClickedCountryId(null);
      setShowHint(false);
      setMapState({ center: [0, 0], zoom: 1.4 });
      fetchData(newHistory);
    }
  };
  const handleStartGame = () => {
    setStartGame(true);
    setGameOver(false);
    setTimeRemaining(selectedValue === 0 ? 0 : selectedValue * 60);
  };

  const handlePlayAgain = () => {
    setScore(0);
    setFlag(null);
    setHistory([]);
    setLoading(true);
    setGameOver(false);
    setTimeRemaining(60);
    setWrong(false);
    setShow(true);
    setMessage(false);
    setStartGame(true);
    setRightAns(0);
    setWrongAns(0);
    setStreak(0);
    setClickedCountry(null);
    setHintsRemaining(3);
    setShowHint(false);
    fetchData([]);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const minutes = Number(event.target.value);
    setTimeRemaining(minutes * 60);
    setSelectedValue(minutes);
  };

  const normalizeName = (name?: string | null) =>
    (name ?? "").toLowerCase().replace(/[^a-z]/g, "");

  const handleMapGuess = (geoId: string, geoName: string) => {
    if (!flag || message || !show) return;
    const isCorrect = geoId === flag.numericCode;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      let points = 10;
      if (newStreak >= 5) points = 30; // 3x multiplier
      else if (newStreak >= 3) points = 20; // 2x multiplier

      setMessage(true);
      setScore((prev) => prev + points);
      setRightAns((prev) => prev + 1);
      setWrong(false);
    } else {
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 10));
      setWrongAns((prev) => prev + 1);
      setShow(false);
      setWrong(true);
      setClickedCountry(geoName);
      setClickedCountryId(geoId);

    }
  };

  const useHint = () => {
    if (hintsRemaining > 0 && flag && !showHint) {
      setHintData({ region: flag.region });
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  const extractGeoName = (properties: any) =>
    (properties?.NAME_LONG as string) ??
    (properties?.ADMIN as string) ??
    (properties?.NAME as string) ??
    (properties?.name as string) ??
    (properties?.formal_en as string) ??
    "";

  const extractGeoCode = (properties: any) =>
    (properties?.ISO_A3 as string) ??
    (properties?.ADM0_A3 as string) ??
    (properties?.WB_A3 as string) ??
    "";

  // Helper to extract center from geography
  const getCenter = (geo: Feature): [number, number] => {
    // This is a fallback to find a point inside the polygon
    if (geo.geometry.type === "Polygon") {
      const coords = (geo.geometry as any).coordinates[0][0];
      return [coords[0], coords[1]];
    } else if (geo.geometry.type === "MultiPolygon") {
      const coords = (geo.geometry as any).coordinates[0][0][0];
      return [coords[0], coords[1]];
    }
    return [0, 0];
  };

  const handleMapFocus = (geo: Feature) => {
    const coords = getCenter(geo);
    setMapState({ center: coords, zoom: 3 });
  };

  const renderScoreboard = () => (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <div className="stat-chip text-emerald-300 px-3 py-1.5 md:px-4 md:py-2">
        <FontAwesomeIcon icon={faBolt} />
        <span className="hidden xs:inline">Score</span> {score}
      </div>
      <div className="stat-chip text-cyan-300 px-3 py-1.5 md:px-4 md:py-2">
        <FontAwesomeIcon icon={faCircleCheck} />
        <span>{rightAns}<span className="hidden xs:inline"> right</span></span>
      </div>
      <div className="stat-chip text-rose-300 px-3 py-1.5 md:px-4 md:py-2">
        <FontAwesomeIcon icon={faCircleXmark} />
        <span>{wrongAns}<span className="hidden xs:inline"> wrong</span></span>
      </div>
      <div className="stat-chip text-amber-300 px-3 py-1.5 md:px-4 md:py-2">
        <FontAwesomeIcon icon={faClock} />
        <span>{selectedValue === 0 ? "∞" : `${timeRemaining}s`}</span>
      </div>
      <div className="stat-chip text-purple-300 px-3 py-1.5 md:px-4 md:py-2">
        <FontAwesomeIcon icon={faTrophy} />
        <span className="hidden xs:inline">Best</span> {highScore}
      </div>
      {streak > 1 && (
        <div className="stat-chip bg-orange-500/20 text-orange-400 border-orange-500/30 animate-bounce">
          <FontAwesomeIcon icon={faBolt} />
          <span>{streak} Streak! {streak >= 5 ? '(3x)' : streak >= 3 ? '(2x)' : ''}</span>
        </div>
      )}
      <button
        onClick={handleQuitGame}
        className="stat-chip bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer border-rose-500/20 px-3 py-1.5 md:px-4 md:py-2"
      >
        Quit
      </button>
    </div>
  );

  const renderFlagStage = () => {
    const isInteractive = show && !message;
    return (
      <div
        id="map-stage"
        className="glass-panel p-4 md:p-10"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">
                Round in progress
              </p>
              <h2 className="text-3xl font-black md:text-4xl">
                {flag ? `Find ${flag.name}` : "Loading next target"}
              </h2>
            </div>
            {renderScoreboard()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 space-y-6">
            {!loading && flag?.flagUrl && (
              <div className="glass-panel bg-slate-950/60 border-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Target flag
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  <img
                    src={flag.flagUrl}
                    alt={`Flag of ${flag.name}`}
                    className="w-full rounded-2xl border border-white/10 object-contain bg-slate-900 shadow-lg"
                  />
                  <div className="space-y-1">
                    <p className="text-sm text-white/60">Country to locate</p>
                    <p className="text-2xl font-black text-white leading-tight">{flag.name}</p>
                    <p className="text-sm text-white/50">
                      Tap the map to pin location.
                    </p>
                  </div>
                </div>

                {!message && !wrong && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    {showHint ? (
                      <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 animate-in fade-in zoom-in-95 text-center">
                        <p className="text-xs text-sky-300 font-bold uppercase tracking-wider mb-1">Region Hint</p>
                        <p className="text-white text-lg font-bold">{hintData?.region}</p>
                      </div>
                    ) : (
                      <button
                        onClick={useHint}
                        disabled={hintsRemaining === 0}
                        className="w-full py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-30 border border-sky-500/10 active:scale-95"
                      >
                        <FontAwesomeIcon icon={faEarth} className="mr-2" />
                        Reveal Region ({hintsRemaining} left)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {message && (
              <div className="glass-panel bg-emerald-500/10 border-emerald-400/30 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <p className="text-emerald-300 font-semibold uppercase tracking-[0.35em] text-xs">
                  Great job!
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">{flag?.name}</h3>
                <p className="mt-2 text-sm text-white/70">
                  Great job! {streak >= 5 ? '3x MEGA STREAK! (+30 points)' : streak >= 3 ? '2x STREAK! (+20 points)' : '+10 exploration points awarded.'}
                </p>
                <div className="mt-6">
                  <button onClick={handleNextButton} className="primary-btn w-full justify-center">
                    Next round <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            )}

            {wrong && !show && (
              <div className="glass-panel bg-rose-500/10 border-rose-400/30 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <p className="text-rose-300 font-semibold uppercase tracking-[0.35em] text-xs">
                  Oops!
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">{flag?.name}</h3>
                <p className="mt-2 text-sm text-white/70">
                  That wasn’t it! You clicked <strong>{clickedCountry || "somewhere else"}</strong>.
                </p>
                <div className="mt-6">
                  <button onClick={handleWrongButton} className="secondary-btn w-full justify-center">
                    Try another country <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl h-[400px] md:h-full md:min-h-[500px]">
              {loading ? (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-white/10"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-sky-400 animate-spin"></div>
                  </div>
                </div>
              ) : (
                <ComposableMap
                  projectionConfig={{ scale: 180 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <ZoomableGroup
                    zoom={mapState.zoom}
                    center={mapState.center}
                    onMoveEnd={(s) => setMapState({ center: s.coordinates as [number, number], zoom: s.zoom })}
                    minZoom={0.9}
                    maxZoom={8}
                    translateExtent={[
                      [-1000, -450],
                      [1000, 650],
                    ]}
                  >
                    <Geographies geography={GEO_URL}>
                      {({ geographies }: { geographies: Feature[] }) =>
                        geographies.map((geo, index) => {
                          const key =
                            (geo as { rsmKey?: string }).rsmKey ?? `geo-${index}`;
                          const geoId = (geo.id as string) ?? "";
                          const name = extractGeoName(geo.properties);

                          // Check history first
                          const historyItem = history.find(h => h.numericCode === geoId);

                          const isTarget =
                            flag &&
                            geoId &&
                            geoId === flag.numericCode;

                          const shouldHighlightCorrect =
                            (isTarget && message) || (historyItem?.status === 'correct');

                          const shouldHighlightWrong =
                            (isTarget && wrong) || (historyItem?.status === 'wrong');

                          // Call focus if wrong and this is target
                          if (isTarget && wrong && mapState.zoom === 1.4) {
                            setTimeout(() => handleMapFocus(geo), 100);
                          }

                          const baseFill = "#f8fafc";
                          const highlightFill = shouldHighlightCorrect
                            ? "#22c55e"
                            : shouldHighlightWrong
                              ? "#ef4444"
                              : baseFill;
                          return (
                            <Geography
                              key={key}
                              geography={geo}
                              onClick={() => handleMapGuess(geoId, name)}
                              style={{
                                default: {
                                  fill: highlightFill,
                                  outline: "none",
                                  stroke: "#94a3b8",
                                  strokeWidth: 0.5,
                                },
                                hover: {
                                  fill: shouldHighlightCorrect
                                    ? "#16a34a"
                                    : shouldHighlightWrong
                                      ? "#dc2626"
                                      : "#e2e8f0",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#cbd5f5",
                                  outline: "none",
                                },
                              }}
                              className={
                                !isInteractive ? "pointer-events-none" : ""
                              }
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
              )}
              {!isInteractive && !loading && (
                <div className="pointer-events-none absolute inset-0 bg-slate-950/60"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLanding = () => (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="glass-panel p-8 space-y-6">
        <p className="text-sm uppercase tracking-[0.35em] text-white/50">
          Geography sprint
        </p>
        <h1 className="text-3xl font-black leading-tight md:text-4xl">
          Welcome to Ge
          <FontAwesomeIcon className="mx-2 text-emerald-400" icon={faEarth} />
          Bro
        </h1>
        <p className="text-base text-white/70 md:text-lg">
          Train your memory, travel the globe, and smash the leaderboard in this
          fast paced map challenge.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="stat-chip">
            <FontAwesomeIcon icon={faClock} />
            Timed rounds
          </div>
          <div className="stat-chip">
            <FontAwesomeIcon icon={faCircleCheck} />
            Accuracy boost
          </div>
          <div className="stat-chip">
            <FontAwesomeIcon icon={faBolt} />
            Rapid fire mode
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-white/40">
              Pre-flight
            </p>
            <h2 className="text-2xl font-bold">Choose your session length</h2>
          </div>
          <span className="text-4xl font-black text-white/80">
            {selectedValue === 0 ? "∞" : `${selectedValue}m`}
          </span>
        </div>
        <p className="text-white/60">
          Current best run:{" "}
          <span className="font-semibold text-white">{highScore}</span>
        </p>
        <select
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-lg font-semibold text-white focus:border-sky-300 focus:outline-none focus:ring-0"
          value={selectedValue}
          onChange={handleSelectChange}
        >
          <option value={0} className="text-slate-900">
            Unlimited
          </option>
          {[...Array(5)].map((_, index) => (
            <option key={index + 1} value={index + 1} className="text-slate-900">
              {index + 1} minute
            </option>
          ))}
        </select>
        <button onClick={handleStartGame} className="primary-btn w-full">
          <FontAwesomeIcon icon={faPlay} /> Start exploring
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-4 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-96 w-96 rounded-full bg-sky-500/40 blur-[150px]"></div>
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-[140px]"></div>
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-10">
        {!startGame && !gameOver && renderLanding()}
        {startGame && !gameOver && renderFlagStage()}
        {gameOver && (
          <GameOver
            score={score}
            right={rightAns}
            wrong={wrongAns}
            onPlayAgain={handlePlayAgain}
            highScore={highScore}
          />
        )}
      </div>
    </div>
  );
}
