import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { QuizButton } from "./quiz-button";
import { TriviaDisplay } from "./trivia-display";
import Image from "next/image";
import { useGameData } from "~/app/_context/game-context";
import { useEffect, useState } from "react";

export function GameDisplay() {
  const { correctAnswerId, answers, showTrivia, round } = useGameData();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [correctAnswerId]);

  return (
    <motion.div
      key="question"
      className="h-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-h-full gap-2 overflow-hidden border-0 bg-zinc-800/50 p-0 text-white backdrop-blur-sm">
        <CardHeader className="relative w-full overflow-hidden p-0">
          <div className="relative aspect-square w-full">
            <AnimatePresence mode="wait">
              {showTrivia ? (
                <motion.div
                  layout
                  className="h-full"
                  key="trivia"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <TriviaDisplay />
                </motion.div>
              ) : (
                <motion.div
                  layout
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={`https://frontend-interview.evidentinsights.com/album_covers/${correctAnswerId}`}
                    alt={`Guess the album cover`}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "opacity 2s ease-in-out",
                      opacity: isLoaded ? 1 : 0,
                    }}
                    priority
                    onLoadingComplete={() => setIsLoaded(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          <h2 className="flex flex-col gap-0 text-xl font-semibold md:flex-row md:gap-4">
            <span>Round {round}: </span>
            <span className="nowrap">Which album cover is this?</span>
          </h2>
          <div className="flex flex-col gap-2">
            {answers.map((album, index) => (
              <QuizButton
                key={album.cover_image_id}
                album={album}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
