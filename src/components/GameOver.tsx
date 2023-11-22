import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface GameOverProps {
  score: number;
  onPlayAgain: () => void;
}

export default function GameOver({ score, onPlayAgain  }: GameOverProps) {
  const [playAgain, setPlayAgain] = useState(false)

  const handlePlayAgain=()=>{
    setPlayAgain(true)
    onPlayAgain();
  }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-6xl">Game Over</h1>
        <h1>Your Score is: {score}</h1>
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
