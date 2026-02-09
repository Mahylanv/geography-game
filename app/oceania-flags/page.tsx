import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Océanie",
  description: "Quiz des drapeaux des pays d'Océanie. Testez votre géographie en français."
};

export default function OceaniaFlagsPage() {
  return <ContinentFlagQuiz continent="Océanie" />;
}
