import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Scale, CreditCard, Shield, AlertTriangle, Clock } from 'lucide-react'

export default function TermsOfServicePage() {
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
              <Scale className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using RankMe. By using our service, you agree to these terms.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose prose-gray max-w-none">
              {/* Service Description */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Service Description</h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-gray-700 mb-4">
                    RankMe is a life assessment platform that provides:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Comprehensive life assessment across 4 key areas</li>
                    <li>Percentile rankings compared to similar demographics</li>
                    <li>Detailed analysis reports (premium feature)</li>
                    <li>AI-powered coaching and action plans (subscription feature)</li>
                    <li>Progress tracking and improvement recommendations</li>
                  </ul>
                </div>
              </section>

              {/* User Obligations */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">User Obligations</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Acceptable Use</h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-2 text-sm">
                      <li>Provide accurate and honest assessment responses</li>
                      <li>Use the service for personal development purposes only</li>
                      <li>Respect the intellectual property of the platform</li>
                      <li>Not share account credentials with others</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">Prohibited Activities</h3>
                    <ul className="list-disc list-inside text-orange-700 space-y-2 text-sm">
                      <li>Attempting to reverse engineer or copy our assessment algorithms</li>
                      <li>Creating multiple accounts to circumvent limitations</li>
                      <li>Using automated tools to interact with our service</li>
                      <li>Sharing or redistributing premium content without permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Payment Terms</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Deep Analysis Report</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li><strong>Price:</strong> $29 one-time payment</li>
                      <li><strong>Access:</strong> Immediate after payment</li>
                      <li><strong>Refunds:</strong> 30-day money-back guarantee</li>
                      <li><strong>Content:</strong> Lifetime access to purchased report</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Life Coach</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li><strong>Price:</strong> $19 per month, recurring</li>
                      <li><strong>Trial:</strong> First 7 days free</li>
                      <li><strong>Cancellation:</strong> Cancel anytime, no penalty</li>
                      <li><strong>Billing:</strong> Automatic renewal until cancelled</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100 mt-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Refund Policy</h3>
                  <div className="text-green-700 text-sm space-y-2">
                    <p><strong>Deep Reports:</strong> Full refund within 30 days if not satisfied</p>
                    <p><strong>Subscriptions:</strong> Refund unused portion when cancelled</p>
                    <p><strong>Process:</strong> Contact support@rankme.app for refund requests</p>
                    <p><strong>Timeline:</strong> Refunds processed within 5-7 business days</p>
                  </div>
                </div>
              </section>

              {/* Disclaimers */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Important Disclaimers</h2>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 mb-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">Not Professional Advice</h3>
                  <p className="text-yellow-700 text-sm">
                    RankMe provides general life assessment and coaching suggestions. Our service is NOT a substitute for 
                    professional medical, psychological, financial, or legal advice. Always consult qualified professionals 
                    for specific concerns in these areas.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Accuracy of Results</h4>
                    <p className="text-sm text-gray-600">
                      Assessment results are based on self-reported information and statistical models. 
                      Results may vary and are not guarantees of future performance or outcomes.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Service Availability</h4>
                    <p className="text-sm text-gray-600">
                      We strive for 99.9% uptime but cannot guarantee uninterrupted service. 
                      We are not liable for temporary service interruptions or data loss.
                    </p>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Scale className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Intellectual Property</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Rights</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li>Assessment questions and scoring algorithms</li>
                      <li>Platform design and user interface</li>
                      <li>Coaching content and recommendations</li>
                      <li>Trademarks and branding materials</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li>Your assessment responses remain yours</li>
                      <li>Personal reports for individual use</li>
                      <li>Right to export your data</li>
                      <li>Use coaching advice for personal development</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-gray-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Account Termination</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">By You</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li>Cancel your subscription anytime from your account settings</li>
                      <li>Request account deletion by contacting support</li>
                      <li>Access to purchased reports continues even after cancellation</li>
                      <li>Coaching features end when subscription expires</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">By RankMe</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                      <li>We may terminate accounts that violate these terms</li>
                      <li>30-day notice will be provided when possible</li>
                      <li>Refunds provided for unused subscription time</li>
                      <li>You can export your data before termination</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <h2 className="text-xl font-bold text-red-900 mb-3">Limitation of Liability</h2>
                  <p className="text-red-800 text-sm mb-4">
                    RankMe's liability is limited to the amount you paid for our services in the 12 months 
                    prior to any claim. We are not liable for indirect, incidental, or consequential damages.
                  </p>
                  <p className="text-red-700 text-xs">
                    This limitation applies to the fullest extent permitted by law.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <div className="bg-gray-100 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
                  <p className="text-gray-700 mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><strong>Email:</strong> legal@rankme.app</p>
                    <p className="text-gray-700"><strong>Support:</strong> support@rankme.app</p>
                    <p className="text-gray-700"><strong>Response Time:</strong> Within 48 hours</p>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-xl font-bold text-blue-900 mb-3">Terms Updates</h2>
                  <p className="text-blue-800 text-sm">
                    We may update these Terms of Service to reflect changes in our service or legal requirements. 
                    Significant changes will be communicated via email or platform notice 30 days in advance. 
                    Continued use of RankMe after changes constitutes acceptance of new terms.
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