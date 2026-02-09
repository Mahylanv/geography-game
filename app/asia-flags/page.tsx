import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Asie",
  description: "Quiz des drapeaux des pays d'Asie. Testez votre géographie en français."
};

export default function AsiaFlagsPage() {
  return <ContinentFlagQuiz continent="Asie" />;
}
