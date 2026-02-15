import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Get in Touch | Construction Sites",
  description:
    "Get in touch for a free quote on your construction business website. Fill in the form or message us on WhatsApp. We respond same day.",
  alternates: {
    canonical: "https://construction-sites.co.uk/contact",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://construction-sites.co.uk/contact" },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
