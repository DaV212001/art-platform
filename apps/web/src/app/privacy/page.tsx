import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Artifex',
  description: 'Privacy Policy for Artifex, outlining how we collect and use your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-white/80">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include your name, email address, profile picture, artwork uploads, and feedback you provide to other users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, including to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Facilitate the creation of and secure your account on our network.</li>
            <li>Identify you as a user in our system.</li>
            <li>Provide the services you request, including matching you for peer reviews.</li>
            <li>Send you related information, including confirmations, technical notices, updates, and security alerts.</li>
            <li>Respond to your comments, questions, and requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information in the following situations:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>With other users:</strong> Your profile and submitted artwork may be visible to other users for the purpose of peer review.</li>
            <li><strong>Service providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., email delivery services, image hosting).</li>
            <li><strong>Compliance with laws:</strong> We may disclose your information if we believe it is necessary to comply with a law, regulation, legal process, or governmental request.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
          <p className="mb-4">
            We retain personal data for as long as necessary to provide our services and for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our agreements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, update, or request deletion of your personal data. You can manage most of this information directly within your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us at privacy@artifex.example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
