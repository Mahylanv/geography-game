import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Amérique du Sud",
  description: "Quiz des capitales des pays d'Amérique du Sud. Testez votre géographie en français."
};

export default function SouthAmericaCapitalsPage() {
  return <ContinentCapitalQuiz continent="Amérique du Sud" />;
}
