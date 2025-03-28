import { useGameData } from "~/app/_context/game-context";
import type { Album } from "~/app/_schemas/band-schema";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function QuizButton({ album, index }: { album: Album; index: number }) {
  const { correctAnswerId, selectedIds, handleAnswerSelect, showTrivia } =
    useGameData();
  const isCorrect = album.cover_image_id === correctAnswerId;
  const isSelected = selectedIds.includes(album.cover_image_id);

  const classes = cn([
    "h-auto w-full justify-start border-zinc-700 px-4 py-3 text-left transition-all hover:bg-zinc-700/50 text-black hover:text-white group disabled:opacity-100",
    isSelected && isCorrect
      ? "border-green-500 bg-green-500/20 text-white"
      : "",
    isSelected && !isCorrect ? "border-red-500 bg-red-500/20 text-white" : "",
  ]);

  const disabled = isSelected || showTrivia;

  return (
    <Button
      variant="outline"
      className={classes}
      onClick={() => handleAnswerSelect(album.cover_image_id)}
      disabled={disabled}
    >
      <span className="flex items-center justify-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs text-white group-hover:bg-white group-hover:text-zinc-700">
          {/* This just adds a letter to the button e.g. a, b, c, etc. */}
          {String.fromCharCode(65 + index)}
        </span>
        {album.name}
      </span>
    </Button>
  );
}
