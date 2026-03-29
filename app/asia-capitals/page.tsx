import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Asie",
  description: "Quiz des capitales des pays d'Asie. Testez votre géographie en français."
};

export default function AsiaCapitalsPage() {
  return <ContinentCapitalQuiz continent="Asie" />;
}
