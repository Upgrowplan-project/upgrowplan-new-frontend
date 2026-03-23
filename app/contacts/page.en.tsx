"use client";

import Header from "../../components/Header";
import ContactForm from "../../components/ContactForm";

//const Header = dynamic(() => import('@/components/Header'), { ssr: false });
//const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ContactsPage() {
  return (
    <>
      <Header />

      <main className="container my-5">
        <h1 className="mb-4" style={{ color: "#1e6078" }}>
          Contacts
        </h1>

        <div
          className="d-flex flex-wrap gap-3 mb-4"
          style={{ maxWidth: "320px" }}
        >
          <a
            href="https://web.telegram.org/a/#-2072779175389"
            target="_blank"
            className="contact-btn"
            style={{ color: "#0088cc" }}
          >
            Telegram
          </a>
          <a
            href="https://wa.me/79814504618"
            target="_blank"
            className="contact-btn"
            style={{ color: "#25d366" }}
          >
            WhatsApp
          </a>
          <a
            href="https://vk.com/im?entrypoint=community_page&media=&sel=-231175065"
            target="_blank"
            className="contact-btn"
            style={{ color: "#4a76a8" }}
          >
            VK
          </a>
          <a
            href="https://www.linkedin.com/company/upgrowplan/"
            target="_blank"
            className="contact-btn"
            style={{ color: "#0A66C2" }}
          >
            LinkedIn
          </a>
        </div>

        <ContactForm
          locale="en"
          className="border p-4 rounded bg-light shadow-sm"
          style={{ maxWidth: "600px" }}
        />
      </main>
    </>
  );
}
