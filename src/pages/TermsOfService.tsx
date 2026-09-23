import Seo from '../components/Seo';
import { SITE_NAME } from '../lib/seo';

const SECTION_CLASS = 'mt-8';
const H2_CLASS = 'text-lg font-semibold text-slate-800';
const P_CLASS = 'mt-2 text-slate-600';

export default function TermsOfService() {
  return (
    <div className="bg-slate-50 py-12">
      <Seo
        title="Terms of Service"
        description={`The terms that apply when you use ${SITE_NAME}'s free online tools.`}
        path="/terms"
      />
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: September 23, 2026</p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className={P_CLASS}>
            By using {SITE_NAME} (toolzy.app), you agree to these terms. If you don't agree, please don't use the
            site.
          </p>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>The service</h2>
            <p className={P_CLASS}>
              {SITE_NAME} provides free, browser-based utilities (PDF tools, converters, calculators, generators and
              more) that process your input locally on your device. We don't charge for access to any tool.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Acceptable use</h2>
            <p className={P_CLASS}>
              You agree not to use {SITE_NAME} to process, generate or distribute unlawful, infringing or harmful
              content, or to attempt to disrupt, reverse-engineer, or abuse the site or the ads/third-party services
              embedded in it.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Calculators and generated output are not advice</h2>
            <p className={P_CLASS}>
              Results from calculators (loan, mortgage, GST/VAT, GPA, BMI/BMR and similar tools) are estimates for
              general informational purposes only and are not financial, medical, tax or legal advice. Verify
              important decisions with a qualified professional.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>No warranty</h2>
            <p className={P_CLASS}>
              {SITE_NAME} is provided "as is" and "as available", without warranties of any kind. We do not
              guarantee the tools will be error-free, uninterrupted, or fit for a particular purpose.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Limitation of liability</h2>
            <p className={P_CLASS}>
              To the maximum extent permitted by law, {SITE_NAME} and its operators are not liable for any indirect,
              incidental, or consequential damages arising from your use of, or inability to use, the site.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Advertising and third parties</h2>
            <p className={P_CLASS}>
              {SITE_NAME} displays ads served by Google AdSense and may link to other third-party sites (e.g. a
              support/checkout page). We're not responsible for the content, policies or practices of third-party
              sites or advertisers. See our{' '}
              <a href="/privacy" className="text-brand-600 underline hover:text-brand-700">
                Privacy Policy
              </a>{' '}
              for details on advertising cookies.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Changes</h2>
            <p className={P_CLASS}>
              We may update these terms and the site's features at any time. Continued use after changes means you
              accept the updated terms.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Contact</h2>
            <p className={P_CLASS}>
              Questions? Email{' '}
              <a href="mailto:support@toolzy.app" className="text-brand-600 underline hover:text-brand-700">
                support@toolzy.app
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
