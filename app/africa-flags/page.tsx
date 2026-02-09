import type { Metadata } from "next";
import ContinentFlagQuiz from "../components/ContinentFlagQuiz";

export const metadata: Metadata = {
  title: "Drapeaux d'Afrique",
  description: "Quiz des drapeaux des pays d'Afrique. Testez votre géographie en français."
};

export default function AfricaFlagsPage() {
  return <ContinentFlagQuiz continent="Afrique" />;
}
