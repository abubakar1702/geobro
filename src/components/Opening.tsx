import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEarth } from "@fortawesome/free-solid-svg-icons";

export default function Opening() {
  return (
    <div className="fle p-8 flex-col text-slate-900 dark:text-white">
      <h1 className="p-4 text-xl text-center font-bold">Welcome to</h1>
      <h1 className="text-center text-4xl">
        <span className="p-4 text-2xl font-bold">
          Ge
          <FontAwesomeIcon className="text-green-700" icon={faEarth} />
          Bro
        </span>
      </h1>
      <div className="flex justify-center my-8">
        <select className="p-2 rounded-md border border-slate-200/80 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-500 dark:text-white">
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} minute
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-center my-8">
        <button className="bg-sky-500 px-10 py-4 rounded">
          Start <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
