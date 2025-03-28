import { useGameData } from "~/app/_context/game-context";
import { Button } from "~/components/ui/button";

export function GameOverDisplay() {
  const { score, resetGame, resetGameAndUser } = useGameData();

  return (
    <div className="flex flex-col gap-4">
      <p>Game Over! Your score was {score}</p>
      <Button onClick={resetGame}>Play Again</Button>
      <Button onClick={resetGameAndUser}>Play as a different user</Button>
    </div>
  );
}
