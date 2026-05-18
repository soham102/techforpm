import type { Metadata } from "next";
import { ContactCard } from "@/components/contact/contact-card";

export const metadata: Metadata = {
  title: "Contact — PMverse",
  description:
    "Get in touch with Soham Chotalia. Suggestions and improvement ideas are always welcome.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <ContactCard />
    </div>
  );
}
