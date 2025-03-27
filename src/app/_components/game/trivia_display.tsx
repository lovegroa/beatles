import { Button } from "~/components/ui/button";

export function TriviaDisplay({
  onContinue,
  trivia,
}: {
  trivia: string;
  onContinue: () => void;
}) {
  return (
    <div>
      <p>Correct</p>
      <p>{trivia}</p>
      <Button onClick={onContinue}>Continue</Button>
    </div>
  );
}
