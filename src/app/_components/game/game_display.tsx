import { Button } from "~/components/ui/button";
import Image from "next/image";
import type { Band } from "~/app/_schemas/band_schema";

export function GameDisplay({
  band,
  correctAnswerId,
  answers,
  onAnswerSelect,
  score,
}: {
  band: Band;
  correctAnswerId: number;
  answers: Array<{ cover_image_id: number; name: string }>;
  onAnswerSelect: (albumId: number) => void;
  score: number;
}) {
  return (
    <div>
      <Image
        src={`https://frontend-interview.evidentinsights.com/album_covers/${correctAnswerId}`}
        alt={`Guess the album cover for ${band.artist}`}
        width={300}
        height={300}
      />
      <p>Which {band.artist} album cover is this?</p>
      <div className="flex flex-col gap-4">
        {answers.map((album) => (
          <Button
            key={album.cover_image_id}
            onClick={() => onAnswerSelect(album.cover_image_id)}
            className="flex gap-4"
          >
            {album.name}
          </Button>
        ))}
      </div>
      <div>Score: {score}</div>
    </div>
  );
}
