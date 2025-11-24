import FlagGuesser from "@/components/FlagGuesser";

export default function FlagGuessPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20">
            <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-96 w-96 rounded-full bg-purple-500/20 blur-[150px]"></div>
            <div className="relative z-10">
                <div className="mb-10 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
                        Speed Challenge
                    </p>
                    <h1 className="mt-2 text-4xl font-black text-white md:text-5xl">
                        Guess the Flag
                    </h1>
                </div>
                <FlagGuesser />
            </div>
        </main>
    );
}
