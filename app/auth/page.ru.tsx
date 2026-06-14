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

export default function AuthPageRu() {
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

          {/* Кнопка назад */}
          {canGoBack && (
            <button className={styles.backBtn} onClick={goBack} aria-label="Назад">
              ← Назад
            </button>
          )}

          {/* Главный экран */}
          {screen === "home" && (
            <div className="d-flex flex-column align-items-center gap-3">
              <h1 className="h3 text-center mb-2">Присоединяйтесь к Upgrowplan</h1>
              <p className="text-muted text-center mb-3" style={{ maxWidth: 320 }}>
                Инструменты на базе AI для анализа рынка и бизнес-планирования
              </p>
              <button
                className={`${styles.mainBtn} ${styles.loginBtn}`}
                onClick={() => setScreen("login")}
              >
                Войти
              </button>
              <button
                className={`${styles.mainBtn} ${styles.registerBtn}`}
                onClick={() => setScreen("register-options")}
              >
                Создать аккаунт
              </button>
            </div>
          )}

          {/* Вход */}
          {screen === "login" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Снова с нами? Добро пожаловать!</h2>
              <p className="text-muted text-center small mb-3">Войдите в свой аккаунт</p>

              <EmailRegisterForm mode="login" />

              <div className={styles.divider}>или</div>

              <OAuthButtons
                locale="ru"
                onError={setOauthError}
              />
              {oauthError && (
                <p className="text-danger small mt-2">{oauthError}</p>
              )}
            </div>
          )}

          {/* Выбор метода регистрации */}
          {screen === "register-options" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Создайте аккаунт</h2>
              <p className="text-muted text-center small mb-3">Выберите удобный способ</p>

              <div className={styles.methodList}>
                <button
                  className={`${styles.mainBtn} ${styles.registerBtn}`}
                  onClick={() => setScreen("register-email")}
                >
                  <MdEmail size={18} />
                  Почта и пароль
                </button>
              </div>

              <div className={styles.divider}>или через соцсеть</div>

              <OAuthButtons
                locale="ru"
                onError={setOauthError}
              />
              {oauthError && (
                <p className="text-danger small mt-2">{oauthError}</p>
              )}
            </div>
          )}

          {/* Регистрация через email */}
          {screen === "register-email" && (
            <div className={styles.scenarioWrapper}>
              <h2 className="text-center mb-1">Создайте аккаунт</h2>
              <p className="text-muted text-center small mb-3">Введите почту и придумайте пароль</p>
              <EmailRegisterForm
                mode="register"
                onRegisterDone={() => setScreen("verify-sent")}
              />
            </div>
          )}

          {/* Email отправлен */}
          {screen === "verify-sent" && (
            <div className={styles.verifyScreen}>
              <div className={styles.verifyIcon}>📬</div>
              <div className={styles.verifyTitle}>Проверьте почту</div>
              <p className={styles.verifyText}>
                Мы отправили письмо с ссылкой для подтверждения на указанный адрес.
                <br /><br />
                Перейдите по ссылке в письме — она действительна <strong>24 часа</strong>.
              </p>
              <p className="text-muted small">
                Письмо может попасть в папку «Спам» — проверьте её, если письмо не пришло.
              </p>
              <button
                className={`${styles.mainBtn} ${styles.loginBtn}`}
                onClick={() => setScreen("login")}
              >
                Перейти к входу
              </button>
            </div>
          )}

        </div>
      </main>
    </GoogleOAuthProvider>
  );
}
