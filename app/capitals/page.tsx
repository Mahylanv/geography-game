import type { Metadata } from "next";
import CapitalsQuiz from "../components/CapitalsQuiz";

export const metadata: Metadata = {
  title: "Quiz Capitales",
  description: "Trouvez la capitale des pays du monde. Quiz de géographie en français."
};

export default function CapitalsPage() {
  return <CapitalsQuiz />;
}
