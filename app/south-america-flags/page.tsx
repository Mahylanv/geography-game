import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Amérique du Sud",
  description: "Quiz des drapeaux des pays d'Amérique du Sud. Testez votre géographie en français."
};

export default function SouthAmericaFlagsPage() {
  return <ContinentFlagQuiz continent="Amérique du Sud" />;
}
