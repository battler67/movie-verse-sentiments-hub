
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center text-movie-primary hover:text-movie-primary/80 mb-8">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="space-y-6 text-white/80">
              <div>
                <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                <p className="leading-relaxed">
                  Welcome to Moodies. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you how we handle your personal data when you visit our website and tell you about your privacy rights.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">2. The Data We Collect</h2>
                <p className="leading-relaxed">
                  Personal data means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Identity Data: including name, username or similar identifier</li>
                  <li>Contact Data: including email address</li>
                  <li>Technical Data: including IP address, browser type and version, time zone, location, operating system</li>
                  <li>Profile Data: including your reviews, comments, preferences, and feedback</li>
                  <li>Usage Data: including information about how you use our website</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
                <p className="leading-relaxed">
                  We will only use your personal data for the purposes for which we collected it, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>To register you as a new user</li>
                  <li>To manage your account and profile</li>
                  <li>To enable you to post reviews and comments</li>
                  <li>To improve our website and user experience</li>
                  <li>To recommend movies that might interest you</li>
                  <li>To ensure the security of our website</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                <p className="leading-relaxed">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
                <p className="leading-relaxed">
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">6. Your Legal Rights</h2>
                <p className="leading-relaxed">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@moodies.com.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">8. Changes to Our Privacy Policy</h2>
                <p className="leading-relaxed">
                  We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this policy.
                </p>
                <p className="mt-4 text-sm">Last Updated: April 18, 2025</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
