"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Band } from "../_schemas/band_schema";

interface GameDataType {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;

  email: string;
  setEmail: Dispatch<SetStateAction<string>>;

  selectedIds: number[];
  setSelectedIds: Dispatch<SetStateAction<number[]>>;

  correctAnswerId: number;
  setCorrectAnswerId: Dispatch<SetStateAction<number>>;

  answers: Band["albums"];
  setAnswers: Dispatch<SetStateAction<Band["albums"]>>;

  score: number;
  setScore: Dispatch<SetStateAction<number>>;

  showTrivia: boolean;
  setShowTrivia: Dispatch<SetStateAction<boolean>>;

  trivia: string;
  setTrivia: Dispatch<SetStateAction<string>>;

  completedAnswers: number[];
  setCompletedAnswers: Dispatch<SetStateAction<number[]>>;

  showGameOver: boolean;
  setShowGameOver: Dispatch<SetStateAction<boolean>>;

  resetUser: () => void;
  resetQuestion: ({
    albums,
    completedAnswers,
  }: {
    albums: Band["albums"];
    completedAnswers: number[];
  }) => void;
  resetGame: () => void;
  resetGameAndUser: () => void;
}

const GameContext = createContext<GameDataType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>("Alex");
  const [email, setEmail] = useState<string>("lovegroa@gmail.com");
  const [answers, setAnswers] = useState<Band["albums"]>([]);
  const [correctAnswerId, setCorrectAnswerId] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showTrivia, setShowTrivia] = useState<boolean>(false);
  const [trivia, setTrivia] = useState<string>("");
  const [completedAnswers, setCompletedAnswers] = useState<number[]>([]);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);

  const resetGame = useCallback(() => {
    setUsername("Alex");
    setEmail("lovegroa@gmail.com");
    setAnswers([]);
    setCorrectAnswerId(0);
    setScore(0);
    setSelectedIds([]);
    setShowTrivia(false);
    setTrivia("");
    setCompletedAnswers([]);
    setShowGameOver(false);
  }, []);

  const resetGameAndUser = () => {
    resetGame();
    resetUser();
  };

  const resetUser = () => {
    setUsername("");
    setEmail("");
  };

  const resetQuestion: GameDataType["resetQuestion"] = useCallback(
    ({ albums, completedAnswers }) => {
      console.log("resetQuestion");
      const remainingAlbums = albums.filter(
        (album) => !completedAnswers.includes(album.cover_image_id),
      );
      const shuffledAlbums = [...remainingAlbums].sort(
        () => Math.random() - 0.5,
      );
      const [correctAlbum, ...randomAlbums] = shuffledAlbums.slice(0, 3);

      if (!correctAlbum) {
        // we've reached the end of the game
        setShowGameOver(true);
        return;
        throw new Error("No random album found");
      }

      // if there's less than 3 albums, add some more, but exclude anything that's already in the random albums

      const idsToExclude = randomAlbums
        .map((album) => album.cover_image_id)
        .concat(correctAlbum.cover_image_id);
      const additionalAlbums = albums
        .filter((album) => !idsToExclude.includes(album.cover_image_id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - idsToExclude.length);
      randomAlbums.push(...additionalAlbums);

      const trivia1 = `Did you know that ${correctAlbum.name} was released in ${correctAlbum.year_released}`;
      const trivia2 = `Did you know that ${correctAlbum.name} has ${correctAlbum.tracks} tracks?`;
      const trivia3 = `Did you know that ${correctAlbum.name} has a length of ${correctAlbum.length}?`;
      const trivias = [trivia1, trivia2, trivia3] as const;
      const trivia = trivias[Math.floor(Math.random() * trivias.length)]!; // this is safe because we know the array has at least 3 elements

      const mixedAlbums = [correctAlbum, ...randomAlbums].sort(
        () => Math.random() - 0.5,
      );

      setCorrectAnswerId(correctAlbum.cover_image_id);
      setAnswers(mixedAlbums);
      setSelectedIds([]);
      setTrivia(trivia);
    },
    [],
  );

  return (
    <GameContext.Provider
      value={{
        username,
        email,
        setUsername,
        setEmail,
        correctAnswerId,
        setCorrectAnswerId,
        answers,
        setAnswers,
        score,
        setScore,
        selectedIds,
        setSelectedIds,
        showTrivia,
        setShowTrivia,
        resetUser,
        resetQuestion,
        trivia,
        setTrivia,
        completedAnswers,
        setCompletedAnswers,
        showGameOver,
        setShowGameOver,
        resetGame,
        resetGameAndUser,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameData() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameData must be used within a GameProvider");
  }
  return context;
}
