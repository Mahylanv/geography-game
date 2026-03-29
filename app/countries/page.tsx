import type { Metadata } from "next";
import CountriesList from "../components/CountriesList";

export const metadata: Metadata = {
  title: "Liste des pays",
  description:
    "Explorez les pays du monde : capitales, continents, populations, langues et devises."
};

export default function CountriesPage() {
  return <CountriesList />;
}
