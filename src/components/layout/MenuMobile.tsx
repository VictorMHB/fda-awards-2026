"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AreaDoUsuario from "./AreaDoUsuario";

type NavLink = { href: string; label: string };

interface MenuMobileProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export default function MenuMobile({ isOpen, onClose, links }: MenuMobileProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className={`fixed inset-0 z-40 xl:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-dark-bg/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Painel */}
      <nav
        className={`glass-panel absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-2 px-8 pt-32 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`group relative self-start py-3 text-2xl font-bold uppercase tracking-wider transition-colors duration-300 ${
                active ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 h-[3px] w-full origin-left bg-primary transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          );
        })}

        <div className="mt-4 border-t border-foreground/15 pt-6">
          <AreaDoUsuario variante="menu" />
        </div>

        <Link
          href="/votacao"
          onClick={onClose}
          className="btn-aero mt-auto mb-8 block px-5 py-4 text-center text-xl font-bold uppercase tracking-wider text-dark-bg"
        >
          Votar
        </Link>
      </nav>
    </div>
  );
}