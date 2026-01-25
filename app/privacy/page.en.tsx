"use client";

import { useState } from "react";
import Header from "../../components/Header";

type TabType = "privacy" | "terms" | "cookies" | "disclaimer";

export default function PrivacyPageEn() {
  const [activeTab, setActiveTab] = useState<TabType>("privacy");

  const tabs = [
    { id: "privacy" as TabType, label: "Privacy Policy" },
    { id: "terms" as TabType, label: "Terms of Service" },
    { id: "cookies" as TabType, label: "Cookie Policy" },
    { id: "disclaimer" as TabType, label: "AI Disclaimer" },
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Header />
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Legal Documents
        </h1>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid #0785f6" : "3px solid transparent",
                backgroundColor: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#0785f6" : "#666",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: activeTab === tab.id ? "600" : "500",
                transition: "all 0.3s ease",
                borderRadius: "8px 8px 0 0",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {activeTab === "privacy" && <PrivacyContent />}
          {activeTab === "terms" && <TermsContent />}
          {activeTab === "cookies" && <CookiesContent />}
          {activeTab === "disclaimer" && <DisclaimerContent />}
        </div>
      </main>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="policy-text" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
      {`Last updated: January 2025

1. Information We Collect

We collect information you provide directly to us:
• Account details (name, email address)
• Business Data: Information about your business project used for AI-powered plan generation
• Payment information (processed securely through third-party payment processors)
• Usage data and analytics

2. How We Use Data

We use your data to:
• Generate business plans via third-party AI APIs (OpenAI/Anthropic)
• Process payments and manage subscriptions
• Improve user experience and service functionality
• Communicate with you about the Service

Important: We do not sell your data or use it to train global AI models without your explicit consent.

3. Third-Party Services

We share limited data with trusted service providers:
• AI Providers (OpenAI, Anthropic) - for content generation
• Payment Processors (Stripe) - for billing
• Analytics Services - for service improvement

All providers are bound by strict confidentiality agreements.

4. Data Retention

We retain your personal data for as long as necessary to provide the Service:
• Generated business plans: Stored for 12 months after subscription expiry
• Account data: Retained while your account is active + 30 days after deletion
• Technical logs: Kept for 90 days for debugging purposes

Upon account deletion, all your business plans are permanently deleted from our servers within 72 hours.

5. Your Rights (GDPR Compliance)

You have the right to:
• Access your personal data
• Request correction or deletion
• Data portability
• Withdraw consent at any time
• Object to processing

Contact us at info@upgrowplan.com to exercise these rights.

6. Security

We use industry-standard SSL encryption and security measures to protect your business secrets and personal information.

However, no method of transmission over the Internet is 100% secure.

7. International Data Transfers

Your data may be processed on servers located outside your country of residence, including in jurisdictions with different data protection laws.

8. Children's Privacy

Our Service is not intended for individuals under 16 years of age.

9. Contact Us

For privacy-related questions, contact us at:
Email: info@upgrowplan.com`}
    </div>
  );
}

function TermsContent() {
  return (
    <div className="policy-text" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
      {`Last updated: January 2025

TERMS OF SERVICE

1. Acceptance of Terms

By accessing or using Upgrowplan (the "Service"), you agree to be bound by these Terms of Service.

2. Service Description

Upgrowplan provides AI-powered business planning tools, financial modeling, and market research services.

3. Intellectual Property & Ownership

• The User owns the generated Business Plan and all content created through the Service
• Upgrowplan owns the software, templates, algorithms, and platform
• You may use generated content for commercial purposes
• You may not resell or redistribute the Service itself

4. Payments & Subscriptions

• Subscription fees are charged in advance on a recurring basis
• All payments are processed securely through Stripe
• Refund Policy: 14-day money-back guarantee for first-time subscribers
• Prices may change with 30 days' notice

5. AI-Generated Content Disclaimer

IMPORTANT: AI can produce inaccurate or "hallucinated" information.

• We are not responsible for financial decisions made based on generated plans
• All financial projections are hypothetical estimates
• You should verify all data and consult with qualified professionals

6. User Responsibilities

You agree to:
• Provide accurate information
• Not use the Service for illegal purposes
• Not attempt to reverse-engineer or copy our algorithms
• Not share your account credentials

7. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW:
• We provide the Service "AS IS" without warranties
• We are not liable for any indirect, incidental, or consequential damages
• Our total liability shall not exceed the amount you paid for the Service

8. Termination

We reserve the right to suspend or terminate accounts that violate these Terms.

You may cancel your subscription at any time.

9. Changes to Terms

We may update these Terms from time to time. Continued use constitutes acceptance.

10. Governing Law

These Terms are governed by the laws of the State of Israel.

11. Contact

For questions about these Terms, contact:
Email: info@upgrowplan.com`}
    </div>
  );
}

function CookiesContent() {
  return (
    <div className="policy-text" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
      {`Last updated: January 2025

COOKIE POLICY

1. What Are Cookies?

Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.

2. Types of Cookies We Use

Essential Cookies (Always Active)
• Required for basic site functionality
• Enable user authentication and security
• Cannot be disabled

Analytical Cookies (Optional)
• Google Analytics - traffic analysis
• Hotjar - user behavior insights
• Help us improve the Service

Marketing Cookies (Optional)
• Facebook Pixel - advertising optimization
• Track conversions and ad performance

3. Cookie Duration

• Session cookies: Deleted when you close your browser
• Persistent cookies: Stored for up to 365 days

4. Managing Cookies

You can control cookies through:
• Our Cookie Banner (appears on first visit)
• Cookie Settings (accessible from banner)
• Your browser settings

Note: Disabling essential cookies may affect site functionality.

5. Third-Party Cookies

We use cookies from:
• Google Analytics (analytics)
• Facebook (advertising)
• Stripe (payment processing)

These services have their own privacy policies.

6. Your Consent

By clicking "Accept All" on our cookie banner, you consent to our use of all cookie categories.

You can withdraw consent at any time by clearing your browser cookies or adjusting settings in our Cookie Banner.

7. Updates to This Policy

We may update this Cookie Policy periodically. Check this page for the latest version.

8. Contact Us

Questions about our cookie practices?
Email: info@upgrowplan.com`}
    </div>
  );
}

function DisclaimerContent() {
  return (
    <div className="policy-text" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
      {`Last updated: January 2025

AI BUSINESS PLAN DISCLAIMER

⚠️ IMPORTANT NOTICE

1. For Informational Purposes Only

The business plans, financial projections, and market analysis generated by Upgrowplan (the "Service") are provided for informational and educational purposes only.

The Service uses artificial intelligence to process data and generate content.

2. No Professional Advice

The generated content does NOT constitute:
• Professional financial advice
• Legal advice
• Investment advice
• Tax advice
• Accounting services

You MUST consult with qualified professionals (accountants, lawyers, financial advisors) before making any business decisions or committing capital.

3. Accuracy of AI Output

While we strive for quality, AI models can produce:
• Inaccurate information
• Outdated data
• "Hallucinated" facts (plausible-sounding but false information)

Upgrowplan does NOT guarantee the accuracy, completeness, or reliability of any generated plan.

All financial forecasts are hypothetical estimates based on assumptions.

4. Assumption of Risk

Business ventures are inherently risky.

Upgrowplan shall NOT be held liable for:
• Financial losses
• Failed investments
• Business closures
• Missed opportunities
• Any other damages resulting from use of our generated plans

YOU USE THE SERVICE AT YOUR OWN RISK.

5. Verification Required

You are responsible for:
• Verifying all data in generated plans
• Conducting your own market research
• Validating financial assumptions
• Ensuring compliance with local laws and regulations

6. No Guarantees

We do NOT guarantee:
• Business success
• Profitability
• Investor approval
• Loan approval
• Any specific outcome

7. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW:

Our total liability for any claim arising out of the use of the Service shall not exceed the amount you paid us for the Service in the 12 months preceding the claim.

8. Professional Review Recommended

We STRONGLY RECOMMEND having any AI-generated business plan reviewed by:
• A certified accountant (for financial projections)
• A business lawyer (for legal compliance)
• An industry expert (for market assumptions)

9. Market Conditions

Business plans are based on current market conditions, which can change rapidly.

Historical data and projections do not guarantee future results.

10. Acknowledgment

By using Upgrowplan, you acknowledge that:
• You have read and understood this disclaimer
• You accept all risks associated with using AI-generated business plans
• You will seek professional advice before making business decisions

11. Contact

Questions or concerns?
Email: info@upgrowplan.com`}
    </div>
  );
}
