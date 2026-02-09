import type { Metadata } from "next";
import BlurredFlagsQuiz from "../components/BlurredFlagsQuiz";

export const metadata: Metadata = {
  title: "Drapeaux Flous",
  description: "Reconnaissez les drapeaux floutés. Challenge de géographie en français."
};

export default function BlurredFlagsPage() {
  return <BlurredFlagsQuiz />;
}
