import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Europe",
  description: "Quiz des drapeaux des pays d'Europe. Testez votre géographie en français."
};

export default function EuropeFlagsPage() {
  return <ContinentFlagQuiz continent="Europe" />;
}
