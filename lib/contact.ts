// Single sender for every site form that posts to monitoring /api/monitoring/contact (beta requests, interest forms).
// Returns true only when monitoring answered 2xx: a sleeping/stopped dyno, a 4xx/5xx or a network/CORS error is a failure,
// and the form must show CONTACT_FAIL instead of «thank you» (26.11: forms showed success while the request was lost).

export interface ContactPayload {
  locale: "en" | "ru";
  name: string;
  email: string;
  message: string;
}

export const CONTACT_FAIL = {
  en: "Your request was not sent. Please try again in a minute or email us at info@upgrowplan.com.",
  ru: "Заявка не отправилась. Попробуйте ещё раз через минуту или напишите нам на info@upgrowplan.com.",
};

export async function sendContactRequest(payload: ContactPayload): Promise<boolean> {
  const API_BASE = process.env.NEXT_PUBLIC_MONITORING_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE}/api/monitoring/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Contact request failed:", res.status);
    return res.ok;
  } catch (err) {
    console.error("Contact request failed:", err);
    return false;
  }
}
