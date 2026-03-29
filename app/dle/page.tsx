import type { Metadata } from "next";
import CoutrieDle from "../components/CoutrieDle";

export const metadata: Metadata = {
  title: "Pays mystère",
  description:
    "Jeu type Wordle : devinez le pays mystère avec des indices sur la géographie."
};

export default function DlePage() {
  return <CoutrieDle />;
}
