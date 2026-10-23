// A grey placeholder shown while content loads.
// - motion-safe: only pulse when the person has NOT asked their device for less motion (§14).
// - contrast-more: a slightly stronger fill for people who asked for more contrast (§14).
// aria-hidden: screen readers skip it, because it carries no information.
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-xl bg-primary/10 contrast-more:bg-primary/20 motion-safe:animate-pulse ${className}`}
    />
  );
}