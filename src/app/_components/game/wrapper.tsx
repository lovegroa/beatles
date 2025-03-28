"use client";

import dynamic from "next/dynamic";
import { GameProvider } from "~/app/_context/game-context";
import type { Band } from "~/app/_schemas/band-schema";

const Game = dynamic(() => import("./game"), {
  ssr: false,
}); // The game needs to be imported dynamically to prevent hydration errors due to random number generation

export default function GameWrapper({ band }: { band: Band }) {
  return (
    <GameProvider albums={band.albums}>
      <Game band={band} />
    </GameProvider>
  );
}
