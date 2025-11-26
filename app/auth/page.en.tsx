"use client";

import { useState } from "react";
import Header from "../../components/Header";
import { CSSTransition } from "react-transition-group";
import styles from "./auth.module.css";
import EmailRegisterForm from "./EmailRegisterForm";

export default function AuthPage() {
  const [scenario, setScenario] = useState<"none" | "login" | "register">(
    "none"
  );

  return (
    <>
      <Header />
      <div className={`container py-5 ${styles.authPage}`}>
        {/* Scenario selection screen */}
        {scenario === "none" && (
          <div className="d-flex flex-column align-items-center gap-3">
            <h1 className="h3 text-center mb-4">Join Upgrowplan</h1>
            <button
              className={`${styles.mainBtn} ${styles.loginBtn}`}
              onClick={() => setScenario("login")}
            >
              Login
            </button>
            <button
              className={`${styles.mainBtn} ${styles.registerBtn}`}
              onClick={() => setScenario("register")}
            >
              Create account
            </button>
          </div>
        )}

        {/* Back button */}
        {scenario !== "none" && (
          <button
            className={styles.backBtn}
            onClick={() => setScenario("none")}
            aria-label="Back to selection"
          >
            &lt;
          </button>
        )}

        {/* Сценарий Входа */}
        {scenario === "login" && (
          <div className={`${styles.scenarioWrapper} login`}>
            <h2 className="text-center mb-3">Back with us? Welcome!</h2>
            <CSSTransition
              in={scenario === "login"}
              timeout={300}
              classNames={{
                enter: styles.fadeSlideEnter,
                enterActive: styles.fadeSlideEnterActive,
                exit: styles.fadeSlideExit,
                exitActive: styles.fadeSlideExitActive,
              }}
              unmountOnExit
            >
              <div>
                <EmailRegisterForm mode="login" />
              </div>
            </CSSTransition>
          </div>
        )}

        {/* Сценарий Регистрации */}
        {scenario === "register" && (
          <div className={styles.scenarioWrapper}>
            <h2 className="text-center mb-3">
              Create an account in a few clicks
            </h2>
            <CSSTransition
              in={scenario === "register"}
              timeout={300}
              classNames={{
                enter: styles.fadeSlideEnter,
                enterActive: styles.fadeSlideEnterActive,
                exit: styles.fadeSlideExit,
                exitActive: styles.fadeSlideExitActive,
              }}
              unmountOnExit
            >
              <div>
                <EmailRegisterForm mode="register" />
              </div>
            </CSSTransition>
          </div>
        )}
      </div>
    </>
  );
}
