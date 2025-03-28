"use client";

import { useGameData } from "~/app/_context/game-context";
import type { Band } from "~/app/_schemas/band_schema";
import { UserForm } from "../user_form";
import { GameDisplay } from "./game_display";
import { GameOverDisplay } from "./game_over_display";
import { TriviaDisplay } from "./trivia_display";

export default function Game({ band }: { band: Band }) {
  const { username, email, showTrivia, showGameOver } = useGameData();

  if (!username || !email) return <UserForm />;
  if (showTrivia) return <TriviaDisplay />;
  if (showGameOver) return <GameOverDisplay />;

  return <GameDisplay band={band} />;
}
