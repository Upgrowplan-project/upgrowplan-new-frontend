"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FaGoogle, FaGithub, FaApple, FaWindows } from "react-icons/fa";
import { oauthLogin } from "./authService";
import styles from "./auth.module.css";

interface Props {
  locale: "ru" | "en";
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

const copy = {
  ru: {
    google: "Войти через Google",
    github: "GitHub",
    apple: "Apple",
    microsoft: "Microsoft",
    soon: "скоро",
    error: "Ошибка входа через Google",
  },
  en: {
    google: "Continue with Google",
    github: "GitHub",
    apple: "Apple",
    microsoft: "Microsoft",
    soon: "soon",
    error: "Google login failed",
  },
};

export default function OAuthButtons({ locale, onSuccess, onError }: Props) {
  const router = useRouter();
  const t = copy[locale];

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const info = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        ).then((r) => r.json());

        const result = await oauthLogin(
          info.email,
          info.name || info.email,
          "GOOGLE"
        );
        localStorage.setItem("token", result.token);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("email", info.email);

        if (onSuccess) onSuccess();
        else router.push("/account");
      } catch (err: any) {
        onError?.(err.message || t.error);
      }
    },
    onError: () => onError?.(t.error),
  });

  return (
    <div className={styles.methodList}>
      <button
        type="button"
        className={`${styles.mainBtn} ${styles.googleBtn}`}
        onClick={() => googleLogin()}
      >
        <FaGoogle size={17} />
        {t.google}
      </button>

      <button
        type="button"
        className={`${styles.mainBtn} ${styles.githubBtn}`}
        disabled
        title="Coming soon"
      >
        <FaGithub size={17} />
        {t.github}
        <span className={styles.comingSoon}>{t.soon}</span>
      </button>

      <button
        type="button"
        className={`${styles.mainBtn} ${styles.appleBtn}`}
        disabled
        title="Coming soon"
      >
        <FaApple size={17} />
        {t.apple}
        <span className={styles.comingSoon}>{t.soon}</span>
      </button>

      <button
        type="button"
        className={`${styles.mainBtn} ${styles.microsoftBtn}`}
        disabled
        title="Coming soon"
      >
        <FaWindows size={17} />
        {t.microsoft}
        <span className={styles.comingSoon}>{t.soon}</span>
      </button>
    </div>
  );
}
