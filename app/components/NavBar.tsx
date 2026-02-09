"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "🏠 Accueil" },
  { href: "/dle", label: "🌍 Daily Dle" },
  { href: "/flags", label: "🏳️ Quiz Drapeaux" },
  { href: "/capitals", label: "🏛️ Quiz Capitales" },
  { href: "/blurred-flags", label: "🌫️ Drapeau Flou" },
  { href: "/borders", label: "🧭 Frontières" },
  { href: "/countries", label: "📚 Pays" }
];

const FLAG_CONTINENTS = [
  { href: "/europe-flags", label: "🇪🇺 Europe" },
  { href: "/africa-flags", label: "🌍 Afrique" },
  { href: "/asia-flags", label: "🌏 Asie" },
  { href: "/north-america-flags", label: "🌎 Amérique du Nord" },
  { href: "/south-america-flags", label: "🌎 Amérique du Sud" },
  { href: "/oceania-flags", label: "🌊 Océanie" }
];

const CAPITAL_CONTINENTS = [
  { href: "/europe-capitals", label: "🇪🇺 Europe" },
  { href: "/africa-capitals", label: "🌍 Afrique" },
  { href: "/asia-capitals", label: "🌏 Asie" },
  { href: "/north-america-capitals", label: "🌎 Amérique du Nord" },
  { href: "/south-america-capitals", label: "🌎 Amérique du Sud" },
  { href: "/oceania-capitals", label: "🌊 Océanie" }
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isFlagsDropdownOpen, setIsFlagsDropdownOpen] = useState(false);
  const [isCapitalsDropdownOpen, setIsCapitalsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsFlagsDropdownOpen(false);
        setIsCapitalsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const linkClass = (href: string) =>
    `px-4 py-2 rounded ${pathname === href ? "bg-blue-800" : "hover:bg-gray-700"}`;

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-0">
        <Link href="/" className="text-lg font-semibold">
          GeoDex
        </Link>

        <div className="hidden md:flex flex-1 justify-center gap-6">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}

          <div className="relative group">
            <button className="px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2">
              🏳️ Drapeaux ▾
            </button>
            <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56 hidden group-hover:block">
              {FLAG_CONTINENTS.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-2 hover:bg-gray-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2">
              🏛️ Capitales ▾
            </button>
            <div className="absolute top-10 left-0 bg-gray-800 rounded shadow-lg py-2 w-56 hidden group-hover:block">
              {CAPITAL_CONTINENTS.map((item) => (
                <Link key={item.href} href={item.href} className="block px-4 py-2 hover:bg-gray-700">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <button className="md:hidden focus:outline-none text-2xl z-[100]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden pt-20 fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center space-y-6 py-10 z-50">
          <div className="flex flex-col items-center space-y-4 text-lg">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xl hover:text-lime-400"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="w-full">
                <button
                  onClick={() => setIsFlagsDropdownOpen(!isFlagsDropdownOpen)}
                  className="text-xl rounded hover:bg-gray-700 px-4 py-2 w-full"
                >
                  🏳️ Drapeaux ▾
                </button>
                {isFlagsDropdownOpen && (
                  <div className="w-full rounded shadow-lg py-2 text-center">
                    {FLAG_CONTINENTS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 hover:bg-gray-700"
                        onClick={() => setIsFlagsDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full">
                <button
                  onClick={() => setIsCapitalsDropdownOpen(!isCapitalsDropdownOpen)}
                  className="text-xl rounded hover:bg-gray-700 px-4 py-2 w-full"
                >
                  🏛️ Capitales ▾
                </button>
                {isCapitalsDropdownOpen && (
                  <div className="w-full rounded shadow-lg py-2 text-center">
                    {CAPITAL_CONTINENTS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 hover:bg-gray-700"
                        onClick={() => setIsCapitalsDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </nav>
  );
}
