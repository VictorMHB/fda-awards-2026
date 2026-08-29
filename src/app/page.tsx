import GlassShapes from "@/components/GlassShapes";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="relative min-h-screen p-10 overflow-hidden">
      <GlassShapes />
      <h1 className="text-4xl font-title font-bold">FDA Awards 2026</h1>
      <LoginButton />
    </main>
  );
}
