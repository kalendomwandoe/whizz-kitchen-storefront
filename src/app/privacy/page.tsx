import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { PRIVACY_POLICY } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Whizz Kitchen handles your personal information.",
};

export default function PrivacyPage() {
  return <LegalDocument doc={PRIVACY_POLICY} />;
}