"use client";

import { useGameData } from "~/app/_context/game-context";
import type { Band } from "~/app/_schemas/band_schema";
import { UserForm } from "../user_form";
import { useEffect } from "react";
import { GameDisplay } from "./game_display";
import { GameOverDisplay } from "./game_over_display";
import { TriviaDisplay } from "./trivia_display";

export default function Game({ band }: { band: Band }) {
  const {
    username,
    email,
    correctAnswerId,
    answers,
    setShowTrivia,
    resetQuestion,
    score,
    showTrivia,
    trivia,
    completedAnswers,
    showGameOver,
    resetGame,
    resetGameAndUser,
    handleAnswerSelect,
  } = useGameData();

  const { albums } = band;
  useGameEffects(albums, resetQuestion, showTrivia, completedAnswers);

  // Render user form if not logged in
  if (!username || !email) {
    return <UserForm />;
  }

  // Conditional render based on game state
  if (showTrivia) {
    return (
      <TriviaDisplay trivia={trivia} onContinue={() => setShowTrivia(false)} />
    );
  }

  if (showGameOver) {
    return (
      <GameOverDisplay
        score={score}
        onPlayAgain={resetGame}
        onChangeUser={resetGameAndUser}
      />
    );
  }

  return (
    <GameDisplay
      band={band}
      correctAnswerId={correctAnswerId}
      answers={answers}
      onAnswerSelect={handleAnswerSelect}
      score={score}
    />
  );
}

function useGameEffects(
  albums: Band["albums"],
  resetQuestion: ({
    albums,
    completedAnswers,
  }: {
    albums: Band["albums"];
    completedAnswers: number[];
  }) => void,
  showTrivia: boolean,
  completedAnswers: number[],
) {
  useEffect(() => {
    // Initialise game on mount
    resetQuestion({ albums, completedAnswers: [] });
  }, [albums, resetQuestion]);

  useEffect(() => {
    // Reset question when trivia is dismissed
    if (!showTrivia) {
      resetQuestion({ albums, completedAnswers });
    }
  }, [showTrivia, albums, completedAnswers, resetQuestion]);
}
