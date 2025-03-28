import { useGameData } from "~/app/_context/game-context";
import { Button } from "~/components/ui/button";

export function TriviaDisplay() {
  const { setShowTrivia, trivia, showTrivia } = useGameData();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 text-center">
      {/* the state updates quicker than the animation, so we need to hide the next answer to stop it from appearing early. */}
      {showTrivia ? (
        <>
          <p className="text-xl font-bold text-green-600">Correct!</p>
          <p className="text-lg leading-relaxed text-gray-700">{trivia}</p>
          <Button onClick={() => setShowTrivia(false)} className="mt-2 px-6">
            Continue
          </Button>
        </>
      ) : null}
    </div>
  );
}
