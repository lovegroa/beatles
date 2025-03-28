import { useGameData } from "~/app/_context/game-context";
import { Button } from "~/components/ui/button";

export function TriviaDisplay() {
  const { setShowTrivia, trivia } = useGameData();

  return (
    <div>
      <p>Correct</p>
      <p>{trivia}</p>
      <Button onClick={() => setShowTrivia(false)}>Continue</Button>
    </div>
  );
}
