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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 bg-zinc-800/50 text-white backdrop-blur-sm">
        <CardHeader className="relative w-full overflow-hidden p-0">
          <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
            <AnimatePresence mode="wait">
              {showTrivia ? (
                <motion.div
                  layout
                  className="absolute inset-0 h-full p-4"
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
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={`https://frontend-interview.evidentinsights.com/album_covers/${correctAnswerId}`}
                    alt={`Guess the album cover`}
                    fill
                    className="p-4"
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
        <CardContent className="p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Round {round}: Which album cover is this?
          </h2>
          <div className="space-y-3">
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
