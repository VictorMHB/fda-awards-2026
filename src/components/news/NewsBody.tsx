import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import { NEW_TAB_HINT } from "@/lib/services/contact";

// Renderizado no servidor: o react-markdown não vai para o navegador.
// Sem rehype-raw, HTML escrito no .md aparece como texto em vez de virar HTML
const components: Components = {
  // O título do modal é o h2, então os intertítulos do texto descem um nível
  h1: "h3",
  h2: "h3",
  h3: "h4",
  a({ href = "", title, children }) {
    // "//site.com" também começa com "/", mas é link externo
    if (href.startsWith("/") && !href.startsWith("//")) {
      return <Link href={href} title={title}>{children}</Link>;
    }
    const external = /^(https?:)?\/\//.test(href);
    return (
      <a
        href={href}
        title={title}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
        {external && <span className="sr-only"> {NEW_TAB_HINT}</span>}
      </a>
    );
  },
};

export default function NewsBody({ markdown }: { markdown: string }) {
  return (
    <div className="news-prose">
      <Markdown components={components}>{markdown}</Markdown>
    </div>
  );
}
