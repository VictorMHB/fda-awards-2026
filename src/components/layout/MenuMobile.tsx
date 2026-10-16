"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AreaDoUsuario from "./UserMenu";

type NavLink = { href: string; label: string };

interface MenuMobileProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  // Botão do header que abre o menu: recebe o foco de volta ao fechar
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function MenuMobile({ isOpen, onClose, links, triggerRef }: MenuMobileProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Aberto: foco no primeiro link e fundo sem rolagem. Ao fechar, desfaz os dois
  useEffect(() => {
    if (!isOpen) return;
    const botao = triggerRef.current;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    navRef.current?.querySelector("a")?.focus();
    return () => {
      document.body.style.overflow = overflowAnterior;
      botao?.focus();
    };
  }, [isOpen, triggerRef]);

  // Esc fecha. Virar layout desktop também, senão o fundo ficaria travado com o menu escondido
  useEffect(() => {
    if (!isOpen) return;
    const desktop = window.matchMedia("(min-width: 80rem)");
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const largura = () => {
      if (desktop.matches) onClose();
    };
    document.addEventListener("keydown", tecla);
    desktop.addEventListener("change", largura);
    return () => {
      document.removeEventListener("keydown", tecla);
      desktop.removeEventListener("change", largura);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 xl:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen} inert={!isOpen}
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
        id="menu-mobile"
        ref={navRef}
        className={`glass-panel absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto px-8 pt-32 pb-10 transition-transform duration-300 ease-out ${
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
              className={`nav-link nav-link--stacked ${active ? "nav-link--active" : ""}`}
            >
              <span className="nav-link-label">{link.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 border-t border-foreground/15 pt-6">
          <AreaDoUsuario variante="menu" />
        </div>
      </nav>
    </div>
  );
}
