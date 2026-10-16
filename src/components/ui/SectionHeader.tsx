import { AeroText } from "@/components/ui/AeroText";

type SectionHeaderProps = {
  title: string;
  description?: string;
};

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <header className="mb-8 md:mb-12">
      <AeroText as="h2" className="text-3xl md:text-4xl">
        {title}
      </AeroText>
      {description && (
        <p className="mt-3 max-w-2xl text-base text-foreground/70">
          {description}
        </p>
      )}
    </header>
  );
}