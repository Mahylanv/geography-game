import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page non trouvée",
  description: "La page demandée est introuvable sur GeoDex.",
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-center text-3xl text-red-500 mt-10">Page non trouvée</h1>
    </div>
  );
}
