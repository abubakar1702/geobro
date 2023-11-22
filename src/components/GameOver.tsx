import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface GameOverProps {
  score: number;
  right: number;
  wrong: number;
  onPlayAgain: () => void;
}

export default function GameOver({ score, onPlayAgain, right, wrong  }: GameOverProps) {
  const [playAgain, setPlayAgain] = useState(false)

  const handlePlayAgain=()=>{
    setPlayAgain(true)
    onPlayAgain();
  }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-6xl p-4">Game Over</h1>
        <h1 className="my-6 text-xl">Your score is: <span className={`${score < 0 ? "text-red-600" : "text-green-600"}`}>{score}</span></h1>
        <h1 className="text-cernter">Right: <span className="text-green-600">{right}</span> | Wrong: <span className="text-red-600">{wrong}</span></h1>
      </div>

      <button onClick={handlePlayAgain} className="bg-sky-500 px-10 py-4 rounded flex items-center mt-4">
        <span className="mr-2">
          <FontAwesomeIcon icon={faRedo} />
        </span>{" "}
        Play Again
      </button>
    </div>
  );
}
