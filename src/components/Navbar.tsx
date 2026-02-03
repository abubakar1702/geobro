"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black text-slate-900 transition hover:opacity-80 dark:text-white"
          onClick={() => setIsOpen(false)}
        >
          <span className="tracking-tight">Ge</span>
          <FontAwesomeIcon className="text-emerald-400" icon={faEarth} />
          <span className="tracking-tight">Bro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/#map-stage"
            className="rounded-full border border-slate-200/80 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Map Game
          </Link>
          <Link
            href="/flag-guess"
            className="rounded-full border border-slate-200/80 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            Flag Guesser
          </Link>
          <Link
            href="/countries"
            className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:scale-[1.02] active:scale-95"
          >
            Browse Flags
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/5 text-slate-900 md:hidden dark:bg-white/5 dark:text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-slate-200/80 bg-white/90 p-6 backdrop-blur-3xl md:hidden dark:border-white/10 dark:bg-slate-950/95">
          <div className="flex flex-col gap-4">
            <Link
              href="/#map-stage"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-900/5 py-4 text-lg font-bold text-slate-900 active:bg-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:active:bg-white/10"
            >
              Map Game
            </Link>
            <Link
              href="/flag-guess"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-900/5 py-4 text-lg font-bold text-slate-900 active:bg-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:active:bg-white/10"
            >
              Flag Guesser
            </Link>
            <Link
              href="/countries"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 active:scale-95"
            >
              Browse Flags
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
