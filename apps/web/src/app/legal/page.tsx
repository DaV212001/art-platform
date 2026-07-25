import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Artifex',
  description: 'Terms of Service for Artifex, the deliberate practice engine for artists.',
};

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-white/80">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Artifex (the &quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the Platform or use any of its services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Artifex provides a deliberate practice engine for artists, offering exercises, peer reviews, and tools to build a measurable track record of artistic improvement. We reserve the right to modify, suspend, or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
          <p className="mb-4">
            You must be at least 13 years old to use the Platform. You are responsible for maintaining the security of your account and password. Artifex cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. User Content</h2>
          <p className="mb-4">
            You retain all rights to any artwork, comments, or other content you submit to the Platform. By submitting content, you grant Artifex a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display the content solely for the purpose of providing and improving the Platform.
          </p>
          <p className="mb-4">
            You agree not to post any content that is abusive, threatening, defamatory, obscene, or violates any third-party intellectual property rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
          <p className="mb-4">
            The Platform and its original content, features, and functionality are owned by Artifex and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall Artifex, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
