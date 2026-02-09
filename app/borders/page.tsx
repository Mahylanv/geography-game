import type { Metadata } from "next";
import BordersQuiz from "../components/BordersQuiz";

export const metadata: Metadata = {
  title: "Quiz Frontières",
  description: "Identifiez les pays voisins et leurs frontières. Quiz de géographie en français."
};

export default function BordersPage() {
  return <BordersQuiz />;
}
