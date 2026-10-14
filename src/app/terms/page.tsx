import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { TERMS_OF_USE } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the Whizz Kitchen website and placing orders.",
};

export default function TermsPage() {
  return <LegalDocument doc={TERMS_OF_USE} />;
}