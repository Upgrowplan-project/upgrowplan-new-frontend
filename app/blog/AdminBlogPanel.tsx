"use client";

import { useRef, useState } from "react";
import { BilingualPost } from "./staticPosts";

interface Props {
  posts: BilingualPost[];
  onPostsChange: (posts: BilingualPost[]) => void;
}

const EMPTY_FORM = {
  slug: "",
  titleRu: "",
  titleEn: "",
  descriptionRu: "",
  descriptionEn: "",
  category: "",
  author: "Denis Naletov",
  messageRu: "",
  messageEn: "",
  createdAt: new Date().toISOString().slice(0, 16),
};

const EMOJIS = ["🚀","💡","📊","🔍","🎯","✅","❌","💰","📈","📉","🏆","🔥","⚡","🌍","💼","🤖","📝","🎬","👋","❤","👍","🤔","😄","😅","🙌","👀","🏅","💎","🛠","📌"];

// ── Formatting toolbar ────────────────────────────────────────────────────────
function FormatToolbar({
  value,
  onChange,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}) {
  const [showEmoji, setShowEmoji] = useState(false);

  function wrap(before: string, after?: string) {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e) || "текст";
    const end = after ?? before;
    const next = value.slice(0, s) + before + sel + end + value.slice(e);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    }, 0);
  }

  function bulletList() {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const selected = value.slice(s, e);
    const lines = (selected || "пункт списка")
      .split("\n")
      .map((l) => (l.startsWith("• ") ? l : `• ${l}`))
      .join("\n");
    onChange(value.slice(0, s) + lines + value.slice(e));
    setTimeout(() => el.focus(), 0);
  }

  function insertLink() {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e) || "текст ссылки";
    const url = prompt("Введите URL:", "https://") || "https://";
    const insert = `[${sel}](${url})`;
    onChange(value.slice(0, s) + insert + value.slice(e));
    setTimeout(() => el.focus(), 0);
  }

  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    onChange(value.slice(0, s) + emoji + value.slice(s));
    setShowEmoji(false);
    setTimeout(() => { el.focus(); el.setSelectionRange(s + emoji.length, s + emoji.length); }, 0);
  }

  const btnStyle: React.CSSProperties = {
    background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "0.35rem",
    padding: "0.2rem 0.5rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
    color: "#334155", lineHeight: 1,
  };

  return (
    <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.4rem", flexWrap: "wrap", position: "relative" }}>
      <button type="button" onClick={() => wrap("**")} style={btnStyle} title="Жирный">B</button>
      <button type="button" onClick={() => wrap("*")} style={{ ...btnStyle, fontStyle: "italic" }} title="Курсив">I</button>
      <button type="button" onClick={insertLink} style={btnStyle} title="Ссылка">🔗</button>
      <button type="button" onClick={bulletList} style={btnStyle} title="Маркеры">•—</button>
      <div style={{ position: "relative" }}>
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} style={btnStyle} title="Эмодзи">😊</button>
        {showEmoji && (
          <div style={{
            position: "absolute", top: "110%", left: 0, zIndex: 50,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: "0.5rem",
            padding: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.25rem",
            width: "200px", boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          }}>
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => insertEmoji(e)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: "0.1rem" }}>
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Textarea with toolbar ─────────────────────────────────────────────────────
function RichTextarea({
  value, onChange, placeholder, rows,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1px solid #cbd5e1", borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", resize: "vertical",
  };
  return (
    <div>
      <FormatToolbar value={value} onChange={onChange} textareaRef={ref} />
      <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={rows ?? 8} style={inputStyle} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminBlogPanel({ posts, onPostsChange }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleAuth() {
    if (!password.trim()) return;
    setLoading(true);
    fetch(`/api/blog/admin?password=${encodeURIComponent(password)}`)
      .then((res) => {
        setLoading(false);
        if (res.ok) { setAuthed(true); setAuthError(""); }
        else if (res.status === 401) setAuthError("Неверный пароль");
        else setAuthError("Ошибка сервера — попробуйте ещё раз");
      })
      .catch(() => { setLoading(false); setAuthError("Нет соединения с сервером"); });
  }

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, createdAt: new Date().toISOString().slice(0, 16) });
    setShowForm(true);
    setError("");
  }

  function openEdit(post: BilingualPost) {
    setEditId(post.id);
    setForm({
      slug: post.slug || "",
      titleRu: post.titleRu || "",
      titleEn: post.titleEn || "",
      descriptionRu: post.descriptionRu || "",
      descriptionEn: post.descriptionEn || "",
      category: post.category || "",
      author: post.author || "Denis Naletov",
      messageRu: post.messageRu,
      messageEn: post.messageEn,
      createdAt: post.createdAt.slice(0, 16),
    });
    setShowForm(true);
    setError("");
  }

  async function handleSave() {
    if (!form.messageRu.trim() && !form.messageEn.trim()) {
      setError("Заполните хотя бы одно поле (RU или EN)");
      return;
    }
    setLoading(true);
    setError("");
    const postData = {
      ...(editId !== null ? { id: editId } : {}),
      slug: form.slug.trim() || undefined,
      titleRu: form.titleRu.trim() || undefined,
      titleEn: form.titleEn.trim() || undefined,
      descriptionRu: form.descriptionRu.trim() || undefined,
      descriptionEn: form.descriptionEn.trim() || undefined,
      category: form.category.trim() || undefined,
      author: form.author.trim() || undefined,
      messageRu: form.messageRu,
      messageEn: form.messageEn,
      createdAt: new Date(form.createdAt).toISOString(),
    };
    const res = await fetch("/api/blog/admin", {
      method: editId !== null ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, post: postData }),
    });
    setLoading(false);
    if (!res.ok) { setError("Ошибка сохранения"); return; }
    const refreshed = await fetch("/api/blog/posts").then((r) => r.json());
    onPostsChange(refreshed);
    setShowForm(false);
    setEditId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить этот пост?")) return;
    setLoading(true);
    await fetch("/api/blog/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id }),
    });
    setLoading(false);
    const refreshed = await fetch("/api/blog/posts").then((r) => r.json());
    onPostsChange(refreshed);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1px solid #cbd5e1", borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem", fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
  };
  const btnPrimary: React.CSSProperties = {
    background: "#0683f5", color: "#fff", border: "none", borderRadius: "0.5rem",
    padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
  };
  const btnSecondary: React.CSSProperties = {
    background: "#e2e8f0", color: "#334155", border: "none", borderRadius: "0.5rem",
    padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
  };
  const label: React.CSSProperties = {
    display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem",
  };

  // ── Collapsed state ──
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#0683f5", color: "#fff", border: "none", borderRadius: "0.5rem",
          padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
        }}
      >
        + Предложить пост
      </button>
    );
  }

  // ── Password gate ──
  if (!authed) {
    return (
      <div style={{
        background: "#f8fafc", border: "2px solid #0683f5", borderRadius: "1rem",
        padding: "1.5rem", maxWidth: "22rem",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1rem" }}>Доступ для авторов</h3>
          <button onClick={() => setOpen(false)} style={{ ...btnSecondary, padding: "0.2rem 0.6rem", fontSize: "0.8rem" }}>✕</button>
        </div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAuth()}
          placeholder="Пароль" style={{ ...inputStyle, marginBottom: "0.75rem" }} />
        {authError && <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{authError}</p>}
        <button onClick={handleAuth} disabled={loading} style={btnPrimary}>
          {loading ? "Проверка..." : "Войти"}
        </button>
      </div>
    );
  }

  // ── Admin panel ──
  return (
    <div style={{
      background: "#f8fafc", border: "2px solid #0683f5", borderRadius: "1rem", padding: "1.5rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>⚙ Панель администратора</h3>
        <button onClick={() => setOpen(false)} style={{ ...btnSecondary, padding: "0.25rem 0.75rem" }}>Закрыть</button>
      </div>

      {!showForm && (
        <button onClick={openAdd} style={{ ...btnPrimary, marginBottom: "1.5rem" }}>+ Добавить пост</button>
      )}

      {showForm && (
        <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 1rem", color: "#0f172a" }}>
            {editId ? "Редактировать пост" : "Новый пост"}
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <div>
              <label style={label}>Slug (URL) — без пробелов</label>
              <input value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                placeholder="unido-business-plan" style={inputStyle} />
            </div>
            <div>
              <label style={label}>Категория</label>
              <input value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Бизнес-планирование" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <div>
              <label style={label}>Заголовок RU</label>
              <input value={form.titleRu} onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))}
                placeholder="Как написать бизнес-план..." style={inputStyle} />
            </div>
            <div>
              <label style={label}>Заголовок EN</label>
              <input value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                placeholder="How to Write a Business Plan..." style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <div>
              <label style={label}>Описание RU (meta)</label>
              <textarea value={form.descriptionRu}
                onChange={(e) => setForm((f) => ({ ...f, descriptionRu: e.target.value }))}
                placeholder="Краткое описание..." rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <div>
              <label style={label}>Описание EN (meta)</label>
              <textarea value={form.descriptionEn}
                onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                placeholder="Short description..." rows={2}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            <div>
              <label style={label}>Автор</label>
              <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Denis Naletov" style={inputStyle} />
            </div>
            <div>
              <label style={label}>Дата публикации</label>
              <input type="datetime-local" value={form.createdAt}
                onChange={(e) => setForm((f) => ({ ...f, createdAt: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={label}>Текст поста RU</label>
            <RichTextarea value={form.messageRu}
              onChange={(v) => setForm((f) => ({ ...f, messageRu: v }))}
              placeholder="Текст на русском..." rows={10} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={label}>Текст поста EN</label>
            <RichTextarea value={form.messageEn}
              onChange={(v) => setForm((f) => ({ ...f, messageEn: v }))}
              placeholder="English text..." rows={10} />
          </div>

          <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginBottom: "0.75rem" }}>
            **жирный** · *курсив* · [текст](url) · • маркер
          </p>

          {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={handleSave} disabled={loading} style={btnPrimary}>
              {loading ? "Сохранение..." : editId ? "Сохранить изменения" : "Опубликовать"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={btnSecondary}>
              Отмена
            </button>
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
          Посты ({posts.length}):
        </p>
        {posts.map((post) => (
          <div key={post.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "0.6rem 0.75rem", borderRadius: "0.5rem", background: "#fff",
            border: "1px solid #e2e8f0", marginBottom: "0.5rem", gap: "0.75rem",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {post.titleRu || post.titleEn || (post.messageRu || post.messageEn).slice(0, 60)}…
              </p>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                {new Date(post.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                {post.slug && ` · /${post.slug}`}
                {post.messageRu && " · RU ✓"}{post.messageEn && " · EN ✓"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              <button onClick={() => openEdit(post)}
                style={{ background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: "0.5rem", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                Изменить
              </button>
              <button onClick={() => handleDelete(post.id)}
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "0.5rem", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
