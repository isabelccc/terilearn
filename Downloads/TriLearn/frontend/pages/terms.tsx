import Head from 'next/head';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - TriLearn</title>
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using TriLearn, you accept and agree to be bound by the terms
                and conditions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. User Accounts</h2>
              <p>You are responsible for:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Use the service for any illegal purpose</li>
                <li>Share inappropriate or offensive content</li>
                <li>Attempt to breach or circumvent security measures</li>
                <li>Interfere with other users' use of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to our service immediately,
                without prior notice, for any reason whatsoever.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users
                of any changes by updating the date at the bottom of this page.
              </p>
              <p className="mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 