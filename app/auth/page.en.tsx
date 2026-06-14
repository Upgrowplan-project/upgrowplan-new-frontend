"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MdEmail } from "react-icons/md";
import styles from "./auth.module.css";
import EmailRegisterForm from "./EmailRegisterForm";
import OAuthButtons from "./OAuthButtons";

type Screen = "home" | "login" | "register-options" | "register-email" | "verify-sent";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function AuthPageEn() {
  const [screen, setScreen] = useState<Screen>("home");
  const [oauthError, setOauthError] = useState("");

  const canGoBack = screen !== "home" && screen !== "verify-sent";

  function goBack() {
    if (screen === "login") setScreen("home");
    else if (screen === "register-options") setScreen("home");
    else if (screen === "register-email") setScreen("register-options");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <main>
        <Header />
        <div className={`container py-5 ${styles.authPage}`}>

          {canGoBack && (
            <button className={styles.backBtn} onClick={goBack} aria-label="Back">
              ← Back
            </button>
          )}

          {/* Home */}
          {screen === "home" && (
            <div className="d-flex flex-column align-items-center gap-3">
              <h1 className="h3 text-center mb-2">Join Upgrowplan</h1>
              <p className="text-muted text-center mb-3" style={{ maxWidth: 320 }}>
                AI-powered tools for market research and business planning
              </p>
              <button
                className={`${styles.mainBtn} ${styles.loginBtn}`}
                onClick={() => setScreen("login")}
              >
                Log in
              </button>
              <button
                className={`${styles.mainBtn} ${styles.registerBtn}`}
                onClick={() => setScreen("register-options")}
              >
                Create account
              </button>
            </div>
          )}

          {/* Login */}
          {screen === "login" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Welcome back!</h2>
              <p className="text-muted text-center small mb-3">Sign in to your account</p>

              <EmailRegisterForm mode="login" />

              <div className={styles.divider}>or</div>

              <OAuthButtons
                locale="en"
                onError={setOauthError}
              />
              {oauthError && (
                <p className="text-danger small mt-2">{oauthError}</p>
              )}
            </div>
          )}

          {/* Register options */}
          {screen === "register-options" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Create an account</h2>
              <p className="text-muted text-center small mb-3">Choose how you'd like to sign up</p>

              <div className={styles.methodList}>
                <button
                  className={`${styles.mainBtn} ${styles.registerBtn}`}
                  onClick={() => setScreen("register-email")}
                >
                  <MdEmail size={18} />
                  Email and password
                </button>
              </div>

              <div className={styles.divider}>or continue with</div>

              <OAuthButtons
                locale="en"
                onError={setOauthError}
              />
              {oauthError && (
                <p className="text-danger small mt-2">{oauthError}</p>
              )}
            </div>
          )}

          {/* Register email form */}
          {screen === "register-email" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Create an account</h2>
              <p className="text-muted text-center small mb-3">Enter your email and create a password</p>
              <EmailRegisterForm
                mode="register"
                onRegisterDone={() => setScreen("verify-sent")}
              />
            </div>
          )}

          {/* Verify email sent */}
          {screen === "verify-sent" && (
            <div className={styles.verifyScreen}>
              <div className={styles.verifyIcon}>📬</div>
              <div className={styles.verifyTitle}>Check your inbox</div>
              <p className={styles.verifyText}>
                We sent a verification link to your email address.
                <br /><br />
                Click the link in the email — it's valid for <strong>24 hours</strong>.
              </p>
              <p className="text-muted small">
                Don't see it? Check your spam folder just in case.
              </p>
              <button
                className={`${styles.mainBtn} ${styles.loginBtn}`}
                onClick={() => setScreen("login")}
              >
                Go to login
              </button>
            </div>
          )}

        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
