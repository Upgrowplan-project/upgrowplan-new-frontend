"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "../../components/Header";

//const Header = dynamic(() => import('@/components/Header'), { ssr: false });
//const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function ContactsPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    console.log("Sending message:", { name, email, message });
    alert("Message sent! (simulation)");
  };

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

        <form
          className="border p-4 rounded bg-light shadow-sm"
          style={{ maxWidth: "600px" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              className="form-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
            ></textarea>
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="policyCheck"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label className="form-check-label" htmlFor="policyCheck">
              By sending this message I have read and agree with the{" "}
              <a href="/privacy" target="_blank">
                Privacy Policy
              </a>{" "}
              and the{" "}
              <a href="/privacy" target="_blank">
                Personal Data Processing Policy
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isChecked}
          >
            Send message
          </button>
        </form>
      </main>
    </>
  );
}
