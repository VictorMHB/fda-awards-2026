"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuMobile from "./MenuMobile";
import AreaDoUsuario from "./UserMenu";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/votacao", label: "VOTAÇÃO" },
  { href: "/informacoes", label: "INFORMAÇÕES" },
  { href: "/sobre", label: "SOBRE" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="glass-bar fixed inset-x-0 top-0 z-50">
        <div className="flex h-20 items-center justify-between px-5 md:h-24 md:px-8 xl:px-24">
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

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-4 xl:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link ${active ? "nav-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="ml-6">
              <AreaDoUsuario />
            </div>
          </nav>

          {/* Botão do menu mobile */}
          <button
            ref={menuButtonRef}
            className="flex h-12 w-12 items-center justify-center text-3xl text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary xl:hidden"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <MenuMobile isOpen={menuOpen} onClose={closeMenu} links={NAV_LINKS} triggerRef={menuButtonRef} />
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