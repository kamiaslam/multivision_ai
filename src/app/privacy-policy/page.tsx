import Footer from '@/components/MainFooter/page'
import Header from '@/components/MainHeader/Header'
import React from 'react'

export default function page() {
  return (
    <div className='w-full overflow-hidden'>
      <Header />
      <div className="dark:bg-[#0F172A] bg-[#fff] pt-[100px] md:pb-[20px] relative">
        <div className="my-shape-top term-condition"></div>
        <div className="mx-auto max-w-5xl px-[15px] md:px-6 lg:px-10  py-16 space-y-12  relative z-10">


          <header className="text-center">
            <h1 className="text-[40px] md:text-[52px] font-instrument font-normal dark:text-white text-[#0F172A] leading-[40px] md:leading-[52px] tracking-[-3.04px] mb-[24px]">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-400">Last updated: December 2025</p>
          </header>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">1. Introduction</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              VoiceCake.io ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our AI voice automation platform and services.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-6 text-white">2. Information We Collect</h2>


            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-white">2.1 Personal Information</h3>
              <p className="text-[#B1B1B1] leading-relaxed">
                We may collect personal information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-[#B1B1B1] mt-2 space-y-1">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company information and job title</li>
                <li>Payment and billing information</li>
                <li>Account credentials and preferences</li>
              </ul>
            </div>


            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-white">2.2 Voice Data</h3>
              <p className="text-[#B1B1B1] leading-relaxed">
                Our platform processes voice data to provide AI voice automation services:
              </p>
              <ul className="list-disc pl-6 text-[#B1B1B1] mt-2 space-y-1">
                <li>Voice recordings for training and improving AI models</li>
                <li>Conversation transcripts and analytics</li>
                <li>Voice interaction patterns and preferences</li>
                <li>Audio quality metrics and performance data</li>
              </ul>
            </div>


            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">2.3 Technical Information</h3>
              <p className="text-[#B1B1B1] leading-relaxed">
                We automatically collect technical information when you use our services:
              </p>
              <ul className="list-disc pl-6 text-[#B1B1B1] mt-2 space-y-1">
                <li>Device information and IP addresses</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and service interactions</li>
                <li>Performance metrics and error logs</li>
              </ul>
            </div>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-[#B1B1B1] space-y-2">
              <li>Providing and maintaining our AI voice automation services</li>
              <li>Processing payments and managing your account</li>
              <li>Improving our AI models and voice recognition accuracy</li>
              <li>Providing customer support and technical assistance</li>
              <li>Sending service updates and important notifications</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Complying with legal obligations and protecting our rights</li>
            </ul>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">4. Data Sharing and Disclosure</h2>
            <p className="text-[#B1B1B1] leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties.
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-[#B1B1B1] space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">5. Data Security</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your
              information against unauthorized access, alteration, disclosure, or destruction.
              These measures include encryption, secure data centers, access controls, and regular security assessments.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">6. Data Retention</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              We retain your information for as long as necessary to provide our services and fulfill the purposes
              outlined in this Privacy Policy. Voice data may be retained for model improvement purposes,
              but we implement data minimization practices and anonymization where possible.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">7. Your Rights</h2>
            <p className="text-[#B1B1B1] leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-[#B1B1B1] space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">8. Cookies and Tracking</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience,
              analyze usage patterns, and provide personalized content.
              You can control cookie settings through your browser preferences.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">9. International Data Transfers</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">10. Children's Privacy</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children under 13.
              If you believe we have collected such information, please contact us immediately.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">11. Changes to This Policy</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new policy on our website and updating the "Last updated" date.
              Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>


          <section className="p-6 rounded-2xl dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A]">
            <h2 className="text-2xl font-bold heading-font mb-4 text-white">12. Contact Us</h2>
            <p className="text-[#B1B1B1] leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 dark:bg-[rgba(245,238,255,0.05)] bg-[#0F172A] rounded-lg">
              <p className="text-[#B1B1B1]"><strong>Email:</strong> kamran@voicecake.co.uk</p>
            </div>
          </section>

        </div>
      </div>
      <Footer/>
    </div>

  )
}
