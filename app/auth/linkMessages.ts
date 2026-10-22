// [22.10 · prod] a tester opened his one-time invite on the phone, then on the computer, and read «invalid or
// expired — ask the administrator»: the link was used, not expired, and he could not sign in anywhere else. User service
// now says why a one-time link was refused; this is the one text for both the invite page and the sign-in-link page.

export type Locale = "ru" | "en";

export function refusalMessage(code: string | undefined, locale: Locale): string {
  const ru = locale === "ru";
  switch (code) {
    case "INVITE_USED":
      return ru
        ? "Эта ссылка уже использована — по ней уже вошли (например, на телефоне). Она одноразовая. Чтобы войти здесь, получите новую ссылку для входа на свою почту."
        : "This link has already been used — someone signed in with it (for example, on a phone). It is one-time. To sign in here, get a new sign-in link to your email.";
    case "INVITE_EXPIRED":
      return ru
        ? "Срок действия ссылки истёк. Получите новую ссылку для входа на свою почту — или ответьте на письмо-приглашение, и мы пришлём новое."
        : "This link has expired. Get a new sign-in link to your email — or reply to the invitation email and we will send a new one.";
    case "ACCOUNT_DISABLED":
      return ru
        ? "Этот аккаунт отключён. Напишите нам на info@upgrowplan.com."
        : "This account is switched off. Please write to info@upgrowplan.com.";
    default:
      return ru
        ? "Ссылка неполная или неверная. Откройте её из письма целиком — или получите новую ссылку для входа на свою почту."
        : "The link is incomplete or wrong. Open it from the email in full — or get a new sign-in link to your email.";
  }
}

/** Store the session the same way the invite page does (refreshAccessToken.ts reads these keys). */
export function storeSession(data: { token?: string; refreshToken?: string }) {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
}
