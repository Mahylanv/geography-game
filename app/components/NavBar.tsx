"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";

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
  const [isFlagsMenuOpen, setIsFlagsMenuOpen] = useState(false);
  const [isCapitalsMenuOpen, setIsCapitalsMenuOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartScroll = useRef(0);
  const scrollLockY = useRef(0);
  const closeFlagsTimer = useRef<number | null>(null);
  const closeCapitalsTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsFlagsDropdownOpen(false);
        setIsCapitalsDropdownOpen(false);
        setIsFlagsMenuOpen(false);
        setIsCapitalsMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollLockY.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockY.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollLockY.current) {
        window.scrollTo(0, scrollLockY.current);
      }
      scrollLockY.current = 0;
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeFlagsTimer.current) window.clearTimeout(closeFlagsTimer.current);
      if (closeCapitalsTimer.current) window.clearTimeout(closeCapitalsTimer.current);
    };
  }, []);

  function closeMenu() {
    setIsOpen(false);
    setIsFlagsDropdownOpen(false);
    setIsCapitalsDropdownOpen(false);
    setIsFlagsMenuOpen(false);
    setIsCapitalsMenuOpen(false);
    setDragOffset(0);
    setIsDragging(false);
    touchStartY.current = null;
  }

  function openFlagsMenu() {
    if (closeFlagsTimer.current) window.clearTimeout(closeFlagsTimer.current);
    setIsFlagsMenuOpen(true);
    setIsCapitalsMenuOpen(false);
  }

  function scheduleCloseFlagsMenu() {
    if (closeFlagsTimer.current) window.clearTimeout(closeFlagsTimer.current);
    closeFlagsTimer.current = window.setTimeout(() => setIsFlagsMenuOpen(false), 140);
  }

  function openCapitalsMenu() {
    if (closeCapitalsTimer.current) window.clearTimeout(closeCapitalsTimer.current);
    setIsCapitalsMenuOpen(true);
    setIsFlagsMenuOpen(false);
  }

  function scheduleCloseCapitalsMenu() {
    if (closeCapitalsTimer.current) window.clearTimeout(closeCapitalsTimer.current);
    closeCapitalsTimer.current = window.setTimeout(() => setIsCapitalsMenuOpen(false), 140);
  }

  function handleSheetTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartY.current = event.touches[0]?.clientY ?? null;
    touchStartScroll.current = sheetRef.current?.scrollTop ?? 0;
    setIsDragging(touchStartScroll.current <= 0);
  }

  function handleSheetTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (touchStartY.current === null) return;
    if (touchStartScroll.current > 0) return;
    const currentY = event.touches[0]?.clientY ?? 0;
    const delta = currentY - touchStartY.current;
    if (delta <= 0) {
      setDragOffset(0);
      return;
    }
    setDragOffset(delta);
  }

  function handleSheetTouchEnd() {
    if (dragOffset > 0) {
      const sheetHeight = sheetRef.current?.offsetHeight ?? 0;
      const threshold = Math.min(220, sheetHeight * 0.3);
      if (dragOffset > threshold) {
        closeMenu();
        touchStartY.current = null;
        return;
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartY.current = null;
  }

  const linkClass = (href: string) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      pathname === href
        ? "bg-slate-900 text-white shadow-sm shadow-slate-900/30"
        : "text-slate-700 hover:bg-slate-200/70"
    }`;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/70 backdrop-blur pt-[env(safe-area-inset-top)]">
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

            <div
              className="relative"
              onMouseEnter={openFlagsMenu}
              onMouseLeave={scheduleCloseFlagsMenu}
            >
              <button
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 flex items-center gap-2"
                aria-haspopup="true"
                aria-expanded={isFlagsMenuOpen}
                onFocus={openFlagsMenu}
              >
                🏳️ Drapeaux ▾
              </button>
              <div
                className={`absolute left-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 py-2 shadow-xl ${
                  isFlagsMenuOpen ? "block" : "hidden"
                }`}
                onMouseEnter={openFlagsMenu}
                onMouseLeave={scheduleCloseFlagsMenu}
              >
                {FLAG_CONTINENTS.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="relative"
              onMouseEnter={openCapitalsMenu}
              onMouseLeave={scheduleCloseCapitalsMenu}
            >
              <button
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 flex items-center gap-2"
                aria-haspopup="true"
                aria-expanded={isCapitalsMenuOpen}
                onFocus={openCapitalsMenu}
              >
                🏛️ Capitales ▾
              </button>
              <div
                className={`absolute left-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 py-2 shadow-xl ${
                  isCapitalsMenuOpen ? "block" : "hidden"
                }`}
                onMouseEnter={openCapitalsMenu}
                onMouseLeave={scheduleCloseCapitalsMenu}
              >
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
          className="lg:hidden fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm overscroll-contain touch-none"
          onClick={closeMenu}
        >
          <div
            ref={sheetRef}
            className="absolute inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] bottom-0 overflow-y-auto overscroll-contain touch-pan-y rounded-t-3xl bg-white px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300"
            style={{
              transform: dragOffset ? `translateY(${dragOffset}px)` : undefined,
              transition: isDragging ? "none" : "transform 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleSheetTouchEnd}
            onTouchCancel={handleSheetTouchEnd}
          >
            <div className="mb-4 h-1.5 w-12 rounded-full bg-slate-200 mx-auto" />
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
                  onClick={closeMenu}
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
                        onClick={closeMenu}
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
                        onClick={closeMenu}
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
