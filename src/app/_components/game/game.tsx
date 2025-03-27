"use client";

import { useGameData } from "~/app/_context/user-context";
import type { Band } from "~/app/_schemas/band_schema";
import { UserForm } from "../user_form";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function Game({ band }: { band: Band }) {
  const {
    username,
    email,
    correctAnswerId,
    answers,
    setAnswers,
    setSelectedIds,
    selectedIds,
    setScore,
    setShowTrivia,
    resetQuestion,
    score,
    showTrivia,
    setCompletedAnswers,
    trivia,
    completedAnswers,
    showGameOver,
    resetGame,
    resetGameAndUser,
  } = useGameData();

  const { albums } = band;

  useEffect(() => {
    // 'initial render when the component is mounted'
    console.log("render");
    resetQuestion({ albums, completedAnswers: [] });
  }, [albums, resetQuestion]);

  useEffect(() => {
    // this should run only when the selectedIds change a.k.a when the user clicks on a button

    const latestAnswer = selectedIds[selectedIds.length - 1];

    // remove the selected albums from the answers
    setAnswers((prev) =>
      prev.filter((album) => !selectedIds.includes(album.cover_image_id)),
    );

    if (latestAnswer === correctAnswerId) {
      setCompletedAnswers((prev) => [...prev, latestAnswer]);
      setShowTrivia(true);
      if (selectedIds.length === 1) {
        // if the user got it right on their first try add one to the score
        setScore((prev) => prev + 1);
      }
    }
  }, [
    albums,
    correctAnswerId,
    resetQuestion,
    selectedIds,
    setAnswers,
    setScore,
    setShowTrivia,
    setCompletedAnswers,
  ]);

  useEffect(() => {
    if (!showTrivia) {
      resetQuestion({ albums, completedAnswers });
    }
  }, [albums, completedAnswers, resetQuestion, showTrivia]);

  if (!username || !email) {
    return <UserForm />;
  }

  if (showTrivia) {
    return (
      <div>
        <p>Correct</p>
        <p>{trivia}</p>
        <Button onClick={() => setShowTrivia(false)}>Continue</Button>
      </div>
    );
  }

  if (showGameOver) {
    return (
      <div className="flex flex-col gap-4">
        <p>Game Over your score was {score}</p>
        <Button onClick={() => resetGame()}>Play Again</Button>
        <Button onClick={() => resetGameAndUser()}>
          Play as a different user
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Image
        src={`https://frontend-interview.evidentinsights.com/album_covers/${correctAnswerId}`}
        alt={`guess the album cover for ${band.artist}`}
        width={300}
        height={300}
      />
      Which beatles album cover is this?
      <div className="flex flex-col gap-4">
        {answers.map((album) => (
          <Button
            onClick={() => {
              setSelectedIds((prev) => prev.concat(album.cover_image_id));
            }}
            key={album.cover_image_id}
            className="flex gap-4"
          >
            {album.name}
          </Button>
        ))}
      </div>
      <div>{score}</div>
    </div>
  );
}
