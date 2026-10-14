import { FaqGroup } from "@/lib/faq-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Prose from "@/components/ui/Prose";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-3 font-display font-bold text-xl text-primary-dark">{group.title}</h2>

          <div className="divide-y divide-primary/10 rounded-xl border border-primary/10 bg-white">
            {group.items.map((item) => {
              const whatsappUrl = item.whatsappCta
                ? buildWhatsAppUrl(`Hi Whizz Kitchen! I have a question: ${item.question}`)
                : null;

              return (
                <details key={item.question} className="group px-4 md:px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-sans font-semibold text-primary-dark [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>

                  <div className="pb-5">
                    <Prose paragraphs={item.answer} />
                    {whatsappUrl && (
                      <div className="mt-4">
                        <WhatsAppButton href={whatsappUrl} size="sm" />
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}