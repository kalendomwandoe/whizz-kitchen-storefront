
interface ProseProps {
  paragraphs: string[];
  tone?: "default" | "light"; // "light" is for use on dark backgrounds
  className?: string;
}

export default function Prose({
  paragraphs,
  tone = "default",
  className = "",
}: ProseProps) {
  const color =
    tone === "light"
      ? "text-cream/80"
      : "text-primary-dark/80";

  return (
    <div
      className={`flex flex-col gap-4 font-sans leading-relaxed ${color} ${className}`}
    >
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}