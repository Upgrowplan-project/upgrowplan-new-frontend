'use client';

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPageEn() {
  return (
    <div>
      <Header />
      {/* Content */}
      <main className="container py-5">
        <h1 className="mb-4" style={{ color: '#1e6078' }}>
          PRIVACY POLICY
        </h1>

        <div className="policy-text" style={{ whiteSpace: 'pre-line' }}>
{`Last updated: January 2025

1. Data Controller

This website and related online services (the "Service") are operated by an individual resident of Israel ("we", "us", "our").

Country of residence: Israel
Contact email: info@upgrowplan.com

We act as the data controller within the meaning of the Israeli Protection of Privacy Law, 1981.

2. Applicable Law

This Privacy Policy is governed by and interpreted in accordance with the laws of the State of Israel, including the Protection of Privacy Law, 1981 and related regulations.

Where applicable, this Policy is designed to align with generally accepted international data protection principles, including the General Data Protection Regulation (GDPR).

3. Information We Collect

We may collect the following categories of personal data:

Contact information (such as email address, name or username if provided)

Technical data (IP address, browser type, device information)

Usage data related to interaction with the Service

Content voluntarily submitted by users through forms or service interfaces

Cookies and similar technologies

We do not intentionally collect sensitive personal data unless explicitly provided by the user.

4. Purpose of Data Processing

Personal data is collected and processed for the following purposes:

Providing access to and operating the Service

Testing, maintaining and improving functionality

Ensuring security and preventing misuse

Communicating with users regarding the Service

Internal analytics and performance evaluation

Data is processed only to the extent necessary to achieve these purposes.

5. Legal Basis for Processing

We process personal data based on one or more of the following legal grounds:

User consent, provided through explicit actions such as accepting this Privacy Policy

Legitimate interests, including operation, security and improvement of the Service

6. Cookies

The Service may use cookies and similar technologies for basic functionality and analytics.

Users may control or disable cookies through browser settings. Disabling cookies may affect the functionality of the Service.

7. Data Sharing and Third Parties

We may share limited data with trusted third-party service providers solely for purposes such as:

Hosting and infrastructure

Analytics and performance monitoring

Technical service providers and tools used to operate the Service

Such providers process data only on our instructions and are subject to confidentiality obligations.

We do not sell personal data to third parties.

8. International Data Transfers

Data may be stored or processed on servers located outside Israel, including in jurisdictions that may have different data protection laws.

By using the Service, you consent to such transfers where required for service operation.

9. Data Retention

Personal data is retained only for as long as necessary for the purposes described in this Policy, unless a longer retention period is required or permitted by law.

Users may request deletion of their personal data as described below.

10. Data Security

We implement reasonable technical and organizational measures to protect personal data against unauthorized access, loss or misuse.

However, no method of transmission or storage is completely secure, and absolute security cannot be guaranteed.

11. User Rights

Users may have the right to:

Request access to personal data

Request correction or deletion of data

Withdraw consent at any time

Requests may be submitted by contacting us at the email address listed above. We will respond within a reasonable timeframe.

12. Children

The Service is not intended for individuals under the age of 16. We do not knowingly collect personal data from minors.

13. Changes to This Policy

We may update this Privacy Policy from time to time. The current version will always be available on this page, with the effective date indicated above.

Continued use of the Service constitutes acceptance of the updated Policy.

14. Language

This Privacy Policy is available in multiple languages.
In the event of any inconsistency, the English version shall prevail.`}
        </div>
      </main>
      <Footer />
    </div>
  );
}
