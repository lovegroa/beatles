import { Button } from "~/components/ui/button";

export function GameOverDisplay({
  score,
  onPlayAgain,
  onChangeUser,
}: {
  score: number;
  onPlayAgain: () => void;
  onChangeUser: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p>Game Over! Your score was {score}</p>
      <Button onClick={onPlayAgain}>Play Again</Button>
      <Button onClick={onChangeUser}>Play as a different user</Button>
    </div>
  );
}
