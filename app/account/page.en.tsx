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
  UserProfile,
} from "../auth/authService";
import AdvancedSettings from "./AdvancedSettings";
import styles from "./workspace.module.css";
import {
  FiGrid, FiFolder, FiCreditCard, FiUser, FiSettings, FiLogOut,
} from "react-icons/fi";

type Section = "dashboard" | "projects" | "balance" | "profile" | "settings";

const navItems: { id: Section; icon: React.ReactNode; label: string }[] = [
  { id: "dashboard", icon: <FiGrid />, label: "Dashboard" },
  { id: "projects", icon: <FiFolder />, label: "My Projects" },
  { id: "balance", icon: <FiCreditCard />, label: "Balance & Tokens" },
  { id: "profile", icon: <FiUser />, label: "Profile" },
  { id: "settings", icon: <FiSettings />, label: "Settings" },
];

function DashboardSection({ user, onNav }: { user: UserProfile; onNav: (s: Section) => void }) {
  const firstName = user.fullname?.split(" ")[0] || "there";
  const quickActions = [
    { icon: "📊", title: "Business Plan", desc: "AI-generated investor-ready plan", href: "/ai-business-plan-generator" },
    { icon: "🔍", title: "Market Research", desc: "Market & audience analysis", href: "/solutions/synthetic-customer-research" },
    { icon: "📈", title: "Financial Model", desc: "Automated financial model", href: null },
    { icon: "🤖", title: "Deep Research", desc: "Industry deep-dive", href: null },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className={styles.pageTitle}>Welcome, {firstName}! 👋</h2>
        <p className="text-muted" style={{ marginTop: "-0.75rem" }}>Manage your projects, top up balance and launch new research</p>
      </div>
      <div className="row g-3 mb-4">
        {[
          { value: `${user.balance ?? 0} $`, label: "Balance", color: "#1d4ed8" },
          { value: user.tokens ?? 0, label: "Tokens", color: "#059669" },
          { value: 0, label: "Projects", color: "#7c3aed" },
          { value: 0, label: "Research", color: "#d97706" },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <h5 className="mb-3 fw-semibold">Quick actions</h5>
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
                <div className={styles.quickCardTitle}>{a.title} <span className={styles.soonBadge}>Soon</span></div>
                <div className={styles.quickCardDesc}>{a.desc}</div>
              </div>
            </div>
          )
        )}
      </div>
      <h5 className="mb-3 fw-semibold">Recent projects</h5>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📁</div>
        <div className={styles.emptyTitle}>No projects yet</div>
        <div className={styles.emptyDesc}>Create your first business plan or market research</div>
        <button className="btn btn-primary btn-sm" onClick={() => onNav("projects")}>Go to projects</button>
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <div>
      <h2 className={styles.pageTitle}>My Projects</h2>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <a href="/ai-business-plan-generator" className="btn btn-primary">+ Business Plan</a>
        <a href="/solutions/synthetic-customer-research" className="btn btn-outline-primary">+ Market Research</a>
      </div>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📋</div>
        <div className={styles.emptyTitle}>No projects yet</div>
        <div className={styles.emptyDesc}>Once you create a plan or research, they'll appear here</div>
      </div>
    </div>
  );
}

function BalanceSection({ user }: { user: UserProfile }) {
  return (
    <div>
      <h2 className={styles.pageTitle}>Balance & Tokens</h2>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-5">
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>Monetary Balance</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#1d4ed8" }}>{user.balance ?? 0} $</div>
            <div className="text-muted small mt-1 mb-3">Used to pay for services</div>
            <button className="btn btn-primary btn-sm">Top up balance</button>
          </div>
        </div>
        <div className="col-12 col-md-5">
          <div className={styles.sectionCard}>
            <div className={styles.sectionCardTitle}>AI Tokens</div>
            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#059669" }}>{user.tokens ?? 0}</div>
            <div className="text-muted small mt-1 mb-3">Used for content generation</div>
            <button className="btn btn-outline-success btn-sm" disabled>Get tokens</button>
          </div>
        </div>
      </div>
      <div className={styles.sectionCard}>
        <div className={styles.sectionCardTitle}>Transaction history</div>
        <div className={styles.emptyState} style={{ border: "none", padding: "2rem 1rem" }}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>No transactions yet</div>
          <div className={styles.emptyDesc}>History will appear after the first top-up</div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user, setUser }: { user: UserProfile; setUser: (u: UserProfile) => void }) {
  const [editing, setEditing] = useState(false);
  const [fullname, setFullname] = useState(user.fullname || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [country, setCountry] = useState(user.country || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || "/images/user-icon.png");
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

  return (
    <div>
      <h2 className={styles.pageTitle}>Profile</h2>
      <div className={styles.sectionCard}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ position: "relative" }}>
            <Image src={avatarPreview} alt="Avatar" width={72} height={72} className="rounded-circle" style={{ objectFit: "cover" }} />
            {editing && (
              <label style={{ position: "absolute", bottom: 0, right: 0, background: "#0683f5", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.7rem", color: "#fff" }}>
                ✎<input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>{user.fullname || "—"}</div>
            <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>{user.email}</div>
          </div>
        </div>
        {[
          { label: "Full name", value: fullname, setter: setFullname, editable: true },
          { label: "Email", value: user.email, setter: undefined, editable: false },
          { label: "Phone", value: phone, setter: setPhone, editable: true },
          { label: "Country", value: country, setter: setCountry, editable: true },
        ].map((f) => (
          <div className={styles.fieldRow} key={f.label}>
            <div className={styles.fieldLabel}>{f.label}</div>
            <div className={styles.fieldValue}>
              {editing && f.editable && f.setter ? (
                <input className="form-control form-control-sm" value={f.value || ""} onChange={(e) => f.setter!(e.target.value)} style={{ maxWidth: 280 }} />
              ) : (
                <span style={{ color: f.value ? "#212529" : "#adb5bd" }}>{f.value || "—"}</span>
              )}
            </div>
          </div>
        ))}
        <div className="d-flex gap-2 mt-4">
          {editing ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(true)}>Edit profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ user, setUser }: { user: UserProfile; setUser: (u: UserProfile) => void }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!confirm("Are you sure? This action is irreversible.")) return;
    try { await deleteAccount(); router.push("/auth"); } catch (err) { console.error(err); }
  };
  return (
    <div>
      <h2 className={styles.pageTitle}>Settings</h2>
      <div className={styles.sectionCard}>
        <div className={styles.sectionCardTitle}>Account information</div>
        <AdvancedSettings editing={false} user={user} setUser={setUser} />
      </div>
      <div className={styles.sectionCard} style={{ borderColor: "#f8d7da" }}>
        <div className={styles.sectionCardTitle} style={{ color: "#842029" }}>Danger zone</div>
        <p className="text-muted small mb-3">Account deletion is irreversible. All data will be lost.</p>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete account</button>
      </div>
    </div>
  );
}

export default function AccountPageEn() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then(setUser)
      .catch(() => router.push("/auth"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logout(); router.push("/auth"); };

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
        <aside className={styles.sidebar}>
          <div className={styles.userBlock}>
            <div className="d-flex align-items-center">
              <Image src={user.avatarUrl || "/images/user-icon.png"} alt="avatar" width={36} height={36} className={styles.userAvatar} />
              <div>
                <div className={styles.userName}>{user.fullname || "User"}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
            </div>
          </div>
          {navItems.map((item) => (
            <button key={item.id}
              className={`${styles.navItem} ${section === item.id ? styles.navItemActive : ""}`}
              onClick={() => setSection(item.id)}>
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className={styles.sidebarSpacer} />
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut /> Log out
          </button>
        </aside>
        <main className={styles.content}>
          {section === "dashboard" && <DashboardSection user={user} onNav={setSection} />}
          {section === "projects" && <ProjectsSection />}
          {section === "balance" && <BalanceSection user={user} />}
          {section === "profile" && <ProfileSection user={user} setUser={setUser} />}
          {section === "settings" && <SettingsSection user={user} setUser={setUser} />}
        </main>
      </div>
    </>
  );
}
