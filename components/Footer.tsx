"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <footer className="bg-light py-4">
      <div className="container d-flex justify-content-between align-items-center small flex-wrap">
        <div className="text-muted">
          © {new Date().getFullYear()} Upgrowplan. All rights reserved.
        </div>
        <ul className="list-inline mb-0" style={{ marginBottom: 0 }}>
          <li className="list-inline-item">
            <Link href="/" style={{ textDecoration: "none", color: "#0785f6" }}>
              Home
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/products"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Products
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/solutions"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Solutions
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/about"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              About
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/blog"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Blog
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href="/contacts"
              style={{ textDecoration: "none", color: "#0785f6" }}
            >
              Contacts
            </Link>
          </li>
          <li className="list-inline-item">
            <Link
              href={isLoggedIn ? "/account" : "/auth"}
              style={{
                textDecoration: "none",
                color: "#0785f6",
              }}
            >
              {isLoggedIn ? "Account" : "Sign in"}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
