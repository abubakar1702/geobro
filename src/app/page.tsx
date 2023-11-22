import Image from 'next/image'
import FlagQuiz from '@/components/FlagQuiz'
import GuessTheFlag from '@/components/GuessTheFlag'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center m-auto">
      <>
      <FlagQuiz />
      </>
    </main>
  )
}
