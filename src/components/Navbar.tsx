"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black">
          <span className="tracking-tight">Ge</span>
          <FontAwesomeIcon className="text-emerald-400" icon={faEarth} />
          <span className="tracking-tight">Bro</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/#map-stage"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Play Map Game
          </Link>
          <Link
            href="/countries"
            className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:scale-[1.02]"
          >
            Browse Flags
          </Link>
        </div>
      </nav>
    </header>
  );
}
