"use client";

/**
 * app/zone/profile/setup/page.tsx
 * Nexfluence — Creator Profile Builder
 *
 * 8 independently-saveable sections, each in its own modal.
 * Gamified progress: % credibility, level badges, celebration bursts,
 * motivational toasts. Partial saves so creators can resume anytime.
 *
 * Sections (each PATCH /api/profile/:section on save):
 *  1  Basic Info          +10%
 *  2  Profile Photo       +10%
 *  3  Social Accounts     +15%
 *  4  Content Niche       +10%
 *  5  Audience Data       +15%
 *  6  Past Work           +15%
 *  7  Rate Card           +10%
 *  8  Verification        +15%
 */

import Image from "next/image";
import {
  useState, useEffect, useRef, useCallback,
  type ReactNode, type CSSProperties,
} from "react";

// ─────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────
function useWindowWidth(): number {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const cb = () => setW(window.innerWidth);
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, []);
  return w;
}

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  ink:    "#0a0612",
  pink:   "#ff7ac3",
  mag:    "#ff33bc",
  violet: "#8061ff",
  indigo: "#6a66ff",
  dim:    "rgba(255,255,255,0.50)",
  dim2:   "rgba(255,255,255,0.72)",
  grad:   "linear-gradient(90deg, #ff33bc, #8061ff)",
  border: "rgba(128,97,255,0.30)",
  card:   "rgba(128,97,255,0.06)",
  green:  "#34d399",
  gold:   "#fbbf24",
} as const;

// ─────────────────────────────────────────────
// PROFILE SECTION DEFINITIONS
// ─────────────────────────────────────────────
interface SectionDef {
  id:         string;
  title:      string;
  subtitle:   string;
  icon:       string;
  pct:        number;   // credibility points for completing
  time:       string;   // estimated time
  motivation: string;   // shown in card when incomplete
  celebrate:  string;   // shown in toast after saving
  color:      string;
}

const SECTIONS: SectionDef[] = [
  { id: "basic",    title: "Basic Info",         subtitle: "Name, bio & location",          icon: "👤", pct: 10, time: "~2 min", motivation: "First impression matters — tell brands who you are.",          celebrate: "Nice! Brands can now find you by name.",           color: C.violet },
  { id: "photo",    title: "Profile Photo",       subtitle: "Photo & cover image",           icon: "📸", pct: 10, time: "~1 min", motivation: "Profiles with photos get 3× more campaign invites.",         celebrate: "Looking great! Your profile just got way more visible.", color: C.mag    },
  { id: "social",   title: "Social Accounts",     subtitle: "Connect your platforms",        icon: "🔗", pct: 15, time: "~3 min", motivation: "Link your accounts so brands see your real reach.",          celebrate: "Reach confirmed! Brands love verified numbers.",    color: C.pink   },
  { id: "niche",    title: "Content Niche",       subtitle: "What you create",               icon: "🎯", pct: 10, time: "~2 min", motivation: "Niche creators get 4× better campaign matches.",            celebrate: "Niche set! You'll now get matched to relevant brands.", color: C.indigo },
  { id: "audience", title: "Audience Data",       subtitle: "Who follows you",               icon: "📊", pct: 15, time: "~3 min", motivation: "Audience data is the #1 thing brands look at.",            celebrate: "Audience data added. You're now a top-tier profile.", color: C.violet },
  { id: "work",     title: "Past Work",           subtitle: "Campaign portfolio",            icon: "💼", pct: 15, time: "~5 min", motivation: "Show brands what you've done — proof beats promises.",     celebrate: "Portfolio up! Brands can see your track record.",   color: C.mag    },
  { id: "rates",    title: "Rate Card",           subtitle: "Your pricing",                  icon: "💸", pct: 10, time: "~2 min", motivation: "Set your rates — brands can only book you if they know the cost.", celebrate: "Rate card set! You're now bookable.",          color: C.green  },
  { id: "verify",   title: "Verification",        subtitle: "Phone & identity",              icon: "✅", pct: 15, time: "~2 min", motivation: "Verified creators appear with a trust badge on all offers.", celebrate: "Verified! You now have the trust badge on your profile.", color: C.gold },
];

// ─────────────────────────────────────────────
// PROFILE STATE  (replace with API fetch)
// ─────────────────────────────────────────────
interface ProfileState {
  basic?:    { name: string; bio: string; location: string; languages: string[]; website: string };
  photo?:    { photoUrl: string; coverUrl: string };
  social?:   { ig: string; igFollowers: string; tt: string; ttFollowers: string; yt: string; ytSubs: string };
  niche?:    { primary: string; secondary: string[]; styles: string[]; frequency: string };
  audience?: { ageRange: string; genderSplit: number; topCountries: string[]; topCities: string; engRate: string };
  work?:     { items: WorkItem[] };
  rates?:    { story: string; post: string; video: string; yt: string; currency: string; negotiable: boolean };
  verify?:   { phone: string; agreed: boolean };
}

interface WorkItem { brand: string; platform: string; url: string; type: string; result: string }

// ─────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────
interface Toast { id: number; message: string; sub?: string; emoji: string; type: "success" | "info" }

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const add = useCallback((t: Omit<Toast, "id">) => {
    const id = ++counter.current;
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4000);
  }, []);

  return { toasts, add };
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div style={{ position: "fixed", bottom: "28px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: "10px", pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex", alignItems: "flex-start", gap: "12px",
            padding: "14px 18px",
            borderRadius: "14px",
            background: t.type === "success" ? "rgba(52,211,153,0.12)" : "rgba(128,97,255,0.15)",
            border: `1px solid ${t.type === "success" ? "rgba(52,211,153,0.4)" : "rgba(128,97,255,0.4)"}`,
            backdropFilter: "blur(12px)",
            maxWidth: "320px",
            animation: "slideInToast 0.3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>{t.emoji}</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{t.message}</p>
            {t.sub && <p style={{ fontSize: "11px", color: C.dim, marginTop: "3px" }}>{t.sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// CELEBRATION BURST
// ─────────────────────────────────────────────
function CelebrationBurst({ pct, onDone }: { pct: number; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  const EMOJIS = ["✨", "🎉", "🌟", "💫", "🔥", "⚡", "🎊"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 40}%`,
            fontSize: `${18 + Math.random() * 20}px`,
            animation: `burst${i % 3} ${0.8 + Math.random() * 0.8}s ease forwards`,
            animationDelay: `${Math.random() * 0.4}s`,
            opacity: 0,
          }}
        >
          {EMOJIS[i % EMOJIS.length]}
        </span>
      ))}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        textAlign: "center",
        animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        opacity: 0,
      }}>
        <p style={{ fontSize: "52px", lineHeight: 1 }}>🎉</p>
        <p style={{
          fontSize: "28px", fontWeight: 900, letterSpacing: "-0.03em",
          background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginTop: "8px",
        }}>
          +{pct}% Credibility!
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
function GradText({ children }: { children: ReactNode }) {
  return <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{children}</span>;
}

// ─────────────────────────────────────────────
// FORM PRIMITIVES  (shared across all modals)
// ─────────────────────────────────────────────
function FRow({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px" }}>{children}</div>;
}

function FField({ label, children, hint, required }: { label: string; children: ReactNode; hint?: string; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
        {label}{required && <span style={{ color: C.mag, marginLeft: "3px" }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>{hint}</p>}
    </div>
  );
}

function FInput({ value, onChange, placeholder, type = "text", autoComplete }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; autoComplete?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: "11px 14px",
        borderRadius: "9px",
        background: focused ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.05)",
        border: `1.5px solid ${focused ? "rgba(128,97,255,0.65)" : C.border}`,
        color: "#fff", fontSize: "14px", outline: "none",
        transition: "all 0.15s", width: "100%", boxSizing: "border-box" as const,
        fontFamily: "inherit",
      }}
    />
  );
}

function FTextarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: "11px 14px", borderRadius: "9px",
        background: focused ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.05)",
        border: `1.5px solid ${focused ? "rgba(128,97,255,0.65)" : C.border}`,
        color: "#fff", fontSize: "14px", outline: "none", resize: "vertical",
        transition: "all 0.15s", width: "100%", boxSizing: "border-box" as const,
        fontFamily: "inherit", lineHeight: 1.6,
      }}
    />
  );
}

function FSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        padding: "11px 36px 11px 14px", borderRadius: "9px",
        background: focused ? "rgba(128,97,255,0.12)" : "rgba(128,97,255,0.05)",
        border: `1.5px solid ${focused ? "rgba(128,97,255,0.65)" : C.border}`,
        color: value ? "#fff" : "rgba(255,255,255,0.35)",
        fontSize: "14px", outline: "none", width: "100%", cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        transition: "all 0.15s", boxSizing: "border-box" as const, fontFamily: "inherit",
      }}
    >
      {options.map((o) => <option key={o.value} value={o.value} style={{ background: "#12081e" }}>{o.label}</option>)}
    </select>
  );
}

function FChips({ options, selected, onChange, max }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; max?: number }) {
  const toggle = (o: string) => {
    if (selected.includes(o)) { onChange(selected.filter((s) => s !== o)); return; }
    if (max && selected.length >= max) return;
    onChange([...selected, o]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((o) => {
        const on = selected.includes(o);
        const blocked = !on && max != null && selected.length >= max;
        return (
          <button key={o} type="button" onClick={() => toggle(o)} disabled={blocked}
            style={{
              padding: "7px 14px", borderRadius: "8px",
              background: on ? "rgba(128,97,255,0.22)" : "rgba(128,97,255,0.05)",
              border: `1.5px solid ${on ? "rgba(128,97,255,0.7)" : C.border}`,
              color: on ? "#fff" : blocked ? "rgba(255,255,255,0.2)" : C.dim,
              fontSize: "13px", fontWeight: on ? 600 : 400,
              cursor: blocked ? "default" : "pointer", transition: "all 0.15s",
            }}
          >
            {on ? "✓ " : ""}{o}
          </button>
        );
      })}
    </div>
  );
}

function FToggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}
    >
      <div style={{
        width: "44px", height: "24px", borderRadius: "12px",
        background: value ? C.grad : "rgba(128,97,255,0.2)",
        border: `1.5px solid ${value ? "rgba(128,97,255,0.6)" : C.border}`,
        position: "relative", transition: "all 0.2s",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: "2px",
          left: value ? "20px" : "2px",
          width: "16px", height: "16px",
          borderRadius: "50%", background: "#fff",
          transition: "left 0.2s",
        }} />
      </div>
      <span style={{ fontSize: "13px", color: value ? "#fff" : C.dim, fontWeight: value ? 600 : 400 }}>{label}</span>
    </button>
  );
}

// Photo upload drop zone
function PhotoDrop({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string ?? "");
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        style={{
          borderRadius: "12px",
          border: `2px dashed ${drag ? "rgba(128,97,255,0.8)" : "rgba(128,97,255,0.35)"}`,
          background: drag ? "rgba(128,97,255,0.1)" : "rgba(128,97,255,0.04)",
          cursor: "pointer", transition: "all 0.2s",
          overflow: "hidden", minHeight: "110px",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}
      >
        {value ? (
          <Image src={value} alt={label} fill style={{ objectFit: "cover", objectPosition: "top" }} />
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p style={{ fontSize: "28px", marginBottom: "6px" }}>🖼</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: C.dim2 }}>Click or drag to upload</p>
            <p style={{ fontSize: "11px", color: C.dim, marginTop: "3px" }}>{hint}</p>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            style={{
              position: "absolute", top: "8px", right: "8px",
              background: "rgba(10,6,18,0.7)", border: "none", borderRadius: "50%",
              width: "28px", height: "28px", cursor: "pointer",
              color: "#fff", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>JPG, PNG, WebP · max 5MB</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────
interface ModalProps {
  section: SectionDef;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: ReactNode;
  isMobile: boolean;
}

function ModalShell({ section, onClose, onSave, saving, children, isMobile }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(10,6,18,0.80)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        animation: "overlayFadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "560px",
          maxHeight: "90vh",
          borderRadius: "22px",
          background: "#110820",
          border: `1px solid rgba(128,97,255,0.35)`,
          boxShadow: "0 32px 80px rgba(128,97,255,0.25), 0 0 0 1px rgba(255,122,195,0.1)",
          display: "flex", flexDirection: "column",
          animation: "modalSlideIn 0.28s cubic-bezier(0.34,1.4,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: "22px 28px 18px",
          borderBottom: `1px solid rgba(128,97,255,0.15)`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "13px", flexShrink: 0,
              background: `${section.color}18`,
              border: `1px solid ${section.color}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
            }}>
              {section.icon}
            </div>
            <div>
              <p style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {section.title}
              </p>
              <p style={{ fontSize: "12px", color: C.dim, marginTop: "3px" }}>
                {section.subtitle} · <span style={{ color: section.color, fontWeight: 600 }}>+{section.pct}% credibility</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
              background: "rgba(128,97,255,0.1)", border: `1px solid ${C.border}`,
              color: C.dim, fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(128,97,255,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.dim; (e.currentTarget as HTMLButtonElement).style.background = "rgba(128,97,255,0.1)"; }}
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 28px",
          borderTop: `1px solid rgba(128,97,255,0.15)`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "13px", color: C.dim, background: "none", border: "none",
              cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.dim)}
          >
            Save for later
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            style={{
              padding: "12px 32px", borderRadius: "9px",
              background: saving ? "rgba(128,97,255,0.4)" : C.grad,
              border: "none", color: "#fff", fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.04em", cursor: saving ? "wait" : "pointer",
              boxShadow: "0 6px 24px rgba(128,97,255,0.32)",
              transition: "all 0.18s",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            {saving ? (
              <>
                <span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Saving…
              </>
            ) : `Save & Earn +${section.pct}% →`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8 MODAL FORMS
// ─────────────────────────────────────────────

// — 1. Basic Info —
function ModalBasicInfo({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["basic"]) => void; isMobile: boolean; initial?: ProfileState["basic"] }) {
  const [name, setName]         = useState(initial?.name         ?? "");
  const [bio, setBio]           = useState(initial?.bio          ?? "");
  const [location, setLocation] = useState(initial?.location     ?? "");
  const [langs, setLangs]       = useState<string[]>(initial?.languages ?? []);
  const [website, setWebsite]   = useState(initial?.website      ?? "");
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ name, bio, location, languages: langs, website });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <FField label="Display Name" required>
        <FInput value={name} onChange={setName} placeholder="e.g. Marta Kalniņa" autoComplete="name" />
      </FField>
      <FField label="Bio" hint={`${bio.length}/180 characters`}>
        <FTextarea value={bio} onChange={(v) => setBio(v.slice(0, 180))} placeholder="Tell brands what makes your content unique in 2–3 sentences…" rows={3} />
      </FField>
      <FRow>
        <FField label="City / Region">
          <FInput value={location} onChange={setLocation} placeholder="e.g. Riga, Latvia" />
        </FField>
        <FField label="Website / Link-in-bio">
          <FInput value={website} onChange={setWebsite} placeholder="https://yoursite.com" type="url" />
        </FField>
      </FRow>
      <FField label="Languages you create in">
        <FChips options={["Latvian", "Lithuanian", "Estonian", "English", "Russian", "German"]} selected={langs} onChange={setLangs} />
      </FField>
    </ModalShell>
  );
}

// — 2. Profile Photo —
function ModalPhoto({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["photo"]) => void; isMobile: boolean; initial?: ProfileState["photo"] }) {
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ photoUrl, coverUrl });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,51,188,0.06)", border: "1px solid rgba(255,51,188,0.2)", fontSize: "13px", color: "rgba(255,122,195,0.9)", lineHeight: 1.6 }}>
        💡 Profiles with a clear face photo receive <strong>3× more campaign invitations</strong> than those without.
      </div>
      <FField label="Profile Photo" hint="Square crop recommended · min 400×400px">
        <PhotoDrop label="" hint="Your face or creator logo" value={photoUrl} onChange={setPhotoUrl} />
      </FField>
      <FField label="Cover / Banner Image" hint="Shown at the top of your public profile · 1200×400px ideal">
        <PhotoDrop label="" hint="Brand aesthetic, lifestyle shot, or content mood" value={coverUrl} onChange={setCoverUrl} />
      </FField>
    </ModalShell>
  );
}

// — 3. Social Accounts —
function ModalSocial({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["social"]) => void; isMobile: boolean; initial?: ProfileState["social"] }) {
  const [ig,  setIg]  = useState(initial?.ig  ?? ""); const [igF, setIgF] = useState(initial?.igFollowers ?? "");
  const [tt,  setTt]  = useState(initial?.tt  ?? ""); const [ttF, setTtF] = useState(initial?.ttFollowers ?? "");
  const [yt,  setYt]  = useState(initial?.yt  ?? ""); const [ytS, setYtS] = useState(initial?.ytSubs ?? "");
  const [saving, setSaving] = useState(false);

  const FOLL_OPTS = [
    { value: "", label: "Following count…" },
    ...["< 1K","1K–5K","5K–10K","10K–50K","50K–100K","100K–500K","500K+"].map((v) => ({ value: v, label: v })),
  ];

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ ig, igFollowers: igF, tt, ttFollowers: ttF, yt, ytSubs: ytS });
  };

  const PlatRow = ({ icon, platform, handle, setHandle, followers, setFollowers }: { icon: string; platform: string; handle: string; setHandle: (v: string) => void; followers: string; setFollowers: (v: string) => void }) => (
    <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(128,97,255,0.05)", border: `1px solid ${C.border}` }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: C.dim2, marginBottom: "10px" }}>{icon} {platform}</p>
      <FRow>
        <FField label="Handle"><FInput value={handle} onChange={setHandle} placeholder="@username" /></FField>
        <FField label="Followers"><FSelect value={followers} onChange={setFollowers} options={FOLL_OPTS} /></FField>
      </FRow>
    </div>
  );

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(128,97,255,0.08)", border: `1px solid ${C.border}`, fontSize: "13px", color: C.dim2 }}>
        🔗 Add the platforms where you're most active. Leave blank any you don't use.
      </div>
      <PlatRow icon="📸" platform="Instagram" handle={ig} setHandle={setIg} followers={igF} setFollowers={setIgF} />
      <PlatRow icon="🎵" platform="TikTok"    handle={tt} setHandle={setTt} followers={ttF} setFollowers={setTtF} />
      <PlatRow icon="▶️" platform="YouTube"   handle={yt} setHandle={setYt} followers={ytS} setFollowers={setYtS} />
    </ModalShell>
  );
}

// — 4. Content Niche —
function ModalNiche({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["niche"]) => void; isMobile: boolean; initial?: ProfileState["niche"] }) {
  const [primary,   setPrimary]   = useState(initial?.primary   ?? "");
  const [secondary, setSecondary] = useState<string[]>(initial?.secondary ?? []);
  const [styles,    setStyles]    = useState<string[]>(initial?.styles    ?? []);
  const [freq,      setFreq]      = useState(initial?.frequency  ?? "");
  const [saving, setSaving]       = useState(false);

  const NICHES   = ["Lifestyle", "Travel", "Food & Drink", "Fitness & Wellness", "Fashion & Beauty", "Business", "Tech", "Gaming", "Family", "Art & Design", "Music", "Comedy", "Sports", "Finance", "Education"];
  const STYLES   = ["Aesthetic", "Educational", "Humour", "Raw / Authentic", "Luxury", "Budget-friendly", "Storytelling", "Short-form", "Long-form", "Tutorial", "Review"];
  const FREQ_OPTS = [
    { value: "", label: "How often do you post?" },
    ...["Daily","3–5× per week","1–2× per week","A few times per month","Occasionally"].map((v) => ({ value: v, label: v })),
  ];
  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ primary, secondary, styles, frequency: freq });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <FField label="Primary Niche" required hint="The #1 topic your content is about">
        <FSelect value={primary} onChange={setPrimary} options={[{ value: "", label: "Select your main niche…" }, ...NICHES.map((n) => ({ value: n, label: n }))]} />
      </FField>
      <FField label="Secondary Niches" hint="Pick up to 2 more">
        <FChips options={NICHES.filter((n) => n !== primary)} selected={secondary} onChange={setSecondary} max={2} />
      </FField>
      <FField label="Content Style" hint="Pick everything that describes your vibe">
        <FChips options={STYLES} selected={styles} onChange={setStyles} />
      </FField>
      <FField label="Posting Frequency">
        <FSelect value={freq} onChange={setFreq} options={FREQ_OPTS} />
      </FField>
    </ModalShell>
  );
}

// — 5. Audience Data —
function ModalAudience({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["audience"]) => void; isMobile: boolean; initial?: ProfileState["audience"] }) {
  const [ageRange, setAgeRange]     = useState(initial?.ageRange     ?? "");
  const [genderSplit, setGender]    = useState(initial?.genderSplit   ?? 50);
  const [countries, setCountries]   = useState<string[]>(initial?.topCountries ?? []);
  const [cities, setCities]         = useState(initial?.topCities     ?? "");
  const [engRate, setEngRate]       = useState(initial?.engRate       ?? "");
  const [saving, setSaving]         = useState(false);

  const AGE_OPTS = [{ value: "", label: "Primary age bracket…" }, ...["13–17","18–24","25–34","35–44","45–54","55+"].map((v) => ({ value: v, label: v }))];
  const ENG_OPTS = [{ value: "", label: "Approx. engagement rate…" }, ...["< 1%","1–2%","2–4%","4–7%","7–12%","12%+"].map((v) => ({ value: v, label: v }))];
  const COUNTRY_OPTS = ["🇱🇻 Latvia","🇱🇹 Lithuania","🇪🇪 Estonia","🇩🇪 Germany","🇬🇧 UK","🇺🇸 USA","🇸🇪 Sweden","🇫🇮 Finland","🇳🇴 Norway","🇩🇰 Denmark"];

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ ageRange, genderSplit, topCountries: countries, topCities: cities, engRate });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(128,97,255,0.07)", border: `1px solid ${C.border}`, fontSize: "13px", color: C.dim2 }}>
        📊 This is the single most important section for brand matching. Accurate audience data = better campaign offers.
      </div>
      <FRow>
        <FField label="Primary Age Group"><FSelect value={ageRange} onChange={setAgeRange} options={AGE_OPTS} /></FField>
        <FField label="Engagement Rate"><FSelect value={engRate} onChange={setEngRate} options={ENG_OPTS} /></FField>
      </FRow>

      {/* Gender split slider */}
      <FField label={`Gender Split — ${genderSplit}% Female · ${100 - genderSplit}% Male`}>
        <div style={{ padding: "8px 0" }}>
          <input
            type="range" min={0} max={100} value={genderSplit}
            onChange={(e) => setGender(Number(e.target.value))}
            style={{
              width: "100%", appearance: "none", height: "6px",
              borderRadius: "100px",
              background: `linear-gradient(90deg, rgba(255,51,188,0.7) ${genderSplit}%, rgba(128,97,255,0.5) ${genderSplit}%)`,
              outline: "none", cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <span style={{ fontSize: "11px", color: C.pink }}>♀ Female</span>
            <span style={{ fontSize: "11px", color: C.violet }}>♂ Male</span>
          </div>
        </div>
      </FField>

      <FField label="Top 3 Countries (select up to 3)">
        <FChips options={COUNTRY_OPTS} selected={countries} onChange={setCountries} max={3} />
      </FField>
      <FField label="Top Cities" hint="Comma-separated e.g. Riga, Tallinn, Vilnius">
        <FInput value={cities} onChange={setCities} placeholder="Riga, Tallinn, Vilnius" />
      </FField>
    </ModalShell>
  );
}

// — 6. Past Work —
function ModalWork({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["work"]) => void; isMobile: boolean; initial?: ProfileState["work"] }) {
  const [items, setItems] = useState<WorkItem[]>(
    initial?.items ?? [{ brand: "", platform: "", url: "", type: "", result: "" }]
  );
  const [saving, setSaving] = useState(false);

  const PLAT_OPTS = [{ value: "", label: "Platform…" }, ...["Instagram", "TikTok", "YouTube", "LinkedIn", "Blog"].map((v) => ({ value: v, label: v }))];
  const TYPE_OPTS = [{ value: "", label: "Content type…" }, ...["Sponsored post", "Story / Reel", "Video review", "Affiliate link", "Event coverage", "UGC"].map((v) => ({ value: v, label: v }))];

  const update = (i: number, key: keyof WorkItem, val: string) => {
    setItems((p) => p.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  };
  const add    = () => setItems((p) => [...p, { brand: "", platform: "", url: "", type: "", result: "" }]);
  const remove = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ items: items.filter((it) => it.brand.trim()) });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(128,97,255,0.07)", border: `1px solid ${C.border}`, fontSize: "13px", color: C.dim2 }}>
        💼 Add up to 5 past campaigns. Even personal projects or gifted collabs count — show brands what you can do.
      </div>

      {items.map((item, i) => (
        <div key={i} style={{ padding: "18px", borderRadius: "14px", background: "rgba(128,97,255,0.06)", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.violet }}>Campaign {i + 1}</p>
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,100,100,0.6)", fontSize: "12px" }}>
                Remove
              </button>
            )}
          </div>
          <FRow>
            <FField label="Brand Name"><FInput value={item.brand} onChange={(v) => update(i, "brand", v)} placeholder="e.g. Red Bull" /></FField>
            <FField label="Platform"><FSelect value={item.platform} onChange={(v) => update(i, "platform", v)} options={PLAT_OPTS} /></FField>
          </FRow>
          <FRow>
            <FField label="Content Type"><FSelect value={item.type} onChange={(v) => update(i, "type", v)} options={TYPE_OPTS} /></FField>
            <FField label="Post URL (optional)"><FInput value={item.url} onChange={(v) => update(i, "url", v)} placeholder="https://…" type="url" /></FField>
          </FRow>
          <FField label="Result / Impact" hint="e.g. '12K views, 4.2% engagement' or '200 promo code uses'">
            <FInput value={item.result} onChange={(v) => update(i, "result", v)} placeholder="Metric or outcome" />
          </FField>
        </div>
      ))}

      {items.length < 5 && (
        <button type="button" onClick={add} style={{
          padding: "12px", borderRadius: "10px", border: `1.5px dashed rgba(128,97,255,0.4)`,
          background: "rgba(128,97,255,0.04)", color: C.dim, fontSize: "13px", fontWeight: 600,
          cursor: "pointer", transition: "all 0.15s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(128,97,255,0.7)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = C.dim; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(128,97,255,0.4)"; }}
        >
          + Add Another Campaign
        </button>
      )}
    </ModalShell>
  );
}

// — 7. Rate Card —
function ModalRates({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["rates"]) => void; isMobile: boolean; initial?: ProfileState["rates"] }) {
  const [story, setStory]         = useState(initial?.story       ?? "");
  const [post, setPost]           = useState(initial?.post        ?? "");
  const [video, setVideo]         = useState(initial?.video       ?? "");
  const [ytRate, setYtRate]       = useState(initial?.yt          ?? "");
  const [currency, setCurrency]   = useState(initial?.currency    ?? "EUR");
  const [neg, setNeg]             = useState(initial?.negotiable  ?? true);
  const [saving, setSaving]       = useState(false);

  const CURR = [{ value: "EUR", label: "€ EUR" }, { value: "USD", label: "$ USD" }];
  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSave({ story, post, video, yt: ytRate, currency, negotiable: neg });
  };

  const RateRow = ({ label, value, onChange, ph }: { label: string; value: string; onChange: (v: string) => void; ph: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "rgba(128,97,255,0.05)", border: `1px solid ${C.border}` }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: C.dim2, flex: 1 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "13px", color: C.dim }}>{currency === "EUR" ? "€" : "$"}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={ph}
          style={{
            width: "90px", padding: "7px 10px", borderRadius: "8px",
            background: "rgba(128,97,255,0.08)", border: `1.5px solid ${C.border}`,
            color: "#fff", fontSize: "14px", fontWeight: 600, outline: "none",
            textAlign: "right", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(128,97,255,0.7)")}
          onBlur={(e)  => ((e.target as HTMLInputElement).style.borderColor = C.border)}
        />
      </div>
    </div>
  );

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(128,97,255,0.07)", border: `1px solid ${C.border}`, fontSize: "13px", color: C.dim2 }}>
        💸 Your rates help brands plan their budgets. You can always negotiate — this is a starting point, not a ceiling.
      </div>
      <FField label="Currency">
        <FSelect value={currency} onChange={setCurrency} options={CURR} />
      </FField>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <RateRow label="Instagram Story (per story)" value={story} onChange={setStory} ph="50" />
        <RateRow label="Instagram Post / Reel"        value={post}  onChange={setPost}  ph="150" />
        <RateRow label="TikTok Video"                 value={video} onChange={setVideo} ph="200" />
        <RateRow label="YouTube Integration"          value={ytRate} onChange={setYtRate} ph="500" />
      </div>
      <FToggle value={neg} onChange={setNeg} label="Open to negotiation and package deals" />
    </ModalShell>
  );
}

// — 8. Verification —
function ModalVerify({ section, onClose, onSave, isMobile, initial }: { section: SectionDef; onClose: () => void; onSave: (d: ProfileState["verify"]) => void; isMobile: boolean; initial?: ProfileState["verify"] }) {
  const [phone,   setPhone]   = useState(initial?.phone   ?? "");
  const [agreed,  setAgreed]  = useState(initial?.agreed  ?? false);
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    if (!agreed) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    onSave({ phone, agreed });
  };

  return (
    <ModalShell section={section} onClose={onClose} onSave={save} saving={saving} isMobile={isMobile}>
      <div style={{ padding: "16px", borderRadius: "14px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.25)" }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: C.gold, marginBottom: "4px" }}>🏅 Verified Badge</p>
        <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.65 }}>
          Completing this step adds a permanent <strong style={{ color: "#fff" }}>Verified Creator</strong> badge to your profile. Brands filter by verified status first.
        </p>
      </div>
      <FField label="Phone Number" hint="Used only for account security. Never shared with brands.">
        <FInput value={phone} onChange={setPhone} placeholder="+371 2X XXX XXX" type="tel" autoComplete="tel" />
      </FField>

      <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(128,97,255,0.06)", border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: C.dim2, marginBottom: "10px" }}>🪪 Identity Verification</p>
        <p style={{ fontSize: "12px", color: C.dim, lineHeight: 1.65, marginBottom: "12px" }}>
          Full ID verification via our partner (Veriff) is coming in the next platform update. For now, phone number confirmation earns your Verified badge.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.5, fontSize: "12px", color: C.dim }}>
          🔒 Powered by Veriff · GDPR compliant · Data never sold
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAgreed(!agreed)}
        style={{
          display: "flex", alignItems: "flex-start", gap: "12px",
          background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
        }}
      >
        <div style={{
          width: "20px", height: "20px", borderRadius: "5px", flexShrink: 0, marginTop: "1px",
          background: agreed ? C.grad : "rgba(128,97,255,0.1)",
          border: `1.5px solid ${agreed ? "rgba(128,97,255,0.7)" : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
        }}>
          {agreed && <span style={{ fontSize: "12px", color: "#fff" }}>✓</span>}
        </div>
        <p style={{ fontSize: "13px", color: C.dim, lineHeight: 1.6 }}>
          I confirm the profile information I have provided is accurate. I agree to Nexfluence's{" "}
          <a href="#" style={{ color: C.violet, textDecoration: "none" }}>Creator Terms</a> and{" "}
          <a href="#" style={{ color: C.violet, textDecoration: "none" }}>Privacy Policy</a>.
        </p>
      </button>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────
function SectionCard({ def, done, pct, onOpen, isMobile }: { def: SectionDef; done: boolean; pct: number; onOpen: () => void; isMobile: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "18px",
        padding: "22px",
        background: done ? `${def.color}0c` : C.card,
        border: `1px solid ${done ? `${def.color}50` : hov ? "rgba(255,122,195,0.4)" : C.border}`,
        cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 16px 40px ${def.color}18` : "none",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Completion glow */}
      {done && <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: `radial-gradient(circle, ${def.color}20, transparent 70%)`, pointerEvents: "none" }} />}

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "14px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
          background: done ? `${def.color}22` : "rgba(128,97,255,0.1)",
          border: `1px solid ${done ? `${def.color}55` : C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
          transition: "all 0.2s",
        }}>
          {done ? "✅" : def.icon}
        </div>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          padding: "4px 10px", borderRadius: "100px",
          background: done ? `${def.color}20` : "rgba(128,97,255,0.1)",
          color: done ? def.color : C.dim,
          letterSpacing: "0.04em",
          border: `1px solid ${done ? `${def.color}40` : C.border}`,
          whiteSpace: "nowrap",
        }}>
          {done ? `+${def.pct}% earned` : `+${def.pct}% available`}
        </span>
      </div>

      {/* Title */}
      <p style={{ fontSize: "15px", fontWeight: 800, color: done ? "#fff" : C.dim2, marginBottom: "4px", letterSpacing: "-0.01em" }}>
        {def.title}
      </p>
      <p style={{ fontSize: "12px", color: C.dim, marginBottom: "12px" }}>{def.subtitle}</p>

      {/* Motivation or done message */}
      <p style={{ fontSize: "12px", color: done ? `${def.color}cc` : "rgba(255,255,255,0.35)", lineHeight: 1.55, fontStyle: done ? "normal" : "italic", minHeight: "32px" }}>
        {done ? "✓ Completed — click to edit" : def.motivation}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>⏱ {def.time}</span>
        <span style={{
          fontSize: "12px", fontWeight: 700,
          color: done ? def.color : hov ? "#fff" : C.violet,
          transition: "color 0.15s",
        }}>
          {done ? "Edit →" : "Start →"}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LEVEL SYSTEM
// ─────────────────────────────────────────────
const LEVELS = [
  { min: 0,  max: 24,  name: "Starter",  icon: "🌱", color: C.dim   },
  { min: 25, max: 49,  name: "Rising",   icon: "🌟", color: C.indigo },
  { min: 50, max: 74,  name: "Verified", icon: "💫", color: C.violet },
  { min: 75, max: 99,  name: "Elite",    icon: "🏆", color: C.gold   },
  { min: 100,max: 100, name: "Legend",   icon: "👑", color: C.mag    },
];

function getLevel(pct: number) {
  return LEVELS.find((l) => pct >= l.min && pct <= l.max) ?? LEVELS[0];
}

// ─────────────────────────────────────────────
// PROGRESS HEADER
// ─────────────────────────────────────────────
function ProgressHeader({ pct, isMobile }: { pct: number; isMobile: boolean }) {
  const level    = getLevel(pct);
  const nextLevel = LEVELS.find((l) => l.min > pct);

  return (
    <div style={{
      borderRadius: "22px",
      padding: isMobile ? "28px 22px" : "36px 44px",
      background: "rgba(128,97,255,0.07)",
      border: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
      marginBottom: "36px",
    }}>
      {/* BG decoration */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "200px", background: "radial-gradient(circle at 80% 20%, rgba(128,97,255,0.18), transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
        gap: "28px", alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <div>
          {/* Level badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 14px", borderRadius: "100px",
            background: `${level.color}18`, border: `1px solid ${level.color}44`,
            marginBottom: "12px",
          }}>
            <span style={{ fontSize: "15px" }}>{level.icon}</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: level.color }}>{level.name} Creator</span>
          </div>

          <h1 style={{ fontSize: isMobile ? "26px" : "34px", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: "4px", lineHeight: 1.1 }}>
            Your Profile is <GradText>{pct}% Complete</GradText>
          </h1>
          {nextLevel && (
            <p style={{ fontSize: "14px", color: C.dim, marginBottom: "20px" }}>
              {nextLevel.min - pct}% more to reach{" "}
              <span style={{ color: nextLevel.color, fontWeight: 700 }}>{nextLevel.icon} {nextLevel.name}</span>
            </p>
          )}
          {pct === 100 && <p style={{ fontSize: "14px", color: C.gold, marginBottom: "20px", fontWeight: 700 }}>👑 Maximum credibility achieved — you're at the top!</p>}

          {/* Main progress bar */}
          <div>
            <div style={{ height: "10px", borderRadius: "100px", background: "rgba(128,97,255,0.15)", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{
                height: "100%", borderRadius: "100px",
                width: `${pct}%`, background: C.grad,
                boxShadow: "0 0 14px rgba(128,97,255,0.5)",
                transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)",
              }} />
            </div>
            {/* Level markers */}
            <div style={{ position: "relative", height: "20px" }}>
              {LEVELS.slice(1).map((l) => (
                <div key={l.name} style={{ position: "absolute", left: `${l.min}%`, transform: "translateX(-50%)", textAlign: "center" }}>
                  <div style={{ width: "1px", height: "6px", background: pct >= l.min ? l.color : "rgba(255,255,255,0.15)", margin: "0 auto" }} />
                  <span style={{ fontSize: "9px", color: pct >= l.min ? l.color : "rgba(255,255,255,0.2)", fontWeight: 700, whiteSpace: "nowrap" }}>{l.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Circular on desktop */}
        {!isMobile && <CircularPct pct={pct} level={level} />}
      </div>

      {/* Quick actions */}
      <div style={{
        display: "flex", gap: "10px", flexWrap: "wrap",
        marginTop: "24px", paddingTop: "20px",
        borderTop: `1px solid rgba(128,97,255,0.12)`,
      }}>
        <a href="/zone/profile/preview" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "9px 18px", borderRadius: "8px",
          background: "rgba(128,97,255,0.1)", border: `1px solid ${C.border}`,
          fontSize: "13px", fontWeight: 600, color: C.dim2, textDecoration: "none",
          transition: "all 0.15s",
        }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,122,195,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.dim2; (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border; }}
        >
          👁 Preview Public Profile
        </a>
        <a href="/zone/marketplace" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "9px 18px", borderRadius: "8px",
          background: "transparent", border: `1px solid ${C.border}`,
          fontSize: "13px", fontWeight: 600, color: C.dim, textDecoration: "none",
          transition: "all 0.15s",
        }}>
          🏪 Back to Marketplace
        </a>
      </div>
    </div>
  );
}

function CircularPct({ pct, level }: { pct: number; level: (typeof LEVELS)[0] }) {
  const r = 52; const circ = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff33bc" /><stop offset="100%" stopColor="#8061ff" />
        </linearGradient>
      </defs>
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(128,97,255,0.15)" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="url(#circGrad)" strokeWidth="10"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text x="70" y="62" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900" fontFamily="inherit">{pct}%</text>
      <text x="70" y="78" textAnchor="middle" fill={level.color} fontSize="18" fontFamily="inherit">{level.icon}</text>
      <text x="70" y="92" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="inherit" letterSpacing="1">{level.name.toUpperCase()}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────
export default function ProfileSetupPage() {
  const w         = useWindowWidth();
  const isMobile  = w < 640;
  const { toasts, add: addToast } = useToasts();

  // Track which sections are done
  const [profile, setProfile] = useState<ProfileState>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [burst, setBurst] = useState<{ pct: number } | null>(null);

  const isDone = useCallback((id: string) => {
    const p = profile as Record<string, unknown>;
    return p[id] != null;
  }, [profile]);

  const totalPct = SECTIONS.reduce((acc, s) => acc + (isDone(s.id) ? s.pct : 0), 0);

  const handleSave = useCallback((id: string, data: unknown, def: SectionDef) => {
    const wasAlreadyDone = isDone(id);
    setProfile((p) => ({ ...p, [id]: data }));
    setActiveModal(null);

    if (!wasAlreadyDone) {
      setBurst({ pct: def.pct });
      setTimeout(() => {
        addToast({ emoji: def.icon, message: def.celebrate, sub: `+${def.pct}% credibility earned`, type: "success" });
      }, 400);

      // Streak message
      const doneCount = SECTIONS.filter((s) => isDone(s.id)).length + 1;
      if (doneCount % 3 === 0 && doneCount > 0) {
        setTimeout(() => {
          addToast({ emoji: "🔥", message: `${doneCount} sections done — you're on fire!`, sub: "Brands love complete profiles", type: "info" });
        }, 1800);
      }
    } else {
      addToast({ emoji: "✅", message: `${def.title} updated`, type: "success" });
    }
  }, [isDone, addToast]);

  const activeSection = SECTIONS.find((s) => s.id === activeModal);

  return (
    <div style={{ background: C.ink, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes overlayFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalSlideIn   { from { opacity: 0; transform: translateY(32px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes slideInToast   { from { opacity: 0; transform: translateX(20px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes spin           { to { transform: rotate(360deg) } }
        @keyframes popIn          { from { opacity: 0; transform: translate(-50%,-50%) scale(0.5) } to { opacity: 1; transform: translate(-50%,-50%) scale(1) } }
        @keyframes burst0         { 0% { opacity:0; transform:translate(0,0) scale(0.5) } 30% { opacity:1 } 100% { opacity:0; transform:translate(var(--tx,30px),var(--ty,-80px)) scale(1) rotate(20deg) } }
        @keyframes burst1         { 0% { opacity:0; transform:translate(0,0) scale(0.5) } 25% { opacity:1 } 100% { opacity:0; transform:translate(var(--tx,-40px),var(--ty,-100px)) scale(1.2) rotate(-15deg) } }
        @keyframes burst2         { 0% { opacity:0; transform:translate(0,0) } 20% { opacity:1 } 100% { opacity:0; transform:translate(var(--tx,50px),var(--ty,-60px)) scale(0.8) } }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,#ff33bc,#8061ff); cursor:pointer; border:2px solid #0a0612; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.22); }
        select option { background:#12081e; color:#fff; }
        * { font-family:var(--font-rubik),sans-serif; box-sizing:border-box; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,6,18,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(128,97,255,0.18)",
        padding: isMobile ? "14px 20px" : "14px 40px",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/zone" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Image src="/Nex.webp" alt="Nexfluence" width={36} height={36} style={{ borderRadius: "9px" }} />
            {!isMobile && <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Nexfluence</span>}
          </a>
          <p style={{ fontSize: "13px", fontWeight: 700, color: C.dim2 }}>
            Profile Setup · <span style={{ color: C.violet }}>{totalPct}%</span>
          </p>
          <a href="/zone/marketplace" style={{ fontSize: "13px", color: C.dim, textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.dim)}
          >
            ← Marketplace
          </a>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: isMobile ? "32px 20px 80px" : "48px 40px 96px" }}>
        <ProgressHeader pct={totalPct} isMobile={isMobile} />

        {/* Motivational banner */}
        {totalPct < 100 && (
          <div style={{
            padding: "14px 20px", borderRadius: "14px",
            background: "rgba(255,51,188,0.07)", border: "1px solid rgba(255,51,188,0.2)",
            marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px",
          }}>
            <span style={{ fontSize: "20px" }}>🚀</span>
            <p style={{ fontSize: "13px", color: "rgba(255,122,195,0.9)", lineHeight: 1.5 }}>
              {totalPct === 0
                ? "Start with Basic Info — it takes 2 minutes and unlocks your public profile link."
                : totalPct < 40
                ? "Great start! Add your Social Accounts next — it's the fastest way to earn credibility."
                : totalPct < 70
                ? "You're over halfway! Complete Audience Data to jump to the top of brand search results."
                : "Almost there! Finish the remaining sections to unlock your Founding Creator badge."}
            </p>
          </div>
        )}

        {/* Section cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: "14px",
        }}>
          {SECTIONS.map((def) => (
            <SectionCard
              key={def.id}
              def={def}
              done={isDone(def.id)}
              pct={totalPct}
              isMobile={isMobile}
              onOpen={() => setActiveModal(def.id)}
            />
          ))}
        </div>

        {/* Bottom tip */}
        <div style={{
          marginTop: "36px", padding: "20px 24px", borderRadius: "16px",
          background: C.card, border: `1px solid ${C.border}`,
          display: "flex", gap: "14px", alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "22px", flexShrink: 0 }}>💾</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "3px" }}>Everything saves automatically</p>
            <p style={{ fontSize: "12px", color: C.dim, lineHeight: 1.6 }}>
              Each section saves independently the moment you hit the save button. You can close this page and come back tomorrow — your progress is always preserved.
            </p>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {activeModal === "basic" && (
        <ModalBasicInfo section={SECTIONS[0]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("basic", d, SECTIONS[0])}
          isMobile={isMobile} initial={profile.basic} />
      )}
      {activeModal === "photo" && (
        <ModalPhoto section={SECTIONS[1]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("photo", d, SECTIONS[1])}
          isMobile={isMobile} initial={profile.photo} />
      )}
      {activeModal === "social" && (
        <ModalSocial section={SECTIONS[2]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("social", d, SECTIONS[2])}
          isMobile={isMobile} initial={profile.social} />
      )}
      {activeModal === "niche" && (
        <ModalNiche section={SECTIONS[3]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("niche", d, SECTIONS[3])}
          isMobile={isMobile} initial={profile.niche} />
      )}
      {activeModal === "audience" && (
        <ModalAudience section={SECTIONS[4]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("audience", d, SECTIONS[4])}
          isMobile={isMobile} initial={profile.audience} />
      )}
      {activeModal === "work" && (
        <ModalWork section={SECTIONS[5]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("work", d, SECTIONS[5])}
          isMobile={isMobile} initial={profile.work} />
      )}
      {activeModal === "rates" && (
        <ModalRates section={SECTIONS[6]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("rates", d, SECTIONS[6])}
          isMobile={isMobile} initial={profile.rates} />
      )}
      {activeModal === "verify" && (
        <ModalVerify section={SECTIONS[7]} onClose={() => setActiveModal(null)}
          onSave={(d) => handleSave("verify", d, SECTIONS[7])}
          isMobile={isMobile} initial={profile.verify} />
      )}

      {/* Celebration burst */}
      {burst && <CelebrationBurst pct={burst.pct} onDone={() => setBurst(null)} />}

      {/* Toast notifications */}
      <ToastStack toasts={toasts} />
    </div>
  );
}