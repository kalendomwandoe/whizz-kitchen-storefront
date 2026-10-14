import { LegalDoc } from "@/lib/legal-content";
import Prose from "@/components/ui/Prose";
import PageBand from "@/components/ui/PageBand";

const listClass =
  "list-disc pl-5 flex flex-col gap-2 font-sans text-primary-dark/80 leading-relaxed";

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageBand narrow title={doc.title} text={`Last updated: ${doc.lastUpdated}`} />

      <article className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
        <Prose paragraphs={doc.intro} className="mb-10" />

        <div className="flex flex-col gap-8">
          {doc.sections.map((section, i) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <h2 className="font-display font-bold text-xl text-primary-dark">
                {i + 1}. {section.heading}
              </h2>
              {section.paragraphs && <Prose paragraphs={section.paragraphs} />}
              {section.bullets && section.bullets.length > 0 && (
                <ul className={listClass}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.closing && <Prose paragraphs={section.closing} />}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}