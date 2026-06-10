// MIT License
// Copyright (c) 2026 Sierra Leone Education Platform

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Terms of Use</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-sm text-gray-500 mb-6">Last updated: June 2026</p>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-6">
              Welcome to the Sierra Leone Education Platform. By accessing or using our platform, you agree to comply with 
              and be bound by these Terms of Use. Please read them carefully before using our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By creating an account and using the Sierra Leone Education Platform, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Use and our Privacy Policy. 
              If you do not agree to these terms, please do not use our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Copyright and Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              <strong>No Uploading Copyrighted Materials Without Permission:</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Users must not upload content that they do not own or have the right to distribute. 
              All uploaded materials must either be:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Created by the user</li>
              <li>In the public domain</li>
              <li>Licensed under an open license (such as MIT, Creative Commons) that permits sharing</li>
              <li>Used with explicit permission from the copyright holder</li>
            </ul>
            <p className="text-gray-600 mb-6">
              Users who upload copyrighted materials without permission will have their content removed and may face account suspension.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">MIT License for Platform Content</h2>
            <p className="text-gray-600 mb-6">
              The Sierra Leone Education Platform itself is licensed under the MIT License. 
              Educational resources shared on the platform are also shared under the MIT License unless otherwise specified by the uploader.
              This means:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Anyone can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the resources</li>
              <li>The license notice must be included in all copies or substantial portions of the resources</li>
              <li>The software is provided "as is" without warranty of any kind</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Guidelines</h2>
            <p className="text-gray-600 mb-4">
              <strong>No Harmful or Inappropriate Content:</strong>
            </p>
            <p className="text-gray-600 mb-6">
              Users must not upload content that is:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Illegal or violates any applicable laws or regulations</li>
              <li>Defamatory, libelous, or harmful to others</li>
              <li>Discriminatory based on race, ethnicity, gender, religion, or other protected characteristics</li>
              <li>Sexually explicit or inappropriate for educational purposes</li>
              <li>Containing malware, viruses, or harmful code</li>
              <li>Fraudulent, deceptive, or misleading</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Responsibilities</h2>
            <p className="text-gray-600 mb-4">As a user of the Sierra Leone Education Platform, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Maintain the security of your account and password</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Use the platform only for lawful educational purposes</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Not attempt to gain unauthorized access to our systems or data</li>
              <li>Not interfere with or disrupt the platform or servers</li>
              <li>Not use the platform to distribute spam or unsolicited messages</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Rights</h2>
            <p className="text-gray-600 mb-4">The Sierra Leone Education Platform reserves the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Remove any content that violates these Terms of Use</li>
              <li>Suspend or terminate accounts that violate these terms</li>
              <li>Modify or discontinue the platform at any time without notice</li>
              <li>Monitor and review content for compliance with these terms</li>
              <li>Refuse service to anyone for any reason at our discretion</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Approval</h2>
            <p className="text-gray-600 mb-6">
              All uploaded resources are subject to review by administrators before being made publicly available. 
              We reserve the right to approve or reject any content at our discretion. 
              Resources that do not meet our quality standards or violate these terms will not be approved.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">User-Generated Content</h2>
            <p className="text-gray-600 mb-6">
              Users retain ownership of the content they upload. By uploading content, you grant us a non-exclusive, 
              worldwide, royalty-free license to use, display, and distribute the content on our platform. 
              You represent and warrant that you have the right to grant this license.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments and Reviews</h2>
            <p className="text-gray-600 mb-6">
              Users may leave comments and reviews on resources. All comments must be respectful and constructive. 
              We reserve the right to remove any comments that violate these terms or are inappropriate.
              Users are responsible for the comments they post.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600 mb-6">
              The Sierra Leone Education Platform is provided "as is" without any warranties, express or implied. 
              We do not guarantee that the platform will be uninterrupted, secure, or error-free. 
              We are not responsible for the accuracy, quality, or suitability of any content uploaded by users.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              To the fullest extent permitted by law, the Sierra Leone Education Platform shall not be liable for any 
              indirect, incidental, special, or consequential damages arising from the use or inability to use our platform. 
              Our total liability shall not exceed the amount you paid, if any, to use the platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Indemnification</h2>
            <p className="text-gray-600 mb-6">
              You agree to indemnify and hold harmless the Sierra Leone Education Platform, its officers, directors, 
              employees, and agents from any claims, damages, or expenses arising from your use of the platform 
              or violation of these Terms of Use.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms of Use shall be governed by and construed in accordance with the laws of Sierra Leone. 
              Any disputes arising under these terms shall be resolved in the courts of Sierra Leone.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We may update these Terms of Use from time to time. We will notify users of significant changes 
              by posting the new terms on this page and updating the "Last updated" date. 
              Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700"><strong>Email:</strong> legal@sl-edu.sl</p>
              <p className="text-gray-700"><strong>Address:</strong> Freetown, Sierra Leone</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">SDG Alignment</h2>
            <p className="text-gray-600 mb-6">
              These Terms of Use support our commitment to Sustainable Development Goal 4 (Quality Education) 
              by ensuring a safe, respectful, and legally compliant environment for sharing educational resources 
              across Sierra Leone.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
