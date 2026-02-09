"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "🏠 Accueil" },
  { href: "/dle", label: "🌍 Pays mystère" },
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const linkClass = (href: string) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      pathname === href
        ? "bg-slate-900 text-white shadow-sm shadow-slate-900/30"
        : "text-slate-700 hover:bg-slate-200/70"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/70 backdrop-blur">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200/70 bg-white/80 shadow-sm">
              <Image src="/logo.png" alt="Logo GeoDex" width={32} height={32} className="h-7 w-7 object-contain" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">GeoDex</span>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}

            <div className="relative group">
              <button className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 flex items-center gap-2">
                🏳️ Drapeaux ▾
              </button>
              <div className="absolute left-0 top-11 hidden w-56 rounded-2xl border border-slate-200 bg-white/95 py-2 shadow-xl group-hover:block">
                {FLAG_CONTINENTS.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 flex items-center gap-2">
                🏛️ Capitales ▾
              </button>
              <div className="absolute left-0 top-11 hidden w-56 rounded-2xl border border-slate-200 bg-white/95 py-2 shadow-xl group-hover:block">
                {CAPITAL_CONTINENTS.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button className="lg:hidden btn-ghost text-xl" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute inset-x-0 top-16 bottom-0 overflow-y-auto rounded-t-3xl bg-white px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 h-1.5 w-12 rounded-full bg-slate-200 mx-auto" />
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 rounded-2xl border border-slate-200/80 p-3">
                <button
                  onClick={() => setIsFlagsDropdownOpen(!isFlagsDropdownOpen)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-slate-700"
                >
                  🏳️ Drapeaux <span>{isFlagsDropdownOpen ? "−" : "+"}</span>
                </button>
                {isFlagsDropdownOpen && (
                  <div className="mt-2 flex flex-col gap-1">
                    {FLAG_CONTINENTS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => {
                          setIsFlagsDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200/80 p-3">
                <button
                  onClick={() => setIsCapitalsDropdownOpen(!isCapitalsDropdownOpen)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-slate-700"
                >
                  🏛️ Capitales <span>{isCapitalsDropdownOpen ? "−" : "+"}</span>
                </button>
                {isCapitalsDropdownOpen && (
                  <div className="mt-2 flex flex-col gap-1">
                    {CAPITAL_CONTINENTS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => {
                          setIsCapitalsDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
