import Seo from '../components/Seo';
import { SITE_NAME } from '../lib/seo';

const SECTION_CLASS = 'mt-8';
const H2_CLASS = 'text-lg font-semibold text-slate-800';
const P_CLASS = 'mt-2 text-slate-600';
const LI_CLASS = 'mt-2 list-disc pl-5 text-slate-600';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 py-12">
      <Seo
        title="Privacy Policy"
        description={`How ${SITE_NAME} handles your data, cookies and advertising.`}
        path="/privacy"
      />
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: September 23, 2026</p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className={P_CLASS}>
            {SITE_NAME} ("we", "our", "us") provides free browser-based tools at toolzy.app. This policy explains
            what data is (and is not) collected when you use the site.
          </p>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Your files and inputs</h2>
            <p className={P_CLASS}>
              Every PDF, image, document and text tool on {SITE_NAME} runs entirely in your browser using
              client-side JavaScript. Files you select are processed locally on your device and are never uploaded
              to our servers - we don't have servers that receive them, and we can't see their contents.
            </p>
            <p className={P_CLASS}>
              The Online Notepad tool saves its content in your browser's local storage so it persists between
              visits on the same device; this data never leaves your browser.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Network requests</h2>
            <p className={P_CLASS}>
              The only tool that contacts an external service is the Currency Converter, which requests live
              exchange rates from frankfurter.app (a free, keyless public API). The currency amounts you enter are
              sent as part of that request; no other tool makes network requests with your data.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Cookies and advertising</h2>
            <p className={P_CLASS}>
              {SITE_NAME} is free to use and is supported by advertising. We use Google AdSense to display ads,
              which may use cookies and similar technologies (including the DoubleClick/Google cookie) to serve ads
              based on your prior visits to this or other websites. Google and its partners may also use this data
              to measure ad performance.
            </p>
            <ul>
              <li className={LI_CLASS}>
                You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://myadcenter.google.com/personalizationoff"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 underline hover:text-brand-700"
                >
                  Google's Ad Settings
                </a>
                .
              </li>
              <li className={LI_CLASS}>
                Third-party vendors, including Google, may show ads based on your visits to this and other sites -
                see{' '}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 underline hover:text-brand-700"
                >
                  how Google uses advertising cookies
                </a>
                .
              </li>
              <li className={LI_CLASS}>
                You can also manage cross-industry ad preferences at{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 underline hover:text-brand-700"
                >
                  aboutads.info
                </a>{' '}
                (US) or{' '}
                <a
                  href="https://www.youronlinechoices.eu/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 underline hover:text-brand-700"
                >
                  youronlinechoices.eu
                </a>{' '}
                (EU).
              </li>
            </ul>
            <p className={P_CLASS}>
              If you are visiting from the European Economic Area or the UK, ads are served only after you have
              given consent to personalized advertising through the consent banner shown on your first visit.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Analytics</h2>
            <p className={P_CLASS}>
              {SITE_NAME} does not currently use any first-party or third-party analytics service. If this changes,
              this policy will be updated first.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Children's privacy</h2>
            <p className={P_CLASS}>
              {SITE_NAME} is not directed at children under 13 and we do not knowingly collect personal information
              from children.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Changes to this policy</h2>
            <p className={P_CLASS}>
              We may update this policy from time to time. Material changes will be reflected by updating the "Last
              updated" date above.
            </p>
          </section>

          <section className={SECTION_CLASS}>
            <h2 className={H2_CLASS}>Contact</h2>
            <p className={P_CLASS}>
              Questions about this policy? Email{' '}
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
