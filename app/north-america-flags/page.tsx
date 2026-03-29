import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Amérique du Nord",
  description: "Quiz des drapeaux des pays d'Amérique du Nord. Testez votre géographie en français."
};

export default function NorthAmericaFlagsPage() {
  return <ContinentFlagQuiz continent="Amérique du Nord" />;
}
