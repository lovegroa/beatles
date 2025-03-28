import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Album } from "~/app/_schemas/band-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateTrivia = (album: Album): string => {
  const trivias = [
    `Did you know that ${album.name} was released in ${album.year_released}?`,
    `Did you know that ${album.name} has ${album.tracks} tracks?`,
    `Did you know that ${album.name} has a length of ${album.length}?`,
  ];
  return trivias[Math.floor(Math.random() * trivias.length)]!;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]] as [T, T];
  }
  return newArr;
};
