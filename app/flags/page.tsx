import type { Metadata } from "next";
import FlagsQuiz from "../components/FlagsQuiz";

export const metadata: Metadata = {
  title: "Quiz Drapeaux",
  description: "Devinez les pays à partir de leur drapeau. Quiz de géographie en français."
};

export default function FlagsPage() {
  return <FlagsQuiz />;
}
