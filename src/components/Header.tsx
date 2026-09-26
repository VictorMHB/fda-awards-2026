"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginButton from "@/components/LoginButton";
import UserMenu from "@/components/UserMenu";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/components/ui/cn";
import { IconeFechar, IconeMenu } from "@/components/ui/icons";

const links = [
  { href: "/", rotulo: "Início", exigeLogin: false },
  { href: "/votacao", rotulo: "Votação", exigeLogin: true },
  { href: "/sobre", rotulo: "Sobre", exigeLogin: false },
  { href: "/informacoes", rotulo: "Informações", exigeLogin: false },
];

function linkAtivo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AreaDoUsuario({ menuMobile }: { menuMobile: boolean }) {
  const { user, loading } = useAuth();

  if (loading) return <Skeleton className="h-9 w-32 rounded-full" />;
  if (user) return <UserMenu user={user} />;
  return <LoginButton size={menuMobile ? "md" : "sm"} className={menuMobile ? "w-full" : undefined} />;
}

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuAbertoEm, setMenuAbertoEm] = useState<string | null>(null);
  const menuAberto = menuAbertoEm === pathname;

  const linksVisiveis = links.filter((link) => !link.exigeLogin || user);

  useEffect(() => {
    if (!menuAberto) return;
    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuAbertoEm(null);
    }
    window.addEventListener("keydown", fecharComEsc);
    return () => window.removeEventListener("keydown", fecharComEsc);
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAbertoEm(null);
  }

  function alternarMenu() {
    setMenuAbertoEm(menuAberto ? null : pathname);
  }

  return (
    <header className="pointer-events-none sticky top-0 z-40 px-4 pt-3">
      <div className="glass pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-5 pr-2">
        <Link
          href="/"
          onClick={fecharMenu}
          className="flex items-baseline gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <span className="font-title text-lg font-bold tracking-[0.2em] text-primary">FDA</span>
          <span className="font-title text-xs uppercase tracking-[0.3em] text-foreground/70">Awards 2026</span>
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {linksVisiveis.map((link) => {
              const ativo = linkAtivo(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={ativo ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-4 py-2 font-title text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                      ativo ? "bg-white/10 text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {link.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:block">
          <AreaDoUsuario menuMobile={false} />
        </div>

        <button
          type="button"
          onClick={alternarMenu}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="grid size-10 place-items-center rounded-full text-foreground transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary md:hidden"
        >
          {menuAberto ? <IconeFechar /> : <IconeMenu />}
        </button>
      </div>

      {menuAberto && (
        <div
          id="menu-mobile"
          className="glass-strong pointer-events-auto mx-auto mt-2 max-w-6xl animate-menu rounded-3xl p-3 md:hidden"
        >
          <nav aria-label="Menu">
            <ul className="flex flex-col gap-1">
              {linksVisiveis.map((link) => {
                const ativo = linkAtivo(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={fecharMenu}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 font-title text-lg transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                        ativo ? "bg-white/10 text-primary" : "text-foreground/85 hover:bg-white/5"
                      )}
                    >
                      {link.rotulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-2 border-t border-white/10 px-1 pt-3">
            <AreaDoUsuario menuMobile />
          </div>
        </div>
      )}
    </header>
  );
}
