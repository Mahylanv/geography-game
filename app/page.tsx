"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const title = "Bienvenue sur GeoDex";
  const highlightStart = title.indexOf("GeoDex");
  const highlightEnd = highlightStart + "GeoDex".length;

  return (
    <div className="page-shell flex flex-col items-center justify-center">
      <div className="card-frame w-full max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 shadow-md animate-bounce">
          <Image src="/logo.png" alt="Logo GeoDex" width={56} height={56} className="h-12 w-12 object-contain" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold mb-3 text-slate-900" aria-label={title}>
          <span className="wave-text">
            {title.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                aria-hidden="true"
                className={index >= highlightStart && index < highlightEnd ? "text-teal-600" : undefined}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-6">
          Testez vos connaissances en géographie avec des défis rapides et fun.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/flags" className="btn-primary text-center">
            🏳️ Quiz Drapeaux
          </Link>
          <Link href="/capitals" className="btn-secondary text-center">
            🏛️ Quiz Capitales
          </Link>
        </div>
      </div>
    </div>
  );
}
