import JsonLd from "@/components/JsonLd";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://construction-sites.co.uk" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://construction-sites.co.uk/terms" },
  ],
};

export const metadata = {
  title: "Terms of Service | Construction Sites",
  description:
    "Terms and conditions for using the Construction Sites website and services.",
  alternates: {
    canonical: "https://construction-sites.co.uk/terms",
  },
};

export default function TermsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbJsonLd} />

      <section className="bg-dark px-6 pt-32 pb-0 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Terms of <span className="text-hivis">Service</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-light">
          Last updated: 23 February 2026
        </p>
        <div className="construction-tape mt-12" aria-hidden="true" />
      </section>

      <section className="bg-dark px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-slate-light leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              These terms of service (&quot;Terms&quot;) govern your use of the Construction Sites
              website at <strong className="text-white">construction-sites.co.uk</strong> and
              any services provided by Construction Sites (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
              By using our website or engaging our services, you agree to these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">2. Our Services</h2>
            <p>
              We provide web design, development, hosting, and related digital services
              for construction and trade businesses. The specific scope of work for each
              client is defined in our service agreement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">3. Website Use</h2>
            <p>You agree not to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Use our website for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Reproduce, duplicate, or resell any part of our website without permission</li>
              <li>Introduce viruses, malware, or other harmful material</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">4. Service Agreements</h2>
            <p>
              Our web design services are provided under a separate service agreement
              between Construction Sites and the client. That agreement sets out the
              specific terms including pricing, deliverables, timelines, and cancellation
              terms.
            </p>
            <p className="mt-2">
              In the event of any conflict between these Terms and a signed service
              agreement, the service agreement takes precedence.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">5. Intellectual Property</h2>
            <p>
              All content on this website &mdash; including text, design, graphics, logos,
              and code &mdash; is the property of Construction Sites unless otherwise
              stated. You may not use, copy, or distribute our content without written
              permission.
            </p>
            <p className="mt-2">
              Websites we build for clients are subject to the intellectual property terms
              in the relevant service agreement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">6. Payments</h2>
            <p>
              Payment terms are set out in the individual service agreement for each client.
              All prices are in GBP and inclusive of VAT where applicable. Late payments
              may incur additional charges as outlined in the service agreement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Construction Sites shall not be
              liable for any indirect, incidental, special, or consequential damages
              arising from or related to your use of our website or services.
            </p>
            <p className="mt-2">
              We do not guarantee that our website will be available at all times or be
              free from errors. We make reasonable efforts to ensure uptime and accuracy
              but provide no warranties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We have no control
              over the content or availability of those sites and accept no responsibility
              for them.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">9. Termination</h2>
            <p>
              We reserve the right to restrict or terminate access to our website at any
              time without notice if we believe these Terms have been breached.
              Termination of web design services is governed by the relevant service
              agreement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes
              shall be subject to the exclusive jurisdiction of the courts of England
              and Wales.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">11. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this
              page with an updated date. Continued use of our website after changes
              constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">12. Contact</h2>
            <p>
              Questions about these Terms? Get in touch at{" "}
              <a href="mailto:patrick@construction-sites.co.uk" className="text-hivis hover:underline">
                patrick@construction-sites.co.uk
              </a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
