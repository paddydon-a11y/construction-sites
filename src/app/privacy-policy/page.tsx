import JsonLd from "@/components/JsonLd";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://construction-sites.co.uk/privacy-policy" },
  ],
};

export const metadata = {
  title: "Privacy Policy | Construction Sites",
  description:
    "How Construction Sites collects, uses, and protects your personal data.",
  alternates: {
    canonical: "https://construction-sites.co.uk/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />

      <section className="bg-dark px-6 pt-32 pb-0 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Privacy <span className="text-hivis">Policy</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-light">
          Last updated: 23 February 2026
        </p>
        <div className="construction-tape mt-12" aria-hidden="true" />
      </section>

      <section className="bg-dark px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-slate-light leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">1. Who We Are</h2>
            <p>
              Construction Sites (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a web design agency
              specialising in websites for construction and trade businesses. Our website
              is <strong className="text-white">construction-sites.co.uk</strong>.
            </p>
            <p className="mt-2">
              For any questions about this policy, contact us at{" "}
              <a href="mailto:patrick@construction-sites.co.uk" className="text-hivis hover:underline">
                patrick@construction-sites.co.uk
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">2. What Data We Collect</h2>
            <p>We may collect the following information:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Name and business name</li>
              <li>Email address and phone number</li>
              <li>Website URL and business address</li>
              <li>Information you provide via contact forms, WhatsApp, or email</li>
              <li>Usage data collected automatically (see Section 5)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <p>We use your personal data to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Respond to enquiries and provide quotes</li>
              <li>Deliver our web design and hosting services</li>
              <li>Send service-related communications</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-2">
              We will <strong className="text-white">never</strong> sell your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">4. Legal Basis for Processing</h2>
            <p>We process your data under the following legal bases (UK GDPR):</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong className="text-white">Consent</strong> &mdash; when you contact us or submit a form</li>
              <li><strong className="text-white">Contract</strong> &mdash; to deliver services you&apos;ve agreed to</li>
              <li><strong className="text-white">Legitimate interest</strong> &mdash; to improve our services and respond to enquiries</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">5. Cookies &amp; Analytics</h2>
            <p>We use the following services that may set cookies or collect usage data:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong className="text-white">Google Analytics</strong> &mdash; anonymous usage statistics</li>
              <li><strong className="text-white">Google Ads</strong> &mdash; conversion tracking</li>
              <li><strong className="text-white">TikTok Pixel</strong> &mdash; ad performance tracking</li>
              <li><strong className="text-white">Vercel Analytics</strong> &mdash; performance monitoring</li>
            </ul>
            <p className="mt-2">
              These tools collect anonymised data such as pages visited, time on site, and
              device type. You can disable cookies in your browser settings at any time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">6. Data Sharing</h2>
            <p>We may share data with:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong className="text-white">Hosting providers</strong> (Vercel) to deliver our website</li>
              <li><strong className="text-white">Analytics providers</strong> (Google, TikTok) as described above</li>
              <li><strong className="text-white">Payment processors</strong> to handle transactions</li>
            </ul>
            <p className="mt-2">
              We only share what is necessary and ensure all third parties comply with
              applicable data protection laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfil the
              purposes outlined in this policy, or as required by law. Client data is
              retained for the duration of the service agreement and up to 6 years
              afterwards for legal and accounting purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">8. Your Rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:patrick@construction-sites.co.uk" className="text-hivis hover:underline">
                patrick@construction-sites.co.uk
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">9. Complaints</h2>
            <p>
              If you&apos;re not happy with how we&apos;ve handled your data, you have the right to
              lodge a complaint with the Information Commissioner&apos;s Office (ICO) at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-hivis hover:underline">
                ico.org.uk
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Any changes will be posted on
              this page with an updated date. We encourage you to review this page
              periodically.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
