import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  text?: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({
  title,
  text,
  href,
  linkLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8">
      <div>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-primary-dark">{title}</h2>
        {text && <p className="font-sans text-primary-dark/70 mt-2 max-w-xl">{text}</p>}
      </div>
      {href && (
        <Link href={href} className="font-sans font-semibold text-accent hover:underline shrink-0">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}