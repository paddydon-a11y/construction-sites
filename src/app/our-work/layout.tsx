import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Portfolio | Construction & Trade Websites We've Built",
  description:
    "Browse 2,000+ websites we've built for construction and trade businesses across the UK. Builders, roofers, electricians, plumbers and more.",
  alternates: {
    canonical: "https://construction-sites.co.uk/our-work",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "Our Work", item: "https://construction-sites.co.uk/our-work" },
  ],
};

export default function OurWorkLayout({
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
