import { motion } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { useGameData } from "~/app/_context/game-context";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function GameOverDisplay() {
  const { score, resetGame, resetGameAndUser, guesses, round, username } =
    useGameData();

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 bg-zinc-800/50 text-white backdrop-blur-sm">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400/20">
            <Trophy className="h-10 w-10 text-yellow-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Quiz Complete!</h2>
          <p className="mb-6 text-center text-zinc-400">
            Congratulations {username}
          </p>
          <p className="mb-6 text-center text-zinc-400">You scored {score}!</p>
          <p className="mb-6 text-center text-zinc-400">
            You made {guesses} guesses over the {round} rounds!
          </p>

          <Button
            onClick={resetGame}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Play again
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={resetGameAndUser}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
          >
            Play again as a different user
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
