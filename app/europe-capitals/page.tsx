import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Europe",
  description: "Quiz des capitales des pays d'Europe. Testez votre géographie en français."
};

export default function EuropeCapitalsPage() {
  return <ContinentCapitalQuiz continent="Europe" />;
}
