"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Album } from "../_schemas/band-schema";
import { generateTrivia, shuffleArray } from "~/lib/utils";

// Types

type GameState = {
  username: string;
  email: string;
  selectedIds: number[];
  correctAnswerId: number;
  answers: Album[];
  score: number;
  showTrivia: boolean;
  showWrongAnswer: boolean;
  trivia: string;
  completedAnswers: number[];
  showGameOver: boolean;
  guesses: number;
  round: number;
};

type ResetQuestionOptions = {
  albums: Album[];
  completedAnswers: number[];
};

const INITIAL_STATE: GameState = {
  username: "",
  email: "",
  selectedIds: [],
  correctAnswerId: 0,
  answers: [],
  score: 0,
  showTrivia: false,
  trivia: "",
  completedAnswers: [],
  showGameOver: false,
  showWrongAnswer: false,
  guesses: 0,
  round: 0,
};

// Define action types for the reducer.
type Action =
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_SELECTED_IDS"; payload: number[] }
  | { type: "SET_CORRECT_ANSWER_ID"; payload: number }
  | { type: "SET_ANSWERS"; payload: Album[] }
  | { type: "SET_SCORE"; payload: number }
  | { type: "SET_SHOW_TRIVIA"; payload: boolean }
  | { type: "SET_SHOW_WRONG_ANSWER"; payload: boolean }
  | { type: "SET_TRIVIA"; payload: string }
  | { type: "SET_COMPLETED_ANSWERS"; payload: number[] }
  | { type: "SET_SHOW_GAME_OVER"; payload: boolean }
  | { type: "RESET_USER" }
  | { type: "RESET_GAME" }
  | { type: "RESET_GAME_AND_USER" }
  | { type: "HANDLE_ANSWER_SELECT"; payload: number }
  | { type: "RESET_QUESTION"; payload: ResetQuestionOptions };

// Reducer function that handles all state updates.
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };
    case "SET_CORRECT_ANSWER_ID":
      return { ...state, correctAnswerId: action.payload };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };
    case "SET_SCORE":
      return { ...state, score: action.payload };
    case "SET_SHOW_TRIVIA":
      return { ...state, showTrivia: action.payload };
    case "SET_SHOW_WRONG_ANSWER":
      return { ...state, showWrongAnswer: action.payload };
    case "SET_TRIVIA":
      return { ...state, trivia: action.payload };
    case "SET_COMPLETED_ANSWERS":
      return { ...state, completedAnswers: action.payload };
    case "SET_SHOW_GAME_OVER":
      return { ...state, showGameOver: action.payload };
    case "RESET_USER":
      return { ...state, username: "", email: "" };
    case "RESET_GAME":
      return { ...INITIAL_STATE, username: state.username, email: state.email };
    case "RESET_GAME_AND_USER":
      return { ...INITIAL_STATE, username: "", email: "" };
    case "HANDLE_ANSWER_SELECT": {
      const albumId = action.payload;
      const isFirstSelection = state.selectedIds.length === 0;
      const newSelectedIds = [...state.selectedIds, albumId];
      const isCorrect = albumId === state.correctAnswerId;
      return {
        ...state,
        // Remove the selected album from the answers.

        selectedIds: newSelectedIds,
        completedAnswers: isCorrect
          ? [...state.completedAnswers, albumId]
          : state.completedAnswers,
        showTrivia: isCorrect,
        showWrongAnswer: !isCorrect,
        guesses: state.guesses + 1,
        score: isCorrect && isFirstSelection ? state.score + 1 : state.score,
      };
    }
    case "RESET_QUESTION": {
      // slightly overengineered, but the benefit is that the user can only use the process of elimination for the final 2 questions

      const { albums, completedAnswers } = action.payload;
      // Filter out albums that have already been used.
      const remainingAlbums = albums.filter(
        (album) => !completedAnswers.includes(album.cover_image_id),
      );

      // if there are no remaining albums, the game is over
      if (remainingAlbums.length === 0) {
        return { ...state, showGameOver: true };
      }

      // shuffle the remaining albums and take the first 3, with the first being the correct answer
      const shuffledAlbums = shuffleArray(remainingAlbums);
      const initialChoices = shuffledAlbums.slice(0, 3);
      const [correctAlbum, ...wrongAnswers] = initialChoices;
      if (!correctAlbum) {
        // should be impossible to reach this point since we've already checked the length
        throw new Error("No album available for the question");
      }
      // if there's less than 3 albums, add some more, but exclude anything that's already in the random albums
      const unusedAlbums = albums.filter(
        (album) => !initialChoices.includes(album),
      );
      wrongAnswers.push(...unusedAlbums.slice(0, 2 - wrongAnswers.length));

      // Randomize the order of answer choices.
      const mixedAlbums = shuffleArray([correctAlbum, ...wrongAnswers]);

      return {
        ...state,
        round: state.round + 1,
        correctAnswerId: correctAlbum.cover_image_id,
        answers: mixedAlbums,
        selectedIds: [],
        trivia: generateTrivia(correctAlbum),
        showTrivia: false,
      };
    }
    default:
      return state;
  }
}

// Create the context interface.
interface GameContextType extends GameState {
  setUsername: Dispatch<string>;
  setEmail: Dispatch<string>;
  setSelectedIds: Dispatch<number[]>;
  setCorrectAnswerId: Dispatch<number>;
  setAnswers: Dispatch<Album[]>;
  setScore: Dispatch<number>;
  setShowTrivia: Dispatch<boolean>;
  setShowWrongAnswer: Dispatch<boolean>;
  setTrivia: Dispatch<string>;
  setCompletedAnswers: Dispatch<number[]>;
  setShowGameOver: Dispatch<boolean>;
  resetUser: () => void;
  resetQuestion: (options: ResetQuestionOptions) => void;
  resetGame: () => void;
  resetGameAndUser: () => void;
  handleAnswerSelect: (albumId: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({
  children,
  albums,
}: {
  children: ReactNode;
  albums: Album[];
}) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Dispatch wrappers
  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const resetUser = useCallback(() => {
    dispatch({ type: "RESET_USER" });
  }, []);

  const handleAnswerSelect = useCallback((albumId: number) => {
    dispatch({ type: "HANDLE_ANSWER_SELECT", payload: albumId });
  }, []);

  const resetQuestion = useCallback((options: ResetQuestionOptions) => {
    dispatch({ type: "RESET_QUESTION", payload: options });
  }, []);

  const resetGameAndUser = useCallback(() => {
    dispatch({ type: "RESET_GAME_AND_USER" });
  }, []);

  // Reset question when trivia is hidden and the game is not over.
  useEffect(() => {
    if (!state.showTrivia && !state.showGameOver) {
      resetQuestion({ albums, completedAnswers: state.completedAnswers });
    }
  }, [
    state.showTrivia,
    state.completedAnswers,
    albums,
    state.showGameOver,
    resetQuestion,
  ]);

  // Memoize the context value to reduce unnecessary re-renders.
  const contextValue = useMemo<GameContextType>(
    () => ({
      ...state,
      setUsername: (username) =>
        dispatch({ type: "SET_USERNAME", payload: username }),
      setEmail: (email) => dispatch({ type: "SET_EMAIL", payload: email }),
      setSelectedIds: (selectedIds) =>
        dispatch({ type: "SET_SELECTED_IDS", payload: selectedIds }),
      setCorrectAnswerId: (id) =>
        dispatch({ type: "SET_CORRECT_ANSWER_ID", payload: id }),
      setAnswers: (answers) =>
        dispatch({ type: "SET_ANSWERS", payload: answers }),
      setScore: (score) => dispatch({ type: "SET_SCORE", payload: score }),
      setShowTrivia: (showTrivia) =>
        dispatch({ type: "SET_SHOW_TRIVIA", payload: showTrivia }),
      setShowWrongAnswer: (showWrongAnswer) =>
        dispatch({ type: "SET_SHOW_WRONG_ANSWER", payload: showWrongAnswer }),
      setTrivia: (trivia) => dispatch({ type: "SET_TRIVIA", payload: trivia }),
      setCompletedAnswers: (completedAnswers) =>
        dispatch({ type: "SET_COMPLETED_ANSWERS", payload: completedAnswers }),
      setShowGameOver: (showGameOver) =>
        dispatch({ type: "SET_SHOW_GAME_OVER", payload: showGameOver }),
      resetUser,
      resetQuestion,
      resetGame,
      resetGameAndUser,
      handleAnswerSelect,
    }),
    [
      state,
      resetUser,
      resetQuestion,
      resetGame,
      resetGameAndUser,
      handleAnswerSelect,
    ],
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
}

export function useGameData(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameData must be used within a GameProvider");
  }
  return context;
}
