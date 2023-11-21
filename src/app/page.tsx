import Image from 'next/image'
import FlagQuiz from '@/components/FlagQuiz'
import GuessTheFlag from '@/components/GuessTheFlag'

export default function Home() {
  return (
    <main className="flex w-3/6 flex-col items-center justify-center m-auto p-2">
      <>
      <GuessTheFlag />
      </>
    </main>
  )
}
