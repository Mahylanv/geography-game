import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Océanie",
  description: "Quiz des capitales des pays d'Océanie. Testez votre géographie en français."
};

export default function OceaniaCapitalsPage() {
  return <ContinentCapitalQuiz continent="Océanie" />;
}
