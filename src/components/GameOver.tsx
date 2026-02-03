import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faCircleCheck, faCircleXmark, faTrophy } from "@fortawesome/free-solid-svg-icons";

interface GameOverProps {
  score: number;
  right: number;
  wrong: number;
  highScore: number;
  onPlayAgain: () => void;
}

export default function GameOver({ score, onPlayAgain, right, wrong, highScore }: GameOverProps) {
  const isPositive = score >= 0;
  const unlockedRecord = highScore > 0 && score >= highScore;

  return (
    <div className="glass-panel p-6 md:p-10 text-center space-y-6 md:space-y-8">
      <div>
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-white/40">
          Session complete
        </p>
        <h1 className="text-4xl md:text-5xl font-black">Game over</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 text-slate-600 dark:text-white/80 md:grid-cols-4">
        <div className="stat-chip flex-col items-start text-slate-900 dark:text-white">
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
            Final score
          </span>
          <span className={`text-4xl font-black ${isPositive ? "text-emerald-300" : "text-rose-300"}`}>
            {score}
          </span>
        </div>
        <div className="stat-chip flex-col items-start text-emerald-300">
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
            Correct
          </span>
          <span className="flex items-center gap-2 text-3xl font-black">
            <FontAwesomeIcon icon={faCircleCheck} />
            {right}
          </span>
        </div>
        <div className="stat-chip flex-col items-start text-rose-300">
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
            Missed
          </span>
          <span className="flex items-center gap-2 text-3xl font-black">
            <FontAwesomeIcon icon={faCircleXmark} />
            {wrong}
          </span>
        </div>
        <div className="stat-chip flex-col items-start text-purple-300">
          <span className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
            High score
          </span>
          <span className="flex items-center gap-2 text-3xl font-black">
            <FontAwesomeIcon icon={faTrophy} />
            {highScore}
          </span>
        </div>
      </div>

      <p className="text-lg text-slate-600 dark:text-white/70">
        {unlockedRecord
          ? "New high score unlocked! Keep the streak going."
          : isPositive
            ? "Amazing work! Ready to push that score even further?"
            : "Every explorer stumbles. Ready for a redemption lap?"}
      </p>

      <button onClick={onPlayAgain} className="primary-btn mx-auto">
        <FontAwesomeIcon icon={faRedo} />
        Play again
      </button>
    </div>
  );
}
