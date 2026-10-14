import type { Metadata } from "next";
import { FAQ_GROUPS } from "@/lib/faq-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import FaqAccordion from "@/components/faq/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Whizz Kitchen, our sauces, ordering, delivery, recipes and merchandise.",
};

export default function FaqPage() {
  const whatsappUrl = buildWhatsAppUrl("Hi Whizz Kitchen! I have a question.");

  return (
    <>
      <PageHero
              eyebrow="Frequently asked questions"
              title="Got questions? We've got flavour. Everything you need to know about Whizz Kitchen"
            />

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-12">
        <FaqAccordion groups={FAQ_GROUPS} />

        <div className="mt-12 rounded-xl bg-cream p-6 text-center">
          <h2 className="mb-2 font-display font-bold text-xl text-primary-dark">
            Still have questions?
          </h2>
          <p className="mb-5 font-sans text-primary-dark/70">
            {
              "We're happy to help. Reach out to us on WhatsApp, and let's get you closer to the flavour you're looking for."
            }
          </p>
          {whatsappUrl && <WhatsAppButton href={whatsappUrl} />}
        </div>
      </div>
    </>
  );
}