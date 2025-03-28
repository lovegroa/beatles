import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import type { Band } from "~/app/_schemas/band_schema";
import { useGameData } from "~/app/_context/game-context";

export function GameDisplay({ band }: { band: Band }) {
  const { correctAnswerId, answers, score, handleAnswerSelect } = useGameData();
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset the loaded state when the correctAnswerId changes
  useEffect(() => {
    setIsLoaded(false);
  }, [correctAnswerId]);

  return (
    <div>
      <div className="relative h-[300px] w-[300px]">
        <Image
          key={correctAnswerId} // Forces remount for a new image
          src={`https://frontend-interview.evidentinsights.com/album_covers/${correctAnswerId}`}
          alt={`Guess the album cover for ${band.artist}`}
          fill
          style={{
            objectFit: "cover",
            transition: "opacity 0.5s ease-in-out",
            opacity: isLoaded ? 1 : 0,
          }}
          priority
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>
      <p>Which {band.artist} album cover is this?</p>
      <div className="flex flex-col gap-4">
        {answers.map((album) => (
          <Button
            key={album.cover_image_id}
            onClick={() => handleAnswerSelect(album.cover_image_id)}
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
