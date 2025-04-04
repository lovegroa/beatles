import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Anton, Quicksand } from "next/font/google";

export const metadata: Metadata = {
  icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
    <html
      lang="en"
      className={`${geist.variable} ${quicksand.variable} h-full w-full`}
    >
      <body className="h-full w-full">{children}</body>
    </html>
  );
}
