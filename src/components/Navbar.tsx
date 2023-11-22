"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <div className="shadow-md">
      <ul className="flex flex-row justify-between items-center">
        <li>
          <h1 className="p-4 text-2xl font-bold">
            Ge
            <FontAwesomeIcon className="text-green-700" icon={faEarth} />
            Bro
          </h1>
        </li>
        <div className="flex flex-row p-2 space-x-8 mx-4">
          <li className="text-sky-600 cursor-pointer font-bold">
          <Link href="/">Home</Link>
          </li>
          <li className="text-sky-600 cursor-pointer font-bold">
            <Link href="/countries">All Countries</Link>
          </li>
        </div>
        {/* <li>
          <h1 className="text-5xl rounded p-4 underline decoration-sky-500 text-center">
            Guess the country
          </h1>
        </li> */}
        {/* <li><h1 className="p-4">Highest Score: 90</h1></li> */}
      </ul>
    </div>
  );
}
