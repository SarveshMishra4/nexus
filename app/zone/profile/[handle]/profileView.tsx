"use client";

/**
 * app/zone/profile/[handle]/ProfileView.tsx
 * CLIENT COMPONENT — all interactive UI for the public creator profile.
 *
 * Sections:
 *  1. Cover + avatar hero
 *  2. Name, badges, quick actions (Share + Book)
 *  3. Stats bar
 *  4. About (bio, location, languages, niche tags)
 *  5. Platform cards
 *  6. Past Work portfolio
 *  7. Rate card preview
 *  8. Nexfluence CTA footer
 */

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { CreatorProfile } from "./page";

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
// TOKENS
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
  border: "rgba(128,97,255,0.28)",
  card:   "rgba(128,97,255,0.06)",
  green:  "#34d399",
  gold:   "#fbbf24",
} as const;

// ─────────────────────────────────────────────
// LEVEL HELPER
// ─────────────────────────────────────────────
const LEVELS = [
  { name: "Starter",  icon: "🌱", color: C.dim    },
  { name: "Rising",   icon: "🌟", color: C.indigo },
  { name: "Verified", icon: "💫", color: C.violet },
  { name: "Elite",    icon: "🏆", color: C.gold   },
  { name: "Legend",   icon: "👑", color: C.mag    },
];
const getLevelMeta = (name: string) => LEVELS.find((l) => l.name === name) ?? LEVELS[0];

// ─────────────────────────────────────────────
// PLATFORM HELPERS
// ─────────────────────────────────────────────
const PLATFORM_META: Record<string, { icon: string; name: string; color: string }> = {
  ig: { icon: "📸", name: "Instagram", color: "#ff7ac3" },
  tt: { icon: "🎵", name: "TikTok",    color: "#8061ff" },
  yt: { icon: "▶️", name: "YouTube",   color: "#ff6b6b" },
  li: { icon: "💼", name: "LinkedIn",  color: "#6a66ff" },
};

// ─────────────────────────────────────────────
// SHARE PANEL
// ─────────────────────────────────────────────
function SharePanel({ profile, onClose }: { profile: CreatorProfile; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/zone/profile/${profile.handle}`
    : `https://nexfluence.eu/profile/${profile.handle}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${profile.name} — Creator on Nexfluence`,
        text:  profile.bio.slice(0, 120),
        url:   profileUrl,
      }).catch(() => {});
    }
  };

  const shareLinks = [
    { label: "Twitter / X",  icon: "𝕏",  url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${profile.name}'s creator profile on @nexfluence`)}&url=${encodeURIComponent(profileUrl)}` },
    { label: "WhatsApp",     icon: "💬", url: `https://wa.me/?text=${encodeURIComponent(`${profile.name} on Nexfluence: ${profileUrl}`)}` },
    { label: "LinkedIn",     icon: "💼", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}` },
    { label: "Telegram",     icon: "✈️", url: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(profile.name)}` },
  ];

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,6,18,0.78)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: "20px",
        animation: "overlayIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "480px",
          borderRadius: "22px",
          background: "#110820",
          border: `1px solid ${C.border}`,
          boxShadow: "0 -20px 60px rgba(128,97,255,0.25)",
          overflow: "hidden",
          animation: "panelUp 0.28s cubic-bezier(0.34,1.4,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid rgba(128,97,255,0.15)`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>Share Profile</p>
            <p style={{ fontSize: "12px", color: C.dim, marginTop: "2px" }}>{profile.name} · @{profile.handle}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.dim, fontSize: "20px", lineHeight: 1 }}>×</button>
        </div>

        {/* Copy link */}
        <div style={{ padding: "16px 24px", borderBottom: `1px solid rgba(128,97,255,0.1)` }}>
          <div style={{
            display: "flex", borderRadius: "10px",
            border: `1.5px solid ${copied ? "rgba(52,211,153,0.5)" : C.border}`,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}>
            <p style={{
              flex: 1, padding: "11px 14px",
              fontSize: "12px", color: C.dim, fontFamily: "monospace",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {profileUrl}
            </p>
            <button
              onClick={copyLink}
              style={{
                padding: "11px 20px", flexShrink: 0, border: "none", cursor: "pointer",
                background: copied ? "rgba(52,211,153,0.2)" : "rgba(128,97,255,0.15)",
                color: copied ? C.green : "#fff",
                fontSize: "13px", fontWeight: 700,
                transition: "all 0.2s", fontFamily: "inherit",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ padding: "16px 24px 8px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
            Share on
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {shareLinks.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px", borderRadius: "10px",
                  background: C.card, border: `1px solid ${C.border}`,
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,122,195,0.4)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(128,97,255,0.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border; (e.currentTarget as HTMLAnchorElement).style.background = C.card; }}
              >
                <span style={{ fontSize: "18px" }}>{s.icon}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: C.dim2 }}>{s.label}</span>
              </a>
            ))}
          </div>

          {/* Native share (mobile) */}
          {"share" in (typeof navigator !== "undefined" ? navigator : {}) && (
            <button
              onClick={nativeShare}
              style={{
                width: "100%", padding: "12px",
                borderRadius: "10px", border: `1px solid ${C.border}`,
                background: C.card, color: C.dim2,
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                marginBottom: "8px", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              📤 More options…
            </button>
          )}
        </div>

        <div style={{ height: "16px" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WORK CARD
// ─────────────────────────────────────────────
function WorkCard({ item }: { item: CreatorProfile["pastWork"][0] }) {
  const [hov, setHov] = useState(false);
  const pm = Object.values(PLATFORM_META).find((p) => p.name.toLowerCase() === item.platform.toLowerCase());
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "16px", padding: "20px",
        background: hov ? "rgba(128,97,255,0.1)" : C.card,
        border: `1px solid ${hov ? "rgba(255,122,195,0.4)" : C.border}`,
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 12px 36px rgba(128,97,255,0.18)" : "none",
        transition: "all 0.18s",
        display: "flex", flexDirection: "column", gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>{item.brand}</p>
        {pm && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "6px",
            background: `${pm.color}18`, color: pm.color, letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}>
            {pm.icon} {item.platform}
          </span>
        )}
      </div>
      <p style={{ fontSize: "12px", color: C.dim, background: "rgba(128,97,255,0.08)", padding: "4px 10px", borderRadius: "6px", width: "fit-content" }}>
        {item.type}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>📈</span>
        <p style={{ fontSize: "13px", fontWeight: 600, color: C.green }}>{item.result}</p>
      </div>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: C.violet, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
          View post →
        </a>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export function ProfileView({ profile }: { profile: CreatorProfile }) {
  const w        = useWindowWidth();
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 900;
  const [shareOpen, setShareOpen] = useState(false);
  const [bookSent,  setBookSent]  = useState(false);
  const level = getLevelMeta(profile.level);

  return (
    <div style={{ background: C.ink, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
        @keyframes panelUp   { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn    { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        input::placeholder   { color:rgba(255,255,255,0.22); }
        * { font-family:var(--font-rubik),sans-serif; box-sizing:border-box; }
      `}</style>

      {/* ── COVER HERO ── */}
      <div style={{ position: "relative", width: "100%", height: isMobile ? "220px" : "340px" }}>
        <Image
          src={profile.cover}
          alt={`${profile.name} cover`}
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
          priority
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(128,97,255,0.45) 0%, rgba(255,51,188,0.2) 40%, rgba(10,6,18,0.2) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, #0a0612 0%, transparent 100%)" }} />

        {/* Nexfluence watermark top-left */}
        <a href="/zone" style={{
          position: "absolute", top: "16px", left: "20px",
          display: "flex", alignItems: "center", gap: "8px", textDecoration: "none",
          padding: "6px 12px", borderRadius: "100px",
          background: "rgba(10,6,18,0.65)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <Image src="/Nex.webp" alt="Nexfluence" width={20} height={20} style={{ borderRadius: "5px" }} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.04em" }}>
            NEXFLUENCE
          </span>
        </a>

        {/* Share button top-right */}
        <button
          onClick={() => setShareOpen(true)}
          style={{
            position: "absolute", top: "16px", right: "20px",
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px", borderRadius: "100px",
            background: "rgba(10,6,18,0.65)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(128,97,255,0.4)"}
          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,6,18,0.65)"}
        >
          <span>↗</span> Share
        </button>
      </div>

      {/* ── PROFILE IDENTITY ── */}
      <div style={{
        maxWidth: "760px", margin: "0 auto",
        padding: isMobile ? "0 20px" : "0 32px",
      }}>
        {/* Avatar overlapping cover */}
        <div style={{
          marginTop: isMobile ? "-52px" : "-72px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: isMobile ? "90px" : "116px",
              height: isMobile ? "90px" : "116px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #0a0612",
              boxShadow: "0 8px 32px rgba(128,97,255,0.4)",
              position: "relative",
            }}>
              <Image
                src={profile.photo}
                alt={profile.name}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            {/* Verified ring */}
            {profile.verified && (
              <div style={{
                position: "absolute", bottom: "2px", right: "2px",
                width: "26px", height: "26px", borderRadius: "50%",
                background: "linear-gradient(135deg, #ff33bc, #8061ff)",
                border: "3px solid #0a0612",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px",
              }}>
                ✓
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingBottom: "4px" }}>
            <button
              onClick={() => setShareOpen(true)}
              style={{
                padding: "10px 20px", borderRadius: "9px",
                background: "transparent",
                border: `1.5px solid ${C.border}`,
                color: C.dim2, fontSize: "13px", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.15s", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,122,195,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.dim2; }}
            >
              ↗ Share Profile
            </button>
            <a
              href={`mailto:brands@nexfluence.eu?subject=Campaign enquiry — ${profile.name}&body=Hi, I'd like to discuss a campaign with ${profile.name} (@${profile.handle}).`}
              style={{
                padding: "10px 22px", borderRadius: "9px",
                background: C.grad, color: "#fff",
                fontSize: "13px", fontWeight: 700, textDecoration: "none",
                display: "flex", alignItems: "center", gap: "6px",
                boxShadow: "0 6px 20px rgba(128,97,255,0.32)",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
            >
              📨 Book a Campaign
            </a>
          </div>
        </div>

        {/* Name + badges row */}
        <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: 900, letterSpacing: "-0.035em", color: "#fff", lineHeight: 1 }}>
            {profile.name}
          </h1>
          {profile.verified && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 700, padding: "3px 10px",
              borderRadius: "100px",
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.35)",
              color: C.green,
            }}>
              ✓ Verified
            </span>
          )}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "11px", fontWeight: 700, padding: "3px 10px",
            borderRadius: "100px",
            background: `${level.color}18`,
            border: `1px solid ${level.color}40`,
            color: level.color,
          }}>
            {level.icon} {profile.level}
          </span>
        </div>

        {/* Handle + location */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: C.pink }}>@{profile.handle}</p>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>·</span>
          <p style={{ fontSize: "13px", color: C.dim }}>{profile.location}</p>
          {profile.languages.length > 0 && (
            <>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>·</span>
              <p style={{ fontSize: "13px", color: C.dim }}>{profile.languages.join(" / ")}</p>
            </>
          )}
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: "13px", fontWeight: 600,
          color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em",
          textTransform: "uppercase", marginBottom: "20px",
        }}>
          {profile.tagline}
        </p>

        {/* ── STATS BAR ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderRadius: "16px",
          border: `1px solid ${C.border}`,
          background: C.card,
          overflow: "hidden",
          marginBottom: "36px",
        }}>
          {[
            { val: (() => { const all = Object.values(profile.platforms); const t = all.reduce((a, p) => { if (!p) return a; const n = parseFloat((p as any).followers || (p as any).subscribers || "0"); return a + n; }, 0); return `${(t / 1000).toFixed(0)}K`; })(), label: "Total Reach" },
            { val: profile.stats.engRate,   label: "Engagement" },
            { val: profile.stats.avgViews,  label: "Avg Views"  },
            { val: String(profile.stats.campaigns), label: "Campaigns"  },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "18px 12px",
                textAlign: "center",
                borderRight: i < 3 ? `1px solid rgba(128,97,255,0.15)` : "none",
              }}
            >
              <p style={{
                fontSize: isMobile ? "20px" : "26px", fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 1,
                background: C.grad, WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: "4px",
              }}>
                {s.val}
              </p>
              <p style={{ fontSize: "11px", color: C.dim, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── ABOUT ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>About</SectionLabel>
          <p style={{
            fontSize: isMobile ? "14px" : "15px",
            color: C.dim2, lineHeight: 1.85,
            marginBottom: "20px",
          }}>
            {profile.bio}
          </p>

          {/* Niche + style chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {profile.niche.map((n) => (
              <span key={n} style={{
                padding: "6px 14px", borderRadius: "100px",
                background: "rgba(128,97,255,0.12)",
                border: `1px solid rgba(128,97,255,0.35)`,
                fontSize: "12px", fontWeight: 600, color: C.violet,
              }}>
                {n}
              </span>
            ))}
            {profile.styles.map((s) => (
              <span key={s} style={{
                padding: "6px 14px", borderRadius: "100px",
                background: "rgba(255,51,188,0.08)",
                border: `1px solid rgba(255,51,188,0.25)`,
                fontSize: "12px", fontWeight: 500, color: C.pink,
              }}>
                {s}
              </span>
            ))}
          </div>

          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              marginTop: "16px", fontSize: "13px", fontWeight: 600,
              color: C.violet, textDecoration: "none", transition: "opacity 0.15s",
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              🔗 {profile.website.replace("https://", "")}
            </a>
          )}
        </section>

        {/* ── PLATFORMS ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Platforms</SectionLabel>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : `repeat(${Object.keys(profile.platforms).length}, 1fr)`,
            gap: "10px",
          }}>
            {Object.entries(profile.platforms).map(([key, plat]) => {
              if (!plat) return null;
              const meta = PLATFORM_META[key];
              if (!meta) return null;
              const followersKey = key === "yt" ? "subscribers" : "followers";
              const followersVal = (plat as any)[followersKey] ?? "";
              return (
                <a
                  key={key}
                  href={(plat as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "16px 18px", borderRadius: "14px",
                    background: C.card, border: `1px solid ${C.border}`,
                    textDecoration: "none", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${meta.color}60`; (e.currentTarget as HTMLAnchorElement).style.background = `${meta.color}0f`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border; (e.currentTarget as HTMLAnchorElement).style.background = C.card; }}
                >
                  <span style={{
                    width: "42px", height: "42px", borderRadius: "11px", flexShrink: 0,
                    background: `${meta.color}18`, border: `1px solid ${meta.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px",
                  }}>
                    {meta.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{meta.name}</p>
                    <p style={{ fontSize: "12px", color: meta.color, fontWeight: 600 }}>
                      {(plat as any).handle}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{
                      fontSize: "16px", fontWeight: 900, letterSpacing: "-0.03em",
                      background: C.grad, WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      {followersVal}
                    </p>
                    <p style={{ fontSize: "10px", color: C.dim }}>{key === "yt" ? "subscribers" : "followers"}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ── PAST WORK ── */}
        {profile.pastWork.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <SectionLabel>Campaign Portfolio</SectionLabel>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "12px",
            }}>
              {profile.pastWork.map((item, i) => <WorkCard key={i} item={item} />)}
            </div>
          </section>
        )}

        {/* ── RATE CARD ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Rate Card</SectionLabel>
          <div style={{
            borderRadius: "18px", padding: "24px",
            background: C.card, border: `1px solid ${C.border}`,
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "12px", marginBottom: "20px",
            }}>
              {[
                { label: "Story",     icon: "🔲", val: profile.rates.story,  hide: profile.rates.story  === 0 },
                { label: "Post/Reel", icon: "🖼",  val: profile.rates.post,   hide: profile.rates.post   === 0 },
                { label: "TikTok",    icon: "🎵", val: profile.rates.video,  hide: profile.rates.video  === 0 },
                { label: "YouTube",   icon: "▶️", val: profile.rates.yt,     hide: profile.rates.yt     === 0 },
              ].filter((r) => !r.hide).map((r) => (
                <div key={r.label} style={{
                  textAlign: "center", padding: "16px 10px",
                  borderRadius: "12px",
                  background: "rgba(128,97,255,0.07)",
                  border: `1px solid ${C.border}`,
                }}>
                  <p style={{ fontSize: "18px", marginBottom: "6px" }}>{r.icon}</p>
                  <p style={{
                    fontSize: isMobile ? "18px" : "20px", fontWeight: 900,
                    letterSpacing: "-0.03em",
                    background: C.grad, WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent", backgroundClip: "text",
                    lineHeight: 1, marginBottom: "4px",
                  }}>
                    {profile.rates.currency === "EUR" ? "€" : "$"}{r.val}
                  </p>
                  <p style={{ fontSize: "11px", color: C.dim }}>{r.label}</p>
                </div>
              ))}
            </div>

            {profile.rates.negotiable && (
              <p style={{
                fontSize: "13px", color: C.dim, lineHeight: 1.6,
                padding: "12px 16px", borderRadius: "10px",
                background: "rgba(128,97,255,0.06)",
                border: `1px solid rgba(128,97,255,0.2)`,
              }}>
                💬 <strong style={{ color: "#fff" }}>Open to negotiation</strong> — package deals, barter, and long-term affiliate arrangements welcome. Reach out via the button below.
              </p>
            )}
          </div>
        </section>

        {/* ── CREDIBILITY SCORE ── */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{
            borderRadius: "18px", padding: "20px 24px",
            background: `${level.color}0c`, border: `1px solid ${level.color}30`,
            display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap",
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: level.color, marginBottom: "4px" }}>
                Nexfluence Credibility Score
              </p>
              <div style={{ height: "8px", borderRadius: "100px", background: "rgba(128,97,255,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${profile.credibility}%`, borderRadius: "100px", background: C.grad, boxShadow: "0 0 10px rgba(128,97,255,0.4)", transition: "width 1s ease" }} />
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-0.04em", background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                {profile.credibility}%
              </p>
              <p style={{ fontSize: "11px", color: level.color, fontWeight: 700 }}>{level.icon} {profile.level}</p>
            </div>
          </div>
        </section>

        {/* ── BOOK CTA ── */}
        <section style={{
          borderRadius: "22px", padding: isMobile ? "32px 24px" : "40px 48px",
          textAlign: "center",
          background: "rgba(128,97,255,0.07)",
          border: `1px solid ${C.border}`,
          marginBottom: "40px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(128,97,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: "30px", marginBottom: "12px" }}>📨</p>
            <h2 style={{ fontSize: isMobile ? "22px" : "28px", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: "10px", lineHeight: 1.1 }}>
              Want to Work With <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{profile.name.split(" ")[0]}?</span>
            </h2>
            <p style={{ fontSize: "14px", color: C.dim, maxWidth: "380px", margin: "0 auto 28px", lineHeight: 1.7 }}>
              All campaigns are managed through the Nexfluence platform — performance-based, transparent, and fully tracked.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`mailto:brands@nexfluence.eu?subject=Campaign with ${profile.name}&body=Hi Nexfluence team,%0A%0AI'd like to run a campaign with ${profile.name} (@${profile.handle}).%0A%0ABrand:%0ACampaign goal:%0ABudget range:%0A`}
                style={{
                  padding: "13px 28px", borderRadius: "9px",
                  background: C.grad, color: "#fff",
                  fontSize: "14px", fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 6px 24px rgba(128,97,255,0.32)",
                  transition: "opacity 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
              >
                Start a Campaign →
              </a>
              <button
                onClick={() => setShareOpen(true)}
                style={{
                  padding: "13px 24px", borderRadius: "9px",
                  background: "transparent", border: `1.5px solid ${C.border}`,
                  color: C.dim2, fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,122,195,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.dim2; }}
              >
                ↗ Share Profile
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div style={{
          paddingBottom: "48px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          borderTop: `1px solid rgba(128,97,255,0.12)`, paddingTop: "28px",
        }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Creator profile powered by</span>
          <a href="/zone" style={{
            display: "flex", alignItems: "center", gap: "6px", textDecoration: "none",
            fontSize: "13px", fontWeight: 700, color: C.violet,
            transition: "opacity 0.15s",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
          >
            <Image src="/Nex.webp" alt="Nexfluence" width={18} height={18} style={{ borderRadius: "4px" }} />
            Nexfluence
          </a>
        </div>
      </div>

      {/* Share panel */}
      {shareOpen && <SharePanel profile={profile} onClose={() => setShareOpen(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// ATOM
// ─────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em",
      textTransform: "uppercase", color: C.pink,
      marginBottom: "16px",
    }}>
      <span style={{ display: "block", width: "16px", height: "1px", background: C.pink }} />
      {children}
    </p>
  );
}
