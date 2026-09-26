import { ReactNode } from "react";
import GlassPanel from "./GlassPanel";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <GlassPanel className="mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center sm:px-10">
      <h1 className="font-title text-3xl font-bold leading-tight">{title}</h1>
      <p className="mt-3 text-foreground/75">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </GlassPanel>
  );
}
