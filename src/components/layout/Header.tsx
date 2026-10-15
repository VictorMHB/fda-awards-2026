"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuMobile from "./MenuMobile";
import { AeroText } from "@/components/ui/AeroText";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/votacao", label: "VOTAÇÃO" },
  { href: "/informacoes", label: "INFORMAÇÕES" },
  { href: "/sobre", label: "SOBRE" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="glass-bar fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:h-24 md:px-10">
          {/* Logo (fonte de título) */}
          <Link
  href="/"
  onClick={closeMenu}
  aria-label="FDA Awards"
  className="group flex items-center py-2"
>
  <span
    aria-hidden="true"
    className="logo-aero font-display text-3xl md:text-4xl"
  >
    <span className="logo-aero-word logo-aero-fda" data-l="FDA">
      <span className="logo-aero-face">FDA</span>
    </span>
    <span className="logo-aero-word logo-aero-awards" data-l="AWARDS">
      <span className="logo-aero-face">AWARDS</span>
    </span>
  </span>
</Link>

          {/* Navegação desktop*/}
          <nav className="hidden items-center gap-10 xl:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-lg font-bold uppercase tracking-wider transition-colors duration-300 ${
                    active
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.75 w-full origin-left bg-primary transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}

            {/* <Link
              href="/votacao"
              className="btn-aero px-7 py-3 text-lg font-bold uppercase tracking-wider text-dark-bg"
            >
              Votar
            </Link> */}
          </nav>

          {/* Botão do menu mobile */}
          <button
            className="flex h-12 w-12 items-center justify-center text-3xl text-foreground transition-colors hover:text-primary focus:outline-none xl:hidden"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <MenuMobile isOpen={menuOpen} onClose={closeMenu} links={NAV_LINKS} />
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
