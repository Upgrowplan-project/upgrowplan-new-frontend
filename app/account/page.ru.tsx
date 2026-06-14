"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  logout,
  deleteAccount,
  getProjects,
  getProjectStats,
  deleteProject,
  UserProfile,
  Project,
  ProjectStats,
} from "../auth/authService";
import AdvancedSettings from "./AdvancedSettings";
import styles from "./workspace.module.css";
import {
  FiGrid, FiFolder, FiCreditCard, FiUser, FiSettings, FiLogOut,
} from "react-icons/fi";

type Section = "dashboard" | "projects" | "balance" | "profile" | "settings";

const navItems: { id: Section; icon: React.ReactNode; label: string }[] = [
  { id: "dashboard", icon: <FiGrid />, label: "Дашборд" },
  { id: "projects", icon: <FiFolder />, label: "Мои проекты" },
  { id: "balance", icon: <FiCreditCard />, label: "Баланс и токены" },
  { id: "profile", icon: <FiUser />, label: "Профиль" },
  { id: "settings", icon: <FiSettings />, label: "Настройки" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardSection({
  user, onNav, stats, recentProjects,
}: {
  user: UserProfile;
  onNav: (s: Section) => void;
  stats: ProjectStats;
  recentProjects: Project[];
}) {
  const firstName = user.fullname?.split(" ")[0] || "пользователь";

  const quickActions = [
    { icon: "📊", title: "Бизнес-план", desc: "AI-генерация инвестиционного плана", href: "/ru/ai-business-plan-generator" },
    { icon: "🔍", title: "Маркет-ресёрч", desc: "Исследование рынка и аудитории", href: "/ru/solutions/synthetic-customer-research" },
    { icon: "📈", title: "Финансовая модель", desc: "Автоматическая финмодель", href: null },
    { icon: "🤖", title: "Deep Research", desc: "Глубокий анализ отрасли", href: null },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className={styles.pageTitle}>Добро пожаловать, {firstName}! 👋</h2>
        <p className="text-muted" style={{ marginTop: "-0.75rem" }}>
          Управляйте проектами, пополняйте баланс и запускайте новые исследования
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          { value: `$${user.balance ?? 0}`, label: "Баланс", color: "#1d4ed8" },
          { value: user.tokens ?? 0, label: "Токены", color: "#059669" },
          { value: stats.plans, label: "Планов", color: "#7c3aed" },
          { value: stats.research + stats.deepResearch, label: "Ресёрчей", color: "#d97706" },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mb-3 fw-semibold">Быстрые действия</h5>
      <div className="row g-3 mb-4">
        {quickActions.map((a) =>
          a.href ? (
            <div className="col-12 col-sm-6 col-md-3" key={a.title}>
              <a href={a.href} className={styles.quickCard}>
                <div className={styles.quickCardIcon}>{a.icon}</div>
                <div className={styles.quickCardTitle}>{a.title}</div>
                <div className={styles.quickCardDesc}>{a.desc}</div>
              </a>
            </div>
          ) : (
            <div className="col-12 col-sm-6 col-md-3" key={a.title}>
              <div className={`${styles.quickCard} ${styles.quickCardDisabled}`}>
                <div className={styles.quickCardIcon}>{a.icon}</div>
                <div className={styles.quickCardTitle}>{a.title} <span className={styles.soonBadge}>Скоро</span></div>
                <div className={styles.quickCardDesc}>{a.desc}</div>
              </div>
            </div>
          )
        )}
      </div>

      <h5 className="mb-3 fw-semibold">Последние проекты</h5>
      {recentProjects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📁</div>
          <div className={styles.emptyTitle}>Проектов пока нет</div>
          <div className={styles.emptyDesc}>Создайте первый бизнес-план или запустите маркет-ресёрч</div>
          <button className="btn btn-primary btn-sm" onClick={() => onNav("projects")}>Перейти к проектам</button>
        </div>
      ) : (
        <ProjectList projects={recentProjects.slice(0, 5)} onDeleted={() => onNav("projects")} />
      )}
    </div>
  );
}

// ─── Project helpers ──────────────────────────────────────────────────────────
const typeLabel: Record<string, string> = {
  BUSINESS_PLAN: "Бизнес-план",
  MARKET_RESEARCH: "Маркет-ресёрч",
  DEEP_RESEARCH: "Deep Research",
  FINANCIAL_MODEL: "Финмодель",
};

const typeIcon: Record<string, string> = {
  BUSINESS_PLAN: "📊",
  MARKET_RESEARCH: "🔍",
  DEEP_RESEARCH: "🤖",
  FINANCIAL_MODEL: "📈",
};

const statusLabel: Record<string, { text: string; cls: string }> = {
  PENDING:     { text: "Ожидает", cls: "bg-secondary" },
  IN_PROGRESS: { text: "В процессе", cls: "bg-warning text-dark" },
  COMPLETED:   { text: "Готово", cls: "bg-success" },
  FAILED:      { text: "Ошибка", cls: "bg-danger" },
};

function ProjectList({ projects, onDeleted }: { projects: Project[]; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить проект?")) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      onDeleted();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      {projects.map((p) => {
        const st = statusLabel[p.status] ?? { text: p.status, cls: "bg-secondary" };
        return (
          <div key={p.id} className={styles.sectionCard} style={{ padding: "1rem 1.25rem", marginBottom: 0 }}>
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.25rem" }}>{typeIcon[p.type] ?? "📄"}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{p.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6c757d" }}>
                    {typeLabel[p.type]} · {new Date(p.createdAt).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${st.cls}`} style={{ fontSize: "0.75rem" }}>{st.text}</span>
                {p.fileUrl && (
                  <a href={p.fileUrl} className="btn btn-outline-primary btn-sm" target="_blank" rel="noreferrer">
                    Скачать
                  </a>
                )}
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                >
                  ✕
                </button>
              </div>
            </div>
            {p.summary && (
              <div style={{ fontSize: "0.82rem", color: "#6c757d", marginTop: "0.5rem" }}>{p.summary}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  return (
    <div>
      <h2 className={styles.pageTitle}>Мои проекты</h2>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <a href="/ru/ai-business-plan-generator" className="btn btn-primary">+ Бизнес-план</a>
        <a href="/ru/solutions/synthetic-customer-research" className="btn btn-outline-primary">+ Маркет-ресёрч</a>
      </div>
      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <div className={styles.emptyTitle}>Список проектов пуст</div>
          <div className={styles.emptyDesc}>После создания бизнес-плана или ресёрча они появятся здесь</div>
        </div>
      ) : (
        <ProjectList projects={projects} onDeleted={onRefresh} />
      )}
    </div>
  );
}

// ─── Balance ──────────────────────────────────────────────────────────────────
function BalanceSection({ user }: { user: UserProfile }) {
  return (
    <div>
      <h2 className={styles.pageTitle}>Баланс и токены</h2>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>Денежный баланс</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#1d4ed8" }}>
              {user.balance ?? 0} $
            </div>
            <div className="text-muted small mt-1 mb-3">Используется для оплаты услуг</div>
            <button className="btn btn-primary btn-sm">Пополнить баланс</button>
          </div>
        </div>
        <div className="col-12 col-md-5">
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>AI-токены</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#059669" }}>
              {user.tokens ?? 0}
            </div>
            <div className="text-muted small mt-1 mb-3">Токены для генерации контента</div>
            <button className="btn btn-outline-success btn-sm" disabled>
              Получить токены
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardTitle}>История операций</div>
        <div className={styles.emptyState} style={{ border: "none", padding: "2rem 1rem" }}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>Операций пока нет</div>
          <div className={styles.emptyDesc}>История транзакций появится после первого пополнения</div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfileSection({
  user,
  setUser,
}: {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user.fullname || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [country, setCountry] = useState(user.country || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.avatarUrl || "/images/user-icon.png"
  );
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatarUrl = user.avatarUrl;
      if (avatarFile) {
        const res = await uploadAvatar(avatarFile);
        avatarUrl = res.avatarUrl;
      }
      const updated = { ...user, fullname, phone, country, avatarUrl };
      await updateUserProfile(updated);
      setUser(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Полное имя", value: fullname, setter: setFullname, editable: true },
    { label: "Email", value: user.email, setter: undefined, editable: false },
    { label: "Телефон", value: phone, setter: setPhone, editable: true },
    { label: "Страна", value: country, setter: setCountry, editable: true },
  ];

  return (
    <div>
      <h2 className={styles.pageTitle}>Профиль</h2>

      <div className={styles.sectionCard}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ position: "relative" }}>
            <Image
              src={avatarPreview}
              alt="Аватар"
              width={72}
              height={72}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
            {editing && (
              <label
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  background: "#0683f5", borderRadius: "50%",
                  width: 22, height: 22, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "0.7rem", color: "#fff",
                }}
              >
                ✎
                <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{user.fullname || "—"}</div>
            <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>{user.email}</div>
          </div>
        </div>

        {fields.map((f) => (
          <div className={styles.fieldRow} key={f.label}>
            <div className={styles.fieldLabel}>{f.label}</div>
            <div className={styles.fieldValue}>
              {editing && f.editable && f.setter ? (
                <input
                  className="form-control form-control-sm"
                  value={f.value || ""}
                  onChange={(e) => f.setter!(e.target.value)}
                  style={{ maxWidth: 280 }}
                />
              ) : (
                <span style={{ color: f.value ? "#212529" : "#adb5bd" }}>
                  {f.value || "—"}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="d-flex gap-2 mt-4">
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? "Сохранение…" : "Сохранить"}
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>
                Отмена
              </button>
            </>
          ) : (
            <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(true)}>
              Редактировать
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsSection({
  user,
  setUser,
}: {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Вы уверены? Это действие необратимо.")) return;
    try {
      await deleteAccount();
      router.push("/ru/auth");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>Настройки</h2>

      <div className={styles.sectionCard}>
        <div className={styles.sectionCardTitle}>Информация об аккаунте</div>
        <AdvancedSettings editing={false} user={user} setUser={setUser} />
      </div>

      <div className={styles.sectionCard} style={{ borderColor: "#f8d7da" }}>
        <div className={styles.sectionCardTitle} style={{ color: "#842029" }}>
          Опасная зона
        </div>
        <p className="text-muted small mb-3">
          Удаление аккаунта необратимо. Все данные будут потеряны.
        </p>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Удалить аккаунт
        </button>
      </div>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────
export default function AccountPage() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({ total: 0, plans: 0, research: 0, deepResearch: 0 });
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const [p, s] = await Promise.all([getProjects(), getProjectStats()]);
      setProjects(p);
      setStats(s);
    } catch {
      // не критично — показываем пустой список
    }
  };

  useEffect(() => {
    getUserProfile()
      .then((u) => { setUser(u); return loadProjects(); })
      .catch(() => router.push("/ru/auth"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/ru/auth");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" />
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className={styles.workspace}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.userBlock}>
            <div className="d-flex align-items-center">
              <Image
                src={user.avatarUrl || "/images/user-icon.png"}
                alt="avatar"
                width={36}
                height={36}
                className={styles.userAvatar}
              />
              <div>
                <div className={styles.userName}>{user.fullname || "Пользователь"}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${section === item.id ? styles.navItemActive : ""}`}
              onClick={() => setSection(item.id)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className={styles.sidebarSpacer} />

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut />
            Выйти
          </button>
        </aside>

        {/* Content */}
        <main className={styles.content}>
          {section === "dashboard" && (
            <DashboardSection user={user} onNav={setSection} stats={stats} recentProjects={projects} />
          )}
          {section === "projects" && <ProjectsSection projects={projects} onRefresh={loadProjects} />}
          {section === "balance" && <BalanceSection user={user} />}
          {section === "profile" && <ProfileSection user={user} setUser={setUser} />}
          {section === "settings" && <SettingsSection user={user} setUser={setUser} />}
        </main>
      </div>
    </>
  );
}
