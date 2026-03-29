import type { Metadata } from "next";
import ContinentCapitalQuiz from "../components/ContinentCapitalQuiz";

export const metadata: Metadata = {
  title: "Capitales d'Amérique du Nord",
  description: "Quiz des capitales des pays d'Amérique du Nord. Testez votre géographie en français."
};

export default function NorthAmericaCapitalsPage() {
  return <ContinentCapitalQuiz continent="Amérique du Nord" />;
}
