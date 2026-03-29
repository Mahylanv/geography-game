import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Afrique",
  description: "Quiz des capitales des pays d'Afrique. Testez votre géographie en français."
};

export default function AfricaCapitalsPage() {
  return <ContinentCapitalQuiz continent="Afrique" />;
}
