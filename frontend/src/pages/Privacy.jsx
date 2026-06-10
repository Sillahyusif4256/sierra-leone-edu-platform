// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-sm text-gray-500 mb-6">Last updated: June 2026</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-6">
              The Sierra Leone Education Platform ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data We Collect</h2>
            <p className="text-gray-600 mb-4">We collect the following types of personal information:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li><strong>Account Information:</strong> Name, email address, password (encrypted), profile picture</li>
              <li><strong>Content You Upload:</strong> Educational resources, files, descriptions, tags</li>
              <li><strong>Usage Data:</strong> Pages visited, resources downloaded, comments and ratings submitted</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Data</h2>
            <p className="text-gray-600 mb-4">We use your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>To provide and maintain the platform services</li>
              <li>To process and display your uploaded educational resources</li>
              <li>To enable user authentication and account management</li>
              <li>To facilitate comments, ratings, and community features</li>
              <li>To improve our services and develop new features</li>
              <li>To communicate with you about platform updates and security</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Protection Principles</h2>
            <p className="text-gray-600 mb-4">We adhere to the following data protection principles:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li><strong>Lawfulness:</strong> We collect and process data lawfully and transparently</li>
              <li><strong>Purpose Limitation:</strong> We only collect data for specific, legitimate purposes</li>
              <li><strong>Data Minimization:</strong> We only collect data that is necessary for our purposes</li>
              <li><strong>Accuracy:</strong> We ensure your data is accurate and kept up to date</li>
              <li><strong>Storage Limitation:</strong> We retain data only as long as necessary</li>
              <li><strong>Security:</strong> We implement appropriate security measures to protect your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your data in certain circumstances</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational measures to protect your personal data, including:
              encryption of passwords, secure data transmission (HTTPS), access controls, and regular security reviews.
              However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 mb-6">
              We use third-party services to operate our platform, including Cloudinary for file storage and MongoDB for data storage.
              These services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our platform is intended for educational purposes and may be used by students of all ages. 
              We do not knowingly collect personal information from children under 13 without parental consent.
              If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">International Data Transfers</h2>
            <p className="text-gray-600 mb-6">
              Your data may be transferred to and processed in countries other than Sierra Leone. 
              We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page
              and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, 
              please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700"><strong>Email:</strong> privacy@sl-edu.sl</p>
              <p className="text-gray-700"><strong>Address:</strong> Freetown, Sierra Leone</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">SDG Alignment</h2>
            <p className="text-gray-600 mb-6">
              This Privacy Policy aligns with our commitment to Sustainable Development Goal 4 (Quality Education) 
              and Goal 10 (Reduced Inequalities) by ensuring equitable access to educational resources 
              while protecting user privacy and data rights.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
