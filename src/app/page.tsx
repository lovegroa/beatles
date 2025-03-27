import { bandSchema } from "./_schemas/band_schema";
import GameWrapper from "./_components/game/wrapper";

export default async function HomePage() {
  try {
    const data = await fetch("https://frontend-interview.evidentinsights.com", {
      next: { revalidate: 300 }, // revalidate every 5 minutes
    });
    const result = bandSchema.safeParse(await data.json());

    if (!result.success) {
      console.error(result.error);
      return <ErrorComponent />;
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <GameWrapper band={result.data} />
      </main>
    );
  } catch (error) {
    console.error(error);
    return <ErrorComponent />;
  }
}

function ErrorComponent() {
  return <div>The game is not currently available.</div>;
}
