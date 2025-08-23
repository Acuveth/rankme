import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose prose-gray max-w-none">
              {/* Information We Collect */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Database className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Age range and demographic information for assessment scoring</li>
                    <li>Email address (if you choose to save your results)</li>
                    <li>Payment information (processed securely through Stripe)</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Data</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Your responses to our 32-question life assessment</li>
                    <li>Calculated scores and percentile rankings</li>
                    <li>Progress tracking and coaching interactions (if subscribed)</li>
                    <li>Usage patterns and feature interactions</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>IP address and browser type</li>
                    <li>Device information and screen size</li>
                    <li>Cookies and local storage data</li>
                    <li>Usage analytics and performance metrics</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How We Use Your Information</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Service Delivery</h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-2 text-sm">
                      <li>Calculate your life scores and percentile rankings</li>
                      <li>Generate personalized insights and recommendations</li>
                      <li>Provide AI coaching features and progress tracking</li>
                      <li>Process payments and manage subscriptions</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Platform Improvement</h3>
                    <ul className="list-disc list-inside text-green-700 space-y-2 text-sm">
                      <li>Analyze usage patterns to improve user experience</li>
                      <li>Research and develop new features</li>
                      <li>Ensure platform security and prevent fraud</li>
                      <li>Provide customer support and technical assistance</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Protection */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How We Protect Your Data</h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="h-6 w-6 text-gray-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                      <p className="text-sm text-gray-600">All data transmitted using industry-standard encryption</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Shield className="h-6 w-6 text-gray-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Secure Storage</h4>
                      <p className="text-sm text-gray-600">Data stored in secure, monitored cloud infrastructure</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-6 w-6 text-gray-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Limited Access</h4>
                      <p className="text-sm text-gray-600">Only authorized personnel can access your information</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Users className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Data Sharing</h2>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mb-4">
                  <p className="text-orange-800 font-semibold mb-2">We do NOT sell your personal information.</p>
                  <p className="text-orange-700 text-sm">
                    Your assessment responses and personal data are never shared with third parties for marketing purposes.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Limited Sharing Scenarios:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li><strong>Service Providers:</strong> Stripe for payment processing, cloud hosting providers</li>
                      <li><strong>Aggregated Data:</strong> Anonymous, aggregate statistics for research (no personal identifiers)</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Your Rights</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Access & Download</h4>
                    <p className="text-sm text-gray-600">Request a copy of all data we have about you</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Correction</h4>
                    <p className="text-sm text-gray-600">Update or correct any inaccurate information</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                    <p className="text-sm text-gray-600">Request deletion of your account and all data</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Portability</h4>
                    <p className="text-sm text-gray-600">Export your data in a machine-readable format</p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <div className="bg-gray-100 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have questions about this Privacy Policy or want to exercise your rights, contact us at:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><strong>Email:</strong> privacy@rankme.app</p>
                    <p className="text-gray-700"><strong>Response Time:</strong> Within 72 hours</p>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 mb-3">Policy Updates</h2>
                  <p className="text-blue-800 text-sm">
                    We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
                    We'll notify users of significant changes via email or prominent notice on our platform.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}