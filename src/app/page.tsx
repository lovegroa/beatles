import { bandSchema } from "./_schemas/band_schema";
import GameWrapper from "./_components/game/wrapper";
import ErrorMessage from "./_components/error_message";

export const metadata = {
  title: "The Beatles Album Cover Game",
  description:
    "Test your knowledge of The Beatles Album Covers in this interactive game",
  openGraph: {
    title: "The Beatles Album Cover Game",
    description:
      "Test your knowledge of The Beatles Album Covers in this interactive game",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
};

async function fetchBandData() {
  const data = await fetch("https://frontend-interview.evidentinsights.com", {
    next: { revalidate: 300 }, // revalidate every 5 minutes
  });

  if (!data.ok) {
    throw new Error(`API returned status: ${data.status}`);
  }

  return data.json() as unknown;
}

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#1c1c1c] p-4 text-white">
      <GameContent />
    </main>
  );
}

async function GameContent() {
  try {
    const bandData = await fetchBandData();
    const result = bandSchema.safeParse(bandData);

    if (!result.success) {
      console.error("Data validation error:", result.error);
      return (
        <ErrorMessage title="Invalid Data Received">
          {"We're experiencing technical difficulties. Please try again later."}
        </ErrorMessage>
      );
    }

    return <GameWrapper band={result.data} />;
  } catch (error) {
    console.error("Failed to load game:", error);
    return <ErrorMessage />;
  }
}
