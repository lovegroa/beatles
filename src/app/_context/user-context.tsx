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

  resetUser: () => void;
  resetQuestion: (albums: Band["albums"]) => void;
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

  const resetUser = () => {
    setUsername("");
    setEmail("");
  };

  const resetQuestion: GameDataType["resetQuestion"] = useCallback((albums) => {
    const shuffledAlbums = [...albums].sort(() => Math.random() - 0.5);
    const [correctAlbum, ...randomAlbums] = shuffledAlbums.slice(0, 3);

    if (!correctAlbum) {
      throw new Error("No random album found");
    }

    const trivia1 = `Did you know that ${correctAlbum?.name} was released in ${correctAlbum?.year_released}`;
    const trivia2 = `Did you know that ${correctAlbum?.name} has ${correctAlbum?.tracks} tracks?`;
    const trivia3 = `Did you know that ${correctAlbum?.name} has a length of ${correctAlbum?.length}?`;
    const trivias = [trivia1, trivia2, trivia3] as const;
    const trivia = trivias[Math.floor(Math.random() * trivias.length)]!; // this is safe because we know the array has at least 3 elements

    const mixedAlbums = [correctAlbum, ...randomAlbums].sort(
      () => Math.random() - 0.5,
    );

    setCorrectAnswerId(correctAlbum.cover_image_id);
    setAnswers(mixedAlbums);
    setSelectedIds([]);
    setTrivia(trivia);
  }, []);

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
