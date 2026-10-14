import LinkButton from "@/components/ui/LinkButton";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function HomeCta() {
  const whatsappUrl = buildWhatsAppUrl("Hi Whizz Kitchen! I have a question.");

  return (
    <section className="bg-primary">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-24">
        <h2 className="mb-4 font-display font-bold text-3xl text-cream md:text-4xl">
          Bring the flavour.
        </h2>
        <p className="mb-8 font-sans text-cream/80">
          Order online, and we&apos;ll confirm everything with you on WhatsApp.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href="/products">Shop Now</LinkButton>
          {whatsappUrl && <WhatsAppButton href={whatsappUrl} />}
        </div>
      </div>
    </section>
  );
}