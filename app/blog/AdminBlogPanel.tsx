"use client";

import { useState } from "react";
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
        if (res.ok) {
          setAuthed(true);
          setAuthError("");
        } else if (res.status === 401) {
          setAuthError("Неверный пароль");
        } else {
          setAuthError("Ошибка сервера — попробуйте ещё раз");
        }
      })
      .catch(() => {
        setLoading(false);
        setAuthError("Нет соединения с сервером");
      });
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

    const method = editId !== null ? "PUT" : "POST";
    const res = await fetch("/api/blog/admin", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, post: postData }),
    });

    setLoading(false);
    if (!res.ok) { setError("Ошибка сохранения"); return; }

    // Refresh posts list
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

  const panelStyle: React.CSSProperties = {
    background: "#f8fafc",
    border: "2px solid #0683f5",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginTop: "2rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
  };

  const btnPrimary: React.CSSProperties = {
    background: "#0683f5",
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  };

  const btnSecondary: React.CSSProperties = {
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1.25rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
  };

  const btnDanger: React.CSSProperties = {
    background: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.35rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  const btnEdit: React.CSSProperties = {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.35rem 0.75rem",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  if (!open) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", paddingBottom: "2rem" }}>
        <button
          onClick={() => setOpen(true)}
          style={{ ...btnSecondary, opacity: 0.5, fontSize: "0.8rem" }}
        >
          ⚙ Режим администратора
        </button>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>
          ⚙ Панель администратора
        </h3>
        <button onClick={() => setOpen(false)} style={{ ...btnSecondary, padding: "0.25rem 0.75rem" }}>
          Закрыть
        </button>
      </div>

      {!authed ? (
        <div style={{ maxWidth: "20rem" }}>
          <p style={{ color: "#475569", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            Введите пароль администратора:
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            placeholder="Пароль"
            style={{ ...inputStyle, marginBottom: "0.75rem" }}
          />
          {authError && <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>{authError}</p>}
          <button onClick={handleAuth} disabled={loading} style={btnPrimary}>
            {loading ? "Проверка..." : "Войти"}
          </button>
        </div>
      ) : (
        <>
          {!showForm && (
            <button onClick={openAdd} style={{ ...btnPrimary, marginBottom: "1.5rem" }}>
              + Добавить пост
            </button>
          )}

          {showForm && (
            <div style={{ background: "#fff", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 1rem", color: "#0f172a" }}>
                {editId ? "Редактировать пост" : "Новый пост"}
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Slug (URL) *
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    placeholder="unido-business-plan"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Категория
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Бизнес-планирование"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Заголовок (RU)
                  </label>
                  <input
                    value={form.titleRu}
                    onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))}
                    placeholder="Как написать бизнес-план..."
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Заголовок (EN)
                  </label>
                  <input
                    value={form.titleEn}
                    onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                    placeholder="How to Write a Business Plan..."
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Описание (RU) — meta description
                  </label>
                  <textarea
                    value={form.descriptionRu}
                    onChange={(e) => setForm((f) => ({ ...f, descriptionRu: e.target.value }))}
                    placeholder="Краткое описание для поисковиков..."
                    rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Описание (EN) — meta description
                  </label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                    placeholder="Short description for search engines..."
                    rows={2}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Автор
                  </label>
                  <input
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    placeholder="Denis Naletov"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                    Дата публикации
                  </label>
                  <input
                    type="datetime-local"
                    value={form.createdAt}
                    onChange={(e) => setForm((f) => ({ ...f, createdAt: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                Текст поста (RU)
              </label>
              <textarea
                value={form.messageRu}
                onChange={(e) => setForm((f) => ({ ...f, messageRu: e.target.value }))}
                placeholder="Текст на русском..."
                rows={8}
                style={{ ...inputStyle, resize: "vertical", marginBottom: "1rem" }}
              />

              <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "#475569", marginBottom: "0.4rem" }}>
                Текст поста (EN)
              </label>
              <textarea
                value={form.messageEn}
                onChange={(e) => setForm((f) => ({ ...f, messageEn: e.target.value }))}
                placeholder="English text..."
                rows={8}
                style={{ ...inputStyle, resize: "vertical", marginBottom: "1rem" }}
              />

              {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handleSave} disabled={loading} style={btnPrimary}>
                  {loading ? "Сохранение..." : editId ? "Сохранить изменения" : "Опубликовать"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  style={btnSecondary}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Список постов ({posts.length}):
            </p>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "0.5rem",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  marginBottom: "0.5rem",
                  gap: "0.75rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {(post.messageRu || post.messageEn).slice(0, 80)}…
                  </p>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                    {new Date(post.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    {post.messageRu && " · RU ✓"}
                    {post.messageEn && " · EN ✓"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <button onClick={() => openEdit(post)} style={btnEdit}>Изменить</button>
                  <button onClick={() => handleDelete(post.id)} style={btnDanger}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
