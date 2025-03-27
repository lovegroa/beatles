import { type ReactNode } from "react";

interface ErrorMessageProps {
  title?: string;
  children?: ReactNode;
}

export default function ErrorMessage({
  title = "Oops! Something went wrong",
  children = "The game is not currently available. Please try again later.",
}: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8 text-center">
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
