import "~/styles/globals.css";

import { type Metadata } from "next";
import { Anton, Quicksand } from "next/font/google";

export const metadata: Metadata = {
  icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
};

const geist = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
});
const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${quicksand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
