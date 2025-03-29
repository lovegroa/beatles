"use client";

import { AnimatePresence } from "framer-motion";
import { Disc3, Trophy } from "lucide-react";
import { GameDisplay } from "./game-display";
import { GameOverDisplay } from "./game-over-display";
import { UserForm } from "./user-form";
import { useGameData } from "~/app/_context/game-context";

export default function Game() {
  const { score, showGameOver, username, email } = useGameData();

  const screenController = () => {
    if (!username || !email) return <UserForm />;
    if (showGameOver) return <GameOverDisplay />;
    return <GameDisplay />;
  };

  return (
    <div className="flex max-h-full w-full flex-col justify-center gap-6 md:w-md">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Disc3 className="h-6 w-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">Beatles Quiz</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-3 py-1">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <span className="font-medium text-white">Score: {score}</span>
        </div>
      </header>

      <AnimatePresence mode="wait">{screenController()}</AnimatePresence>
    </div>
  );
}
