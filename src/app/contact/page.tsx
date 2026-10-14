import type { Metadata } from "next";
import Link from "next/link";
import { SITE, formatPhoneDisplay } from "@/lib/site";
import { SITE_IMAGES } from "@/lib/site-images";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import PageHero from "@/components/ui/PageHero";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Whizz Kitchen by WhatsApp, phone or email.",
};

interface ContactCardProps {
  title: string;
  detail: string;
  description: string;
  href: string;
}

function ContactCard({ title, detail, description, href }: ContactCardProps) {
  return (
    <a
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-primary/10 bg-white p-5 transition hover:border-primary hover:shadow-md"
    >
      <span className="font-sans text-sm font-semibold text-accent">{title}</span>
      <span className="break-words font-sans text-lg font-bold text-primary-dark">{detail}</span>
      <span className="font-sans text-sm text-primary-dark/60">{description}</span>
    </a>
  );
}

export default function ContactPage() {
  const whatsappUrl = buildWhatsAppUrl("Hi Whizz Kitchen! I have a question.");
  const hasCards = Boolean(SITE.phone || SITE.email);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        text="Questions about our sauces, your order, or anything else? We'd love to hear from you."
        image={SITE_IMAGES.contactHero}
      >
        {whatsappUrl && <WhatsAppButton href={whatsappUrl} />}
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        {hasCards ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {SITE.phone && (
              <ContactCard
                title="Phone"
                detail={formatPhoneDisplay(SITE.phone)}
                description="Call us directly."
                href={`tel:+${SITE.phone}`}
              />
            )}
            {SITE.email && (
              <ContactCard
                title="Email"
                detail={SITE.email}
                description="Write to us any time."
                href={`mailto:${SITE.email}`}
              />
            )}
          </div>
        ) : (
          !whatsappUrl && (
            <p className="font-sans text-primary-dark/60">Contact details are coming soon.</p>
          )
        )}

        <p className="mt-10 font-sans text-sm text-primary-dark/60">
          Looking for a quick answer? Try our{" "}
          <Link href="/faq" className="font-semibold text-accent">
            FAQ
          </Link>
          . Already ordered?{" "}
          <Link href="/track-order" className="font-semibold text-accent">
            Track your order
          </Link>
          .
        </p>
      </div>
    </>
  );
}